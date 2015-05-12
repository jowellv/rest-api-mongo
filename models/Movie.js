'use strict';

var Sql = require('sequelize');
var sql = new Sql('movies_dev', 'movies_dev', 'foobar123', {
  dialect: 'postgres',
  logging: false
});

var Movie = module.exports = sql.define('Movie', {
  name: Sql.STRING,
  genre: { type: Sql.STRING,
    validate: {
      isIn: [['action', 'adventure', 'comedy', 'drama', 'horror', 'war']]
    }
  },
  desc: { type: Sql.STRING, defaultValue: 'No Description Given'}
});

Movie.sync();
