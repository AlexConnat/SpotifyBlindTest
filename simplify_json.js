/**
 * This file contains the differents json simplifiers
 * 
 */
 
/**
 * This method will simplify the playlists json to keep only what we use
 * 
 * Return a json like following : 
 * {
 *		'items' : {
 * 			"id" : id, 
 *			"image" : image url,
 *			"name" : Playlist name, 
 * 			"tracks" : query for getting tracks,
 * 			}
 * 		'next' : null or next query url,
 *		'size' : nOfPlaylists
 * }
 */
function simplifyPlaylistJSON (playlists) {
	//document.body.appendChild(document.createTextNode("Voilà"));
	//document.write("TEST");
	var relevantJSON;
	// TODO : Only now for testing phase
	var jsonContent = readGivenFile('playlists.json');
	/*
	try {
		jsonContent = JSON.parse(playlists);
	} catch (err) {
		jsonContent = playlists;
	}
	*/
	
	// We create a new json file only with relevant informations
	var nOfPlaylists = Math.min(jsonContent['limit'], jsonContent['total']);
	var myItems = [];
	
	
	for (i = 0; i < nOfPlaylists; i++) {
		var currentItem = jsonContent['items'][i];
		
		var newItem = { 
			"id" : currentItem["id"], 
			"image" : currentItem["images"][0]['url'],	
			"name" : currentItem["name"], 
			"tracks" : currentItem["tracks"]
			};
			
		myItems.push(newItem);
	}
	
	relevantJSON = {
		'items' : myItems,
		'next' : jsonContent['next'],
		'size' : nOfPlaylists
		};

	return relevantJSON;
}

/**
 * This method will simplify the tracks json to keep only what we use
 * 
 * Return a json like following : 
 * {
 *		'items' : {
 * 			"artist_name" : Bla bla - Bli bli, 
 *			"album_name" : Album bla,
 *			"track_name" : Bliolas, 
 * 			"cover_url" : cover url,
 *			"mp3_preview" : preview url,
 *			"track_url" : track url,
 * 			}
 * 		'next' : null or next query url,
 *		'size' : nOfTracks
 * }
 * 
 */
function simplifyTracksJSON (tracks) {
	var relevantJSON;
	var jsonContent;
	
	try {
		jsonContent = JSON.parse(tracks);
	} catch (err) {
		jsonContent = tracks;
	}
	
	// We create a new json file only with relevant informations
	var nOfTracks = Math.min(jsonContent['limit'], jsonContent['total']);
	var myTracks = [];
	
	// We go over all tracks one by one and keep only what is needed
	for (i = 0; i < nOfTracks; i++) {
		var currentItem = jsonContent['items'][i];
		
		var artists = currentItem["track"]["artists"];
		var artistsNames = "";
		
		artists.forEach(function(artist) {
			artistsNames += ' - ' + artist["name"];
		});
		
		// Removes the first ' - ' 
		artistsNames = artistsNames.substr(3);
		
		var cover;
		
		if (currentItem["track"]["album"]["images"].length > 1) {
			cover = currentItem["track"]["album"]["images"][1];
		} else {
			cover = currentItem["track"]["album"]["images"][0];
		}
		
		var newTrack = {
			"artist_name" : artistsNames, 
			"album_name" : currentItem["track"]["album"]["name"],
			"track_name" : currentItem["track"]["name"], 
			"cover_url" : cover['url'],
			"mp3_preview" : currentItem["preview_url"],
			"track_url" : currentItem["track"]["external_urls"]["spotify"]
			};
			
		myTracks.push(newTrack);
	}
	
	relevantJSON = {
		'items' : myTracks,
		'next' : jsonContent['next'],
		'size' : nOfTracks
		};

	return relevantJSON;
}


/**
 * For now jsons are taken in files for testing phase.
 * 
 */
