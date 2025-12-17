import { array, Codec, type GetType, number, string } from "purify-ts/Codec";
import type { Either } from "purify-ts/Either";
import { Left, Right } from "purify-ts/Either";
import { Just, type Maybe, Nothing } from "purify-ts/Maybe";

/** This prefix is used when saving messages to the Supibot channel data */
const commandPrefix = "OOC_MSGS";

const commandOwner = "treejadey";

const Message = Codec.interface({
	id: number,
	text: string,
	date: string,
	addedBy: string,
});

type Message = GetType<typeof Message>;

const Data = Codec.interface({
	currentId: number,
	messages: array(Message),
});

type Data = GetType<typeof Data>;

const getOOCData = (): Either<string, Data> => {
	const unknownData = channelCustomData.get(commandPrefix);
	return Data.decode(unknownData);
};

const setOOCData = (data: Data): undefined => {
	return channelCustomData.set(commandPrefix, data);
};

const initBaseOOCData = () => {
	const baseData: Data = { currentId: 0, messages: [] };
	return setOOCData(baseData);
};

const getRandomMessage = (data: Data): Message => {
	return utils.randArray(data.messages);
};

const formatMessage = (msg: Message, textOnly: boolean): string => {
	if (textOnly) {
		return msg.text;
	}

	// HACK: Sweden uses the year-month-day format I want
	const formattedDate = new Date(msg.date).toLocaleDateString("sv");

	return `(#${msg.id.toString()}) [${formattedDate}]: ${msg.text}`;
};

const formatRandomMessage = (msg: Message, textOnly: boolean): string => {
	if (textOnly) {
		return msg.text;
	}

	return `🎲 ${formatMessage(msg, false)}`;
};

const formatIndexedMessage = (msg: Message, textOnly: boolean, leftNum: number, rightNum: number) => {
	if (textOnly) {
		return msg.text;
	}

	return `[${leftNum.toString()}/${rightNum.toString()}] ${formatMessage(msg, false)}`;
};

const dataWithAddedMessage = (data: Data, text: string, adder: string): Data => {
	const newId = data.currentId + 1;

	const date = new Date().toISOString();

	return {
		currentId: newId,
		messages: [...data.messages, { id: newId, text, date, addedBy: adder }],
	};
};

const dataWithRemovedMessage = (data: Data, id: number): Data => {
	return {
		currentId: data.currentId,
		messages: [...data.messages].filter((m) => m.id !== id),
	};
};

const getMessageById = (data: Data, id: number): Either<string, Message> => {
	const msg = data.messages.filter((d) => d.id === id);

	if (msg.length === 0) {
		return Left("Couldn't find a message with that id.");
	} else if (msg.length !== 1) {
		return Left("More than one message with that id??");
	}

	return Right(msg[0]);
};

const getMaxIdInData = (data: Data) => {
	const message = getMessageById(data, data.currentId);

	if (message.isLeft()) {
		const allIds = data.messages.map((m) => m.id);

		return Math.max(...allIds);
	} else {
		return message.unsafeCoerce().id;
	}
};

const getLastMessage = (data: Data) => {
	const maxId = getMaxIdInData(data);

	return getMessageById(data, maxId);
};

const isInMiddle = (data: Data, idx: number) => {
	const maxId = getMaxIdInData(data);

	return idx < maxId && idx !== 0;
};

const getClosestId = (ids: number[], id: number) => {
	let left = 0;
	let right = ids.length - 1;
	let closest = ids[0];

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);

		if (Math.abs(ids[mid] - id) < Math.abs(closest - id)) {
			closest = ids[mid];
		}

		if (ids[mid] === id) {
			return ids[mid];
		}

		if (ids[mid] < id) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return closest;
};

const getCloseSearchResults = (data: Data, needle: string): Maybe<ClosestStringDescriptor[]> => {
	const haystack = data.messages.map((m) => m.text);

	const searchResults = utils.selectClosestString(needle, haystack, { ignoreCase: true, fullResult: true });

	if (searchResults === null) {
		return Nothing;
	} else {
		const closestResults = searchResults.filter((res) => res.includes);

		if (closestResults.length === 0) {
			return Nothing;
		} else {
			return Just(closestResults);
		}
	}
};

const noPinnedMessages =
	"There aren't any pinned messages yet. You should try pinning something. Like: $$ooc add [text]";

