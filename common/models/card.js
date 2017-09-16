'use strict';

module.exports = function(Card) {
  Card.spread = function(numCards, cb) {
    return Card.find()
      .then(allCards => {
        let res = []
        let orientations = ['upright', 'reversed'];
        while(res.length < numCards){
            let randomCard = allCards[Math.floor(Math.random()*78)];
            if(!res.includes(randomCard)) {
              let orientation = orientations[Math.floor(Math.random()*2)];
              randomCard.orientation = orientation;
              res.push(randomCard);
            }
        }
        console.log(res);
        return res;
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
        type: 'array',
      },
    }
  );
};
