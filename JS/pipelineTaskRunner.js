/**
 * Constructor function to get a new dummy delay function
 * @param {*} duration
 */
function genericDelayFunctionGenerator(duration) {
  this.duration = duration;
  this.execute = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.2) {
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
  return new Promise((resolve, reject) => {
    currentFunction()
      .then(function (message) {
        resolve(`Function : ${id} successfully executed.` + message);
      })
      .catch(function (error) {
        reject(`Error occured for function : ${id}.` + error);
      });
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
          currId++;
          return currentPromise;
        })
        .then(function (message) {
          console.log(message);
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
let functions = [
  new genericDelayFunctionGenerator(1000).execute,
  new genericDelayFunctionGenerator(2000).execute,
  new genericDelayFunctionGenerator(1500).execute,
];

pipeLineExecuter(...functions);
