'use strict';

require('../server');

var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
chai.use(chaihttp);
var Movie = require('../models/Movie');
var Sql = require('sequelize');
var sql = new Sql('movies_dev', 'movies_dev', 'foobar123', {
  dialect: 'postgres',
  logging: false
});



describe('movie REST api', function() {

  after(function() {
    return Movie.drop({logging: false, cascade: true})
        .then(function() {
          return Movie.sync({logging: false});
        });
  });

  it('should not creat invalid movie ', function(done) {
    chai.request('localhost:3000')
      .post('/api/movies')
      .send({name:'Shrek', genre:'funny'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.err).to.eql('insert a valid genre');
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
        expect(res.body).to.have.property('id');

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
      chai.request('localhost:3000')
        .post('/api/movies')
        .send({name:'happy', genre:'comedy'})
        .end(function(err, res) {
          if(err) throw err;
          done();
        });
    });

    it('should update a movie', function(done) {
      var id;
      sql.sync()
      .then(function() {
        Movie.find({ where: {name: 'happy'}})
        .then(function(testMovie) {
          id = testMovie.id;
        })
        .then(function() {
          chai.request('localhost:3000')
            .put('/api/movies/' + id)
            .send({name:'new name', genre:'action'})
            .end(function(err, res) {
              expect(err).to.eql(null);
              expect(res.body.msg).to.eql('大成功！');
              done();
            });
        });
      });
    });

    it('should delete a movie', function(done) {
      var id;
      sql.sync()
      .then(function() {
        Movie.find({ where: {name: 'happy'}})
        .then(function(testMovie) {
          id = testMovie.id;
        })
        .then(function() {
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
  });
});
