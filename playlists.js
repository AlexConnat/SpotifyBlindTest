var displayPlaylists = function(playlists) {
  var items = playlists['items']
  var sb = "<ul>"
  items.forEach(function(item) {
    sb += "<li><p><img src=\"" + item['image'] + "\" width=\"50\" height\"50\" /> " + item['name'] + "</p></li>"
  });
  sb += "</ul>"
  document.getElementById('test').innerHTML = sb;
}
