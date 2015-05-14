'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var eat = require('eat');
var uuid = require('node-uuid');


var userSchema = mongoose.Schema({
  username: String,
  basic: {
    email: {type: String, unique: true},
    password: String
  },
  uniqueHash: {type: String, unique: true}
});

userSchema.methods.generateUuid = function() {
  return uuid.v1();
};

userSchema.methods.generateHash = function(password, done) {
  bcrypt.genSalt(8, function(err, salt) {
    if(err) return done(err);
    bcrypt.hash(password, salt, null, function(err, hash) {
      if(err) return done(err);
      return done(null, hash);
    });
  });
};

userSchema.methods.checkPassword = function(password, done) {
  bcrypt.compare(password, this.basic.password, function(err, res) {
    if(err) return done(err);
    return done(null, res);
  });
};

userSchema.methods.generateToken = function(secret, callback) {
  var today = new Date();
  var expiresDate = new Date(today);
  expiresDate.setDate(today.getDate() + 5); // tokens expire in 5 days
  eat.encode({uniqueHash: this.uniqueHash, expires: expiresDate.getTime()}, secret, callback);
};

module.exports = mongoose.model('User', userSchema);
