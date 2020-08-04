const express = require('express')
const app = module.exports = express()
var Jimp = require("jimp");
var markovQuotes = './quotes.txt'
const fs = require('fs');
const bodyParser = require('body-parser');

fs.readFile('./commands/quotes/newQuotes.txt', 'utf8', function(err, data) {markovQuotes = data.split("\n")})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//FIXME: need to restore pic (make copy from backup folder (images folder in local directory) and move it to root directory) as it's overwriting the image currently

app.post('/quote', async function(req, res) {
  var images = ["./images/landscape1.png", "./images/landscape2.jpg", "./images/landscape3.jpg", "./images/landscape5.jpg", "./images/landscape6.jpg", "./images/landscape7.jpg", "./images/landscape8.jpg"];
  var imageCaption = (req.body.quote == undefined) ? markovQuotes[Math.floor(Math.random() * markovQuotes.length)] : req.body.quote.toString()
  var loadedImage;
  var chosenImage = images[Math.floor(Math.random() * images.length)]

  Jimp.read(chosenImage)
      .then(function (image) {
          loadedImage = image;
          return Jimp.loadFont('./commands/quotes/sea-base.fnt');
      })
      .then(async function (font) {
          loadedImage.print(font, 10, 10, {
            text: imageCaption,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_CENTER
          })
                     .writeAsync(chosenImage, err => console.error('write error: ', err));
      })
      .catch(function (err) {
          console.error(err);
      });
      console.log(imageCaption)
      console.log(chosenImage)
      res.sendFile(__dirname + chosenImage.replace('.', ""))/*.then(() => {
        fs.copyFile(`./commands/quotes/${chosenImage.replace('.', "")}`, chosenImage, (err) => {
          if (err) throw err;
        })
      })*/
})
