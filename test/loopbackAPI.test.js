'use strict'

let app = require('../server/server.js');
let chai = require('chai');
let request = require('supertest');

let expect = chai.expect;
 
describe('Tarot Cards API Integration Tests', function() {
  describe('#GET /api/cards', function() { 
    it('should get all cards', function(done) { 
      request(app) .get('/api/cards')
        .end(function(err, res) { 
          expect(res.statusCode).to.equal(200); 
          expect(res.body).to.be.an('array');
          done(); 
        }); 
    });
  });

  describe('#GET /api/cards/count', function() { 
    it('there should be 78 card objects', function(done) { 
      request(app) .get('/api/cards/count')
        .end(function(err, res) { 
          expect(res.statusCode).to.equal(200);
          expect(res.body.count).to.equal(78);
          done(); 
        }); 
    });
  });

  describe('#POST /api/cards', function() { 
    it('should return 401 when no access token is provided', function(done) { 
      request(app) .post('/api/cards')
        .end(function(err, res) { 
          expect(res.statusCode).to.equal(401);
          done(); 
        }); 
    });
  });

  describe('#GET /api/cards/spread?numCards=3', function() { 
    it('should return a spread object', function(done) { 
      request(app) .get('/api/cards/spread?numCards=3')
        .end(function(err, res) { 
          let { spread } = res.body;
          expect(res.statusCode).to.equal(200);
          expect(spread).to.be.an('object');
          expect(spread.cards).to.be.an('array');
          expect(spread).to.have.property('spreadImg');
          done(); 
        }); 
    });
  });

  describe('#GET /api/cards/spread?numCards=5', function() { 
    it('should return a spread with the requested number of cards', function(done) { 
      request(app) .get('/api/cards/spread?numCards=5')
        .end(function(err, res) { 
          let { spread } = res.body;
          expect(res.statusCode).to.equal(200);
          expect(spread.cards).to.be.an('array');
          expect(spread.cards.length).to.equal(5);
          done(); 
        }); 
    });
  });
});

after(done => process.exit());