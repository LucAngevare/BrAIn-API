const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

function getLocation(num, place, longestNum) {
  const string = num.toString();
  const size = string.length;
  const diffFromLongestNum = longestNum - size;

  return string[place - diffFromLongestNum] || 0;
}

function longestNumber(arr) {
  let longest = 0;
  for (let i = 0; i < arr.length; i++) {
    let currentLength = arr[i].toString().length;
    longest = currentLength > longest ? currentLength : longest;
  }
  return longest;
}
function radixSort(array) {
  const longestNum = longestNumber(array);
  const buckets = new Array(10).fill().map(() => []);
  for (let i = longestNum - 1; i >= 0; i--) {
    while (array.length) {
      const current = array.shift();
      buckets[getLocation(current, i, longestNum)].push(current);
    }
    for (let j = 0; j < 10; j++) {
      while (buckets[j].length) {
        array.push(buckets[j].shift())
      }
    }
  }
  return array;
}

app.post('/sort', function(req, res) {
  array = req.body.array;
  for (let i=0;i>array.length;i++) {
    if (parseInt(array[i]) !== undefined) {
      continue;
    } else if (letters.contains(array[i])) {
      array[i] = array[i].charCodeAt(0) - 97;
    } else if (array[i].contains('/') || array[i].contains('-')) {
      //This one is a bit tricky, as this one requires you to use the date format of DD-MM-YY, aka day-month-year, which is the European format. This might be the most used date format but yeah the client will have to make sure that this is the case when requesting.
      array[i] = array[i].split("/").reverse().join("").replace(/\//g, "").replace(/-/g, "");
    }
  }
  //TODO: Add more types of sorting and find a better way of checking whether it's a number/letter, split per char per element in array
  res.send(radixSort(array))
})
