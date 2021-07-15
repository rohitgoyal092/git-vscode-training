interface genericInterfae<T = string> {
    (arg: T): boolean;
}
declare const getAString: genericInterfae<string>;
/**
 * Type Guards
 */
declare let unknownVar: unknown;
declare function isFunction(value: unknown): value is Function;
declare function undefinedChecker<T>(arg: T | undefined): arg is T;
declare const arr1: any[];
declare const filtered: any[];
/**
 * Branded types
 */
interface BrandedA {
    __this_is_branded_a: "a";
}
interface BrandedB {
    __this_is_branded_b: "b";
}
declare function BrandA(value: string): BrandedA;
declare function unBrandA(value: BrandedA): string;
declare function BrandB(value: {
    abc: string;
}): BrandedB;
declare function unBrandB(value: BrandedB): {
    abc: string;
};
declare let s1: BrandedA;
declare let s2: BrandedB;
declare let r1: string, r2: {
    abc: string;
};
/**
 * Exhaustive Switch
 */
declare let exhaustiveSwitchVar: string | number | boolean;
/**
 * Mapping as a substitute of overloading function signature
 */
interface firstType {
    name: string;
    phoneNo: number;
}
interface secondType {
    name: string;
    email: string;
}
interface typeMatching {
    firstType: firstType;
    secondType: secondType;
}
declare function choiceFunction1<K extends keyof typeMatching>(method: K, member: typeMatching[K]): void;
/**
 * Enums
 */
declare enum StateHolder {
    alpha = 2,
    beta = 3,
    gamma = 4,
    pi = 3.14
}
