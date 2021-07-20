interface A {
    b: string;
    c: {
        d: string;
        e: number;
    };
    f: number;
    50: string;
}
interface B {
    b: string;
    c: {
        d: string;
        e: number;
    };
}
declare const obj3: A;
declare const obj4: B;
/**
 * Plucks a list of properties from an object
 * @param obj
 * @param propertyNames
 * @returns
 */
declare function pluckProperties<T, V extends keyof T>(obj: T, propertyNames: V[]): T[V][];
/**
 * Plucks a property from an array of objects if it exists in all of them.
 * @param arr
 * @param propertyName
 * @returns
 */
declare function pluckProperty<T, V extends keyof T>(arr: Array<T>, propertyName: V): T[V][];
/**
 * Returns an array of keys of an object. In case of undefined value, it returns an empty array.
 * @param obj
 * @returns
 */
declare function getObjectValues<T, K extends keyof T>(obj: T | undefined): K[];
/**
 * Flattens an N-D array to a linear array.
 * @param arr
 * @returns
 */
declare function flattenArray(arr: Array<any>): Array<any>;
/**
 * Composes a list of functions from R to L (Opposite order to general composition).
 * @param arg
 * @param currentFunction
 * @param nxtFunction
 * @param functions
 * @returns
 */
declare function composeRTL<Inp, Out>(arg: Inp, currentFunction: (arg: Inp) => Out, nxtFunction: (arg: Out) => any | undefined, ...functions: any[] | undefined): any;
declare function f1(arg: number): string;
declare function f2(arg: string): boolean;
declare function f3(arg: boolean): number;
