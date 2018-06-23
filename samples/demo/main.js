//
var browserInfo;

var cfg_ = getInitConfig();
var mediaCfg_ = getMediaInfo();
//

var omPlayer = null;
var uiEngine = null;

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
  //uiEngine.open(mediaCfg_);
  omPlayer.open(mediaCfg_);
}

function onBtnClose() {
  omPlayer.close();

  //uiEngine.playerClose();
}

function onBtnPlay() {
  uiEngine.vopPlayButton.click();
}

function onBtnManualSchedule() {
  uiEngine.onBtnManualSchedule();
}

function onBtnInitAD() {
  uiEngine.playerRequestAds();
}

function onBtnDelAll() {}

function onBtnStop() {}

function onBtnPlayAd() {}

function onBtnTest() {
  //uiEngine.test();
  omPlayer.test();
}

function onBtnTest2() {
  printLog('--onBtnTest2--');
  uiEngine.player_.setAudioPlaybackSpeed(2);

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
  uiEngine.installSkin();
}

function onBtnUninstallSkin() {
  uiEngine.uninstallSkin();
}

function onBtnSeek() {
  var time = document.getElementById('seekedTime').value;
  uiEngine.player_.setPosition(time);
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
  uiEngine.castSender_.new_init(cfg_);

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
  uiEngine.castSender_.new_open(mediaCfg_);
}

function onUICmdCastAdd() {
  uiEngine.castSender_.new_add();
}

function onUICmdCastAddPD() {}

function onUICmdCastPlay() {
  uiEngine.castSender_.new_play();
}

function onUICmdCastPause() {}

function onUICmdCastPlayAd() {}

function onUICmdCastTest() {
  uiEngine.castSender_.new_test();
}

function onUICmdCastSeek() {
  var time = document.getElementById('castSeekedTime').value;
  uiEngine.castSender_.new_setPosition(time);
}

/////////////////////////////////////////////////////////////////////////
// dynamic load main.css file
window.onload = function() {
  // print browser version info
  browserInfo = oldmtn.CommonUtils.getBrowserInfo();
  console.log('browser: ' + browserInfo.browser + ', version: ' + browserInfo.version);

  // Init with Player
  omPlayer = new oldmtn.Player('player-container');
  omPlayer.init(cfg_);

  uiEngine = new oldmtn.UIEngine(omPlayer);

  // Init with UIEngine
  // uiEngine = new oldmtn.UIEngine('player-container');
  // uiEngine.init(cfg_);

  //oldmtn.test_subtitle_menu();
};

window.onunload = function() {
  //onBtnStop();
};





