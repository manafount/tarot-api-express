/*
Code for use in AWS Lambda function to act as a middleman between
the Tarot API and the conversational interface on API.AI
*/
'use strict';
let http = require('http');
let tarotAPI = "tarotreader-179104.appspot.com";

console.log('Loading function');

exports.handler = function(event, context, callback) {
  console.log(event.result.parameters);
  
  let cardName = event.result.parameters['card'];
  
  if (event.result.parameters['suit']) {
      cardName.concat(' ' + event.result.parameters['suit']);
  }
  
  cardName = capitalizeText(cardName);
  
  let options = searchCardsByName(cardName);
  
  makeRequest(options, function( data, error) {
    let res = data;
    if (res) {
        let response = ''
        if (event.result.parameters['orientation'].toLowerCase() === 'reversed') {
            response = data.readings.reversed;
        }else{
            response = data.readings.upright;
        }
        callback(null, {"speech": response.slice(0, 140)});
    }
    else {
        callback(null, {"speech": "I'm not sure!"});
    }
  });
};
 
function searchCardsByName(cardName) {
    return {
        host: tarotAPI,
        path: `/api/cards/findOne?filter[where][name]=${cardName}`
    };
}

function capitalizeText(string) {
    return string.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });    
  }
 
function makeRequest(options, callback) {
    var request = http.request(options, 
    function(response) {
        var responseString = '';
        response.on('data', function(data) {
            responseString += data;
        });
         response.on('end', function() {
            var responseJSON = JSON.parse(responseString);
            callback(responseJSON, null);
        });
    });
    request.end();
}