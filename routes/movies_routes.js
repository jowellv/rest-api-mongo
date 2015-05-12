'use strict';

var Movie = require('../models/Movie');
var Sql = require('sequelize');
var sql = new Sql('movies_dev', 'movies_dev', 'foobar123', {
  dialect: 'postgres',
  logging: false
});
var bodyparser = require('body-parser');


module.exports = function(router) {
  router.use(bodyparser.json()); // req.body becomes a json object

  router.get('/movies', function(req ,res) {
    sql.sync()
    .then(function() {
      Movie.all()
      .then(function(data) {
        res.json(data);
      })
      .error(function(err) {
        console.log(err);
        res.status(500).json({msg: 'internal server error'});
      });
    });
  });

  router.post('/movies', function(req, res) {
    sql.sync()
    .then(function() {
      Movie.create(req.body)
      .then(function(data) {
        res.json(data);
      })
      .then(null, function(err) {
        if(err.name === 'SequelizeValidationError' && err.errors[0].path === 'genre') {
          return res.json({err:'insert a valid genre'});
        }
        console.log(err);
        res.status(500).json({msg: 'internal server error'});
      });
    });
  });

  router.put('/movies/:id', function(req, res) {
    var updatedMovie = req.body;
    delete updatedMovie.id;
    sql.sync()
    .then(function() {
      Movie.update(updatedMovie, {where: {'id': req.params.id}})
      .then(function() {
        res.json({msg:'大成功！'});
      });
    });
  });


  router.delete('/movies/:id', function(req, res) {
    sql.sync()
    .then(function() {
      Movie.destroy({where: {'id': req.params.id}})
      .then(function() {
        res.json({msg:'大成功！'});
      });
    });
  });
};
