function isFullscreen() {
  //printLog('+isFullscreen');
  return document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreen ||
    document.webkitIsFullScreen;
}

function isPtInElement(pt, element) {
  var rect = element.getBoundingClientRect();
  if ((rect.left <= pt.x && pt.x <= rect.right) &&
    (rect.top <= pt.y && pt.y <= rect.bottom)) {
    return true;
  } else {
    return false;
  }
}

function timeToString(seconds) {
  function formatTime(time) {
    return time < 10 ? '0' + time.toString() : time.toString();
  }

  seconds = Math.max(seconds, 0);
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor((seconds % 3600) % 60);
  return (h === 0 ? '' : formatTime(h) + ':') + formatTime(m) + ':' + formatTime(s);
}

function TimeRangesToString(r) {
  let log = '',
    len = r.length;
  for (let i = 0; i < len; i++) {
    let beg = r.start(i);
    let end = r.end(i);

    //console.log('start: ' + beg + ', end: ' + end);
    log += '[' + r.start(i) + ',' + r.end(i) + ']';
  }
  return log;
}

function genGradientColor(posList, colorList) {
  var totalRange = posList[posList.length - 1];

  var gradient = ['to right'];
  for (var i = 0; i < posList.length; ++i) {
    var range = posList[i] * 100 / totalRange;

    if (i === 0) {
      gradient.push(colorList[0] + ' 0%');
      gradient.push(colorList[0] + ' ' + range + '%');
    } else {
      var lastRange = posList[i - 1] * 100 / totalRange;
      gradient.push(colorList[i] + ' ' + lastRange + '%');
      gradient.push(colorList[i] + ' ' + range + '%');
    }
  }

  return 'linear-gradient(' + gradient.join(',') + ')';
}

///////////////////////////////////////////////////////////////////