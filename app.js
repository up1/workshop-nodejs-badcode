const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', require('./AuthenController'));

const myJwt = require('./jwt');

app.get('/hello', myJwt.jwtValidate, (req, res) => {
  res.send('Hello World!');
});

module.exports = app;
