let id = 0;
let availableSlots = 3;
let taskStore = {};
let mySet = new Set();

function executeATask(duration, id) {
  console.log(`Execution begun for task : ${id}`);
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (Math.random() > 0.5) {
        resolve(`Task succeeded : ${id}`);
      }
      reject(`Task failed : ${id}`);
    }, duration);
  });
}

function checkForNewTask() {
  if (mySet.size > 0 && availableSlots > 0) {
    let cid = mySet.values().next().value;
    availableSlots--;
    console.log(
      `Allocating slot to task : ${cid}. Free space is now : `,
      availableSlots
    );
    mySet.delete(cid);
    let myPromise = executeATask(taskStore[cid], cid);
    myPromise
      .then(function (response) {
        console.log(response);
        availableSlots++;
        console.log(
          `Deallocating slot for task : ${cid}. Free space is now : `,
          availableSlots
        );
        checkForNewTask();
      })
      .catch(function (err) {
        console.log(err);
        availableSlots++;
        console.log(
          `Deallocating slot for task : ${cid}. Free space is now : `,
          availableSlots
        );
        console.log(`Re-adding task : ${cid} to queue`);
        mySet.add(cid);
        checkForNewTask();
      });
  }
}

function addTask(duration) {
  let cid = id;
  id++;
  console.log(`Adding task : ${cid} to queue`);
  taskStore[cid] = duration;
  mySet.add(cid);
  checkForNewTask();
}

addTask(200);
addTask(1500);
addTask(3000);
addTask(1200);
addTask(2000);
