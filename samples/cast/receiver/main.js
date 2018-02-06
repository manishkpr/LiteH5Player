
var playerDiv;
var video1;
var curTimeElement_;
var totalTimeElement_;

function formatDuration_(dur) {
    dur = Math.floor(dur);
    function digit(n) { return ('00' + Math.round(n)).slice(-2); }
    var hr = Math.floor(dur / 3600);
    var min = Math.floor(dur / 60) % 60;
    var sec = dur % 60;
    if (!hr) {
        return digit(min) + ':' + digit(sec);
    } else {
        return digit(hr) + ':' + digit(min) + ':' + digit(sec);
    }
}

function getElementByClass_(className) {
    var element = playerDiv.querySelector(className);
    if (element) {
        return element;
    } else {
        throw Error('Cannot find element with class: ' + className);
    }
}

function cbTimeupdate(curTime, totalTime) {
    //console.log('--cbTimeupdate--');
    var curTime = formatDuration_(curTime);
    var totalTime = formatDuration_(totalTime);

    curTimeElement_.innerText = curTime;
    totalTimeElement_.innerText = totalTime;
}

function initUI() {
    playerDiv = document.getElementById('player');

    // BD
    //video1 = document.getElementById('video1');
    //video1.src = "http://10.2.72.4/2/pd/trailer.mp4";
    // ED

    curTimeElement_ = getElementByClass_('.controls-cur-time');
    totalTimeElement_ = getElementByClass_('.controls-total-time');
}

function initData() {
    var receiver = new oldmtn.CastReceiver(playerDiv);

    receiver.addEventListener('timeupdate', cbTimeupdate);
    receiver.start();
}

function onBtnTest1() {
    var t1 = formatDuration_(120);

    curTimeElement_.innerText = t1;
    totalTimeElement_.innerText = t1;
}

window.onload = function () {
  initUI();
  initData();
};

