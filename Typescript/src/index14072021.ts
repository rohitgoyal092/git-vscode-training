let message = "hellow world";

let a = 2;
// a = "string";      //Invalid, as 'a' is already assigned a value of number
let b: string, c: any; //b can only be assigned string, c can be assigned any type of value

let arr: [string, any];
arr = ["1", "2"]; //arr is a tuple, hence number of entries also remain the same with type matching

/* 
- Nested object type description 
*/
const obj: {
  name: string;
  address: string;
  phone: number;
  marks: {
    english: number;
    hindi: number;
    science: number;
  };
} = {
  name: "rohit",
  address: "...",
  phone: 122,
  marks: {
    english: 20,
    hindi: 22,
    science: 21,
  },
};

/* 
- AND, OR operators 
*/
interface firstType {
  name: string;
  phoneNo: number;
}
interface secondType {
  name: string;
  email: string;
}

let obj1: firstType | secondType =
  Math.random() > 0.5
    ? {
        name: "rohit",
        phoneNo: 1212,
      }
    : {
        name: "rohit",
        email: "test@best.com",
      };
console.log(obj1.name); //We can for sure access name property as it's common between both interfaces (or operator).

let obj2: firstType & secondType = {
  name: "rohit",
  phoneNo: 1212,
  email: "test@best.com",
};

console.log(obj2.name, obj2.email, obj2.phoneNo); //We can for sure access all the properties as we used 'and' operator on both the interfaces.

/* 
- Simple function usage in typescript 
*/
function sumNumbers(...vals: number[]): number {
  let sum = 0;
  for (let x of vals) {
    sum += x;
  }
  return sum;
}
console.log(sumNumbers(1, 2, 3));

/* 
- Function overloading to make sure combination of types of arguments match
*/
function choiceFunction(method: "firstType", member: firstType): void;
function choiceFunction(method: "secondType", member: secondType): void;

//Comment the above 2 lines and the 2nd function call also works, which shouldn't be allowed. This can help us narrow our type matching even further.

function choiceFunction(
  method: "firstType" | "secondType",
  member: firstType | secondType
): void {
  if (method === "firstType") {
    console.log(
      "testing overloaded function : ",
      member.name,
      member,
      "firstType"
    );
  } else {
    console.log(
      "testing overloaded function : ",
      member.name,
      member,
      "secondType"
    );
  }
}

choiceFunction("firstType", { name: "testName", phoneNo: 1212 });
// choiceFunction("secondType", { name: "testName", phoneNo: 1212 });

/* 
- Interfaces 
*/
interface firstInterface {
  (name: string, address: string): void;
}

const printNameAndAddress: firstInterface = (name, address) => {
  console.log("testing custom interface : ", name, address);
};

printNameAndAddress("rohit", "....");

//Testing constructor function interface
interface functionalConstructorInterface {
  new (property: string): void;
  someFunction(): void;
}

function functionConsF(s) {
  console.log("Argument in constructor function is :", s);
  this.someFunction = function () {
    console.log("executing 'some function' from constructor function");
  };
}

const objFuncCons: functionalConstructorInterface = new functionConsF(a);
objFuncCons.someFunction();

/* 
- Merging interface signatures 
*/

interface mergeInterface {
  home: {
    phoneNo: number;
  };
  work: {
    phoneNo: number;
  };
  [numberName: string]:
    | undefined
    | {
        phoneNo: number;
      };
}

const mergeObj: mergeInterface = {
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

//Uncomment the below lines to require an address field apart from the previously required fields in the object.

// interface mergeInterface {
//   home: {
//     phoneNo: number;
//   };
//   work: {
//     phoneNo: number;
//   };
//   address: {
//     phoneNo: number;
//   };
// }

/* 
- Type aliases are strict, interfaces are lazy(kind of like hoisted, can use before defined).
- Type aliases can be used with type of primitive type or js data structures like arrays, objects, functions etc.
- Interfaces can only be used with non primitive types or data structures in js only.
*/

/* 
- Recursive type defining using aliases and interfaces 
*/

type fstRecType = 1 | 2 | 3 | secRecType;
interface secRecType extends Array<fstRecType> {}

/*
- Classes in Typescript
- Definite Assignment Operator
*/

interface firstClassInterface {
  name: string;
  address: string;
  phoneNo: number;
}

class class1 implements firstClassInterface {
  private password!: string;
  // !Should have got a warning here to somehow provide value to the private uninitialized variable
  constructor(
    public name: string,
    public address: string,
    public phoneNo: number
  ) {
    console.log("password is : ", this.password);
  }

  async init() {
    this.password = "thisIsPassword";
    console.log("Async called : ");
  }

  printX(): void {
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
