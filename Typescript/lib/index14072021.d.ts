declare let message: string;
declare let a: number;
declare let b: string, c: any;
declare let arr: [string, any];
declare const obj: {
    name: string;
    address: string;
    phone: number;
    marks: {
        english: number;
        hindi: number;
        science: number;
    };
};
interface firstType {
    name: string;
    phoneNo: number;
}
interface secondType {
    name: string;
    email: string;
}
declare let obj1: firstType | secondType;
declare let obj2: firstType & secondType;
declare function sumNumbers(...vals: number[]): number;
declare function choiceFunction(method: "firstType", member: firstType): void;
declare function choiceFunction(method: "secondType", member: secondType): void;
interface firstInterface {
    (name: string, address: string): void;
}
declare const printNameAndAddress: firstInterface;
interface functionalConstructorInterface {
    new (property: string): void;
    someFunction(): void;
}
declare function functionConsF(s: any): void;
declare const objFuncCons: functionalConstructorInterface;
interface mergeInterface {
    home: {
        phoneNo: number;
    };
    work: {
        phoneNo: number;
    };
    [numberName: string]: undefined | {
        phoneNo: number;
    };
}
declare const mergeObj: mergeInterface;
declare type fstRecType = 1 | 2 | 3 | secRecType;
interface secRecType extends Array<fstRecType> {
}
interface firstClassInterface {
    name: string;
    address: string;
    phoneNo: number;
}
declare class class1 implements firstClassInterface {
    name: string;
    address: string;
    phoneNo: number;
    private password;
    constructor(name: string, address: string, phoneNo: number);
    init(): Promise<void>;
    printX(): void;
}
declare const x: class1;
