type DayOfMonth =
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13
	| 14
	| 15
	| 16
	| 17
	| 18
	| 19
	| 20
	| 21
	| 22
	| 23
	| 24
	| 25
	| 26
	| 27
	| 28
	| 29
	| 30
	| 31;

type EnglishDaySuffix = "st" | "nd" | "rd" | "th";
type HasValueOf = { valueOf: () => number };
type TimeUnit = "h" | "m" | "s" | "ms";

type SupiDate = Date & {
	// Static properties and methods
	months: readonly string[];
	getDaySuffix(number: DayOfMonth): EnglishDaySuffix;
	zf(number: number, padding: number): string;
	equals(from: HasValueOf, to: HasValueOf): boolean;
	UTC(year: number, month: number, ...args: number[]): number;
	getTodayUTC(): number;

	// Instance methods
	format(formatString: string): string;
	isValid(): boolean;
	simpleDate(): string;
	simpleDateTime(): string;
	fullDateTime(): string;
	sqlDate(): string;
	sqlTime(): string;
	sqlDateTime(): string;
	setTimezoneOffset(offset: number): this;
	discardTimeUnits(...units: TimeUnit[]): this;
	clone(): SupiDate;

	// Mutation methods
	addYears(y: number): this;
	addMonths(m: number): this;
	addDays(d: number): this;
	addHours(h: number): this;
	addMinutes(m: number): this;
	addSeconds(s: number): this;
	addMilliseconds(ms: number): this;

	// Getters and Setters
	readonly dayOfTheWeek: string;

	milliseconds: number;
	seconds: number;
	minutes: number;
	hours: number;
	day: DayOfMonth;
	month: number;
	year: number;
} & {
	// Constructor signatures
	new (input?: string | number | Date | SupiDate): SupiDate;
	new (
		year: number,
		month: number,
		day?: number,
		hour?: number,
		minute?: number,
		second?: number,
		millis?: number,
	): SupiDate;
};

type NameDescriptor = {
	native: {
		short: string;
		long: string;
	};
	english: {
		short: string;
		long: string;
	};
	transliterations: string[];
	other: string[];
};

type LanguageDefinition = {
	name: string;
	group: string;
	names: string[] | NameDescriptor;
	iso6391: string;
	iso6392: string;
	iso6393: string;
	glottolog?: string;
	deprecated?: string;
};

type IsoType = 1 | 2 | 3;

interface Language {
	name: string;
	aliases: string[];
	glottolog?: string;

	getIsoCode(type: IsoType): string | undefined;
}

type LanguageConstructor = {
	new (data: LanguageDefinition): Language;
};

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

type ParameterValueMap = {
	string: string;
	number: number;
	boolean: boolean;
	date: SupiDate;
	object: Record<string, string>;
	regex: RegExp;
	language: Language;
};

type ParameterType = keyof ParameterValueMap;
type ParameterValue = ParameterValueMap[ParameterType];

type ParameterDefinition = {
	readonly name: string;
	readonly type: ParameterType;
};
type ParameterDefinitions = readonly ParameterDefinition[];

// type ParamFromDefinition<T extends ParameterDefinitions> = {
// 	[P in T[number] as P["name"]]: ParameterValueMap[P["type"]] | undefined;
// };

type ResultFailure = { success: false; reply: string };

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

	/**
	 * Takes a string value, and parses it according to the provided type.
	 * This is the underlying function used to parse parameters for all supibot commands.
	 */
	parseParametersFromArguments(
		paramsDefinition: ParameterDefinitions,
		argsArray: string[],
	): { success: true; parameters: Record<string, ParameterValue>; args: string[] } | ResultFailure;
};

declare const channelCustomData: {
	get(key: string): unknown;
	set<T>(key: string, value: T): undefined;
};
