'use strict';
let createSpreadImage = require('./util/stitch_cards.js');

module.exports = function(Card) {
  Card.spread = function(numCards, cb) {
    return Card.find()
      .then(allCards => {
        let cards = []
        let orientations = ['upright', 'reversed'];
        while(cards.length < numCards){
            let randomCard = allCards[Math.floor(Math.random()*78)];
            if(!cards.includes(randomCard)) {
              let orientation = orientations[Math.floor(Math.random()*2)];
              randomCard.orientation = orientation;
              cards.push(randomCard);
            }
        }
        console.log(cards);
        return cards;
      })
      .then(cards => {
        return {
          cards,
          spreadImg: createSpreadImage(cards)
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  Card.remoteMethod(
    'spread', {
      http: {
        path: '/spread',
        verb: 'get',
      },
      accepts: {
        arg: 'numCards', type: 'number', http: { 
          source: 'query'
        }
      },
      returns: {
        arg: 'spread',
        type: 'object',
      },
    }
  );
};
