var UITools = {};


UITools.enterFullscreen = function(v) {
  // Try to enter fullscreen mode in the browser
  let requestFullscreen =
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
  let cancelFullscreen =
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
    elements.className = (elements.className + " " + cName).trim();
  }
};

UITools.removeClass = function(elements, cName) {
  if (UITools.hasClass(elements, cName)) {
    elements.className = (elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ")).trim();
  }
};

UITools.genGradientColor = function(posList, colorList) {
  let totalRange = posList[posList.length - 1];

  let gradient = ['to right'];
  for (let i = 0; i < posList.length; ++i) {
    let range = posList[i] * 100 / totalRange;

    if (i === 0) {
      gradient.push(colorList[0] + ' 0%');
      gradient.push(colorList[0] + ' ' + range + '%');
    } else {
      let lastRange = posList[i - 1] * 100 / totalRange;
      gradient.push(colorList[i] + ' ' + lastRange + '%');
      gradient.push(colorList[i] + ' ' + range + '%');
    }
  }

  return 'linear-gradient(' + gradient.join(',') + ')';
};

UITools.isPtInElement = function(pt, element) {
  let rect = element.getBoundingClientRect();
  if ((rect.left <= pt.x && pt.x <= rect.right) &&
    (rect.top <= pt.y && pt.y <= rect.bottom)) {
    return true;
  } else {
    return false;
  }
};



export default UITools;





