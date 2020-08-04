//using https://www.reddit.com/r/news/random.json
const fetch = require('node-fetch');
const sqlite = require('better-sqlite3')('news.db');
const settings = { method: "Get" };
const nodeCron = require("node-cron")
const express = require("express")
const app = module.exports = express()
let amount;
var counts = {};
var compare = 0;
var mostFrequent;

sqlite.prepare(`CREATE TABLE IF NOT EXISTS news (
  title TEXT NOT NULL UNIQUE,
  author TEXT,
  contents TEXT NOT NULL UNIQUE,
  most_frequent_phrase TEXT NOT NULL
);`)

app.get('/news/:amount', function(req, res) {
  amount = (req.params["amount"] !== undefined) ? 25 : req.params["amount of news"]
  getNews(amount).then(() => {
    const everythingDB = sqlite.prepare(`SELECT * FROM news;`)
    const everythingObj = {
      title: everythingDB.title,
      author: everythingDB.author,
      contents: everythingDB.content,
      mostFrequentWord: everythingDB.most_frequent_phrase
    }
    res.send(everythingObj)
  })
})

function getFrequency(array){
   for(var i = 0, len = array.length; i < len; i++){
       var word = array[i];

       if(counts[word] === undefined){
           counts[word] = 1;
       }else{
           counts[word] = counts[word] + 1;
       }
       if(counts[word] > compare){
             compare = counts[word];
             mostFrequent = array[i];
       }
    }
  return mostFrequent;
}

async function getNews(amount) {
  for (let i=0; i<parseInt(amount); i++) {
    /*if (source !== undefined && source !== null) {
      var url = source;
    } else {*/
      var url = "http://newsapi.org/v2/top-headlines?country=nl&apiKey=f58fdc6096074d1481d8be0c31814e8e";
      fetch(url, settings)
        .then(res => res.json())
        .then(async (json) => {
          const mostFrequentWord = getFrequency(json["content"].replace(/(?i)^(?=.*\bde\b)(?=.*\bhet\b)(?=.*\been\b)(?=.*\bdie\b)(?=.*\bdat\b)(?=.*\bdaar\b)(?=.*\bjij\b)(?=.*\bje\b)(?=.*\bhij\b)(?=.*\bhem\b)(?=.*\bjouw\b)(?=.*\bhun\b)(?=.*\bhen\b)(?=.*\bzij\b)(?=.*\bte\b)/g, "").split(/\s/g))
          //FIXME: Fix the regex, getting error now
          //FIXME: Check the usage docs of better-sqlite3, database file isn't updating and no error
          sqlite.prepare(`INSERT INTO news (title, author, contents, most_frequent_phrase) VALUES (
            ${json["articles"][i]["title"]},
            ${json["articles"][i]["author"]},
            ${json["articles"][i]["content"]},
            ${mostFrequentWord}
          );`)
        });
    //}
  }
}

nodeCron.schedule('0 0 6 * * *', () => {
  sqlite.prepare(`TRUNCATE TABLE news;`)
  getNews(amount)
})
