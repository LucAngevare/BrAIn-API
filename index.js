const fs = require('fs')
const request = require('request');
var satelize = require('satelize');
let sqlOutput, name, option1, option2, option3, votes1, votes2, votes3, status, dueDate, todoOutput, homeData, htmlCode, imageBool, faviconBool, authorBool, globalResponse, globalBody, href, imageLink, vulnerabilities, isAlive; //making everything global hehe
const sqlite3 = require('sqlite3').verbose();
var port = process.env.PORT || 3537;
const bodyParser = require('body-parser');
let imageTag = "NULL";
let vulnerabilites = 0;
//List of modules can be found in 'modules.txt'

//TODO: Clean up list of vars

const express = require('express');
const app = express();

const routines = require('./commands/routines')
const quotes = require('./commands/quotes')
const colorpalette = require('./commands/colorpalette');
const radixSort = require('./commands/radixSort');
const charts = require('./commands/charts');
const tasks = require('./commands/tasks');
const vulnerabilityChecker = require('./commands/vulnerabilityChecker')
const webscraper = require('./commands/webscraper')
const news = require('./commands/news')

app.use(colorpalette)
app.use(quotes)
app.use(routines)
app.use(radixSort)
app.use(charts)
app.use(tasks)
app.use(vulnerabilityChecker)
app.use(webscraper)
app.use(news)

app.listen(3537);

console.log('RESTful API server started on: port ' + port);
