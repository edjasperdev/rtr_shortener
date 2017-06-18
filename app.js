const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const debug = require('debug')
const urlShortAlg = require('./utils/UrlShortAlg')
const firebase = require('firebase');

const config = {
    apiKey: "AIzaSyCtA30HDiOfcyGsJGcc2uuIMHfL6Ay-wT4",
    authDomain: "rtr-shortener.firebaseapp.com",
    databaseURL: "https://rtr-shortener.firebaseio.com",
    projectId: "rtr-shortener",
    storageBucket: "rtr-shortener.appspot.com",
    messagingSenderId: "421985294206"
  }

firebase.initializeApp(config);
const database = firebase.database();
//initialize app with express
const app = express();

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app) 

const getAbsoluteUrl = (url) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url ;
  }
  
  return 'https://' + url;
}
 
const mapObj = {

}

app.get('/shorten', cors(), (req, res, next) => {  
  const longUrl = req.query.url.toLowerCase().replace(/(^\w+:|^)\/\//, '').replace('www.','');
  let keyNum = Object.values(mapObj).indexOf(longUrl)
  if( keyNum == -1){
    const shortUrl = urlShortAlg.encode()
    mapObj[shortUrl] = longUrl;
    const urlObj = database.ref('url/');
    urlObj.set(mapObj)

    res.json({
      shortUrl:  process.env.SHORT_DOMAIN + '/' + shortUrl
    })
  } else{
    res.json({
      error: "This URL has already been entered",
      shortUrl: process.env.SHORT_DOMAIN + '/' + Object.entries(mapObj)[keyNum][0]
    })
  }

  
})

app.get('/:url', (req, res) => { 
  const shortUrl = '/s/' +req.params.url;
  const longUrl = mapObj[shortUrl];
  
  res.redirect(getAbsoluteUrl(longUrl));
})











const port = normalizePort(process.env.PORT || '8080');

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
}

const onListening = () => {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  
}

app.set('port', port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


