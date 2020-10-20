const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const { AwesomeQR } = require("awesome-qr");
const QRReader = require('qrcode-reader');
const jimp = require('jimp');
const fileUpload = require('express-fileupload');

app.use(fileUpload({
  createParentPath: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/qrcode/generate', async (req, res) => {
  // var qrcode = new QRCode({
  //   content: req.body.link,
  //   padding: 4,
  //   width: 256,
  //   height: 256,
  //   color: req.body.color || "#000000",
  //   background: req.body.background || "#ffffff",
  //   ecl: "M",
  // })
  //
  // res.send(qrcode.svg())


  const buffer = await new AwesomeQR({
    text: req.body.content,
    size: 256,
    backgroundImage: req.files.backgroundImage || undefined,
    colorDark: req.body.foregroundColor || "#000000",
    colorLight: req.body.backgroundColor || "#ffffff",
    logoImage: req.files.logoImage || undefined,
  }).draw();

  res.send(buffer.toString("base64"))
})

app.post('/qrcode/read', async (req, res) => {
  //const file = req.files.QR_image;
  console.log(req.files.QR_image)
  // const img = await jimp.read(file);
  //
  // const qr = new QRReader();
  //
  // const value = await new Promise((resolve, reject) => {
  //   qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
  //   qr.decode(img.bitmap);
  // });
  //
  // for (const point of value.points) {
  //   img.scan(Math.floor(point.x) - 5, Math.floor(point.y) - 5, 10, 10, function(x, y, idx) {
  //     this.bitmap.data[idx] = 255;
  //     this.bitmap.data[idx + 1] = 0;
  //     this.bitmap.data[idx + 2] = 0;
  //     this.bitmap.data[idx + 3] = 255;
  //   });
  // }
  //
  // await res.send(`${value}\n${Buffer.from(img).toString('base64')}`)
})
