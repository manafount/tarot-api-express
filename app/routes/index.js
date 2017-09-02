const tarotRoutes = require('./tarot-routes');

module.exports = function(app, db) {
  tarotRoutes(app, db);
  // Other route groups could go here, in the future
};