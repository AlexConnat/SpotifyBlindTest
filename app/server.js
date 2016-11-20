// Server-side of Spotify BlindTest Application

var express = require('express');
var cookieParser = require('cookie-parser');
var querystring = require('querystring');
var request = require('request');
var mustache = require('mustache');
var fs = require('fs');

var CLIENT_ID = 'ec4f785e16954921b2fb12f95dc994d0';
var CLIENT_SECRET = '7a54e6554c3841289b675aaaf06e7d78'; // APP Spotify BlindTest Secret API Key
var REDIRECT_URI = 'http://localhost:8888/callback'; // Redirect uri, once login is completed

var ACCES_TOKEN = ''

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI
    })
  );

});

app.get('/callback', function(req, res) {

  var authCode = req.query.code || null;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: authCode,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      var refresh_token = body.refresh_token;
      ACCES_TOKEN = body.access_token;
      res.redirect('/user-info');
      console.log("Successfully Logged!")
    } else {
      res.redirect( '/#' + querystring.stringify({error: 'invalid_token'}) );
    }
  });
});


app.get('/user-info', function(req, res) {

  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + ACCES_TOKEN },
    json: true
  };

  request.get(options, function(error, response, body) {

    if (!body.id) {
      res.redirect('/login')
    }

    console.log(body);
    console.log('\n-------------------------\n');

    var output = mustache.render('Hello {{name}}!', {name: body.id})
    output += '<br><a href="/playlists" class="btn btn-primary">Begin the Test</a>'
    res.send(output);
    // SEND A TEMPLATE WITH THE USER PROFILE
  });

});

app.get('/playlists', function(req, res) {

  var options = {
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: { 'Authorization': 'Bearer ' + ACCES_TOKEN },
    params: { limit: 50 },
    json: true
  };

  request.get(options, function(error, response, body) {
    console.log('GET PLAYLISTS:');
    console.log(body);
    console.log('=========================');
    // res.send(body['items'][0]['name'] + '<br>' + body['items'][1]['name']);

    // Si j'appelle la fonction de Steph :
    // J'aimerais générer ... ?

  });

});


console.log('Listening on 8888');
app.listen(8888);
