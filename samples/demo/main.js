//
var browserInfo;

var cfg_ = getInitConfig();
var mediaCfg_ = getMediaInfo();
//

var uiEngine = null;

var playerUI = {};



const LOG_DEBUG = undefined;
const LOG_INFO = 1;
const LOG_WARN = 2;
const LOG_ERROR = 3;

function printLog(msg, level) {
  if (!level || level === LOG_DEBUG) {
    console.log('UI: ' + msg);
  }
  if (level === LOG_INFO) {
    console.log('UI: ' + msg);
  }
  printLogUI(msg);
}

function printLogUI(msg) {
  var v = document.getElementById('idLog');
  v.innerHTML = (v.innerHTML + '<br/>' + msg);
}

/////////////////////////////////////////////////////////////////////////
// Title: UI Command
function onBtnInit() {

}

function onBtnUninit() {

}

function onBtnOpen() {
  uiEngine.playerOpen(mediaCfg_);
  //playerUI.playerOpen();
}

function onBtnClose() {
  playerUI.playerClose();
}

function onBtnPlay() {
  playerUI.vopPlayButton.click();
}

function onBtnManualSchedule() {
  playerUI.onBtnManualSchedule();
}

function onBtnInitAD() {
  playerUI.playerRequestAds();
}

function onBtnDelAll() {}

function onBtnStop() {}

function onBtnPlayAd() {}

function onBtnTest() {
  uiEngine.playerTest();
}

function onBtnTest2() {
  printLog('--onBtnTest2--');
  playerUI.player_.setAudioPlaybackSpeed(2);

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

function onBtnSeek() {
  var time = document.getElementById('seekedTime').value;
  playerUI.player_.setPosition(time);
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
var castSender = null;

function onUICmdCastInit() {
  playerUI.castSender_.new_init(cfg_);

  // new_init: new_init,
  // new_open: new_open,
  // new_addV: new_addV,
  // new_addPD: new_addPD,
  // new_play: new_play,
  // new_pause: new_pause,
  // new_playAd: new_playAd,
  // new_test: new_test,
}

function onUICmdCastOpen() {
  playerUI.castSender_.new_open(mediaCfg_);
}

function onUICmdCastAdd() {
  playerUI.castSender_.new_add();
}

function onUICmdCastAddPD() {}

function onUICmdCastPlay() {
  playerUI.castSender_.new_play();
}

function onUICmdCastPause() {}

function onUICmdCastPlayAd() {}

function onUICmdCastTest() {
  playerUI.castSender_.new_test();
}

function onUICmdCastSeek() {
  var time = document.getElementById('castSeekedTime').value;
  playerUI.castSender_.new_setPosition(time);
}

/////////////////////////////////////////////////////////////////////////
// dynamic load main.css file
window.onload = function() {
  // print browser version info
  browserInfo = oldmtn.CommonUtils.getBrowserInfo();
  console.log('browser: ' + browserInfo.browser + ', version: ' + browserInfo.version);

  uiEngine = new oldmtn.UIEngine('player-container');


  // // old
  // playerUI.initVariable();

  // playerUI.playerInit();
  // playerUI.initUIElements();
  // playerUI.initUIEventListeners();

  // new
  // var player_ = new oldmtn.Player('player-container');
  // player_.init(cfg_);

  // BD
  //onBtnTmp1();
  //oldmtn.test();
  // ED
};

window.onunload = function() {
  //onBtnStop();
};