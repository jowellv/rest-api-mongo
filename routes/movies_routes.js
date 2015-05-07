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
};
