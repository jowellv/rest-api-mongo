'use strict';

var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var app = express();

process.env.APP_SECRET = process.env.APP_SECRET || 'changethischangethischangethis';

var moviesRoutes = express.Router();
var usersRoutes = express.Router();

mongoose.connect(process.env.MONGOLAB_URI ||'mongodb://localhost/movies_dev');

app.use(passport.initialize());

require('./lib/passport_strat')(passport);

require('./routes/movies_routes')(moviesRoutes);
require('./routes/auth_routes')(usersRoutes, passport);

app.use('/api', moviesRoutes);
app.use('/api', usersRoutes);

app.listen(process.env.PORT || 3000, function() {
  console.log('server up on port ' + (process.env.PORT || 3000));
});
