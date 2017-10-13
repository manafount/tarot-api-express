'use strict';

let Raven = require('raven');
let DSN;

try {
  DSN = require('../../secret/sentry_key.js');
} catch (e) {
  DSN = process.env.SENTRY_URL;
}

Raven.config(DSN).install();

module.exports = function() {
  return Raven.errorHandler();
};
