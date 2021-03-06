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
	generateHTMLPlaylists: function (jsonQueryPlaylists) {
		playlists = simplifyPlaylistJSON(jsonQueryPlaylists);

		var items = playlists['items'];

		var htmlCode = '<div class="valign-wrapper" style="width:100%; height:20%;">' + '\n';
		htmlCode += '<ul class="collection with-header grey darken-4" style="width:100%">' + '\n';
		htmlCode += '<li class="collection-header"><h4>Your Playlists</h4></li>' + '\n';
		
		items.forEach(function(item) {
			var id = item['id'];
			htmlCode += '<a class="collection-item avatar" id=' + '"' + id + '"' + 'href=' + '"' + '/playlist/' + id + '"' + ' style="width:100%">' + '\n';
			htmlCode += '<img src="' + item['image'] + '"' + 'alt="Playlist image" style="max-height: 100%" class="circle" />' + '\n';
			htmlCode += '<span class="title">' + item['name'] + '</span>' + '\n';
			htmlCode += '</a>' + '\n';
		});
		htmlCode += '</ul>' + '\n';
		htmlCode += '</div>' + '\n';

		return htmlCode;
	},

	/**
	 * Will display the tracks in the div with given id (@divID)
	 */
	generateHTMLTracks: function (jsonQueryTracks) {
		tracks = simplifyTracksJSON(jsonQueryTracks);

		var items = tracks['items'];

		var htmlCode = "<div>" + "\n"
		items.forEach(function(track) {
			var id = track['id'];
			htmlCode += "<div id=" + '"' + id + '"' + ">" + "\n";
			htmlCode += "<img src=\"" + track['cover_url'] + '"' + 'width="100" height\"100\" />' + "\n";
			htmlCode += "<p>" + "Artist : " + track['artist_name'] + " Album: " + track['album_name'] + "</p>" + "\n";
      htmlCode += "<p>" + track['mp3_preview'] + "</p>" + "\n";
      htmlCode += "<p>" + track['track_name'] + "</p>" + "\n";
      htmlCode += "<audio controls>" + "\n";
			htmlCode += "<source src=" + '"' + track['mp3_preview'] + '"' + " type=" + '"' + "audio/mpeg" + '"' + ">" + track['mp3_preview'];
			htmlCode += "</audio>" + "\n";
			htmlCode += "</div>";
		});
		htmlCode += "</div>"

		return htmlCode;
	},

	/**
	 * Get one randomly chosen track on the tracks list
	 */
	getRandomTrack: function (jsonQueryTracks) {
		return chooseRandomTrack(jsonQueryTracks);
	},
	
	/**
	 * Function to call when we pass to the next challenge
	 */
	incrementIt: function() {
		it++;
	},
	
	/**
	 * Function to call on a @return call
	 */
	resetIt: function() {
		it = 0;
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

	return relevantJSON;
}

var it = 0;
var tracksSchuffled = [];
function chooseRandomTrack(jsonQueryTracks) {
	if (jsonQueryTracks != null && it == 0) {
		// We init the array on the first step
		tracks = simplifyTracksJSON(jsonQueryTracks);
		items = tracks['items']
		items.forEach(function(item) {
			tracksSchuffled.push(item);
		});
		shuffle(tracksSchuffled);
	}
	
	return tracksSchuffled[it];
}

/**
 * Shuffle a given array
 */
function shuffle(array) {
    var j, x;
    for (var i = array.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }
}
