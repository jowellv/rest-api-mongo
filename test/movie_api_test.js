'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost:27017/dev_db';
require('../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);
var Movie = require('../models/Movie');




describe('movie REST api', function() {

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should not creat invalid movie ', function(done) {
    chai.request('localhost:3000')
      .post('/api/movies')
      .send({name:'Shrek', genre:'funny'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.err).to.eql('funny is not a valid genre.');
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
        expect(res.body.desc).to.eql('No Description Given');
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

  describe('needs an existing movie to work on', function() {
    beforeEach(function(done) {
      var testMovie = new Movie({name: 'happy', genre:'comedy'});
      testMovie.save(function(err, data) {
        if(err) throw err;
        this.testMovie = data;
        done();
      }.bind(this));
    });

    it('should actually create testMovie', function() {
      expect(this.testMovie.name).to.eql('happy');
      expect(this.testMovie).to.have.property('_id');
    });

    it('should update a movie', function(done) {
      var id = this.testMovie._id;
      chai.request('localhost:3000')
        .put('/api/movies/' + id)
        .send({name:'new name', genre:'action'})
        .end(function(err, res) {
           expect(err).to.eql(null);
           expect(res.body.msg).to.eql('大成功！');
           done();
        });
    });

    it('should delete a movie', function(done) {
      var id = this.testMovie._id;
      chai.request('localhost:3000')
        .del('/api/movies/' + id)
        .end(function(err, res) {
           expect(err).to.eql(null);
           expect(res.body.msg).to.eql('大成功！');
           done();
        });
    });
  });
});
