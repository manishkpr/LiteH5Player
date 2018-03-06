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

///////////////////////////////////////////////////////////////////
function printLog(msg) {
    onLog({
        message: msg
    });
    console.log('UI: ' + msg);
}
