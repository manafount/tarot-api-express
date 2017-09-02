const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const mongoose       = require('mongoose');
const bodyParser     = require('body-parser');
const app            = express();
const db             = require('./config/db');

const port = 8000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

mongoose.Promise = require('bluebird');

let promise = mongoose.connect(db.url, {
  useMongoClient: true
});

promise.then(database => {
  require('./app/routes')(app, database);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });  
})
.catch(err => {
  console.log(err);
});