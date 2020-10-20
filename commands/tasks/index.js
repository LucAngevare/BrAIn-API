const express = require('express');
const cron = require("node-cron");
const app = module.exports = express()
var tasks = [];
var complete = []
const bodyParser = require('body-parser');
const fs = require('fs')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function randomStr(arr) {
  var ans = '';
  for (let i=0;i<100;i++) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
}

/**
 * The path to get an object of all tasks in a specific board
 * @name Task view
 * @route {GET} /tasks/view/:board?
 * @routeparam {string} [board="inbox"] This is the board you want to see the tasks for, it defaults to inbox so just going to /tasks/view gives you all the tasks for /inbox

 * @return {Object} An object that consists of all tasks in that board (or inbox).
 */
app.get("/tasks/view/:board?", function(req, res) {
  const board = (typeof req.params["board"] === "undefined") ? "inbox" : req.params["board"]
  const obj = JSON.parse(fs.readFileSync(__dirname + '/tasks.json', 'utf8'));
  res.json({ success: true, tasksOnBoard: obj[board], completed: complete })
});

/**
 * The path to add a task to a specific board
 * @name Task add
 * @route {POST} /tasks/addtask
 * @bodyparam {string|Object[]} newtask This is the task you want to add, this can either be an object with a due date and stuff or a string with just the name of the task.
 * @bodyparam {string} [board="inbox"] This is the board you want to add the task to, it defaults to inbox so just leaving this empty makes the task go to inbox
 * @bodyparam {date} [dueDate] This is the due date of the task, you don't have to define this, if you don't define this it will just not be empty.

 * @return {redirect} This will redirect you to the /tasks/view/[board you entered as parameter or inbox] route.
 */
app.post("/tasks/addtask", function(req, res) {
    newTask = req.body.newtask;
    const board = (typeof req.body.board === "undefined") ? "inbox" : req.body.board
    const dueDate = (typeof req.body.dueDate === "undefined") ? "" : req.body.dueDate
    const newerTask = { "name": newTask, "Status": 0, "ID":  randomStr("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZ1234567890"), "subTask": [], "due date": dueDate}
    tasks.push(newerTask)
    res.redirect(`/tasks/view/${board}`);
    const obj = JSON.parse(fs.readFileSync(__dirname + '/tasks.json', 'utf8'));
    let objCopy = {...obj}
    objCopy[board].push(newerTask);
    //FIXME: Add deep copy to object to push it to JSOn
    fs.writeFile(__dirname + '/tasks.json', JSON.stringify(objCopy), "utf8", (err) => console.error(err))
});

/**
 * The path to change an object of a task in a specific board
 * @name Task change
 * @route {POST} /tasks/changetask
 * @bodyparam {string} newtask This is the task you want to change it to, this can either be an object with a due date and stuff or a string with just the name of the new task.
 * @bodyparam {string} oldtask This is the old task, the one you want to change.
 * @bodyparam {string} [oldBoard="inbox"] This is the board the old task was in
 * @bodyparam {string} [newBoard="inbox"] This is the board you want the new task to be in.

 * @return {redirect} This will redirect you to the /tasks/view/[newBoard you entered as parameter or inbox] route.
 */
app.post("/tasks/changetask", function(req, res) {
  newTask = req.body.newtask;
  const newBoard = (typeof req.body.newBoard === "undefined") ? "inbox" : req.body.newBoard
  oldTask = req.body.oldtask;
  const oldBoard = (typeof req.body.oldBoard === "undefined") ? "inbox" : req.body.oldBoard

  const obj = JSON.parse(fs.readFileSync(__dirname + '/tasks.json', 'utf8'));
  var oldObj = obj[oldBoard][tasks.findIndex(obj => obj.name === oldTask)]["name"]
  var newObj = oldObj["name"] = newTask;
  newObj[oldBoard].splice(obj[oldBoard][tasks.findIndex(obj => obj.name === oldTask)]["name"], 1)
  newObj[newBoard].push(newObj)
  fs.writeFile(__dirname + '/tasks.json', JSON.stringify(newObj), "utf8", (err) => console.error(err))
  res.redirect(`/tasks/view/${newBoard}`);
})

/**
 * The path to add a subtask in an already existing task
 * @name Task Add Subtask
 * @route {POST} /tasks/addsubtask
 * @bodyparam {string} parentTask This is the name of the task you want to add a subtask to.
 * @bodyparam {string|Object[]} subTask This is the subtask
 * @bodyparam {string} [board="inbox"] This is the board the parent task is in, this will default to inbox

 * @return {redirect} This will redirect you to the /tasks/view/[board you entered as parameter or inbox] route.
 */
app.post("/tasks/addsubtask", function(req, res) {
  const parentTask = req.body.parentTask;
  const board = (typeof req.body.board === "undefined") ? "inbox" : req.body.board;
  const subTask = req.body.subTask;

  const obj = JSON.parse(fs.readFileSync(__dirname + '/tasks.json', 'utf8'));
  var objCopy = {...obj};
  objCopy[board][objCopy[board].findIndex(object => object.name === parentTask)]["subTask"].push(subTask);
  fs.writeFile(__dirname + '/tasks.json', JSON.stringify(objCopy), "utf8", (err) => console.error(err))
  res.redirect(`/tasks/view/${board}`)
})

/**
 * The path to remove a task
 * @name Task Remove
 * @route {POST} /tasks/removetask
 * @bodyparam {string|Object[]} completeTask This is the name of the task you want to remove or mark as complete.
 * @bodyparam {string} [board="inbox"] This is the board the parent task is in, this will default to inbox

 * @return {redirect} This will redirect you to the /tasks/view/[board you entered as parameter or inbox] route.
 */
app.post("/tasks/removetask", function(req, res) {
  completedTask = req.body.completeTask;
  const board = (typeof req.body.board === "undefined") ? "inbox" : req.body.board
  const obj = JSON.parse(fs.readFileSync(__dirname + '/tasks.json', 'utf8'));
  if (typeof completedTask === "string") {
    complete.push(completedTask)
    obj[board].splice(obj[board][tasks.findIndex(obj => obj.name === completedTask)]["name"], 1)
  } else if (typeof completedTask === "object") {
    for (var i = 0; i < completedTask.length; i++) {
      completedTask.push(completedTask[i]);
      obj[board].splice(obj[board][tasks.findIndex(obj => obj.name === completedTask[i])]["name"], 1)
    }
  }
  res.redirect(`/tasks/view/${board}`);
});

cron.schedule("* * 0 * * *", () => {
  complete = [];
})
