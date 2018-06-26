var UITools = {};


UITools.enterFullscreen = function() {
  printLog('+h5EnterFullscreen');
  var v = document.getElementById('player-container');
  //var v = document.querySelector('.html5-video-player');
  //var v = document.querySelector('.vop-video-container');
  //var v = document.querySelector('.vop-video');
  //var v = document.querySelector('video');
  // Refer to youtube player
  //var v = document.querySelector('.html5-video-player');

  // Try to enter fullscreen mode in the browser
  var requestFullscreen =
    v.requestFullscreen ||
    v.requestFullScreen ||
    v.webkitRequestFullscreen ||
    v.webkitRequestFullScreen ||
    v.mozRequestFullscreen ||
    v.mozRequestFullScreen ||
    v.msRequestFullscreen ||
    v.msRequestFullScreen;

  requestFullscreen.call(v);
}

UITools.leaveFullscreen = function() {
  printLog('+h5LeaveFullscreen');

  var cancelFullscreen =
    document.exitFullscreen ||
    document.exitFullScreen ||
    document.webkitCancelFullScreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen ||
    document.msExitFullscreen;
  if (cancelFullscreen) {
    cancelFullscreen.call(document);
  }
}

UITools.hasClass = function(elements, cName) {
  return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
};

UITools.addClass = function(elements, cName) {
  if (!UITools.hasClass(elements, cName)) {
    elements.className += " " + cName;
  }
};

UITools.removeClass = function(elements, cName) {
  if (UITools.hasClass(elements, cName)) {
    elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
  }
};

UITools.genGradientColor = function(posList, colorList) {
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
};

UITools.isPtInElement = function(pt, element) {
  var rect = element.getBoundingClientRect();
  if ((rect.left <= pt.x && pt.x <= rect.right) &&
    (rect.top <= pt.y && pt.y <= rect.bottom)) {
    return true;
  } else {
    return false;
  }
};



export default UITools;





