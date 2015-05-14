'use strict';

var Basic = require('passport-http').BasicStrategy;
var User = require('../models/User');

module.exports = function(passport) {
  passport.use('basic', new Basic({}, function(email, password, done) {
    User.findOne({'basic.email': email}, function(err,user) {
      if(err) return done('database error');
      if(!user) return done('no such user');
      user.checkPassword(password, function(err, isMatch) {
        if(err) throw err;
        if(!isMatch) return done('wrong password');
        else return done(null, user);
      });
    });
  }));
};
