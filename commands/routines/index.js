const express = require('express')
const app = module.exports = express()
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const mongoose = require('mongoose')
require('dotenv').config()
let on = false;
var longitude, latitude, ip, overallPrecipValue, overallTempValue, weatherReturnValue;
const silencePhoneURL = process.env.SILENCE_PHONE;
const unSilencePhoneURL = process.env.UNSILENCE_PHONE;

//This currently does not at all work or is even finished.

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongoDB = 'mongodb://127.0.0.1/news';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var Schema = mongoose.Schema;

class Routine {
  constructor(functionArray, name, timeOfExecution) {
    this.functionArray = functionArray;
    this.name = name;
    this.timeOfExecution = timeOfExecution;
    this.Main(this.functionArray, this.name, this.timeOfExecution)
  }

  Main(functionArray, name, timeOfExecution) {
    //TODO: Create the actual routine, save these in ~~CSV~~ mongoose???
    const functionObj = {
      "Turn on the lights": this.turnOnLights,
      "Say": this.saySomething,
      "Play the news": this.news,
      "Toggle the radio": this.radio,
      "Play my playlist": this.mainPlaylist,
      "Mute my phone": this.silencePhone,
      "Give me some clothing advice": this.checkWeather,
      "Unmute my phone": this.unSilencePhone,
      "How good did I do today/yesterday?": this.trackProductivity
    }
    for (let i=0;i<functionArray.length;i++) {
      functionArray[i] = functionObj[functionArray[i]]()
    }
    console.log(`Array: ${functionArray}\nName: ${name}\nTime of execution: ${timeOfExecution}`)
  }

  turnOnLights() {
    //This is gonna be hard as fuck I have no idea how I'm gonna handle this
  }

  saySomething() {

  }

  news() {
    db.newsModel.find({}, async function (err, results) {
      if (err) console.log(err);
      return results;
    })
  }

  radio(stationStream) {
    const stationsJSON = require('./commands/routines/stations.json');
    var streamURL = stationsJSON[stationStream]["streamURL"]
    //TODO: Somehow have a constant stream, https://nodesource.com/blog/understanding-streams-in-nodejs/ ?
  }

  mainPlaylist() {
    //Get most recently (or most frequently) played spotify playlist (or by name), download the mp3s, convert to flac and play them (or send to FTP server and play them client?)
  }

  trackProductivity() {
    //TODO: Get productivity level of todo path and Google Fit
  }

  silencePhone() {
    //Gotta make a client for this to work
  }

  unSilencePhone() {
    //Gotta make a client for this to work
  }

  checkWeather() {
    //Buienalarm API example: https://cdn-secure.buienalarm.nl/api/3.9/forecast.php?lat=${latitude}&lon=${longitude}&region=nl&unit=mm/u
    //API to get lat&long from IP: http://api.ipstack.com/${ip}?access_key=6d9320c1c8ca5d5d355291f823e47f91
    //API to get overall temp and sunniness: openweathermap
    //TODO: Add look forward function to help with packing for Example
    //TODO: Add switch function to overallPrecipValue
    fetch(`http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_APPID}`, { method: 'Get'})
      .then(res => res.json)
      .then(json => {latitude, longitude = json["latitude"], json["longitude"]})

    fetch(`https://cdn-secure.buienalarm.nl/api/3.9/forecast.php?lat=${latitude}&lon=${longitude}&region=nl&unit=mm/u`)
      .then(res => res.json)
      .then(json => {
        for (let i=0;i<json[0]["precip"].length;i++) {
          overallPrecipValue + parseInt(json[0]["precip"][i]);
        }
      })
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=current,minutely,hourly&appid=${process.env.OPENWEATHERMAP_APPID}`)
      .then(res => res.json)
      .then(json => {
        overallTempValue + json["daily"][0]["feels_like"]["day"]
    })
    switch (overallTempValue) {
      case (overallTempValue <= 12):
        weatherReturnValue + "sweater";
        break;
      case (overallTempValue >= 6):
        weatherReturnValue + "coat when going outside";
        break;
      case (overallTempValue >= 7 && overallTempValue <= 18):
        weatherReturnValue + "long sleeves";
        break;
      case (overallTempValue >= 26):
        weatherReturnValue + "shorts";
        break;
      case (overallTempValue >= 12 && overallTempValue <= 14):
        weatherReturnValue + "vest";
        break;
      default:
        weatherReturnValue = "long pants, short sleeves and a vest";
        break;
    }
    console.log({"Feels like temperature": overallTempValue, "clothing suggestion": weatherReturnValue})
  }
}

app.post('/routines', function(req, res) {
  const forwarded = req.headers['x-forwarded-for'];
  ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
  //Add optional param to add trigger keyword(s)
  if (req.body.new) {
    new Routine(req.body.functionArray, req.body.name, req.body.timeAtRun)
  }
})
