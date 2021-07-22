const probabilityFailure = 0.2;

/**
 * Constructor function to get a new dummy delay function
 * @param {*} duration
 */
function genericDelayFunctionGenerator(duration) {
  this.duration = duration;
  this.execute = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < probabilityFailure) {
          reject("");
        } else {
          resolve("");
        }
      }, this.duration);
    });
  };
}

/**
 * Functional wrapper to wrap function promise and messages into new promise.
 * @param {*} currentFunction
 * @param {*} id
 * @returns
 */

function functionPromiseWrapper(currentFunction, id) {
  return Promise.resolve()
    .then(function (message) {
      return currentFunction();
    })
    .then(function (message) {
      console.log(`Successfully executed function : ${id}`);
      return message;
    })
    .catch(function (message) {
      return Promise.reject(`Error occured for function : ${id} => ${message}`);
    });
}

/**
 * Main pipeline executor. It stops execution if any one of the functions poses an error.
 * @param  {...any} functions
 */
function pipeLineExecuter(...functions) {
  let currId = 0;
  functions
    .reduce((runningPromise, currentFunction) => {
      return runningPromise
        .then(function (message) {
          let currentPromise = functionPromiseWrapper(currentFunction, currId);
          return currentPromise;
        })
        .then(function (message) {
          console.log(`Return value of function ${currId} : ${message}`);
          currId++;
          return message;
        });
    }, Promise.resolve(""))
    .then(function (message) {
      console.log("All done!");
    })
    .catch(function (message) {
      console.log(message);
    });
}

/**
 * List of functions to run in pipeline
 */
const syncFunction = () => {
  if (Math.random() < probabilityFailure) {
    throw new Error("Error occured inside Synchronous function");
  } else {
    console.log("Synchronous Function Executed");
  }
};
let functions = [
  new genericDelayFunctionGenerator(1000).execute,
  syncFunction,
  new genericDelayFunctionGenerator(2000).execute,
  new genericDelayFunctionGenerator(1500).execute,
];

pipeLineExecuter(...functions);
