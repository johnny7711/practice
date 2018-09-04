var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Message = mongoose.Schema({
  username: String,
  message: String,
  date: { type: Date, default: new Date()}
});

module.exports = router, mongoose.model('Message', Message);
