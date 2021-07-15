/* 
- template types
*/

interface genericInterfae<T = string> {
  (arg: T): boolean;
}
const getAString: genericInterfae<string> = (input) => {
  return typeof input === "string";
};

// If we do not specify a type, it is by default 'any' unless interpreted from one of the arguments.

/**
 * Type Guards
 */

let unknownVar: unknown;
// Comment this function to generate an error at the name property access part below
function isFunction(value: unknown): value is Function {
  if (typeof value === "function") {
    return true;
  }
  return false;
}
function undefinedChecker<T>(arg: T | undefined): arg is T {
  return typeof arg !== "undefined";
}

const arr1: any[] = ["a", "b", "c", , undefined, 2];
const filtered = arr1.filter(undefinedChecker);
console.log(filtered);

if (isFunction(unknownVar)) {
  console.log(unknownVar.name);
}

/**
 * Branded types
 */

interface BrandedA {
  __this_is_branded_a: "a";
}

interface BrandedB {
  __this_is_branded_b: "b";
}

function BrandA(value: string): BrandedA {
  return value as unknown as BrandedA;
}

function unBrandA(value: BrandedA): string {
  return value as unknown as string;
}

function BrandB(value: { abc: string }): BrandedB {
  return value as unknown as BrandedB;
}

function unBrandB(value: BrandedB): { abc: string } {
  return value as unknown as { abc: string };
}

let s1 = BrandA("This is message-1");
let s2 = BrandB({ abc: "This is message-2" });

let r1 = unBrandA(s1),
  r2 = unBrandB(s2);

/**
 * Exhaustive Switch
 */
let exhaustiveSwitchVar = 4 as string | number | boolean;
console.log("Exhaustive switch : ");
if (typeof exhaustiveSwitchVar === "number") {
  console.log(exhaustiveSwitchVar, "number");
} else if (typeof exhaustiveSwitchVar === "string") {
  console.log(exhaustiveSwitchVar, "string");
} else if (typeof exhaustiveSwitchVar === "function") {
  console.log(exhaustiveSwitchVar, "function");
} else if (typeof exhaustiveSwitchVar === "boolean") {
  console.log(exhaustiveSwitchVar, "boolean");
} else {
  console.log(exhaustiveSwitchVar, "lets observe");
}

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
function choiceFunction1<K extends keyof typeMatching>(
  method: K,
  member: typeMatching[K]
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
console.log("Mapped functions : ");
choiceFunction1("firstType", { name: "testName", phoneNo: 1212 });

/**
 * Enums
 */

// See the equivalent JS code
enum StateHolder {
  alpha = 2,
  beta = 3,
  gamma = 4,
  pi = 3.14,
}

console.log("Enums : ", StateHolder.alpha);
