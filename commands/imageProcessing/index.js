const express = require('express');
const app = module.exports = express();
var Jimp = require("jimp");
var fileupload = require("express-fileupload");

app.use(fileupload());

app.post('/imageProcessing/:type/:sizeArray/:percentage', function(req, res) {
  var type = req.params
  var image;
  if (!req.files) return res.status(418).end()
  file = req.files.FormFieldName;
  console.log(type)
})
