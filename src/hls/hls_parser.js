


var HlsParser = function() {
    
};

HlsParser.prototype.parsePlaylist = function (data, uri) {
    // Get the input as a string.  Normalize newlines to \n.
  var str = data;//StringUtils.ab2str_v1(data);
  str = str.replace(/\r\n|\r(?=[^\n]|$)/gm, '\n').trim();

  var lines = str.split(/\n+/m);

  if (!/^#EXTM3U($|[ \t\n])/m.test(lines[0])) {
    console.log('get an error when parsePlaylist.');
    return;
  }

  var i = 1;
  while (i < lines.length) {
    console.log('i: ' + i.toString() + ', value: ' + lines[i]);
  }
};





