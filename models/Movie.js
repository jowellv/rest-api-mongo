'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var movieSchema = new Schema({
  name  : String,
  genre  : String,
  desc  : {type: String, default: 'No Description Given'}

});

var Movie = mongoose.model('Movie', movieSchema);

Movie.schema.path('genre').validate(function(value) {
  return /action|adventure|comedy|drama|horror|war/i.test(value);
}, 'not a valid genre');

module.exports = Movie;
