'use strict';

var Movie = require('../models/Movie');

var bodyparser = require('body-parser');

module.exports = function(router) {
  router.use(bodyparser.json()); // req.body becomes a json object

  router.get('/movies', function(req ,res) {
    Movie.find({}, function(err, data) {
      if(err){
        console.log(err);
        return res.json(500, 'internal server error');
      }
      res.json(data);
    });
  });

  router.post('/movies', function(req, res) {
    var newMovie = new Movie(req.body);
    newMovie.save(function(err) {
      if(err) {
        if(err.name === 'ValidationError' && err.errors.genre) {
          return res.json({err:err.errors.genre.value + ' is ' + err.errors.genre.message + '.'});
        }
        console.log(err);
        return res.status(500).json('internal server brain fart');
      }
      res.json(newMovie);
    });
  });

  router.put('/movies/:id', function(req, res) {
     var updatedMovie = req.body;
     delete updatedMovie._id;
     Movie.findOneAndUpdate({'_id': req.params.id}, updatedMovie, function(err, data) { //_id is of type objectID
       if(err) {
         console.log(err);
         return res.status(500).json('internal server brain fart');
       } else {
         res.json({msg:'大成功！'});
       }
     });
  });

  router.delete('/movies/:id', function(req, res) {
    Movie.findOneAndRemove({'_id': req.params.id}, function(err, data) { //_id is of type objectID
      if(err) {
        console.log(err);
        return res.status(500).json('internal server brain fart');
      } else {
        res.json({msg:'大成功！'});
      }
    });
  });
};
