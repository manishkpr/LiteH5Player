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
    let log = '', len = r.length;
    for (let i=0; i < len; i ++) {
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


function h5EnterFullscreen() {
    printLog('+h5EnterFullscreen');
    //var v = document.querySelector('.player');
    //var v = document.querySelector('.vop-video-container');
    //var v = document.querySelector('.vop-video');
    //var v = document.querySelector('video');
    // Refer to youtube player
    var v = document.querySelector('.html5-video-player');

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

function h5LeaveFullscreen() {
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

///////////////////////////////////////////////////////////////////
const LOG_DEBUG = undefined;
const LOG_INFO = 1;
const LOG_WARN = 2;
const LOG_ERROR = 3;

function printLog(msg, level) {
    if (level === LOG_DEBUG) {
        console.log('UI: ' + msg);
    }
    if (level === LOG_INFO) {
        console.log('UI: ' + msg);
    }
}


