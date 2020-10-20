const express = require('express')
const app = module.exports = express()
const {
  registerFont,
  createCanvas,
  loadImage
} = require('canvas')
var CanvasTextWrapper = require('canvas-text-wrapper').CanvasTextWrapper;
var markovQuotes = './quotes.txt'
const fs = require('fs');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

registerFont(__dirname + "/TheMicrander-d9rOR.ttf", {
  family: "The Micrander"
})
const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext('2d');
ctx.font = '128px "The Micrander"'

fs.readFile(__dirname + '/newQuotes.txt', 'utf8', function(err, data) {
  markovQuotes = data.split("\n")
})

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

/**
 * I'll be honest; this route was mostly made for me to meme on people with dumb, overly-inspirational statuses. However it can actually be useful, say you read a quote you really like and would like to share it in a creative, non-text way, just send the quote in to this route and you're free to share it! Don't know any good quotes and want to be inspired? There's some pre-generated (I used a Markov Chain to generate some new quotes, not because Markov chains are good at text generation, but usually they're funny) quotes you can use have a laugh, share with your friends or just feel inspired by.
 * @todo Make it possible to upload your own images
 * @todo Get more backdrop images and categorize them
 * @todo Add an option to choose between real and generated quotes
 * @name Quote Backdrop Generator
 * @route {POST} /quote
 * @bodyparam {string} [quote=pre-generated] The quote you want to display in front of a backdrop.
 * @return {String} A string of your image, encoded in Base64
 */
app.post('/quote', async function(req, res) {
  var images = ["./images/landscape1.png", "./images/landscape2.jpg", "./images/landscape3.jpg", "./images/landscape5.jpg", "./images/landscape6.jpg", "./images/landscape7.jpg", "./images/landscape8.jpg"];
  var chosenImage = images[Math.floor(Math.random() * images.length)]

  var imageCaption = (!req.body.quote) ? markovQuotes[Math.floor(Math.random() * markovQuotes.length)] : req.body.quote.toString()
  var loadedImage;

  loadImage(chosenImage).then((image) => {
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)
    var text = ctx.measureText(`"${imageCaption}"`)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'white';
    CanvasTextWrapper(canvas, `"${imageCaption}"`, {
      font: '128px "The Micrander"',
      textAlign: "center",
      verticalAlign: "top",
      strokeText: true,
      paddingX: 50,
      paddingY: 300
    })

    res.send(canvas.toDataURL())
  }).catch((err) => console.log(err))
})
