/*
Code for use in an AWS Lambda function to act as a middleman between
the Tarot API and the conversational interface on API.AI
*/

'use strict';
let http = require('http');
let tarotAPI = "tarotreader-179104.appspot.com";

console.log('Loading clarify function...');

exports.handler = function(event, context, callback) {
  console.log(event.result.parameters);
  
  /* 
    Event object should be in the shape of:
      {
        ...
        "result": {
          "source": "agent",
          "resolvedQuery": string,
          "action": string,
          "actionIncomplete": false,
          "parameters": {
            "card": string,
            "orientation": string,
            "suit": string,
          },
          "contexts": [],
          "metadata": {
            ...
            "intentName": string
          },
          "fulfillment": {
            "speech": string,
            ...
          }
        },
        "status": {
          "code": int,
          "errorType": string
        },
        "sessionId": string
      }
  */

  let cardName = event.result.parameters['card'];
  
  if (event.result.parameters['suit']) {
      cardName = cardName.concat(' of ' + event.result.parameters['suit']);
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
        callback(null, {"speech": response});
    }
    else {
        callback(null, {"speech": "I'm not sure!"});
    }
  });
};
 
function searchCardsByName(cardName) {
    // escape spaces before appending cardName to query string
    cardName = cardName.replace(/ /g,'%20');
    console.log(cardName);
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