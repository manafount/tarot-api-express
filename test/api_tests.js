let axios = require('axios');
let _ = require('lodash');
let cloudinary = require('cloudinary');

let testImage = 'https://www.biddytarot.com/cards/magician.jpg';

let accessToken;
let cards;

function uploadAndReplace(card) {
  cloudinary.uploader.upload(card.imgURL, function(result) { 
    console.log(result) 
  });
}

uploadAndReplace(testImage);