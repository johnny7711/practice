var mongoose = require('mongoose');

var Message = mongoose.Schema({
  username: String,
  message: String,
  data: { type: Date, default: new Date()}
});

module.exports = mongoose.model('Message', Message)
