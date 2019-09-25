const morgan = require('morgan');
const express = require('express');
const app = express();

const storeData = require('./playstore.js');

app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
  let results = storeData;

  if(sort) {
    if (!['Rating', 'App'].includes(sort)) {
      return res.status(400).send('Sort must of one of rating or app')
    }
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  if(genres){
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
      return res.status(400).send('Genre does not exist')
    }
    results=storeData.filter(playApp => {
      return playApp.Genres.toLowerCase().includes(genres.toLowerCase())
    });
  }

  res.send(results);
});

module.exports = app;