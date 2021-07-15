/*
- template types
*/
const getAString = (input) => {
    return typeof input === "string";
};
// If we do not specify a type, it is by default 'any' unless interpreted from one of the arguments.
/**
 * Type Guards
 */
let unknownVar;
// Comment this function to generate an error at the name property access part below
function isFunction(value) {
    if (typeof value === "function") {
        return true;
    }
    return false;
}
function undefinedChecker(arg) {
    return typeof arg !== "undefined";
}
const arr1 = ["a", "b", "c", , undefined, 2];
const filtered = arr1.filter(undefinedChecker);
console.log(filtered);
if (isFunction(unknownVar)) {
    console.log(unknownVar.name);
}
function BrandA(value) {
    return value;
}
function unBrandA(value) {
    return value;
}
function BrandB(value) {
    return value;
}
function unBrandB(value) {
    return value;
}
let s1 = BrandA("This is message-1");
let s2 = BrandB({ abc: "This is message-2" });
let r1 = unBrandA(s1), r2 = unBrandB(s2);
/**
 * Exhaustive Switch
 */
let exhaustiveSwitchVar = 4;
console.log("Exhaustive switch : ");
if (typeof exhaustiveSwitchVar === "number") {
    console.log(exhaustiveSwitchVar, "number");
}
else if (typeof exhaustiveSwitchVar === "string") {
    console.log(exhaustiveSwitchVar, "string");
}
else if (typeof exhaustiveSwitchVar === "function") {
    console.log(exhaustiveSwitchVar, "function");
}
else if (typeof exhaustiveSwitchVar === "boolean") {
    console.log(exhaustiveSwitchVar, "boolean");
}
else {
    console.log(exhaustiveSwitchVar, "lets observe");
}
function choiceFunction1(method, member) {
    if (method === "firstType") {
        console.log("testing overloaded function : ", member.name, member, "firstType");
    }
    else {
        console.log("testing overloaded function : ", member.name, member, "secondType");
    }
}
console.log("Mapped functions : ");
choiceFunction1("firstType", { name: "testName", phoneNo: 1212 });
/**
 * Enums
 */
// See the equivalent JS code
var StateHolder;
(function (StateHolder) {
    StateHolder[StateHolder["alpha"] = 2] = "alpha";
    StateHolder[StateHolder["beta"] = 3] = "beta";
    StateHolder[StateHolder["gamma"] = 4] = "gamma";
    StateHolder[StateHolder["pi"] = 3.14] = "pi";
})(StateHolder || (StateHolder = {}));
console.log("Enums : ", StateHolder.alpha);
//# sourceMappingURL=index15072021.js.map