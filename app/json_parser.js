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

		var htmlCode = "<div id=\"playlists-container\">" + "\n"
		items.forEach(function(item) {
			var id = item['id'];
			htmlCode += "<a id=" + '"' + id + '"' + "href=" + '"' + "/playlist/" + id + '"' + ">" + "\n";
			htmlCode += "<img src=\"" + item['image'] + "\" width=\"100\" height\"100\" /> " + "\n";
			htmlCode += "<p>" + item['name'] + "</p>" + "\n";
			htmlCode += "</a><br>" + "\n";
		});
		htmlCode += "</div>" + "\n"

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
			htmlCode += "<img src=\"" + track['cover_url'] + "\" width=\"100\" height\"100\" /> " + "\n";
			htmlCode += "<p>" + "Artist : " + track['artist_name'] + " Album: " + track['album_name'] + "</p>" + "\n";
			htmlCode += "<audio controls>" + "\n";
			htmlCode += "<source src=" + '"' + track['mp3_preview'] + '"' + " type=" + '"' + "audio/mpeg" + '"' + ">" + track['mp3_preview'];
			htmlCode += "</audio>" + "\n";
			htmlCode += "</div><br>" + "\n";
		});
		htmlCode += "</div>"

		return htmlCode;
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
