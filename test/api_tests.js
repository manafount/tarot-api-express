let axios = require('axios');

let a = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 1000
});

a.post('/tarot', {
  name: "Wheel of Fortune",
	suit: "Major Arcana",
	keywords: ["optimism", "success", "change in fortune", "new beginnings", "perseverence", "chance"],
	description: "The four corners of the card boast representations of the Zodiac: Aquarius, Scorpio, Leo, and Taurus. These are the four fixed signs of the zodiac representing stability amidst change.",
	correspondences: {
		astrology: "Virgo",
		numbers: [10, 11],
		plants: ["jasmine", "spearmint", "slippery elm"]
	},
	readings: {
		upright: "The Wheel of Fortune urges you to accept the ups and downs of life with grace, but not with passivity. You have the power to spin the wheel and remain on its upside. Be grateful when things are going well and work actively to improve things when the going gets rough. This is a hopeful card that asks you to not become discouraged when faced with adversity; it is a natural part of life and it will pass. Sometimes the Wheel of Fortune suggests external factors are influencing your life. Try to assess your situation honestly and examine the factors that could be causing difficulties.",
		reversed: "The Wheel of Fortune reversed can mean that luck is not on your side; the Wheel has spun and you are on the downswing. Perhaps there have been changes or a turn of events that are not in your favor. Especially when reversed, the Wheel of Fortune indicates that there are external negative forces influencing your life that seem outside of your control. Now is the time to think about what you can do to regain control of your destiny. Don't resist change; try to find ways to accept the things that are happening and find the new opportunities that they will present."
	}
})
.then(function (response) {
  console.log(response);
})
.catch(function (error) {
  console.log(error);
});