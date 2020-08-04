const express = require('express');
const app = module.exports = express()
const tasks = []
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function randomStr(arr) {
  var ans = '';
  for (let i=0;i<100;i++) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
}

//TODO: Save tasks to file on cron and add/remove task
//FIXME: Continue the fix of using IDs instead of names, the removetask still works with the name, use .find() or .findIndex() to find the name/index

app.get("/tasks/view", function(req, res) {
    res.json({success: true, tasks: tasks});
});

app.post("/tasks/addtask", function(req, res) {
    newTask = req.body.newtask;
    tasks.push({ "name": newTask, "Status": 0, "ID":  randomStr("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZ1234567890")});
    res.redirect("/tasks/view");
});

app.post("/tasks/removetask", function(req, res) {
    completeTask = req.body.check;
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/tasks/view");
});
