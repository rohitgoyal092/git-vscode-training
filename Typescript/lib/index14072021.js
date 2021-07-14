let message = "hellow world";
let a = 2;
// a = "string";      //Invalid, as 'a' is already assigned a value of number
let b, c; //b can only be assigned string, c can be assigned any type of value
let arr;
arr = ["1", "2"]; //arr is a tuple, hence number of entries also remain the same with type matching
/*
- Nested object type description
*/
const obj = {
    name: "rohit",
    address: "...",
    phone: 122,
    marks: {
        english: 20,
        hindi: 22,
        science: 21,
    },
};
let obj1 = Math.random() > 0.5
    ? {
        name: "rohit",
        phoneNo: 1212,
    }
    : {
        name: "rohit",
        email: "test@best.com",
    };
console.log(obj1.name); //We can for sure access name property as it's common between both interfaces (or operator).
let obj2 = {
    name: "rohit",
    phoneNo: 1212,
    email: "test@best.com",
};
console.log(obj2.name, obj2.email, obj2.phoneNo); //We can for sure access all the properties as we used 'and' operator on both the interfaces.
/*
- Simple function usage in typescript
*/
function sumNumbers(...vals) {
    let sum = 0;
    for (let x of vals) {
        sum += x;
    }
    return sum;
}
console.log(sumNumbers(1, 2, 3));
//Comment the above 2 lines and the 2nd function call also works, which shouldn't be allowed. This can help us narrow our type matching even further.
function choiceFunction(method, member) {
    if (method === "firstType") {
        console.log("testing overloaded function : ", member.name, member, "firstType");
    }
    else {
        console.log("testing overloaded function : ", member.name, member, "secondType");
    }
}
choiceFunction("firstType", { name: "testName", phoneNo: 1212 });
const printNameAndAddress = (name, address) => {
    console.log("testing custom interface : ", name, address);
};
printNameAndAddress("rohit", "....");
function functionConsF(s) {
    console.log("Argument in constructor function is :", s);
    this.someFunction = function () {
        console.log("executing 'some function' from constructor function");
    };
}
const objFuncCons = new functionConsF(a);
objFuncCons.someFunction();
const mergeObj = {
    home: {
        phoneNo: 123,
    },
    work: {
        phoneNo: 123,
    },
    iphone: {
        phoneNo: 123,
    },
    // address: {
    //   phoneNo: 123,
    // },
};
class class1 {
    name;
    address;
    phoneNo;
    password;
    // !Should have got a warning here to somehow provide value to the private uninitialized variable
    constructor(name, address, phoneNo) {
        this.name = name;
        this.address = address;
        this.phoneNo = phoneNo;
        console.log("password is : ", this.password);
    }
    async init() {
        this.password = "thisIsPassword";
        console.log("Async called : ");
    }
    printX() {
        console.log("Called password printer : ", this.password);
    }
}
const x = new class1("abc", "bcd", 2);
console.log(x);
x.printX();
//Same as
// class class1 implements firstClassInterface {
//   name: string;
//   address: string;
//   phoneNo: number;
//   constructor() {}
// }
//# sourceMappingURL=index14072021.js.map