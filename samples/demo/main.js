//
var browserInfo;

var cfg_ = getInitConfig();
var mediaCfg_ = getMediaInfo();
//

var omPlayer = null;
var omUIEngine = null;

const LOG_DEBUG = undefined;
const LOG_INFO = 1;
const LOG_WARN = 2;
const LOG_ERROR = 3;

function printLogUI(msg) {
  var v = document.getElementById('idLog');
  v.innerHTML = (v.innerHTML + '<br/>' + msg);
}

function printLog(msg, level) {
  if (!level || level === LOG_DEBUG) {
    console.log('UI: ' + msg);
  }
  if (level === LOG_INFO) {
    console.log('UI: ' + msg);
  }
  printLogUI(msg);
}



/////////////////////////////////////////////////////////////////////////
// Title: UI Command
function onBtnInit() {

}

function onBtnUninit() {

}

function onBtnOpen() {
  //omUIEngine.open(mediaCfg_);
  omPlayer.open(mediaCfg_);
}

function onBtnClose() {
  omPlayer.close();
}

function onBtnPlay() {
  var v = document.getElementById('idPlayOrPause');
  if (omPlayer.isPaused()) {
    omPlayer.play();

    v.innerText = "pause";
  } else {
    omPlayer.pause();

    v.innerText = "play";
  }
}

function onBtnManualSchedule() {
  omUIEngine.onBtnManualSchedule();
}

function onBtnInitAD() {
  omUIEngine.playerRequestAds();
}

function onBtnDelAll() {}

function onBtnStop() {}

function onBtnPlayAd() {}

function onBtnTest() {
  //omUIEngine.test();
  omPlayer.test();
}

function onBtnTest2() {
  printLog('--onBtnTest2--');
  omUIEngine.player_.setAudioPlaybackSpeed(2);

  //this.player_.resize(1024, 768);
  //stopBufferingUI();

  // var v = document.querySelector('.ytp-play-button');
  // var v1 = v.querySelector('.ytp-svg-fill');
  // v1.setAttribute('d', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');

  // var v = document.querySelector('.vop-video');
  // v.addEventListener("webkitfullscreenchange", function() {
  //   printLog('--webkitfullscreenchange--');
  //     //printLog(document.webkitIsFullScreen);
  // }, false);

  // v.webkitEnterFullScreen();

  //v.setAttribute('aria-hidden', true);
}

function onBtnInstallSkin() {
  omUIEngine.installSkin();
}

function onBtnUninstallSkin() {
  omUIEngine.uninstallSkin();
}

function onBtnSeek() {
  var time = document.getElementById('seekedTime').value;
  omPlayer.setPosition(time);
}

/////////////////////////////////////////////////////////////////////////
// Title: experience functions
function onBtnTmp1() {
  printLog('visual viewport, width: ' + window.width + ', height: ' + window.height);
  printLog('layout viewport, width: ' + document.width + ', height: ' + document.height);

  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  printLog('screen, width: ' + width);
}

/////////////////////////////////////////////////////////////////////////
// Title: chromecast cmd part
function onUICmdCastInit() {
  omPlayer.castInit(cfg_);
}

function onUICmdCastOpen() {
  omPlayer.castOpen(mediaCfg_);
}

function onUICmdCastAdd() {
  omPlayer.castAdd();
}

function onUICmdCastPlay() {
  omPlayer.castPlay();
}

function onUICmdCastPause() {
  omPlayer.castPause();
}

function onUICmdCastSeek() {
  var time = document.getElementById('castSeekedTime').value;
  omPlayer.castSetPosition(time);
}

function onUICmdCastTest() {
  omPlayer.castTest();
}

/////////////////////////////////////////////////////////////////////////
// dynamic load main.css file
window.onload = function() {
  // print browser version info
  browserInfo = oldmtn.CommonUtils.getBrowserInfo();
  printLog('browser: ' + browserInfo.browser + ', version: ' + browserInfo.version);

  // Init with Player
  omPlayer = new oldmtn.Player('player-container');
  omPlayer.init(cfg_);

  omUIEngine = new oldmtn.UIEngine(omPlayer);

  // Init with omUIEngine
  // omUIEngine = new oldmtn.omUIEngine('player-container');
  // omUIEngine.init(cfg_);

  //oldmtn.test_subtitle_menu();
};

window.onunload = function() {
  //onBtnStop();
};







