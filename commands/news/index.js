const fetch = require('node-fetch');
const nodeCron = require("node-cron")
const puppeteer = require('puppeteer')
var mongoose = require('mongoose');
const express = require("express")
const app = module.exports = express()
require('dotenv').config()
let amount, ip;
var counts = {};
var compare = 0;
var mostFrequent, city;
var mongoDB = 'mongodb://127.0.0.1/news';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var Schema = mongoose.Schema;

var newsSchema = new mongoose.Schema({
  title: {
    type: String
  },
  link: {
    type: String
  },
  date: {
    type: Date,
    default: () => Date.now()
  },
  id: Schema.Types.ObjectId
});
var techNewsModel = mongoose.model('TechNewsModel', newsSchema );
var newsModel = mongoose.model('newsModel', newsSchema );

async function gatherTechNews() {
  const techStories = await getTechNewsTitles().catch((err) => console.log(err))

  for (let i = 0; i < techStories["titles"].length; i++) {
    techNewsModel.find(techStories["titles"][i]), function (err, result) {
      if (typeof result !== "undefined") return false;
      if (err) console.log(err)
    }
    const techNewsArticle = new techNewsModel({title: techStories["titles"][i], link: techStories["links"][i]})
      techNewsArticle.save()
      .catch((err) => console.log(err))
    console.log(techStories["titles"][i])
  }
  return techStories;
};

async function gatherNews() {
  const stories = await getNewsTitles().catch((err) => console.log(err))

  for (let i = 0; i < stories["titles"].length; i++) {
    newsModel.find(stories["titles"][i]), function (err, result) {
      if (typeof result !== "undefined") return false;
      if (err) console.log(err)
    }
    const newsArticle = new newsModel({title: stories["titles"][i], link: stories["links"][i]})
      newsArticle.save()
      .catch((err) => console.log(err))
    console.log(stories["titles"][i])
  }
  return stories;
};

async function getTechNewsTitles() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://news.ycombinator.com/news')

  const techStories = await page.$$eval('a.storylink', anchors => { return {titles: anchors.map(anchor => anchor.textContent).slice(0, 10), links: anchors.map(anchor => anchor.href).slice(0, 10)} })
  return techStories;
}

async function getNewsTitles() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://nos.nl/')

  const stories = await page.$$eval('a.link_2ilMxJiw', anchors => { return {titles: anchors.map(anchor => anchor.textContent).slice(0, 10), links: anchors.map(anchor => `https://nos.nl${anchor.getAttribute('href')}`).slice(0, 10)}})
  console.log(stories)
  return stories;
}

/**
 * Looking for some tech news? We got ya covered! This route looks for new headlines on <a href="https://news.ycombinator.com/news">ycombinator</a> and logs them to a mongoose database. It does this on call with the path named above and it also does it automatically at 6am, just so you never run out of news
 * @name Tech News
 * @route {GET} /techNews/get
 * @return {Object} An object with the contents of the mongoose database, this makes it easier for the client to look back at older news and check for differences with older news to check for new news.
 */
app.get('/techNews/get', async function(req, res) {
  console.log(await gatherTechNews())
  techNewsModel.find({}, async function(err, result) {
    if (err) {
      await res.send(err);
    } else {
      await res.send(result);
    }
  });
})

app.get('/news/get', async function(req, res) {
  console.log(await gatherNews())
  newsModel.find({}, async function(err, result) {
    if (err) {
      await res.send(err);
    } else {
      await res.send(result);
    }
  });
})

nodeCron.schedule('0 0 6 * * *', () => {
  gatherTechNews()
  gatherNews()
})
