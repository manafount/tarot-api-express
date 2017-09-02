let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = new Schema({
  name:  String,
  suit: String,
  keywords: Array,
  description: String,
  correspondences: {
    astrology: String,
    numbers: Array,
    plants: Array
  },
  readings: {
    upright: String,
    reversed: String
  },
  imgURL: String
});