function pluckit(obj, propertyNames) {
  const returnArray = propertyNames.map((x) => obj[x]);
  return returnArray;
}
const obj3 = {
  b: "b",
  c: {
    d: "d",
    e: 2,
  },
  f: 3,
  50: "fifty",
};
console.log("Pluck test : ", pluckit(obj3, ["b", "c"]));
function getObjectValues(obj) {
  if (typeof obj === "undefined") {
    return [];
  }
  let arr = Reflect.ownKeys(obj3);
  return arr;
}
console.log("Object Values test(undefined) : ", getObjectValues(undefined));
console.log("Object Values test(object) : ", getObjectValues(obj3));
function flattenArray(arr) {
  let arr1 = [];
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
function composeRTL(arg, currentFunction, nxtFunction, ...functions) {
  let cans = currentFunction(arg);
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
function f1(arg) {
  return arg.toString();
}
function f2(arg) {
  if (arg[0] != "-") {
    return true;
  }
  return false;
}
function f3(arg) {
  if (arg) {
    return 100;
  }
  return -100;
}
console.log("Composition of functions RTL: ", composeRTL(-1, f1, f2, f3));
//# sourceMappingURL=exercises_pluck.js.map
