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
        let name = 'The ' + url.match(/major-arcana\/([^\/]*)\//)[1];
        card.name = this.capitalizeText(name);
        card.suit = "Major Arcana";
      }else if(url.match(/suit-of/)) {
        let matches = url.match(/suit-of-([^\/]*)\/([^\/]*)/);
        let name = matches[2].replace(/-/g, ' ');
        card.name = this.capitalizeText(name);
        card.suit = this.capitalizeText(matches[1]);
      }
      
      card.keywords = $('#card-page-keywords > p').text();
      card.imgURL = $('#card-page-image > img').attr('src');

      
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

let ts = new TarotScraper;
let baseUrl = "https://www.biddytarot.com";
let promiseQueue = [];
startPoints.forEach(start => {
  promiseQueue.push(ts.getCardUrls(start));
})
Promise.all(promiseQueue)
.then(data => {
  data = _.flatten(data);
  console.log(data);
  return data;
})
.then(urls => {
  let url = baseUrl + urls[29].url;
  return ts.getCardInfo(url);
})
.then(card => console.log(card));