const commandMain = (args: string[]): string => {
	if (channelCustomData.get(commandPrefix) == null) {
		initBaseOOCData();
		return "Looks like this alias has been run for the first time. I initialized the data now. Try adding a message with $$ooc add [text]";
	}

	const unknownData = getOOCData();

	if (unknownData.isLeft()) {
		throw new Error(unknownData.extract());
	}

	const data = unknownData.unsafeCoerce();

	const CommandParameters = [
		{ name: "index", type: "number" },
		{ name: "textOnly", type: "boolean" },
	] as const;

	const par = utils.parseParametersFromArguments(CommandParameters, args);

	if (par.success) args = par.args;

	const isTextOnly = par.success && !!par.parameters.textOnly;

	if (args.at(0) === undefined) {
		// If the user types "$$ooc" with no additional args then we want to return a random message
		const randomMessage = getRandomMessage(data);

		return formatRandomMessage(randomMessage, isTextOnly);
	}

	switch (args.at(0)) {
		case "pin":
		case "add": {
			if (args.length === 1) {
				return "Usage: $$ooc add|pin [text]";
			}

			const messageText = args.slice(1).join(" ");

			const newData = dataWithAddedMessage(data, messageText, executor);

			channelCustomData.set(commandPrefix, newData);

			return `Pinned the message with ID: ${newData.currentId.toString()}`;
		}
		case "get": {
			if (args.length === 1) {
				return "Usage: $$ooc get [id] (For example: $$ooc get 1)";
			}

			switch (args.at(1)) {
				case "latest":
				case "last": {
					const message = getLastMessage(data);

					if (data.messages.length === 0) {
						return noPinnedMessages;
					}

					const ret = message.caseOf({
						Left: (l) => {
							return `Couldn't get last message: ${l}`;
						},
						Right: (r) => {
							return formatMessage(r, isTextOnly);
						},
					});

					return ret;
				}
				default: {
					const arg = args.at(1);

					if (arg === undefined) {
						return "I don't know what you want me to get. Usage: $$ooc get [int] (For example: $$ooc get 1)";
					} else {
						const argAsInt = Number.parseInt(arg, 10);

						if (Number.isNaN(argAsInt)) {
							return "Provided value is not an integer. Usage: $$ooc get [int] (For example: $$ooc get 1)";
						}

						if (data.messages.length === 0) {
							return noPinnedMessages;
						}

						const message = getMessageById(data, argAsInt);

						const ret = message.caseOf({
							Left: (err) => {
								let returnMessage = "";

								returnMessage += err;

								const ids = data.messages.map((m) => m.id);
								returnMessage += ` Did you mean #${getClosestId(ids, argAsInt)}?`;

								if (isInMiddle(data, argAsInt)) {
									returnMessage += " It may have been deleted.";
								}

								return returnMessage;
							},
							Right: (r) => {
								return formatMessage(r, isTextOnly);
							},
						});

						return ret;
					}
				}
			}
		}
		case "unpin":
		case "delete":
		case "remove": {
			const arg = args.at(1);

			if (arg === undefined) {
				if (data.messages.length !== 0) {
					return "I don't know what you want me to delete. Usage: $$ooc delete [int] (For example: $$ooc delete 1)";
				} else {
					return "I don't know what you want me to delete and you don't even have anything to delete in the first place. You should try pinning something. Like: $$ooc add [text]";
				}
			}

			if (data.messages.length === 0) {
				return "I don't know what you want me to delete considering there aren't any pinned messages. You should try pinning something. Like: $$ooc add [text]";
			}

			switch (arg) {
				case "last":
				case "latest": {
					const maxId = getMaxIdInData(data);
					const messagesWithRemovedMessage = dataWithRemovedMessage(data, maxId);

					if (messagesWithRemovedMessage.messages.length < data.messages.length) {
						channelCustomData.set(commandPrefix, messagesWithRemovedMessage);
						return `Successfully removed last message (ID: ${maxId.toString()})`;
					} else {
						return `Couldn't remove last message for some reason. Please report this to ${commandOwner}`;
					}
				}
				default: {
					const argAsInt = Number.parseInt(arg, 10);

					if (Number.isNaN(argAsInt)) {
						return "Provided value is not an integer. Usage: $$ooc remove [int] (For example: $$ooc remove 1)";
					}

					const message = getMessageById(data, argAsInt);

					const ret = message.caseOf({
						Left: (err) => {
							let returnMessage = "";

							returnMessage += err;

							const ids = data.messages.map((m) => m.id);
							returnMessage += ` Did you mean #${getClosestId(ids, argAsInt)}?`;

							if (isInMiddle(data, argAsInt)) {
								returnMessage += " It may be deleted already.";
							}

							return returnMessage;
						},
						Right: (msg) => {
							const messagesWithRemovedMessage = dataWithRemovedMessage(data, msg.id);

							if (messagesWithRemovedMessage.messages.length < data.messages.length) {
								return `Successfully removed message (ID: ${msg.id})`;
							} else {
								return `Couldn't remove last message for some reason. Please report this to ${commandOwner}`;
							}
						},
					});

					return ret;
				}
			}
		}
		case "search": {
			if (args.length === 1) {
				return "Usage: $$ooc search [text]";
			}

			const messageText = args.slice(1).join(" ");

			const searched = getCloseSearchResults(data, messageText);

			const ret = searched.caseOf({
				Nothing: () => {
					return "Couldn't find anything similar enough.";
				},
				Just: (msgs) => {
					if (msgs.length === 1) {
						const searchMsg = msgs[0];

						const msg = data.messages[searchMsg.index];

						return formatMessage(msg, isTextOnly);
					}

					if (par.success && par.parameters.index != null) {
						const idx = par.parameters.index | 0;

						if (idx > msgs.length) {
							return "Error: You are trying to pick an index of a higher value than the amount of found items.";
						} else if (idx === 0) {
							return "Error: You cannot pick an index of 0. The search index must be at least 1.";
						} else if (idx < 0) {
							return "Error: You cannot index with a value lower than 1.";
						}

						// Accounting for the fact that the index starts with 1
						const searchMsg = msgs[idx - 1];

						const msg = data.messages[searchMsg.index];

						return formatIndexedMessage(msg, isTextOnly, idx, msgs.length);
					}

					const allChoices = msgs.length - 1;
					const randomIndex = utils.random(0, allChoices);

					const randomMessage = msgs[randomIndex];

					const message = data.messages[randomMessage.index];

					return formatIndexedMessage(message, isTextOnly, randomIndex + 1, msgs.length);
				},
			});

			return ret;
		}
		default: {
			return "No command like this exists. Available commands are [add|remove|get|search]";
		}
	}
};

const main = (args: string[]) => {
	return utils.unping(commandMain(args));
};

export { main };
