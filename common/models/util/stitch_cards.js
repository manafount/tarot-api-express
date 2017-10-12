// This is a utility function to stitch multiple card images together 
// and return a single image for display in Slack, Messenger, etc.
let cloudinary = require('cloudinary');
let keys = require('../../../secret/cloudinary_key.js');

cloudinary.config(keys);

let bgImg = "tarot_blue_background_y0y3cd.jpg";
let cardWidth = 150;
let gutter = 25;

function createSpreadImage (cards) {
  let cloudinary = require('cloudinary');
  let bgImg = "tarot_blue_background_y0y3cd.jpg";
  let cardWidth = 150;
  let gutter = 25;
  let keys;
  let options;
  
  try {
    keys = require('../../../secret/cloudinary_key.js');
  } catch (e) {
    keys = {
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    };
  }
  cloudinary.config(keys);
  
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

module.exports = createSpreadImage;