declare function pluckit<T, V extends keyof T>(obj: T, propertyNames: V[]): T[V][];
interface A {
    b: string;
    c: {
        d: string;
        e: number;
    };
    f: number;
    50: string;
}
declare const obj3: A;
declare function getObjectValues<T, K extends keyof T>(obj: T | undefined): K[];
declare function flattenArray(arr: Array<any>): Array<any>;
interface functionType<Inp, Out> {
    (arg: Inp): Out;
}
declare function composeRTL<Inp, Out>(arg: Inp, currentFunction: functionType<Inp, Out>, nxtFunction: functionType<Out, any> | undefined, ...functions: any[] | undefined): any;
declare function f1(arg: number): string;
declare function f2(arg: string): boolean;
declare function f3(arg: boolean): number;
