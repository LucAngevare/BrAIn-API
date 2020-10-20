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

/**
 * Need to sort some things? Well this is the route for you! This route uses a Radix sorting algorithm to sort the array you put in the body. I did quite some research on sorting algorithms and Radix sort was one of the best. I could have used ES2015's .sort() function but I read that it preferred some characters over others and obviously it was just way too easy for me to use something someone else had already made ._.
 * @name Radix Sort
 * @route {POST} /sort
 * @bodyparam {Array} array This needs an array of data to be sorted, that can be alfabetical, numbers, dates, etc. However with using numbers and alfabetical characters mixed together it will look at the ASCII number of the alfabetical character and use that as the value to compare to the number with. This means that it can be inaccurate when using them together.
 * @todo Add more types of sorting
 * @todo Find a better way of checking whether it's a number/letter
 * @todo Implement better sorting between alphabetical characters and numbers
 * @return {Array} The array you inputted, but then sorted.
 */
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
