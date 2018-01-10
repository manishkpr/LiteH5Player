﻿var media = null;
// UI Controls
var h5pShade = null;
var uiConsole = null;

// UI Data
var timerControlBar;

var player = null;


///////////////////////////////////////////////////////////////////////////
// Title: UI reference functions
function beginBuffering() {
  var idBufferingContainer = document.getElementById('idBufferingContainer');
  idBufferingContainer.style.display = 'block';
}

function endBuffering() {
  var idBufferingContainer = document.getElementById('idBufferingContainer');
  idBufferingContainer.style.display = 'none';
}

function updateProgress() {
  var c = oldmtn.CommonUtils.timeToString(player.currentTime());
  var d = oldmtn.CommonUtils.timeToString(player.duration());
  var fmtTime = c + '/' + d;

  //printLog('--onMediaDurationChanged--, p: ' + c + ', d: ' + d);
  var tDisplay = document.querySelector('.h5p-time-text');
  tDisplay.innerText = fmtTime;
}

///////////////////////////////////////////////////////////////////////////
// Title: Tool function
function enterFullScreen() {
  //var v = document.querySelector('.player');
  //var v = document.querySelector('.h5p-video-container');
  //var v = document.querySelector('.h5p-video');
  var v = document.querySelector('.html5-video-player');

  if (v.requestFullscreen) {
    v.requestFullscreen();
  } else if (v.msRequestFullscreen) {
    v.msRequestFullscreen();
  } else if (v.mozRequestFullScreen) {
    v.mozRequestFullScreen();
  } else {
    v.webkitRequestFullScreen();
  }
  // v.style.width = '100%';
  // v.style.height = '100%';
}


// tool functions
function initUI() {
  media = document.querySelector('.h5p-video');

  h5pShade = document.querySelector('.h5p-shade');

  uiConsole = document.getElementById('idConsole');

  // BD
  media.autoplay = false;
  // ED

  endBuffering();
}

function initData() {
  if (!player) {

  // Begin ads test links
  // Single Inline Linear
  var Single_Inline_Linear = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';

  // Single Skippable Inline
  var SAMPLE_AD_TAG_ = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=';

  // Single Redirect Linear
  //var SAMPLE_AD_TAG_ = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dredirectlinear&correlator=';

  // Single VPAID 1.0 Linear Flash (VAST Inline)
  //var SAMPLE_AD_TAG_ = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinearvpaid&correlator=';

  // Single VPAID 2.0 Linear
  var Single_VPAID_20_Linear = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinearvpaid2js&correlator=';

  // Single Non-linear Inline
  var Single_Non_linear_Inline = 'https://pubads.g.doubleclick.net/gampad/ads?sz=480x70&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dnonlinear&correlator=';

  // VMAP Pre-roll
  //var SAMPLE_AD_TAG_ = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=';

  // VMAP Post-roll
  //var SAMPLE_AD_TAG_ = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpostonly&cmsid=496&vid=short_onecue&correlator=';

  // VMAP Pre-, Mid-, and Post-rolls, Single Ads
  var VMAP_Pre_Mid_Post = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=';
  // End ads test links

  var cfg = {
    playerContainer: 'player-container',
    media: media,
    // advertising: {
    //   tag: Single_Inline_Linear,
    //   enablePreloading: true,
    //   forceNonLinearFullSlot: false,
    //   locale: 'fr',
    //   companions: [ { width:300, height:250, id: 'idCompanionAd' } ]
    // }
  };

  player = new oldmtn.Player(cfg);

  player.on(oldmtn.Events.MSE_OPENED, onMSEOpened, {});
  player.on(oldmtn.Events.SB_UPDATE_ENDED, onSBUpdateEnded, {});

  player.on(oldmtn.Events.MEDIA_DURATION_CHANGED, onMediaDurationChanged, {});
  player.on(oldmtn.Events.MEDIA_ENDED, onMediaEnd, {});
  player.on(oldmtn.Events.MEDIA_PAUSED, onMediaPaused, {});
  player.on(oldmtn.Events.MEDIA_PLAYING, onMediaPlaying, {});
  player.on(oldmtn.Events.MEDIA_SEEKING, onMediaSeeking, {});
  player.on(oldmtn.Events.MEDIA_SEEKED, onMediaSeeked, {});
  player.on(oldmtn.Events.MEDIA_TIMEUPDATE, onMediaTimeupdated, {});
  player.on(oldmtn.Events.MEDIA_WAITING, onMediaWaiting, {});

  player.on(oldmtn.Events.LOG, onLog, {});
  }
}

function addH5PListeners() {
  h5pShade.addEventListener('mouseenter', onH5PShadeMouseenter);
  h5pShade.addEventListener('mousemove', onH5PShadeMousemove);
  h5pShade.addEventListener('mouseleave', onH5PShadeMouseleave);

  h5pShade.addEventListener('click', onH5PShadeClick);
}

///////////////////////////////////////////////////////////////////
function printLog(msg)
{
  onLog({message: msg});
  console.log(msg);
}

///////////////////////////////////////////////////////////////////
function onH5PShadeMouseenter() {
  $('.html5-video-player').removeClass('h5p-autohide');
}

function onH5PShadeMousemove() {
  $('.html5-video-player').removeClass('h5p-autohide');

  if (timerControlBar) {
    clearTimeout(timerControlBar);
  }
  timerControlBar = setTimeout(function() {
    onH5PShadeMouseleave();
  }, 2000);
}