function readGivenFile(filename) {
	var content = {
  "href" : "https://api.spotify.com/v1/users/blindyuser/playlists?offset=0&limit=20",
  "items" : [ {
    "collaborative" : false,
    "external_urls" : {
      "spotify" : "http://open.spotify.com/user/blindyuser/playlist/1yEaOa6xzwJdB1UpMORo56"
    },
    "href" : "https://api.spotify.com/v1/users/blindyuser/playlists/1yEaOa6xzwJdB1UpMORo56",
    "id" : "1yEaOa6xzwJdB1UpMORo56",
    "images" : [ {
      "height" : 640,
      "url" : "https://mosaic.scdn.co/640/47c498c4f7bc4063f318ce8538222b767863f70407dfaad94069f808c714d8223d88a42e921ba0bcdd695d8a18d33640f2abca4588ef36a8ac1811a64cafb36fe230a65a8006ddc220cd56f8abd313ae",
      "width" : 640
    }, {
      "height" : 300,
      "url" : "https://mosaic.scdn.co/300/47c498c4f7bc4063f318ce8538222b767863f70407dfaad94069f808c714d8223d88a42e921ba0bcdd695d8a18d33640f2abca4588ef36a8ac1811a64cafb36fe230a65a8006ddc220cd56f8abd313ae",
      "width" : 300
    }, {
      "height" : 60,
      "url" : "https://mosaic.scdn.co/60/47c498c4f7bc4063f318ce8538222b767863f70407dfaad94069f808c714d8223d88a42e921ba0bcdd695d8a18d33640f2abca4588ef36a8ac1811a64cafb36fe230a65a8006ddc220cd56f8abd313ae",
      "width" : 60
    } ],
    "name" : "Jazz",
    "owner" : {
      "external_urls" : {
        "spotify" : "http://open.spotify.com/user/blindyuser"
      },
      "href" : "https://api.spotify.com/v1/users/blindyuser",
      "id" : "blindyuser",
      "type" : "user",
      "uri" : "spotify:user:blindyuser"
    },
    "public" : false,
    "snapshot_id" : "wGr7Ub0jI4BW9DqOfKuzk9RJGg0W6ezaxCcIaJRq/NOYmQFr6rkldNcBBJP7op10",
    "tracks" : {
      "href" : "https://api.spotify.com/v1/users/blindyuser/playlists/1yEaOa6xzwJdB1UpMORo56/tracks",
      "total" : 5
    },
    "type" : "playlist",
    "uri" : "spotify:user:blindyuser:playlist:1yEaOa6xzwJdB1UpMORo56"
  }, {
    "collaborative" : false,
    "external_urls" : {
      "spotify" : "http://open.spotify.com/user/blindyuser/playlist/0fOrEi0tvjLE2dnodj5yxO"
    },
    "href" : "https://api.spotify.com/v1/users/blindyuser/playlists/0fOrEi0tvjLE2dnodj5yxO",
    "id" : "0fOrEi0tvjLE2dnodj5yxO",
    "images" : [ {
      "height" : 640,
      "url" : "https://i.scdn.co/image/9cab76ad73ce2adbacbd118ebc632255ce7c1841",
      "width" : 640
    } ],
    "name" : "Pop-Rock",
    "owner" : {
      "external_urls" : {
        "spotify" : "http://open.spotify.com/user/blindyuser"
      },
      "href" : "https://api.spotify.com/v1/users/blindyuser",
      "id" : "blindyuser",
      "type" : "user",
      "uri" : "spotify:user:blindyuser"
    },
    "public" : true,
    "snapshot_id" : "SvajZ6GcKOKSPj1Ff6TgerCbuLsC5T4mNd04ji28unvzj0idCaSnLnwVkHfQZ/aD",
    "tracks" : {
      "href" : "https://api.spotify.com/v1/users/blindyuser/playlists/0fOrEi0tvjLE2dnodj5yxO/tracks",
      "total" : 3
    },
    "type" : "playlist",
    "uri" : "spotify:user:blindyuser:playlist:0fOrEi0tvjLE2dnodj5yxO"
  } ],
  "limit" : 20,
  "next" : null,
  "offset" : 0,
  "previous" : null,
  "total" : 2
};
	
	/*
	document.write("I start to read");
	try {
		fs.readFile(filename, 'utf-8', function read(err, data) {
			if (err) {
				document.write(err);
				throw err;
			}
			content = data;		
		});
	} catch(err) {
		document.write(err);
	}
	*/
	
	return content;
}
 
 
/**
 * Just a test method
 */
function test() {
	var fs = require('fs');
	fs.readFile('testTracks.json', 'utf-8', function read(err, data) {
		if (err) {
			throw err;
		}
		content = data;

		// Invoke the next step here however you like
		//console.log(content);   // Put all of the code here (not the best solution)
		processFile();          // Or put the next step in a function and invoke it
	});

	function processFile() {
		// Get json file
		var jsonContent = JSON.parse(content);
		
		// We create a new json file only with relevant informations
		var nOfTracks = Math.min(jsonContent['limit'], jsonContent['total']);
		var myTracks = [];
		
		// We go over all tracks one by one and keep only what is needed
		for (i = 0; i < nOfTracks; i++) {
			var currentItem = jsonContent['items'][i];
			
			var artists = currentItem["track"]["artists"];
			var artistsNames = "";
			
			artists.forEach(function(artist) {
				artistsNames += ' - ' + artist["name"];
			});
		
			// Removes the first ' - ' 
			artistsNames = artistsNames.substr(3);
			
			var cover;
			
			if (currentItem["track"]["album"]["images"].length > 1) {
				cover = currentItem["track"]["album"]["images"][1];
			} else {
				cover = currentItem["track"]["album"]["images"][0];
			}
			
			var newTrack = {
				"artist_name" : artistsNames, 
				"album_name" : currentItem["track"]["album"]["name"],
				"track_name" : currentItem["track"]["name"], 
				"cover_url" : cover,
				"mp3_preview" : currentItem["track"]["preview_url"],
				"track_url" : currentItem["track"]["external_urls"]["spotify"]
				};
				
			myTracks.push(newTrack);
		}
		
		relevantJSON = {
			'items' : myTracks,
			'next' : jsonContent['next'],
			'size' : nOfTracks
			};
		
		var i = 3;
		
		console.log(relevantJSON.items[i].artist_name);
		console.log(relevantJSON.items[i].track_url);
		console.log(relevantJSON.items[i].mp3_preview);
	}
}




