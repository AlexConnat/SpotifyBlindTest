
/**
 * Compute the levenshtein distance between two given words a and b
 */
function levenshteinDistance (a, b) {
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length;

  // swap to save some memory O(min(a,b)) instead of O(a)
  if(a.length > b.length) {
    var tmp = a;
    a = b;
    b = tmp;
  }

  var row = [];
  // init the row
  for(var i = 0; i <= a.length; i++){
    row[i] = i;
  }

  // fill in the rest
  for(var i = 1; i <= b.length; i++){
    var prev = i;
    for(var j = 1; j <= a.length; j++){
      var val;
      if(b.charAt(i-1) == a.charAt(j-1)){
        val = row[j-1]; // match
      } else {
        val = Math.min(row[j-1] + 1, // substitution
                       prev + 1,     // insertion
                       row[j] + 1);  // deletion
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[a.length] = prev;
  }

  return row[a.length];
}


/**
 * This is the max levenshtein distance we accept between the given 
 * answer and the actual ones for track name and artist name
 */
var maxToleratedDistForArtist = 2;
var maxToleratedDistForTracks = 2;

module.exports = {
	/**
	 * Compute the actual distance between the given answer and the real answer
	 */
	isTrackNameCorrect: function(givenAnswer, trackName) {
		// We take the case where there are multiple artists
		var distance = levenshteinDistance(givenAnswer.trim().toLowerCase(), trackName.trim().toLowerCase());
		if (distance <= maxToleratedDistForTracks) {
			return 1;
		} else {
			return 0;
		}
	},


	/**
	 * Compute the actual distance between the given answer and the real answer
	 */
	isArtistCorrect: function(givenAnswer, artists) {
		var possibleAnswers = artists.split(" - ");
		
		for (var i = 0; i < possibleAnswers.length; i++) {
			var distance = levenshteinDistance(givenAnswer.trim().toLowerCase(), possibleAnswers[i].trim().toLowerCase());
			if (distance <= maxToleratedDistForArtist) {
				return 1;
			}
		}
		
		return 0;
	}
}


