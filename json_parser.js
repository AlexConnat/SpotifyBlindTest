/**
 * This file contains the differents json simplifiers
 * 
 */
 
 /**
  * Functions that can be used in other Node.js
  */
 module.exports = {
	/**
	 * Will display the playlists in the div with given id (@divID)
	 */
	displayPlaylists: function (jsonQueryPlaylists, divID) {
		playlists = simplifyPlaylistJSON(jsonQueryPlaylists);

		var items = playlists['items'];
		
		var htmlCode = "<ul>"
		items.forEach(function(item) {
			htmlCode += "<li><p><img src=\"" + item['image'] + "\" width=\"50\" height\"50\" /> " + item['name'] + "</p></li>"
		});
		htmlCode += "</ul>"
		document.getElementById(divID).innerHTML = htmlCode;
	},
	
	/**
	 * Will display the tracks in the div with given id (@divID)
	 */
	displayTracks: function (jsonQueryTracks, divID) {
		tracks = simplifyTracksJSON(jsonQueryTracks);
		
		var items = playlists['items'];
		
		var htmlCode = "<ul>"
		items.forEach(function(item) {
			htmlCode += "<li><p><img src=\"" + item['image'] + "\" width=\"50\" height\"50\" /> " + item['name'] + "</p></li>"
		});
		htmlCode += "</ul>"
		document.getElementById(divID).innerHTML = htmlCode;
	}
};
 
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
	var relevantJSON;
	var jsonContent;
	
	try {
		jsonContent = JSON.parse(playlists);
	} catch (err) {
		jsonContent = playlists;
	}
	
	
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
	
	return content;
}

