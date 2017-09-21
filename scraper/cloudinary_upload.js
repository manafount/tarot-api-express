// upload images to cloudinary CDN and update image location for each card in the database
let axios = require('axios');
let _ = require('lodash');
let cloudinary = require('cloudinary');
let keys = require('../secret/cloudinary_key.js');

cloudinary.config(keys);

let accessToken;
let cards;

function uploadAndReplace(card) {
	cloudinary.uploader.upload(card.imgURL, { tags: [card.name, card.suit] })
	.then(result => {
		console.log(result);
		card.imgURL = result.secure_url;
		return axios({
			method: 'patch',
			url: 'http://localhost:3000/api/cards/' + card.id,
			headers: { 'Authorization': accessToken },
			data: card
		})
		.then(res => {
			console.log(res);
		})
		.catch(err => {
			console.log(err);
		});
	});
}

axios.post('http://localhost:3000/api/Users/login', {
  username: 'name',
  password: 'pass'
})
.then(res => {
  accessToken = res.data.id;
  return axios.get('http://localhost:3000/api/cards')
})
.then(res => {
  cards = res.data;
	console.log('Found ' + cards.length + ' cards.');
	let promiseQueue = [];
	cards.forEach(card => {
		promiseQueue.push(uploadAndReplace(card));
	});
	return Promise.all(promiseQueue);
})
.then(() => {
	console.log('Done!');
})
.catch(err => {
  console.log(err);
});