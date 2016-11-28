var fs = require('fs');

var header = null;

module.exports = {
	getHeader: function ()
	{
		if (header==null) {
			console.log("Need to read file..");
			header = fs.readFileSync(__dirname+'/public/templates/header.html', "utf-8");
		}
		return header;
	},
	
	generateQuestionTemplate: function (currentTrack) {
		var htmlCode = '<div class="valign-wrapper center-align valign" style="width:100%; height:70%;">';
		htmlCode += '<div class="center-align valign" style="width:80%;">';
		htmlCode += '<div class="row">' + "\n";
		htmlCode += '<form class="col s12 center-align">' + "\n";
		htmlCode += '<div class="row">' + "\n";
		htmlCode += '<div class="input-field col s6">' + "\n";
		htmlCode += '<i class="material-icons prefix">account_circle</i>' + "\n";
		htmlCode += '<input id="icon_prefix" type="text" class="validate">' + "\n";
		htmlCode += '<label for="icon_prefix">Artist</label>' + "\n";
		htmlCode += '</div>' + "\n";
		htmlCode += '<div class="input-field col s6">' + "\n";
		htmlCode += '<i class="material-icons prefix">hearing</i>' + "\n";
		htmlCode += '<input id="icon_telephone" type="tel" class="validate">' + "\n";
		htmlCode += '<label for="icon_telephone">Track Name</label>' + "\n";
		htmlCode += '</div>' + "\n";
		htmlCode += '</div>' + "\n";
		htmlCode += '</form>' + "\n";
		htmlCode += "<audio controls>" + "\n";
		htmlCode += "<source src=" + '"' + currentTrack['mp3_preview'] + '"' + " type=" + '"' + "audio/mpeg" + '"' + ">" + currentTrack['mp3_preview'];
		htmlCode += "</audio>" + "\n";
		htmlCode += '</div>' + "\n";
		htmlCode += '';
		htmlCode += '';
		htmlCode += '<button class="btn waves-effect waves-light" type="submit" name="action">Submit</button>';
		htmlCode += '</div>';
		htmlCode += '</div>';
		
		return htmlCode;
	}
}


