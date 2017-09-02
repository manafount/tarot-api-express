let ObjectID = require('mongodb').ObjectID;
let mongoose = require('mongoose');
let cardSchema = require('../schemas/tarot-card-schema');

let Card = mongoose.model('Card', cardSchema);

module.exports = function(app, db) {
  app.get('/tarot', (req, res) => {
    db.collection('cards').find({}, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  app.post('/tarot', (req, res) => {
    // Create a new tarot card
    console.log(req);
    const card = { 
      name: req.body.name, 
      suit: req.body.suit,
      keywords: req.body.keywords,
      description: req.body.description,
      correspondences: req.body.correspondences,
      readings: req.body.readings,
      imageURL: req.body.imageURL
    };
    console.log(card);
    db.collection('cards').insert(card, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};