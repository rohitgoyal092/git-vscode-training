interface A {
  b: string;
  c: {
    d: string;
    e: number;
  };
  f: number;
  50: string;
}

const obj3: A = {
  b: "b",
  c: {
    d: "d",
    e: 2,
  },
  f: 3,
  50: "fifty",
};

function pluckit<T, V extends keyof T>(obj: T, propertyNames: V[]): T[V][] {
  const returnArray: T[V][] = propertyNames.map((x) => obj[x]);
  return returnArray;
}

console.log("Pluck test : ", pluckit(obj3, ["b", "c"]));

function getObjectValues<T, K extends keyof T>(obj: T | undefined): K[] {
  if (typeof obj === "undefined") {
    return [];
  }
  let arr: K[] = Reflect.ownKeys(obj3) as unknown as K[];
  return arr;
}

console.log("Object Values test(undefined) : ", getObjectValues(undefined));
console.log("Object Values test(object) : ", getObjectValues(obj3));

function flattenArray(arr: Array<any>): Array<any> {
  let arr1: Array<any> = [];
  for (let i = 0; i < arr.length; i++) {
    if (!Array.isArray(arr[i])) {
      arr1.push(arr[i]);
    } else {
      let arr2 = flattenArray(arr[i]);
      arr1.push(...arr2);
    }
  }
  return arr1;
}

console.log(flattenArray([1, 2, [[3], 4]]));

function composeRTL<Inp, Out>(
  arg: Inp,
  currentFunction: (arg: Inp) => Out,
  nxtFunction: (arg: Out) => any | undefined,
  ...functions: any[] | undefined
): any {
  let cans: Out = currentFunction(arg);
  if (typeof nxtFunction === "undefined") {
    return cans;
  }
  if (functions !== undefined && functions.length > 1) {
    return composeRTL(cans, nxtFunction, functions[0], functions.slice(1, 0));
  }
  if (functions !== undefined) {
    return composeRTL(cans, nxtFunction, functions[0], undefined);
  }
  return composeRTL(cans, nxtFunction, undefined, undefined);
}

function f1(arg: number): string {
  return arg.toString();
}

function f2(arg: string): boolean {
  if (arg[0] != "-") {
    return true;
  }
  return false;
}

function f3(arg: boolean): number {
  if (arg) {
    return 100;
  }
  return -100;
}

console.log("Composition of functions RTL: ", composeRTL(-1, f1, f2, f3));
