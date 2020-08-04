const express = require('express');
const ColorScheme = require('color-scheme');
const nodeHtmlToImage = require('node-html-to-image');
const app = module.exports = express();
var hsl = require('hex-to-hsl')
let rgbArray = [];

//TODO: Check if it even works; generating same color palette over and over again currently?

app.get('/colorpalette/:color1', function(req, res) {
  var hexColor = req.url
  var r = parseInt(hexColor.substr(1,2), 16);
  var g = parseInt(hexColor.substr(3,2), 16);
  var b = parseInt(hexColor.substr(5,2), 16);

  var hueColor = hsl(hexColor)[0]
  var scheme = new ColorScheme;
  scheme.from_hue(hueColor)
  scheme.scheme('analogic')
  scheme.add_complement(true)
  scheme.variation('hard')

  for (let i=0; i < scheme.colors().length; i++) {
    let r = parseInt(scheme.colors()[i].substring(0,2),16)/255
    let g = parseInt(scheme.colors()[i].substring(2,4),16)/255
    let b = parseInt(scheme.colors()[i].substring(4,6),16)/255
    rgbArray.push(`rgb(${r}, ${g}, ${b})`)
  }

  nodeHtmlToImage({
    output: './image.png',
    html: `<div class="color-1"><h1>{{hex1}}</h1></div><div class="color-2"><h1>{{hex2}}</h1></div><div class="color-3"><h1>{{hex3}}</h1></div><div class="color-4"><h1>{{hex4}}</h1></div><div class="color-5"><h1>{{hex5}}</h1></div></div class="color-6"><h1>{{hex6}}</h1></div><div class="color-7"><h1>{{hex7}}</h1></div><div class="color-8"><h1>{{hex8}}</h1></div><div class="color-9"><h1>{{hex9}}</h1></div><div class="color-10"><h1>{{hex10}}</h1></div><div class="color-11"><h1>{{hex11}}</h1></div><div class="color-12"><h1>{{hex12}}</h1></div><div class="color-13"><h1>{{hex13}}</h1></div><div class="color-14"><h1>{{hex14}}</h1></div><div class="color-15"><h1>{{hex15}}</h1></div><div class="color-16"><h1>{{hex16}}</h1></div><style>*{margin:0;padding:0;}body{width: 100%;height: 100vh;display: flex;}h1{font-size: 20px;text-align: center;position: relative;top: 50%;}.color-1{background:{{hex1}};width: 20%; height: 100%;}.color-2{background: {{hex2}};width: 20%; height: 100%;}.color-3{background: {{hex3}};width: 20%; height: 100%;}.color-4{background: {{hex4}};width: 20%; height: 100%;}.color-5{background: {{hex5}};width: 20%; height: 100%;}.color-6{background: {{hex6}};width: 20%; height: 100%;}.color-7{background: {{hex7}};width: 20%; height: 100%;}.color-8{background: {{hex8}};width: 20%; height: 100%;}.color-9{background: {{hex9}};width: 20%; height: 100%;}.color-10{background: {{hex10}};width: 20%; height: 100%;}.color-11{background: {{hex11}};width: 20%; height: 100%;}.color-12{background: {{hex12}};width: 20%; height: 100%;}.color-13{background: {{hex13}};width: 20%; height: 100%;}.color-14{background: {{hex14}};width: 20%; height: 100%;}.color-15{background: {{hex15}};width: 20%; height: 100%;}.color-16{background: {{hex16}};width: 20%; height: 100%;}</style>`,
    content: { hex1: `#${scheme.colors()[0]}`,hex2:`#${scheme.colors()[1]}`,hex3:`#${scheme.colors()[2]}`,hex4:`#${scheme.colors()[3]}`,hex5:`#${scheme.colors()[4]}`,hex6:`#${scheme.colors()[5]}`,hex7:`#${scheme.colors()[6]}`,hex8:`#${scheme.colors()[7]}`, hex9:`#${scheme.colors()[8]}`,hex10:`#${scheme.colors()[9]}`,hex11:`#${scheme.colors()[10]}`,hex12:`#${scheme.colors()[11]}`,hex13:`#${scheme.colors()[12]}`,hex14:`#${scheme.colors()[13]}`,hex15:`#${scheme.colors()[14]}`,hex16:`#${scheme.colors()[15]}` }
  })

  res.json({
    hexArray: scheme.colors(),
    rgbArray: rgbArray,
    hue: hueColor
  })
})
