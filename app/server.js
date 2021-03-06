// Server-side of Spotify BlindTest Application

// Libraries :
var express = require('express');
var cookieParser = require('cookie-parser');
var querystring = require('querystring');
var request = require('request');
var mustache = require('mustache');
var fs = require('fs');
//var path = require('path');

// User modules :
var json_parser = require('./json_parser');
var answes_analyze = require('./answers_analyze');
var html_generator = require('./generate_html');

var CLIENT_ID = 'ec4f785e16954921b2fb12f95dc994d0';
var CLIENT_SECRET = '7a54e6554c3841289b675aaaf06e7d78'; // APP Spotify BlindTest Secret API Key
var REDIRECT_URI = 'http://localhost:8888/callback'; // Redirect uri, once login is completed

var ACCES_TOKEN = '';
var USER_ID = '';

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

    USER_ID = body.id;
	
	// Just to be redirected to the interesting page (:
	res.redirect('/playlists');
	
    var output = mustache.render('Hello {{name}}!', {name: body.id})
    output += '<br><a href="/playlists" class="btn btn-primary">Begin the Test</a>'
    res.send(output);
    // SEND A TEMPLATE WITH THE USER PROFILE
  });

});

app.get('/playlists', function(req, res) {
  // Modulariser ???
  // playlists = getCurrentUserPlaylists(ACCES_TOKEN); // JSON
  // html_template = getTemplateForPlaylists(playlists); // --> Qui lui va le précompiler (Mustache) en le "remplissant" avec les bonnes playlists
  // res.send(html_template);
  ////////////////////

  // Options of the GET request : (LIMIT=50 here)
  var options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: { 'Authorization': 'Bearer ' + ACCES_TOKEN },
    json: true
  };

  request.get(options, function(error, response, body) {
    console.log('GET ALL PLAYLISTS FROM USER ' + USER_ID);
    console.log('=========================');

	// Read the header file to put it at the start of the new page
	header = html_generator.getHeader();
	
	// res.write permits us to write several data to generate the same page.
	res.write(header);
    res.write(json_parser.generateHTMLPlaylists(body));
    res.write("</body>\n</html>");
    
    res.end();
  });
});


var currentTrack;
app.get('/playlist/:playlist_id', function(req, res) {

  // LOAD TRACKS FOR THIS PLAYLIST_ID :

  var options = {
    url: 'https://api.spotify.com/v1/users/'+USER_ID+'/playlists/'+req.params.playlist_id+'/tracks?limit=100',
    headers: { 'Authorization': 'Bearer ' + ACCES_TOKEN },
    json: true
  };

  request.get(options, function(error, response, body) {
    console.log('GET TRACKS FROM PLAYLIST #' + req.params.playlist_id);
    // console.log(body);

    // GIVE BODY TO JOJO TO PARSE :
    // console.log(json_parser.generateHTMLTracks(body));
    //res.send(json_parser.generateHTMLTracks(body));

    // FIXME: Why is the query launched as many times as there are
    // Tracks in the playlist ???


    // var randomTrack = json_parser.getRandomTrack(body);
    // res.send(randomTrack);

	// Question Time
    currentTrack = json_parser.getRandomTrack(body);
    
    // Print the json of the randomly chosen track
    console.log(currentTrack);
    
    header = html_generator.getHeader();
    question = html_generator.generateQuestionTemplate(currentTrack);

    // Only send the mp3 preview because the rest should be hided from client
    // res.send(currentTrack['items']['mp3_preview']);
	res.write(header);
	res.write(question);
	res.write("</body>\n</html>");
	res.end();
    // When we pass on the next query we should call this :
    //json_parser.incrementIt();

  });

});

app.get('/now_playing/:answer', function(req, res) {
	var correctness = [0, 0];
	var answer = req.params.answer;

	// Store the wanted answers
    currentArtistAnswer = currentTrack['items']['artist_name'];
    currentTrackAnswer = currentTrack['items']['track_name'];

	// Should think about sending a json in order to treat all cases easily.
    if (answers_analyze.isTrackNameCorrect(answer, currentTrackAnswer) > 0 && correctness[1] == 0) {
		correctness[1] = 1;
	} else {

	}
	if (answers_analyze.isArtistNameCorrect(answer, currentTrackAnswer) > 0 && correctness[0] == 0) {
		correctness[0] = 1;
	} else {

	}

	return correctness;
});


console.log('Listening on 8888');
app.listen(8888);
