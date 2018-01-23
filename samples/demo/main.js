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
function isFullScreen() {
  printLog('--isFullScreen--');
  return document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreen ||
    document.webkitIsFullScreen;
}

function enterFullScreen() {
  printLog('--enterFullScreen--');
  //var v = document.querySelector('.player');
  //var v = document.querySelector('.h5p-video-container');
  var v = document.querySelector('.h5p-video');
  //var v = document.querySelector('.html5-video-player');

  // Try to enter fullscreen mode in the browser
  var requestFullscreen = v.requestFullscreen ||
      v.webkitRequestFullscreen ||
      v.mozRequestFullscreen ||
      v.requestFullScreen ||
      v.webkitRequestFullScreen ||
      v.mozRequestFullScreen;
  requestFullscreen.call(v);

  // var requestFullscreen = document.documentElement.requestFullscreen ||
  //   document.documentElement.webkitRequestFullscreen ||
  //   document.documentElement.mozRequestFullscreen ||
  //   document.documentElement.requestFullScreen ||
  //   document.documentElement.webkitRequestFullScreen ||
  //   document.documentElement.mozRequestFullScreen;
  // if (!requestFullscreen) {
  //   printLog('requestFullscreen is not NULL2');
  //   requestFullscreen.call(document.documentElement);
  //   //v.webkitSupportsFullscreen();
  // } else {
  //   printLog('requestFullscreen is NULL');
  //   v.webkitSupportsFullscreen();
  // }
}

function leaveFullScreen() {
  printLog('--leaveFullScreen--');

  var cancelFullscreen = document.exitFullscreen ||
        document.exitFullScreen ||
        document.webkitCancelFullScreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;
  if (cancelFullscreen) {
      cancelFullscreen.call(document);
  }
}


function initUI() {
  h5pShade = document.querySelector('.h5p-shade');

  uiConsole = document.getElementById('idConsole');

  endBuffering();
}

function initData() {
  if (!player) {

  // Begin ads test links
  // Single Inline Linear
  var Single_Inline_Linear = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';

  // Single Skippable Inline
  var Single_Skippable_Inline = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=';

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
  //var VMAP_Post_roll = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpostonly&cmsid=496&vid=short_onecue&correlator=';

  // VMAP Pre-, Mid-, and Post-rolls, Single Ads
  var VMAP_Pre_Mid_Post = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=';
  
  var VMAP_Pre_3Mid_Post = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostpod&cmsid=496&vid=short_onecue&correlator=';

  // VMAP - Pre-roll Single Ad, Mid-roll Standard Pods with 5 Ads Every 10 Seconds for 1:40, Post-roll Single Ad
  // cue points: 0,10,20,30,40,50,60,70,80,90,100,-1
  var VMAP_5Ads_Every_10_Secs = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostlongpod&cmsid=496&vid=short_tencue&correlator=';
  // End ads test links

  // My own ads test links
  var VMAP_Pre_10_20_Post = 'http://10.2.68.64/2/ads/VMAP_Pre_10_20_Post.xml';
  var VMAP_Pre_10_20Skip_Post = 'http://10.2.68.64/2/ads/VMAP_Pre_10_20Skip_Post.xml';

  var cfg = {
    playerContainer: 'player-container',
    // advertising: {
    //   //tag: 'http://10.2.64.68/tmp/1123.aa',
    //   //tag: Single_Inline_Linear,
    //   //tag: Single_Skippable_Inline,
    //   //tag: VMAP_Pre_Mid_Post,
    //   //tag: VMAP_Pre_3Mid_Post,
    //   //tag: VMAP_5Ads_Every_10_Secs,
    //   //tag: VMAP_Pre_10_20_Post,
    //   tag: VMAP_Pre_10_20Skip_Post,
    //   //tag: 'https://rtr.innovid.com/r1.5554946ab01d97.36996823;cb=%2525%25CACHEBUSTER%2525%2525',
    //   //enablePreloading: true,
    //   //forceNonLinearFullSlot: false,
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

  player.on(oldmtn.Events.AD_TIMEUPDATE, onAdTimeUpdate, {});
  
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
  //initVideoContent();
  //initAudioVideoContent();
  initPDContent();

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

  //pdContent = 'http://10.2.68.64/2/myhls/features/av_muxed/test.m3u8';
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

function onBtnClose() {
  printLog('+onBtnClose');
  player.close();
  printLog('-onBtnClose');
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
  printLog('--onBtnFullscreen--');
  if (isFullScreen()) {
    leaveFullScreen();
  } else {
    enterFullScreen();
  }
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


  // if (player) {
  //   player.mute();
  // }

  player.test();
}

function onBtnTest2() {
  printLog('--onBtnTest2--');
  player.test2();
  //endBuffering();

  // var v = document.querySelector('.ytp-play-button');
  // var v1 = v.querySelector('.ytp-svg-fill');
  // v1.setAttribute('d', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');



  // var v = document.querySelector('.h5p-video');
  // v.addEventListener("webkitfullscreenchange", function() {
  //   printLog('--webkitfullscreenchange--');
  //     //console.log(document.webkitIsFullScreen);
  // }, false);

  // v.webkitEnterFullScreen();

  //v.setAttribute('aria-hidden', true);
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
  printLog('--onMediaSeeking--, currentTime: ' + player.currentTime());
}

function onMediaSeeked() {
  printLog('--onMediaSeeked--, currentTime: ' + player.currentTime());
}

function onMediaTimeupdated() {
  printLog('--onMediaTimeupdated--, position: ' + player.currentTime() + ', duration: ' + player.duration());
  
  updateProgress();
}

function onMediaWaiting() {
  beginBuffering();
}

function onLog(e) {
  uiConsole.innerHTML = (uiConsole.innerHTML + '<br/>' + e.message);
}

function onAdTimeUpdate(e) {
  printLog('ad position: ' + e.position + ', duration: ' + e.duration);
}

/////////////////////////////////////////////////////////////////////////
// dynamic load main.css file
window.onload = function () {
  initUI();
  initData();
  addH5PListeners();

  // BD
  //onBtnOpen();
  // ED
};

window.onunload = function () {
  //onBtnStop();
};






