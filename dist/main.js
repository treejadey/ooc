"use strict";

  // node_modules/.pnpm/purify-ts@2.1.4/node_modules/purify-ts/esm/Maybe.js
  var Maybe = {
    of(value) {
      return just(value);
    },
    empty() {
      return nothing;
    },
    zero() {
      return nothing;
    },
    fromNullable(value) {
      return value == null ? nothing : just(value);
    },
    fromFalsy(value) {
      return value ? just(value) : nothing;
    },
    fromPredicate(pred, value) {
      switch (arguments.length) {
        case 1:
          return (value2) => Maybe.fromPredicate(pred, value2);
        default:
          return pred(value) ? just(value) : nothing;
      }
    },
    mapMaybe(f, list) {
      switch (arguments.length) {
        case 1:
          return (list2) => Maybe.mapMaybe(f, list2);
        default:
          return Maybe.catMaybes(list.map(f));
      }
    },
    catMaybes(list) {
      let res = [];
      for (const e of list) {
        if (e.isJust()) {
          res.push(e.extract());
        }
      }
      return res;
    },
    encase(thunk) {
      try {
        return just(thunk());
      } catch {
        return nothing;
      }
    },
    isMaybe(x) {
      return x instanceof Just || x instanceof Nothing;
    },
    sequence(maybes) {
      let res = [];
      for (const m of maybes) {
        if (m.isJust()) {
          res.push(m.extract());
        } else {
          return nothing;
        }
      }
      return just(res);
    },
    "fantasy-land/of"(value) {
      return this.of(value);
    },
    "fantasy-land/empty"() {
      return this.empty();
    },
    "fantasy-land/zero"() {
      return this.zero();
    }
  };
  var Just = class {
    constructor(__value) {
      this.__value = __value;
    }
    isJust() {
      return true;
    }
    isNothing() {
      return false;
    }
    inspect() {
      return `Just(${this.__value})`;
    }
    [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")](_depth, opts, inspect) {
      return `Just(${inspect(this.__value, opts)})`;
    }
    toString() {
      return this.inspect();
    }
    toJSON() {
      const value = this.__value;
      return value instanceof Date ? value.toJSON() : value;
    }
    equals(other) {
      return this.extract() === other.extract();
    }
    map(f) {
      return just(f(this.__value));
    }
    ap(maybeF) {
      return maybeF.isJust() ? this.map(maybeF.extract()) : nothing;
    }
    alt(_) {
      return this;
    }
    altLazy(_) {
      return this;
    }
    chain(f) {
      return f(this.__value);
    }
    chainNullable(f) {
      return Maybe.fromNullable(f(this.__value));
    }
    join() {
      return this.__value;
    }
    reduce(reducer, initialValue) {
      return reducer(initialValue, this.__value);
    }
    extend(f) {
      return just(f(this));
    }
    unsafeCoerce() {
      return this.__value;
    }
    caseOf(patterns) {
      return "_" in patterns ? patterns._() : patterns.Just(this.__value);
    }
    orDefault(_) {
      return this.__value;
    }
    orDefaultLazy(_) {
      return this.__value;
    }
    toList() {
      return [this.__value];
    }
    mapOrDefault(f, _) {
      return f(this.__value);
    }
    extract() {
      return this.__value;
    }
    extractNullable() {
      return this.__value;
    }
    toEither(_) {
      return right(this.__value);
    }
    ifJust(effect) {
      return effect(this.__value), this;
    }
    ifNothing(_) {
      return this;
    }
    filter(pred) {
      return pred(this.__value) ? just(this.__value) : nothing;
    }
  };
  Just.prototype["fantasy-land/equals"] = Just.prototype.equals;
  Just.prototype["fantasy-land/map"] = Just.prototype.map;
  Just.prototype["fantasy-land/ap"] = Just.prototype.ap;
  Just.prototype["fantasy-land/alt"] = Just.prototype.alt;
  Just.prototype["fantasy-land/chain"] = Just.prototype.chain;
  Just.prototype["fantasy-land/reduce"] = Just.prototype.reduce;
  Just.prototype["fantasy-land/extend"] = Just.prototype.extend;
  Just.prototype["fantasy-land/filter"] = Just.prototype.filter;
  Just.prototype.constructor = Maybe;
  var Nothing = class {
    isJust() {
      return false;
    }
    isNothing() {
      return true;
    }
    inspect() {
      return "Nothing";
    }
    [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
      return "Nothing";
    }
    toString() {
      return this.inspect();
    }
    toJSON() {
      return this.__value;
    }
    equals(other) {
      return this.extract() === other.extract();
    }
    map(_) {
      return nothing;
    }
    ap(_) {
      return nothing;
    }
    alt(other) {
      return other;
    }
    altLazy(other) {
      return other();
    }
    chain(_) {
      return nothing;
    }
    chainNullable(_) {
      return nothing;
    }
    join() {
      return nothing;
    }
    reduce(_, initialValue) {
      return initialValue;
    }
    extend(_) {
      return nothing;
    }
    unsafeCoerce() {
      throw new Error("Maybe#unsafeCoerce was ran on a Nothing");
    }
    caseOf(patterns) {
      return "_" in patterns ? patterns._() : patterns.Nothing();
    }
    orDefault(defaultValue) {
      return defaultValue;
    }
    orDefaultLazy(getDefaultValue) {
      return getDefaultValue();
    }
    toList() {
      return [];
    }
    mapOrDefault(_, defaultValue) {
      return defaultValue;
    }
    extract() {
      return void 0;
    }
    extractNullable() {
      return null;
    }
    toEither(left2) {
      return left(left2);
    }
    ifJust(_) {
      return this;
    }
    ifNothing(effect) {
      return effect(), this;
    }
    filter(_) {
      return nothing;
    }
  };
  Nothing.prototype["fantasy-land/equals"] = Nothing.prototype.equals;
  Nothing.prototype["fantasy-land/map"] = Nothing.prototype.map;
  Nothing.prototype["fantasy-land/ap"] = Nothing.prototype.ap;
  Nothing.prototype["fantasy-land/alt"] = Nothing.prototype.alt;
  Nothing.prototype["fantasy-land/chain"] = Nothing.prototype.chain;
  Nothing.prototype["fantasy-land/reduce"] = Nothing.prototype.reduce;
  Nothing.prototype["fantasy-land/extend"] = Nothing.prototype.extend;
  Nothing.prototype["fantasy-land/filter"] = Nothing.prototype.filter;
  Nothing.prototype.constructor = Maybe;
  var just = (value) => new Just(value);
  var nothing = new Nothing();

  // node_modules/.pnpm/purify-ts@2.1.4/node_modules/purify-ts/esm/Either.js
  var Either = {
    of(value) {
      return right(value);
    },
    lefts(list) {
      let result = [];
      for (const x of list) {
        if (x.isLeft()) {
          result.push(x.extract());
        }
      }
      return result;
    },
    rights(list) {
      let result = [];
      for (const x of list) {
        if (x.isRight()) {
          result.push(x.extract());
        }
      }
      return result;
    },
    encase(throwsF) {
      try {
        return right(throwsF());
      } catch (e) {
        return left(e);
      }
    },
    sequence(eithers) {
      let res = [];
      for (const e of eithers) {
        if (e.isLeft()) {
          return e;
        }
        res.push(e.extract());
      }
      return right(res);
    },
    isEither(x) {
      return x instanceof Left || x instanceof Right;
    },
    "fantasy-land/of"(value) {
      return Either.of(value);
    }
  };
  var Right = class {
    constructor(__value) {
      this.__value = __value;
      this._ = "R";
    }
    isLeft() {
      return false;
    }
    isRight() {
      return true;
    }
    toJSON() {
      return this.__value;
    }
    inspect() {
      return `Right(${this.__value})`;
    }
    [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")](_depth, opts, inspect) {
      return `Right(${inspect(this.__value, opts)})`;
    }
    toString() {
      return this.inspect();
    }
    bimap(_, g) {
      return right(g(this.__value));
    }
    map(f) {
      return right(f(this.__value));
    }
    mapLeft(_) {
      return this;
    }
    ap(other) {
      return other.isRight() ? this.map(other.extract()) : other;
    }
    equals(other) {
      return other.isRight() ? this.__value === other.extract() : false;
    }
    chain(f) {
      return f(this.__value);
    }
    chainLeft(_) {
      return this;
    }
    join() {
      return this.__value;
    }
    alt(_) {
      return this;
    }
    altLazy(_) {
      return this;
    }
    reduce(reducer, initialValue) {
      return reducer(initialValue, this.__value);
    }
    extend(f) {
      return right(f(this));
    }
    unsafeCoerce() {
      return this.__value;
    }
    caseOf(patterns) {
      return "_" in patterns ? patterns._() : patterns.Right(this.__value);
    }
    leftOrDefault(defaultValue) {
      return defaultValue;
    }
    orDefault(_) {
      return this.__value;
    }
    orDefaultLazy(_) {
      return this.__value;
    }
    leftOrDefaultLazy(getDefaultValue) {
      return getDefaultValue();
    }
    ifLeft(_) {
      return this;
    }
    ifRight(effect) {
      return effect(this.__value), this;
    }
    toMaybe() {
      return just(this.__value);
    }
    leftToMaybe() {
      return nothing;
    }
    extract() {
      return this.__value;
    }
    swap() {
      return left(this.__value);
    }
  };
  Right.prototype["fantasy-land/bimap"] = Right.prototype.bimap;
  Right.prototype["fantasy-land/map"] = Right.prototype.map;
  Right.prototype["fantasy-land/ap"] = Right.prototype.ap;
  Right.prototype["fantasy-land/equals"] = Right.prototype.equals;
  Right.prototype["fantasy-land/chain"] = Right.prototype.chain;
  Right.prototype["fantasy-land/alt"] = Right.prototype.alt;
  Right.prototype["fantasy-land/reduce"] = Right.prototype.reduce;
  Right.prototype["fantasy-land/extend"] = Right.prototype.extend;
  Right.prototype.constructor = Either;
  var Left = class {
    constructor(__value) {
      this.__value = __value;
      this._ = "L";
    }
    isLeft() {
      return true;
    }
    isRight() {
      return false;
    }
    toJSON() {
      return this.__value;
    }
    inspect() {
      return `Left(${JSON.stringify(this.__value)})`;
    }
    [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")](_depth, opts, inspect) {
      return `Left(${inspect(this.__value, opts)})`;
    }
    toString() {
      return this.inspect();
    }
    bimap(f, _) {
      return left(f(this.__value));
    }
    map(_) {
      return this;
    }
    mapLeft(f) {
      return left(f(this.__value));
    }
    ap(other) {
      return other.isLeft() ? other : this;
    }
    equals(other) {
      return other.isLeft() ? other.extract() === this.__value : false;
    }
    chain(_) {
      return this;
    }
    chainLeft(f) {
      return f(this.__value);
    }
    join() {
      return this;
    }
    alt(other) {
      return other;
    }
    altLazy(other) {
      return other();
    }
    reduce(_, initialValue) {
      return initialValue;
    }
    extend(_) {
      return this;
    }
    unsafeCoerce() {
      if (this.__value instanceof Error) {
        throw this.__value;
      }
      throw new Error("Either#unsafeCoerce was ran on a Left");
    }
    caseOf(patterns) {
      return "_" in patterns ? patterns._() : patterns.Left(this.__value);
    }
    leftOrDefault(_) {
      return this.__value;
    }
    orDefault(defaultValue) {
      return defaultValue;
    }
    orDefaultLazy(getDefaultValue) {
      return getDefaultValue();
    }
    leftOrDefaultLazy(_) {
      return this.__value;
    }
    ifLeft(effect) {
      return effect(this.__value), this;
    }
    ifRight(_) {
      return this;
    }
    toMaybe() {
      return nothing;
    }
    leftToMaybe() {
      return just(this.__value);
    }
    extract() {
      return this.__value;
    }
    swap() {
      return right(this.__value);
    }
  };
  Left.prototype["fantasy-land/bimap"] = Left.prototype.bimap;
  Left.prototype["fantasy-land/map"] = Left.prototype.map;
  Left.prototype["fantasy-land/ap"] = Left.prototype.ap;
  Left.prototype["fantasy-land/equals"] = Left.prototype.equals;
  Left.prototype["fantasy-land/chain"] = Left.prototype.chain;
  Left.prototype["fantasy-land/alt"] = Left.prototype.alt;
  Left.prototype["fantasy-land/reduce"] = Left.prototype.reduce;
  Left.prototype["fantasy-land/extend"] = Left.prototype.extend;
  Left.prototype.constructor = Either;
  var left = (value) => new Left(value);
  var right = (value) => new Right(value);

  // node_modules/.pnpm/purify-ts@2.1.4/node_modules/purify-ts/esm/Function.js
  var identity = (x) => x;

  // node_modules/.pnpm/purify-ts@2.1.4/node_modules/purify-ts/esm/NonEmptyList.js
  var NonEmptyListConstructor = (list) => list;
  var NonEmptyList = Object.assign(NonEmptyListConstructor, {
    fromArray: (source) => NonEmptyList.isNonEmpty(source) ? just(source) : nothing,
    unsafeCoerce: (source) => {
      if (NonEmptyList.isNonEmpty(source)) {
        return source;
      }
      throw new Error("NonEmptyList#unsafeCoerce was ran on an empty array");
    },
    fromTuple: (source) => NonEmptyList(source.toArray()),
    head: (list) => list[0],
    last: (list) => list[list.length - 1],
    isNonEmpty: (list) => list.length > 0,
    tail: (list) => list.slice(1)
  });

  // node_modules/.pnpm/purify-ts@2.1.4/node_modules/purify-ts/esm/Codec.js
  var serializeValue = (_, value) => {
    return typeof value === "bigint" ? value.toString() : value;
  };
  var isObject = (obj) => typeof obj === "object" && obj !== null && !Array.isArray(obj);
  var reportError = (expectedType, input) => {
    let receivedString = "";
    switch (typeof input) {
      case "undefined":
        receivedString = "undefined";
        break;
      case "object":
        receivedString = input === null ? "null" : Array.isArray(input) ? "an array with value " + JSON.stringify(input, serializeValue) : "an object with value " + JSON.stringify(input, serializeValue);
        break;
      case "boolean":
        receivedString = "a boolean";
        break;
      case "symbol":
        receivedString = "a symbol";
        break;
      case "function":
        receivedString = "a function";
        break;
      case "bigint":
        receivedString = `a bigint with value ${input.toString()}`;
    }
    receivedString = receivedString || `a ${typeof input} with value ${JSON.stringify(input, serializeValue)}`;
    return `Expected ${expectedType}, but received ${receivedString}`;
  };
  var removeOneOfWithSingleElement = (schema) => {
    const schemaKeys = Object.keys(schema);
    if (schemaKeys.length === 1 && schema.oneOf?.length === 1 && typeof schema.oneOf[0] === "object") {
      Object.assign(schema, schema.oneOf[0]);
      delete schema.oneOf;
    }
    return schema;
  };
  var flattenNestedOneOf = (schema) => {
    if (Array.isArray(schema.oneOf)) {
      for (let i = 0; i < schema.oneOf.length; i++) {
        const e = schema.oneOf[i];
        if (typeof e === "object" && e.oneOf) {
          schema.oneOf.splice(i, 1);
          schema.oneOf.push(...e.oneOf);
          return optimizeSchema(schema);
        }
      }
    }
    return schema;
  };
  var optimizeSchema = (schema) => {
    flattenNestedOneOf(schema);
    removeOneOfWithSingleElement(schema);
    return schema;
  };
  var Codec = {
    /** Creates a codec for any JSON object */
    interface(properties) {
      const keys = Object.keys(properties);
      const decode = (input) => {
        if (!isObject(input)) {
          return left(reportError("an object", input));
        }
        const result = {};
        for (const key of keys) {
          if (!Object.prototype.hasOwnProperty.call(input, key) && !properties[key]._isOptional) {
            return left(`Problem with property "${key}": it does not exist in received object ${JSON.stringify(input, serializeValue)}`);
          }
          const decodedProperty = properties[key].decode(input[key]);
          if (decodedProperty.isLeft()) {
            return left(`Problem with the value of property "${key}": ${decodedProperty.extract()}`);
          }
          const value = decodedProperty.extract();
          if (value !== void 0) {
            result[key] = value;
          }
        }
        return right(result);
      };
      const encode = (input) => {
        const result = {};
        for (const key of keys) {
          result[key] = properties[key].encode(input[key]);
        }
        return result;
      };
      return {
        decode,
        encode,
        unsafeDecode: (input) => decode(input).mapLeft(Error).unsafeCoerce(),
        schema: () => keys.reduce((acc, key) => {
          const isOptional = properties[key]._isOptional;
          if (!isOptional) {
            acc.required.push(key);
          }
          acc.properties[key] = optimizeSchema(properties[key].schema());
          return acc;
        }, {
          type: "object",
          properties: {},
          required: []
        })
      };
    },
    /** Creates a codec for any type, you can add your own deserialization/validation logic in the decode argument */
    custom({ decode, encode, schema }) {
      return {
        decode,
        encode,
        unsafeDecode: (input) => decode(input).mapLeft(Error).unsafeCoerce(),
        schema: schema ?? (() => ({}))
      };
    }
  };
  var string = Codec.custom({
    decode: (input) => typeof input === "string" ? right(input) : left(reportError("a string", input)),
    encode: identity,
    schema: () => ({ type: "string" })
  });
  var number = Codec.custom({
    decode: (input) => typeof input === "number" ? right(input) : left(reportError("a number", input)),
    encode: identity,
    schema: () => ({ type: "number" })
  });
  var nullType = Codec.custom({
    decode: (input) => input === null ? right(input) : left(reportError("a null", input)),
    encode: identity,
    schema: () => ({ type: "null" })
  });
  var undefinedType = Codec.custom({
    decode: (input) => input === void 0 ? right(input) : left(reportError("an undefined", input)),
    encode: identity
  });
  var boolean = Codec.custom({
    decode: (input) => typeof input === "boolean" ? right(input) : left(reportError("a boolean", input)),
    encode: identity,
    schema: () => ({ type: "boolean" })
  });
  var unknown = Codec.custom({
    decode: right,
    encode: identity,
    schema: () => ({})
  });
  var array = (codec) => Codec.custom({
    decode: (input) => {
      if (!Array.isArray(input)) {
        return left(reportError("an array", input));
      } else {
        const result = [];
        for (let i = 0; i < input.length; i++) {
          const decoded = codec.decode(input[i]);
          if (decoded.isRight()) {
            result.push(decoded.extract());
          } else {
            return left(`Problem with the value at index ${i}: ${decoded.extract()}`);
          }
        }
        return right(result);
      }
    },
    encode: (input) => input.map(codec.encode),
    schema: () => ({
      type: "array",
      items: codec.schema()
    })
  });
  var numberString = Codec.custom({
    decode: (input) => string.decode(input).chain((x) => isFinite(+x) ? right(x) : left(reportError("a number", input))),
    encode: identity,
    schema: number.schema
  });
  var date = Codec.custom({
    decode: (input) => string.decode(input).mapLeft((err) => `Problem with date string: ${err}`).chain((x) => Number.isNaN(Date.parse(x)) ? left("Expected a valid date string, but received a string that cannot be parsed") : right(new Date(x))),
    encode: (input) => input.toISOString(),
    schema: () => ({ type: "string", format: "date-time" })
  });

  // src/main.ts
  var commandPrefix = "OOC_MSGS";
  var commandOwner = "treejadey";
  var Message = Codec.interface({
    id: number,
    text: string,
    date: string,
    addedBy: string
  });
  var Data = Codec.interface({
    currentId: number,
    messages: array(Message)
  });
  var getOOCData = () => {
    const unknownData = channelCustomData.get(commandPrefix);
    return Data.decode(unknownData);
  };
  var setOOCData = (data) => {
    return channelCustomData.set(commandPrefix, data);
  };
  var initBaseOOCData = () => {
    const baseData = { currentId: 0, messages: [] };
    return setOOCData(baseData);
  };
  var getRandomMessage = (data) => {
    return utils.randArray(data.messages);
  };
  var formatMessage = (msg) => {
    const formattedDate = new Date(msg.date).toLocaleDateString("sv");
    return `(#${msg.id.toString()}) [${formattedDate}]: ${msg.text}`;
  };
  var formatRandomMessage = (msg) => {
    return `\u{1F3B2} ${formatMessage(msg)}`;
  };
  var dataWithAddedMessage = (data, text, adder) => {
    const newId = data.currentId + 1;
    const date2 = (/* @__PURE__ */ new Date()).toISOString();
    return {
      currentId: newId,
      messages: [...data.messages, { id: newId, text, date: date2, addedBy: adder }]
    };
  };
  var dataWithRemovedMessage = (data, id) => {
    return {
      currentId: data.currentId,
      messages: [...data.messages].filter((m) => m.id !== id)
    };
  };
  var getMessageById = (data, id) => {
    const msg = data.messages.filter((d) => d.id === id);
    if (msg.length === 0) {
      return left("Couldn't find a message with that id.");
    } else if (msg.length !== 1) {
      return left("More than one message with that id??");
    }
    return right(msg[0]);
  };
  var getMaxIdInData = (data) => {
    if (data.messages.at(data.currentId) !== void 0) {
      return data.currentId;
    } else {
      const allIds = data.messages.map((m) => m.id);
      return Math.max(...allIds);
    }
  };
  var getLastMessage = (data) => {
    const maxId = getMaxIdInData(data);
    return getMessageById(data, maxId);
  };
  var isInMiddle = (data, idx) => {
    const maxId = getMaxIdInData(data);
    return idx < maxId && idx !== 0;
  };
  var getClosestId = (ids, id) => {
    let left2 = 0;
    let right2 = ids.length - 1;
    let closest = ids[0];
    while (left2 <= right2) {
      const mid = Math.floor((left2 + right2) / 2);
      if (Math.abs(ids[mid] - id) < Math.abs(closest - id)) {
        closest = ids[mid];
      }
      if (ids[mid] === id) {
        return ids[mid];
      }
      if (ids[mid] < id) {
        left2 = mid + 1;
      } else {
        right2 = mid - 1;
      }
    }
    return closest;
  };
  var getCloseSearchResults = (data, needle) => {
    const haystack = data.messages.map((m) => m.text);
    const searchResults = utils.selectClosestString(needle, haystack, { ignoreCase: true, fullResult: true });
    if (searchResults === null) {
      return nothing;
    } else {
      const closestResults = searchResults.filter((res) => res.includes);
      if (closestResults.length === 0) {
        return nothing;
      } else {
        return just(closestResults);
      }
    }
  };
  var noPinnedMessages = "There aren't any pinned messages yet. You should try pinning something. Like: $$ooc add [text]";
  var commandMain = (args) => {
    if (channelCustomData.get(commandPrefix) == null) {
      initBaseOOCData();
      return "Looks like this alias has been run for the first time. I initialized the data now. Try adding a message with $$ooc add [text]";
    }
    const unknownData = getOOCData();
    if (unknownData.isLeft()) {
      throw new Error(unknownData.extract());
    }
    const data = unknownData.unsafeCoerce();
    if (args.at(0) === void 0) {
      const randomMessage = getRandomMessage(data);
      return formatRandomMessage(randomMessage);
    }
    switch (args.at(0)) {
      case "pin":
      case "add": {
        if (args.length === 1) {
          return "Usage: $$ooc add|pin [text]";
        }
        const messageText = args.slice(1).join(" ");
        const newData = dataWithAddedMessage(data, messageText, executor);
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
                return formatMessage(r);
              }
            });
            return ret;
          }
          default: {
            const arg = args.at(1);
            if (arg === void 0) {
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
                  return formatMessage(r);
                }
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
        if (arg === void 0) {
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
              }
            });
            return ret;
          }
        }
      }
      case "search": {
        if (args.length === 1) {
          return "Usage: $$ooc search [text]";
        }
        const slicedArgs = args.slice(1);
        const parameterDefinition = [{ name: "index", type: "number" }];
        const parameters = utils.parseParametersFromArguments(parameterDefinition, slicedArgs);
        let messageText;
        if (parameters.success) {
          messageText = parameters.args.join(" ");
        } else {
          messageText = slicedArgs.join(" ");
        }
        const searched = getCloseSearchResults(data, messageText);
        const ret = searched.caseOf({
          Nothing: () => {
            return "Couldn't find anything similar enough.";
          },
          Just: (msgs) => {
            if (msgs.length === 1) {
              const searchMsg = msgs[0];
              const msg = data.messages[searchMsg.index];
              return formatMessage(msg);
            }
            if (parameters.success && parameters.parameters.idx != null) {
              const idx = parameters.parameters.index;
              if (idx > msgs.length) {
                return "Error: You are trying to pick an index of a higher value than the amount of found items.";
              } else if (idx === 0) {
                return "Error: You cannot pick an index of 0. The search index must be at least 1.";
              } else if (idx < 0) {
                return "Error: You cannot index with a value lower than 1.";
              }
              const msg = data.messages[idx - 1];
              return `[${idx}/${msgs.length.toString()}] ${formatMessage(msg)}`;
            }
            const allChoices = msgs.length - 1;
            const randomIndex = utils.random(0, allChoices);
            const left2 = (randomIndex + 1).toString();
            const right2 = msgs.length.toString();
            const leftOutOfright = `[${left2}/${right2}]`;
            const randomMessage = msgs[randomIndex];
            const message = data.messages[randomMessage.index];
            return `${leftOutOfright} ${formatMessage(message)}`;
          }
        });
        return ret;
      }
      default: {
        return "No command like this exists. Available commands are [add|remove|get|search]";
      }
    }
  };
  var main = (args) => {
    return utils.unping(commandMain(args));
  };
