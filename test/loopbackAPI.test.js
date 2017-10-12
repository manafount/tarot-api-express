var loopbackApiTesting = require('loopback-api-testing');
var tests = require('./apiTestConfig.json');
var server = require('../server/server.js');
var url = 'http://localhost:3000/api';
 
loopbackApiTesting.run(tests, server, url, function(err) {
  if (err) {
    console.log(err);
  }
});