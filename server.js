'use strict';

var express = require('express');
var app = express();

var moviesRoutes = express.Router();

require('./routes/movies_routes')(moviesRoutes);

app.use('/api', moviesRoutes);

app.listen(process.env.PORT || 3000, function() {
  console.log('server up on port ' + (process.env.PORT || 3000));
});
