'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/movies_dev';
require('../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);
var Movie = require('../models/Movie');
var User = require('../models/User');




describe('movie REST api', function() {

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  before(function(done) {
    var token;
    chai.request('localhost:3000')
      .post('/api/create_user')
      .send({email:'test@example.com', password:'foobar123'})
      .end(function(err, res) {
        this.token = res.body.token;
        done();
      }.bind(this));
  });

  it('should not creat invalid movie ', function(done) {
    chai.request('localhost:3000')
      .post('/api/movies')
      .send({name:'Shrek', genre:'funny', eat:this.token})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.err).to.eql('funny is not a valid genre.');
        done();
      });
  });

  it('should creat movie ', function(done) {
    chai.request('localhost:3000')
      .post('/api/movies')
      .send({name:'Shrek', genre:'comedy', eat:this.token})
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
      var testMovie = new Movie({name: 'happy', genre:'comedy', eat:this.token});
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
        .send({name:'new name', genre:'action', eat:this.token})
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
        .send({eat:this.token})
        .end(function(err, res) {
           expect(err).to.eql(null);
           expect(res.body.msg).to.eql('大成功！');
           done();
        });
    });
  });
});
