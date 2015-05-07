'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/dev_db';
require('../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);
var Movie = require('../models/Movie');




describe('movie REST api', function(done) {

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should creat movie ', function(done) {
    chai.request('localhost:3000')
      .post('/api/movies')
      .send({name:'Shrek', genre:'comedy'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('Shrek');
        expect(res.body.genre).to.eql('comedy');
        expect(res.body).to.have.property('_id');
        
        done();
      });
  });

  it('should get an array of moviez', function(done) {
    chai.request('localhost:3000')
      .get('/api/movies')
      .end(function(err, res) {
        expect(res.status).to.eql(200);
        expect(err).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(Array.isArray(res.body)).to.eql(true);

        done();
      });
  });
});
