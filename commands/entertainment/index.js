const express = require('express');
const app = module.exports = express()
const fs = require('fs');
const csv = require('csv-parser');
const sudoku = require('sudoku');
const puppeteer = require('puppeteer');
var lines = []

async function sudokuPreview(sudokuArray) {
  const imgHTML = `<!DOCTYPE html><html> <head> <link href="style.css" rel="stylesheet" type="text/css"/> </head> <body> <div class="grid-container"> <div class="grid-item">${sudokuArray[0]}</div><div class="grid-item">${sudokuArray[1]}</div><div class="grid-item">${sudokuArray[2]}</div><div class="grid-item1">${sudokuArray[3]}</div><div class="grid-item1">${sudokuArray[4]}</div><div class="grid-item1">${sudokuArray[5]}</div><div class="grid-item">${sudokuArray[6]}</div><div class="grid-item">${sudokuArray[7]}</div><div class="grid-item">${sudokuArray[8]}</div><div class="grid-item">${sudokuArray[9]}</div><div class="grid-item">${sudokuArray[10]}</div><div class="grid-item">${sudokuArray[11]}</div><div class="grid-item1">${sudokuArray[12]}</div><div class="grid-item1">${sudokuArray[13]}</div><div class="grid-item1">${sudokuArray[14]}</div><div class="grid-item">${sudokuArray[15]}</div><div class="grid-item">${sudokuArray[16]}</div><div class="grid-item">${sudokuArray[17]}</div><div class="grid-item">${sudokuArray[18]}</div><div class="grid-item">${sudokuArray[19]}</div><div class="grid-item">${sudokuArray[20]}</div><div class="grid-item1">${sudokuArray[21]}</div><div class="grid-item1">${sudokuArray[22]}</div><div class="grid-item1">${sudokuArray[23]}</div><div class="grid-item">${sudokuArray[24]}</div><div class="grid-item">${sudokuArray[25]}</div><div class="grid-item">${sudokuArray[26]}</div><div class="grid-item1">${sudokuArray[27]}</div><div class="grid-item1">${sudokuArray[28]}</div><div class="grid-item1">${sudokuArray[29]}</div><div class="grid-item">${sudokuArray[30]}</div><div class="grid-item">${sudokuArray[31]}</div><div class="grid-item">${sudokuArray[32]}</div><div class="grid-item1">${sudokuArray[33]}</div><div class="grid-item1">${sudokuArray[34]}</div><div class="grid-item1">${sudokuArray[35]}</div><div class="grid-item1">${sudokuArray[36]}</div><div class="grid-item1">${sudokuArray[37]}</div><div class="grid-item1">${sudokuArray[38]}</div><div class="grid-item">${sudokuArray[39]}</div><div class="grid-item">${sudokuArray[40]}</div><div class="grid-item">${sudokuArray[41]}</div><div class="grid-item1">${sudokuArray[42]}</div><div class="grid-item1">${sudokuArray[43]}</div><div class="grid-item1">${sudokuArray[44]}</div><div class="grid-item1">${sudokuArray[45]}</div><div class="grid-item1">${sudokuArray[46]}</div><div class="grid-item1">${sudokuArray[47]}</div><div class="grid-item">${sudokuArray[48]}</div><div class="grid-item">${sudokuArray[49]}</div><div class="grid-item">${sudokuArray[50]}</div><div class="grid-item1">${sudokuArray[51]}</div><div class="grid-item1">${sudokuArray[52]}</div><div class="grid-item1">${sudokuArray[53]}</div><div class="grid-item">${sudokuArray[54]}</div><div class="grid-item">${sudokuArray[55]}</div><div class="grid-item">${sudokuArray[56]}</div><div class="grid-item1">${sudokuArray[57]}</div><div class="grid-item1">${sudokuArray[58]}</div><div class="grid-item1">${sudokuArray[59]}</div><div class="grid-item">${sudokuArray[60]}</div><div class="grid-item">${sudokuArray[61]}</div><div class="grid-item">${sudokuArray[62]}</div><div class="grid-item">${sudokuArray[63]}</div><div class="grid-item">${sudokuArray[64]}</div><div class="grid-item">${sudokuArray[65]}</div><div class="grid-item1">${sudokuArray[66]}</div><div class="grid-item1">${sudokuArray[67]}</div><div class="grid-item1">${sudokuArray[68]}</div><div class="grid-item">${sudokuArray[69]}</div><div class="grid-item">${sudokuArray[70]}</div><div class="grid-item">${sudokuArray[71]}</div><div class="grid-item">${sudokuArray[72]}</div><div class="grid-item">${sudokuArray[73]}</div><div class="grid-item">${sudokuArray[74]}</div><div class="grid-item1">${sudokuArray[75]}</div><div class="grid-item1">${sudokuArray[76]}</div><div class="grid-item1">${sudokuArray[77]}</div><div class="grid-item">${sudokuArray[78]}</div><div class="grid-item">${sudokuArray[79]}</div><div class="grid-item">${sudokuArray[80]}</div></div><style>.grid-container{display: grid; grid-template-columns: auto auto auto auto auto auto auto auto auto; background: #efefef8c; color: #000; padding: 10px;}.grid-item{padding-top: 10px; padding-bottom: 10px; background: white; border: 1px solid #3a3d3f31; text-align: center;}.grid-item1{padding-top: 10px; padding-bottom: 10px; background: silver; border: 1px solid black; text-align: center;}</style> </body></html>`
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: 512,
    height: 395,
    deviceScaleFactor: 1
  });
  await page.setContent(imgHTML)
  await page.screenshot({path: "sudoku.png"})
  await browser.close()
  var bitmap = fs.readFileSync("sudoku.png");
  const image = new Buffer.from(bitmap).toString('base64');
  return image;
}

