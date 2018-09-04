var mongoose = require('mongoose');

var Book = mongoose.Schema({
  isbn: String,
  title: String,
  price: String,
  publish: String,
  published: {type: Date, default: new Date()},
});

module.exports = mongoose.model('Book', Book)
