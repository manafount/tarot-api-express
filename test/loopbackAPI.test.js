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
          expect(res.body.length).to.equal(78);
          done(); 
        }); 
    });
  });
});

after(done => process.exit());