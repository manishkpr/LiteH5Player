// UI Controls
var h5pShade = null;
var uiConsole = null;

// UI Data
var timerControlBar;

var player = null;

var metaWidth;
var metaHeight;


var progressColorList = ['red', 'rgba(192,192,192,0.3)'];

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

// begin progress bar
function genGradientColor(posList, totalRange, colorList) {
    var gradient = ['to right'];
    for (var i = 0; i < posList.length; ++i) {
      var range = posList[i] * 100 / totalRange;

      if (i === 0) {
          gradient.push(colorList[0] + ' 0%');
          gradient.push(colorList[0] + ' ' + range +'%');
      } else {
          var lastRange = posList[i-1] * 100 / totalRange;
          gradient.push(colorList[i] + ' ' + lastRange +'%');
          gradient.push(colorList[i] + ' ' + range +'%');
      }
    }

    return 'linear-gradient(' + gradient.join(',') + ')';
}

function updateProgress() {
  // 
  var currentTime = player.currentTime();
  var duration = player.duration();

  // update time progress bar
  var v = document.querySelector('.h5p-progress-bar');
  var progressList = [currentTime, duration];
  v.style.background = genGradientColor(progressList, duration, progressColorList);

  // update time display label
  var c = oldmtn.CommonUtils.timeToString(currentTime);
  var d = oldmtn.CommonUtils.timeToString(duration);
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

  var cfg = getInitConfig();
  player = new oldmtn.Player(cfg);

  player.on(oldmtn.Events.MSE_OPENED, onMSEOpened, {});
  player.on(oldmtn.Events.SB_UPDATE_ENDED, onSBUpdateEnded, {});

  player.on(oldmtn.Events.MEDIA_DURATION_CHANGED, onMediaDurationChanged, {});
  player.on(oldmtn.Events.MEDIA_ENDED, onMediaEnd, {});
  player.on(oldmtn.Events.MEDIA_LOADEDMETADATA, onMediaLoadedMetaData, {});
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

  // resize listener
  var ro = new ResizeObserver(entries => {
    for (let entry of entries) {
      const cr = entry.contentRect;
      const cWidth = entry.target.clientWidth;
      const cHeight = entry.target.clientHeight;

      player.resize(cWidth, cHeight);
      // BD
      // console.log('resize event, width: ' + cWidth + ', height: ' + cr.height);
      // console.log('Element:', entry.target);
      // console.log(`Element size: ${cr.width}px x ${cr.height}px`);
      // console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
      // ED
      }
  });

  // Observer one or multiple elements
  var v = document.querySelector('.player');
  ro.observe(v);
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
  }, 3000);
}

function onH5PShadeMouseleave() {
  if (!player.isPaused()) {
    $('.html5-video-player').addClass('h5p-autohide');
  }
}

// browser & UI callback functions
function onBtnOpen() {
  var playerCfg = getMediaInfo();
  player.open(playerCfg);
}

function onBtnClose() {
  printLog('+onBtnClose');
  player.close();
  printLog('-onBtnClose');
}

function onBtnPlay() {
  if (player.isPaused()) {
    player.play();

    var v = document.querySelector('.h5p-play-button');
    var v1 = v.querySelector('.h5p-svg-fill');
    v1.setAttribute('d', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');
  } else {
    player.pause();

    var v = document.querySelector('.h5p-play-button');
    var v1 = v.querySelector('.h5p-svg-fill');
    v1.setAttribute('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');
  }
}

function onBtnMute() {
  if (player.isMuted()) {
    player.unmute();
  } else {
    player.mute();
  }
}

function onCmdVolumeChange() {
  var value = document.querySelector('.h5p-volume-slider').value;
  player.setVolume(value/100);
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

  //player.test();

  var v = document.querySelector('.h5p-progress-bar');
  var progressList = [0.5, 1];
  v.style.background = genGradientColor(progressList, 1, progressColorList);

}

function onBtnTest2() {
  printLog('--onBtnTest2--');
  //player.test2();

  player.resize(1024, 768);
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
  //printLog('--onVideoShadeClick--');
}

function onVideoControlBarClick() {
  //printLog('--onVideoControlBarClick--');
}

function onH5PRootClick() {
  //printLog('--onH5PRootClick--');
}

function onH5PShadeClick(e) {
  //printLog('--onH5PShadeClick--');
}

function onBufferIconClick() {
  //printLog('--onBufferIconClick--');
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

function onMediaLoadedMetaData(e) {
  // update external div's dimensions
  metaWidth = e.width;
  metaHeight = e.height;

  var vp = document.querySelector('.player');
  var v = document.querySelector('.html5-video-player');

  vp.style.paddingBottom = ((metaHeight/metaWidth)*100).toString() + '%';

  console.log('vp.clientWidth: ' + vp.clientWidth);
  console.log('vp.clientHeight: ' + vp.clientHeight);
  player.resize(vp.clientWidth, vp.clientHeight);
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
  //printLog('--onMediaTimeupdated--, position: ' + player.currentTime() + ', duration: ' + player.duration());
  
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






