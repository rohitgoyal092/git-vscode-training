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

const obj3: A = {
  b: "b",
  c: {
    d: "d",
    e: 2,
  },
  f: 3,
  50: "fifty",
};
const obj4: B = {
  b: "b",
  c: {
    d: "d",
    e: 2,
  },
};

/**
 * Plucks a list of properties from an object
 * @param obj
 * @param propertyNames
 * @returns
 */
function pluckProperties<T, V extends keyof T>(
  obj: T,
  propertyNames: V[]
): T[V][] {
  const returnArray: T[V][] = propertyNames.map((x) => obj[x]);
  return returnArray;
}
console.log("Pluck test : ", pluckProperties(obj3, ["b", "c"]));

/**
 * Plucks a property from an array of objects if it exists in all of them.
 * @param arr
 * @param propertyName
 * @returns
 */
function pluckProperty<T, V extends keyof T>(
  arr: Array<T>,
  propertyName: V
): T[V][] {
  const returnArray: T[V][] = arr.map((x) => x[propertyName]);
  return returnArray;
}
console.log(pluckProperty([obj3, obj4], "b"));

/**
 * Returns an array of keys of an object. In case of undefined value, it returns an empty array.
 * @param obj
 * @returns
 */
function getObjectValues<T, K extends keyof T>(obj: T | undefined): K[] {
  if (typeof obj === "undefined") {
    return [];
  }
  let arr: K[] = Reflect.ownKeys(obj3) as unknown as K[];
  return arr;
}

console.log("Object Values test(undefined) : ", getObjectValues(undefined));
console.log("Object Values test(object) : ", getObjectValues(obj3));

/**
 * Flattens an N-D array to a linear array.
 * @param arr
 * @returns
 */
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

/**
 * Composes a list of functions from R to L (Opposite order to general composition).
 * @param arg
 * @param currentFunction
 * @param nxtFunction
 * @param functions
 * @returns
 */
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