function onH5PShadeMouseleave() {
  $('.html5-video-player').addClass('h5p-autohide');
}

// browser & UI callback functions
function onBtnOpen() {
  //initAudioContent();
  initVideoContent();
  //initAudioVideoContent();
  //initPDContent();

  /* drm content part */
  //initDRM_PR();
  //initWV_MP4();
  //initPDContent_ClearKey();
  //initCK_WebM();
  //initCK_MP4();

  //var info = initTask62293();
  //initMseCase01();
  //initTestTmp();
  //init1080i();

  var info = {
    audioCodec: audioCodec,
    aContents: aContents,
    videoCodec: videoCodec,
    vContents: vContents,

    pdContent: pdContent,
    pdDuration: pdDuration,

    drm: {
      type: drmType,
      laUrl: laUrl,
      headers: headers,
      key: key, // only for clearkey
      drmInitDataType: drmInitDataType,
      drmInitData: drmInitData
    }
  };

  player.open(info);
}

function onPlayInternal() {
  player.play();

  var v = document.querySelector('.h5p-play-button');
  var v1 = v.querySelector('.h5p-svg-fill');
  v1.setAttribute('d', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');
}

function onPauseInternal() {
  player.pause();

  var v = document.querySelector('.h5p-play-button');
  var v1 = v.querySelector('.h5p-svg-fill');
  v1.setAttribute('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');
}

function onBtnPlay() {
  if (player.isPaused()) {
    onPlayInternal();
  } else {
    onPauseInternal();
  }
}

function onBtnMute() {
  if (player.isMuted()) {
    player.unmute();
  } else {
    player.mute();
  }
}

function onBtnAddA() {
  player.addA();
}

function onBtnAddV() {
  player.addV();
}

function onBtnAddPD() {
  player.addPD();
}

function onBtnDelAll() {
  player.dellAll();
}

function onBtnClose() {
  player.close();
}

function onBtnStop() {
  player.close();
  player = null;
}

function onBtnCast() {
  if (player) {
    player.cast();
  }
}

function onBtnSetting() {
  printLog('--onBtnSetting--');
}

function onBtnFullscreen() {
  enterFullScreen();
}

function onBtnSeek() {
  var time = document.getElementById('seekedTime').value;
  player.seek(time);
}

function onBtnAddTextTrack() {
  if (player) {
    player.addTextTrack();
  }
}

function onBtnRemoveTextTrack() {
  player.removeTextTrack();
}

function setTextTrackHidden() {
  player.setTextTrackHidden();
}

function setCueAlign(align) {
  player.setCueAlign(align);
}

function onFruitClick() {
  alert('aaaa');
}

function onBtnTest() {
  // if (player) {
  //   //player.signalEndOfStream();
  // }
  // if (player) {
  //   player.test();
  // }

  //beginBuffering();
  // var v = document.querySelector('.h5p-chrome-bottom');
  // v.setAttribute('aria-hidden', false);

  // var v = document.querySelector('.ytp-play-button');
  // var v1 = v.querySelector('.ytp-svg-fill');
  // v1.setAttribute('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');


  if (player) {
    player.mute();
  }
}

function onBtnTest2() {
  //player.test2();
  //endBuffering();

  var v = document.querySelector('.ytp-play-button');
  var v1 = v.querySelector('.ytp-svg-fill');
  v1.setAttribute('d', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');

  // var v = document.querySelector('.h5p-chrome-bottom');
  // v.setAttribute('aria-hidden', true);
}

function onBtnAttribute() {
  //player.attribute();
}

function onVideoShadeClick(e) {
  printLog('--onVideoShadeClick--');
}

function onVideoControlBarClick() {
  printLog('--onVideoControlBarClick--');
}

function onH5PRootClick() {
  printLog('--onH5PRootClick--');
}

function onH5PShadeClick(e) {
  printLog('--onH5PShadeClick--');
}

function onVideoContainerClick() {
  printLog('--onVideoContainerClick--');
}

function onVideoClick() {
  printLog('--onVideoClick--');
}

function onBufferIconClick() {
  printLog('--onBufferIconClick--');
}

////////////////////////////////////////////////////////////////////////////////////
// player event callback
function onMSEOpened(ev) {
  printLog('--onMSEOpened--');
  //player.addV();
}

function onSBUpdateEnded(ev) {
  printLog('--onSBUpdateEnded--');
  //player.addV();
}

function onMediaDurationChanged() {
  updateProgress();
}

function onMediaEnd() {
  var v = media;
  printLog('--onMediaEnd--');
}

function onMediaPaused() {
  printLog('--onMediaPaused--');
}

function onMediaPlaying() {
  printLog('--onMediaPlaying--');
  endBuffering();
}

function onMediaSeeking() {
  printLog('--onMediaSeeking--');
}

function onMediaSeeked() {
  printLog('--onMediaSeeked--');
}

function onMediaTimeupdated() {
  //printLog('--onMediaTimeupdated--');
  updateProgress();
}

function onMediaWaiting() {
  beginBuffering();
}

function onLog(e) {
  uiConsole.innerHTML = (uiConsole.innerHTML + '<br/>' + e.message);
}

/////////////////////////////////////////////////////////////////////////
// dynamic load main.css file
window.onload = function () {
  initUI();
  initData();
  addH5PListeners();
};

window.onunload = function () {
  //onBtnStop();
};






