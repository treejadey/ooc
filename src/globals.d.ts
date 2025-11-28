type GenericClosestStringOptions = {
	ignoreCase?: boolean;
	fullResult?: boolean;
	descriptor?: boolean;
};
type BaseClosestStringOptions = {
	ignoreCase?: boolean;
};
type DescriptorClosestStringOptions = BaseClosestStringOptions & {
	descriptor: true;
};
type FullResultClosestStringOptions = BaseClosestStringOptions & {
	fullResult: true;
};
type ClosestStringDescriptor = {
	string: string;
	original: string;
	index: number;
	score: number;
	includes: boolean;
};

declare const executor: string;

declare const utils: {
	/** Escapes all usernames within a function if they choose to not be pinged.*/
	unping(text: string): string;
	/**
	 * Returns a random integer between min and max, inclusively.
	 */
	random(min: number, max: number): number;

	/**
	 * Returns a random array element.
	 * Returns `undefined` if the array is empty.
	 */
	randArray(arr: readonly []): undefined;
	randArray<T>(arr: readonly T[]): T;
	randArray<T>(arr: readonly T[]): T | undefined;

	/**
	 * Returns the best fit for given string, based on Levenshtein distance.
	 * @param [options.ignoreCase] if true, all cases will be ignored
	 * @param [options.fullResult] if true, a full array of ClosestStringDescriptor-s will be returned. Mutually exclusive with descriptor
	 * @param [options.descriptor] if true, a ClosestStringDescriptor will be returned. Mutually exclusive with fullResult
	 */
	selectClosestString(
		from: string,
		originalTargets: string[],
		options: BaseClosestStringOptions,
	): string | null;
	selectClosestString(
		from: string,
		originalTargets: string[],
		options: DescriptorClosestStringOptions,
	): ClosestStringDescriptor | null;
	selectClosestString(
		from: string,
		originalTargets: string[],
		options: FullResultClosestStringOptions,
	): ClosestStringDescriptor[] | null;
	selectClosestString(from: string, originalTargets: string[], options: GenericClosestStringOptions = {});
};

declare const channelCustomData: {
	get(key: string): unknown;
	set<T>(key: string, value: T): undefined;
};
