const fs = require('fs')
require('dotenv').config()
const process = require('process');
var port = process.env.PORT || 3537;
var dash = require('appmetrics-dash').attach()
const express = require('express');
const fetch = require("node-fetch");
const app = express();
const notificationLink = `${process.env.SEND_NOTIF}`

process.stdin.resume();

//Command handler, this checks for all subdirectories in the directory /commands/ and requires it.
const commandRoutes = fs.readdirSync(__dirname + '/commands/')
for (var i = 0; i < commandRoutes.length; i++) {
  const currentRoute = require(__dirname + '/commands/' + commandRoutes[i])
  console.log('/commands/' + commandRoutes[i])
  app.use(currentRoute)
}

//Everything from here is to "prevent" it from crashing, if it gets a signal to be terminated it sends a notification to my phone.
function handle(signal) {
  console.log(`Received ${signal}`);
  fetch(notificationLink, {
    method: "POST",
    body: { "value1": reason }
  })
    .then(res => console.log("heyyy"))
    .then(json => console.log(json))
}

//process.on('SIGINT', handle);
//process.on('SIGHUP', handle);
//process.on('SIGTERM', handle);
//process.on('SIGKILL', handle);

app.listen(port);

console.log('RESTful API server started on: port ' + port);
