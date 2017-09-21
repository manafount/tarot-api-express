// This is a utility function to stitch multiple card images together 
// and return a single image for display in Slack, Messenger, etc.
let axios = require('axios');
let _ = require('lodash');
let cloudinary = require('cloudinary');
let keys = require('../secret/cloudinary_key.js');

cloudinary.config(keys);

let bgImg = "tarot_blue_background_y0y3cd.jpg";
let cardWidth = 150;
let gutter = 25;

function createSpreadImage (cards) {
  let options;
  if (cards) {
    let bgWidth = (cards.length * (cardWidth + gutter)) + gutter;
    options = {
      transformation: [
        {height: 300, width: bgWidth, crop: "scale"}
      ]
    }
    
    for(let i=0; i<cards.length; i++) {
      let imgID = cards[i].imgURL.match(/\/([^\/]*).jpg/)[1];
      let leftEdge = 0 - (Math.floor(bgWidth / 2));
      let startPoint = leftEdge + Math.floor(cardWidth / 2) + gutter;
      let offset = startPoint + ((cardWidth + gutter) * i);
      let angle = 0;

      if (cards[i].orientation) {
        if(cards[i].orientation === "reversed") {
          angle = 180;
        }
      }

      options.transformation.push({
        angle,
        overlay: imgID,
        width: cardWidth,
        x: offset,
        crop: "scale"
      });
    }
  }else{
    console.log('No card objects supplied.');
    return;
  }
  return cloudinary.url(bgImg, options);
}

axios.get('http://localhost:3000/api/cards')
.then(res => {
  let cards = res.data;
  return createSpreadImage(cards.slice(0,5));
})
.then(img => {
  console.log(img);
})
.catch(err => {
  console.log(err);
});
