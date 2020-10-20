const express = require('express');
const ColorScheme = require('color-scheme');
const app = module.exports = express();
const puppeteer = require("puppeteer");
var path = require('path');
const fs = require('fs')
var hsl = require('hex-to-hsl')
const scheme = new ColorScheme;

/**
 * Looking for a color palette and need a preview of it? Well then, this route is the route for you!
 * @name Color Palette Generator
 * @route {GET} /colorpalette/:color
 * @routeparam {string} :color is the color you want to for sure have in your palette.
 * @return {Object} An object that consists of the original hex color, array of your new color palette (RGB and Hex format), the hue of the original color and a preview image encoded in Base64.
 */

app.get('/colorpalette/:schemeType?/:color1?', async function(req, res) {
  let rgbArray = [];
  if (req.params["color1"]) {
    var hexColor = req.params["color1"]
  } else {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    var hexColor = n.slice(0, 6)
  }
  var hexColor = req.params["color1"] || (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);
  var schemeType = req.params["schemeType"] || "analogic";
  var HTMLstring = "<head><link href=\"https://fonts.googleapis.com/css2?family=Roboto%3Aital%2Cwght%400%2C100%3B0%2C300%3B0%2C400%3B0%2C500%3B0%2C700%3B0%2C900%3B1%2C100%3B1%2C300%3B1%2C400%3B1%2C500%3B1%2C700%3B1%2C900&display=swap\" rel=\"stylesheet\"></head>"
  var CSSstring = "*{margin:0;padding:0}body{width:100%;height:100vh;display:flex}h1{font-family:Roboto,sans-serif;font-size:35px;text-align:center;position:relative;top:50%;-webkit-text-fill-color:#fff;-webkit-text-stroke-width:1.5px;-webkit-text-stroke-color:#000}"
  var hueColor = hsl(hexColor)[0]
  scheme.from_hue(hueColor)
  scheme.scheme(schemeType)
  scheme.add_complement(true)
  scheme.variation('default')
  var colorThings = scheme.colors();
  for (let i=0;i<colorThings.length;i++) {
    HTMLstring += `<div class="color-${i}"><h1>#${colorThings[i]}</h1></div>`
    CSSstring += `.color-${i} {background: #${colorThings[i]}; width: 20%; height: 100%;}`
  }
  const imgHTML = HTMLstring + "<style>" + CSSstring + "</style>"

  for (let i=0; i < colorThings.length; i++) {
    let r = parseInt(colorThings[i].substring(0,2),16)/255
    let g = parseInt(colorThings[i].substring(2,4),16)/255
    let b = parseInt(colorThings[i].substring(4,6),16)/255
    rgbArray.push(`rgb(${r}, ${g}, ${b})`)
  }

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: 3000,
    height: 500,
    deviceScaleFactor: 1,
  });

  await page.setContent(imgHTML)
  await page.screenshot({path: "preview.png"})

  res.json({
    originHex: hexColor,
    hexArray: colorThings,
    rgbArray: rgbArray,
    hue: hueColor,
    previewImageBase64: fs.readFileSync("preview.png", {encoding: 'base64'})
  })
})

app.get('/colorpalettePossibilities', function(req, res) {
  res.json({
    mono: "The monochromatic scheme is based on selecting a single hue on the color wheel, then adding more colors by varying the source color's saturation and brightness. This will produce 4 colors",
    contrast: "Contrast supplements the selected hue with its complement (the color opposite it on the color wheel) as another source color. This will produce 8 colors",
    triade: "Triade takes the selected hue and adds two more source colors that are both a certain distance from the initial hue. This will produce 12 colors.",
    tetrade: "Tetrade adds another yet source color, meaning four total sources. This will produce 16 colors",
    analogic: 'Analogic produces colors that are "analogous", or next to each other on the color wheel. This will produce 12 colors.',
    more_info: "https://github.com/c0bra/color-scheme-js#schemes"
  })
})
