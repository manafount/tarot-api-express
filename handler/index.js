/*
Code for use in an AWS Lambda function to act as a middleman between
a Tarot Card API and a conversational interface on API.AI

**NOTES**
In order to avoid creating a Deployment Package for such a small app,
I had to keep all of the logic for fulfillment in a single file and
only use packages included in Node and the AWS SDK. I plan to refactor 
this out into separate files and use a promise-based http client in the
future.
*/

'use strict';
let http = require('http');
let tarotAPI = "tarotreader-179104.appspot.com";

console.log('Loading handler function...');

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

    let intent = event.result.metadata.intentName;
    if(intent) {
        switch(intent) {
            case "Clarify Intent":
                clarifyCard(event, callback);
                break;
            case "Describe Intent":
                describeCard(event, callback);
                break;
            case "Read Fortune Intent":
                getReading(event, callback);
                break;
            default:
                console.log("No matching fulfillment method available for: " + intent);
        }
    }


};

function getReading(event, callback) {
    let readingType = event.result.parameters['reading'];
    let numCards;

    switch(readingType) {
        case "one card":
            numCards = 1;
            break;
        case "three card":
            numCards = 3;
            break;
        case "five card":
            numCards = 5;
            break;
        default:
            numCards = 1;
            break;
    }

    let options = getTarotSpread(numCards);

    console.log(options);
    makeRequest(options, function( data, error) {
        if (data) {
            console.log(data);
            let { spread } = data;
            callback(null, {
                "speech": spread,
                "textDisplay": spread,
                "data": {
                    "slack": {
                        "text": "test",
                        "attachments": [
                            {
                                "title": 'Your ' + readingType + ' reading.',
                                "color": "#36a64f",
                                "image_url": spread.spreadImg
                            }
                        ]
                    }
                }
            });
        }
        else {
            callback(null, {"speech": "I'm not sure!"});
        }
    });
}

function describeCard(event, callback) {
    let cardName = event.result.parameters['card'];
    
    if (event.result.parameters['suit']) {
        cardName = cardName.concat(' of ' + event.result.parameters['suit']);
    }

    cardName = capitalizeText(cardName);

    let options = searchCardsByName(cardName);

    makeRequest(options, function( data, error) {
        if (data) {
            let response = data.description;
            callback(null, {
                "speech": response,
                "textDisplay": response,
                "data": {
                    "slack": {
                        "text": response,
                        "attachments": [
                            {
                                "title": data.name,
                                "text": data.suit,
                                "color": "#36a64f",
                    
                                "fields": [
                                    {
                                        "title": "Keywords (Upright)",
                                        "value": data.keywords.upright.join(', '),
                                        "short": "false"
                                    },
                                    {
                                        "title": "Kyewords (Reversed)",
                                        "value": data.keywords.reversed.join(', '),
                                        "short": "false"
                                    }
                                ],
                    
                                "image_url": data.imgURL
                            }
                        ]
                    }
                }
            });
        }
        else {
            callback(null, {"speech": "I'm not sure!"});
        }
    });
}

function clarifyCard(event, callback) {
    let cardName = event.result.parameters['card'];

    if (event.result.parameters['suit']) {
        cardName = cardName.concat(' of ' + event.result.parameters['suit']);
    }

    cardName = capitalizeText(cardName);

    let options = searchCardsByName(cardName);

    makeRequest(options, function( data, error) {
        if (data) {
            let response = ''
            if (event.result.parameters['orientation'].toLowerCase() === 'reversed') {
                response = data.readings.reversed;
            }else{
                response = data.readings.upright;
            }
            response = response.split('\n')
            response = response[Math.floor(Math.random()*response.length)];
            callback(null, {
                "speech": response,
                "textDisplay": response,
                "data": {
                    "slack": {
                        "text": response,
                        "attachments": [
                            {
                                "title": data.name,
                                "text": data.suit,
                                "color": "#36a64f",
                    
                                "fields": [
                                    {
                                        "title": "Keywords (Upright)",
                                        "value": data.keywords.upright.join(', '),
                                        "short": "false"
                                    },
                                    {
                                        "title": "Kyewords (Reversed)",
                                        "value": data.keywords.reversed.join(', '),
                                        "short": "false"
                                    }
                                ],
                    
                                "image_url": data.imgURL
                            }
                        ]
                    }
                }
            });
        }
        else {
            callback(null, {"speech": "I'm not sure!"});
        }
    });
}

function getTarotSpread(numCards) {
    return {
        host: tarotAPI,
        path: `/api/cards/spread?numCards=${numCards}`
    };
}

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