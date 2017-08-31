module.exports = function(app, db) {
  app.post('/tarot', (req, res) => {
    // Create a new tarot card
    res.send('Hello');
  });
};