'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/movies_dev';
require('../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);
var Movie = require('../models/Movie');

describe('Messing with users', function() {

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should create a user' ,function(done) {
    chai.request('localhost:3000')
      .post('/api/create_user')
      .send({email:'test@example.com', password:'foobar123'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.token).to.be.not.eql(null);
        done();
      });
  });
  describe('needs an existing user', function() {
      before(function(done) {
        var token;
        chai.request('localhost:3000')
          .post('/api/create_user')
          .send({email:'mocha@example.com', password:'test123'})
          .end(function(err, res) {
            this.token = res.body.token;
            done();
          }.bind(this));
      });
      it('should be able to login', function() {
        chai.request('localhost:3000')
        .get('/api/sign_in')
        .auth('mocha@example.com', 'test123')
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.token).to.be.not.eql(null);
        });
      });
  });
});
