let id = 0; //Global id counter used to assign new id to a task
let availableSlots = 3; //Slots available to execute a task
let taskStore = {}; //Object map to store the mapping between Task ID's and duration
let mySet = new Set(); //Set to represent queue of tasks that are yet to be executed

function executeATask(duration, id) {
  //Execute a dummy task that runs asyncly for duration 'd' and has task-id 'id'
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

function popTaskFromQueue() {
  //Check if queue is non empty and slots are available for execution
  if (mySet.size > 0 && availableSlots > 0) {
    //Remove task from the queue and assign an available slot to the task to begin execution of the task
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
        //Task succeeded
        console.log(response);
        availableSlots++;
        console.log(
          `Deallocating slot for task : ${cid}. Free space is now : `,
          availableSlots
        );
        popTaskFromQueue();
      })
      .catch(function (err) {
        // If task failed, add the task to the queue again
        console.log(err);
        availableSlots++;
        console.log(
          `Deallocating slot for task : ${cid}. Free space is now : `,
          availableSlots
        );
        console.log(`Re-adding task : ${cid} to queue`);
        mySet.add(cid);
        popTaskFromQueue();
      });
  }
}

function addTask(duration) {
  let cid = id;
  id++;
  console.log(`Adding task : ${cid} to queue`);
  //Add a new task to the queue, with task id = 'cid' and duration = 'duration'
  taskStore[cid] = duration;
  mySet.add(cid);
  popTaskFromQueue();
}

addTask(200);
addTask(1500);
addTask(3000);
addTask(1200);
addTask(2000);
