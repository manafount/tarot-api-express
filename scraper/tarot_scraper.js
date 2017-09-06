let artoo = require('artoo-js');
let cheerio = require('cheerio');
let axios = require('axios');
let _ = require('lodash');

let startPoints = [
  "https://www.biddytarot.com/tarot-card-meanings/major-arcana/",
  "https://www.biddytarot.com/tarot-card-meanings/minor-arcana/suit-of-cups/",
  "https://www.biddytarot.com/tarot-card-meanings/minor-arcana/suit-of-wands/",
  "https://www.biddytarot.com/tarot-card-meanings/minor-arcana/suit-of-swords/",
  "https://www.biddytarot.com/tarot-card-meanings/minor-arcana/suit-of-pentacles/"
];

class TarotScraper {
  getCardUrls(rootUrl) {
    return axios.get(rootUrl)
      .then((response) => {
        let $ = cheerio.load(response.data);
        artoo.setContext($);


        let urlList = artoo.scrape('.column-link', {
          url: 'href'
        });

        urlList = urlList.filter(obj => {
          return obj.url.length > 1; // eliminate empty urls
        })
        return urlList;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getCardInfo(url) {
    return axios.get(url)
    .then((response) => {
      let $ = cheerio.load(response.data);
      artoo.setContext($);

      let card = {};

      if(url.match(/major-arcana/)) {
        let name = url.match(/major-arcana\/([^\/]*)\//)[1];
        card.name = this.capitalizeText(name.replace(/-/g, ' '));
        card.suit = "Major Arcana";
      }else if(url.match(/suit-of/)) {
        let matches = url.match(/suit-of-([^\/]*)\/([^\/]*)/);
        let name = matches[2].replace(/-/g, ' ');
        card.name = this.capitalizeText(name);
        card.suit = this.capitalizeText(matches[1]);
      }
      
      let upkeys = $('#card-page-keywords > p').eq(0).text();
      upkeys = this.capitalizeText(upkeys.replace(/Upright: /, ''));
      upkeys = upkeys.split(', ');
      let revkeys = $('#card-page-keywords > p').eq(1).text();
      revkeys = this.capitalizeText(revkeys.replace(/Reversed: /, ''));
      revkeys = revkeys.split(', ');

      card.keywords = {
        upright: upkeys,
        reversed: revkeys
      };

      card.imgURL = $('#card-page-image > img').attr('src');

      let description = '';
      $('#card-page-description > p').each(function(i) {
        if (description.length > 0) {
          description = description.concat('\n');
        }
        description = description.concat($(this).text());
      });
      card.description = description;
  
      let upreading = '';
      $('#card-meaning > p').each(function(i) {
        if (upreading.length > 0) {
          upreading = upreading.concat('\n');
        }
        upreading = upreading.concat($(this).text());
      });

      let revreading = '';
      $('#card-meaning-reversed > p').each(function(i) {
        if (revreading.length > 0) {
          revreading = revreading.concat('\n');
        }
        revreading = revreading.concat($(this).text());
      });

      card.readings = {
        upright: upreading,
        reversed: revreading
      }

      return card;
    })
    .catch((error) => {
      console.log(error);
    });
  }

  formatKeywords(string) {
    let keywords = {};
    keywords.upright = string.match();
  }

  capitalizeText(string) {
    return string.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });    
  }
}

// scrape tarot cards/readings and bootstrap our tarot api

let ts = new TarotScraper;
let baseUrl = "https://www.biddytarot.com";
let promiseQueue = [];
startPoints.forEach(start => {
  promiseQueue.push(ts.getCardUrls(start));
})
Promise.all(promiseQueue)
.then(data => {
  data = _.flatten(data);
  return data;
})
.then(urls => {
  console.log('Found ' + urls.length + ' tarot card urls.');
  promiseQueue = [];
  urls.forEach(url => {
    promiseQueue.push(ts.getCardInfo(baseUrl.concat(url.url)));
  })
  return Promise.all(promiseQueue);
})
.then(cards => {
  // login to our API server to get an access token
  return axios.post('http://localhost:3000/api/Users/login', {
    username: 'name',
    password: 'pass'
  })
  .then((response) => {
    let access = response.data.id;
    console.log('Login successful with access token: ' + access);
    promiseQueue = [];
    cards.forEach(card => {
      promiseQueue.push(
        axios({
          method: 'post',
          url: 'http://localhost:3000/api/cards',
          headers: { 'Authorization': access },
          data: card
        })
      );
    });
    return Promise.all(promiseQueue);
  })
  .catch((error) => {
    console.log(error);
  });
})
.then(() => console.log('done'));
