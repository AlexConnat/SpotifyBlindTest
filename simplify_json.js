/**
 * This file contains the differents json simplifiers
 * 
 */
 
/**
 * This method will simplify the playlists json to keep only what we use
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
			"image" : currentItem["images"][0],	
			"name" : currentItem["name"], 
			"tracks" : currentItem["tracks"]
			};
			
		myItems.push(newItem);
	}
	
	relevantJSON = {
		'items' : (myItems),
		'next' : jsonContent['next'],
		'size' : nOfPlaylists
		};

	return relevantJSON;
}

/**
 * This method will simplify the tracks json to keep only what we use
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
			artistsNames += artist["name"];
		});
		
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
 * Just a test method
 */
function test() {
	var fs = require('fs');
	fs.readFile('testPlaylists.json', 'utf-8', function read(err, data) {
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
				artistsNames += artist["name"];
			});
			
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
		
		var i = 2;
		
		console.log(relevantJSON.items[i].artist_name);
		console.log(relevantJSON.items[i].track_url);
		console.log(relevantJSON.items[i].mp3_preview);
	}

}




