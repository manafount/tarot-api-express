const tarotRoutes = require('./tarot_routes');

module.exports = function(app, db) {
  tarotRoutes(app, db);
  // Other route groups could go here, in the future
};