/**
 * This is the route you can go to for a short laugh, this uses a database of short jokes that has more than 100,000 entries, You shouldn't be running out of jokes for the next 2 months if you generated 1 joke every minute of the day. <br> Warning: some of these are slightly NSFW, I filtered out some of the ones that were just too NSFW but for some of these I wouldn't be reading them out loud in front of your parents.
 * @name Joke Generator
 * @route {GET} /shortjoke/get
 * @return {Object} A string within an object that contains the joke
 */
app.get('/shortjoke/get', function(req, res) {
  fs.createReadStream(__dirname + "/shortjokes.csv")
    .pipe(csv())
    .on("data", function(data) {
      lines.push(data["Joke"])
    })
  res.json({ shortJoke: lines[Math.floor(Math.random()*lines.length)] })
})

/**
 * This is the route you can go to if you want a good riddle to get you thinking, it also gives the solution to that riddle so a client for this route should be fairly straight-forward. This dataset is fairly small so getting a bigger dataset is definitely on my todo list.
 * @todo Getting a bigger dataset for this
 * @todo Add a route to add riddles
 * @name Riddle Generator
 * @route {GET} /riddle/get
 * @return {Object} An object with the riddle and solution of that riddle
 */
app.get('/riddle/get', function(req, res) {
  fs.readFile(__dirname + "/riddles.json", function(err, data) {
    if (err) console.log(err)
    var parsedJSON = JSON.parse(data)
    const randomIndex = Math.floor(Math.random()*parsedJSON.length)
    const riddle = parsedJSON[randomIndex]["riddle"]
    const solution = parsedJSON[randomIndex]["solution"]
    res.json({ riddle: riddle, solution: solution })
  })
})

/**
 * Riddles not hard enough for you? Well try these sodukos then! This does not use a dataset at all, this uses a randomly generated array of *possible* sudoku values, which means there are almost infinite possibilities (<a href="http://en.wikipedia.org/wiki/Mathematics_of_Sudoku">6,670,903,752,021,072,936,960 possibilities</a> for all you nerds out there) so there's absolutely no way you can run out of sudokus.
 * @name Sudoku Generator
 * @route {GET} /sudoku/generate
 * @return {Object} An object with the generated array (it's an array of 81 values, enough to fill a 9x9 area), the solved array, a preview of the unsolved array and a preview of the solved array (those last two are images encoded in Base64)
 */
app.get('/sudoku/generate', async (req, res) => {
  const puzzle = sudoku.makepuzzle();
  const solution = sudoku.solvepuzzle(puzzle);
  var puzzleForPreview = [...puzzle];
  for (let i=0;i<puzzleForPreview.length;i++) {
    if (!(puzzleForPreview[i])) { puzzleForPreview[i] = "_" }
  }
  unsolvedPreview = await sudokuPreview(puzzleForPreview)
  solvedPreview = await sudokuPreview(solution)
  await res.json({sodukoObj: puzzle, solvedSudokuObj: solution, unsolvedPreview: unsolvedPreview, solvedPreview: solvedPreview})
})
