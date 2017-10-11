'use strict';

let Raven = require('raven');
let DSN = require('../../secret/sentry_key.js');

Raven.config(DSN).install();

module.exports = function() {
  return Raven.errorHandler();
};
