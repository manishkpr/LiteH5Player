// UI Controls
var h5pShade = null;
var h5pProgressBar = null;
var uiConsole = null;

var h5pPlaySvg;
var h5pMuteSvg;

// UI Data
var timerControlBar;

var player = null;
var castSender = null;

var metaWidth;
var metaHeight;

var progressColorList = ['red', 'rgba(192,192,192,0.3)'];

// UI Matrial Icon
var icon_play = 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z';
var icon_pause = 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z';
var icon_muted = 'm 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z';
var icon_low = 'M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z';
var icon_high = 'M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z';

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
            gradient.push(colorList[0] + ' ' + range + '%');
        } else {
            var lastRange = posList[i - 1] * 100 / totalRange;
            gradient.push(colorList[i] + ' ' + lastRange + '%');
            gradient.push(colorList[i] + ' ' + range + '%');
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

function updatePlayBtnUI(paused, ended) {
    if (paused && !ended) {
        h5pPlaySvg.setAttribute('d', icon_pause);
    } else {
        h5pPlaySvg.setAttribute('d', icon_play);
    }
}

function updateMuteBtnUI(muted, volume) {
    if (muted) {
        h5pMuteSvg.setAttribute('d', icon_muted);
    } else {
        if (volume >= 0.5) {
            h5pMuteSvg.setAttribute('d', icon_high);
        } else {
            h5pMuteSvg.setAttribute('d', icon_low);
        }
    }
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
    h5pProgressBar = document.querySelector('.h5p-progress-bar');
    uiConsole = document.getElementById('idConsole');

    var v = document.querySelector('.h5p-play-button');
    h5pPlaySvg = v.querySelector('.h5p-svg-fill');

    var v = document.querySelector('.h5p-mute-button');
    h5pMuteSvg = v.querySelector('.h5p-svg-fill');

    h5pPlaySvg.setAttribute('d', icon_pause);
    h5pMuteSvg.setAttribute('d', icon_high);

    endBuffering();
}

function initData() {
    var cfg = getInitConfig();
    player = new oldmtn.Player('player-container');
    player.init(cfg);

    player.on(oldmtn.Events.MSE_OPENED, onMSEOpened, {});
    player.on(oldmtn.Events.SB_UPDATE_ENDED, onSBUpdateEnded, {});

    player.on(oldmtn.Events.MEDIA_DURATION_CHANGED, onMediaDurationChanged, {});
    player.on(oldmtn.Events.MEDIA_ENDED, onMediaEnd, {});
    player.on(oldmtn.Events.MEDIA_LOADEDDATA, onMediaLoadedData, {});
    player.on(oldmtn.Events.MEDIA_LOADEDMETADATA, onMediaLoadedMetaData, {});
    player.on(oldmtn.Events.MEDIA_PAUSED, onMediaPaused, {});
    player.on(oldmtn.Events.MEDIA_PLAYING, onMediaPlaying, {});
    player.on(oldmtn.Events.MEDIA_SEEKING, onMediaSeeking, {});
    player.on(oldmtn.Events.MEDIA_SEEKED, onMediaSeeked, {});
    player.on(oldmtn.Events.MEDIA_TIMEUPDATE, onMediaTimeupdated, {});
    player.on(oldmtn.Events.MEDIA_WAITING, onMediaWaiting, {});

    player.on(oldmtn.Events.LOG, onLog, {});

    player.on(oldmtn.Events.AD_TIMEUPDATE, onAdTimeUpdate, {});


    // chrome cast part
    var receiverAppId = 'E19ACDB8'; // joseph test app1
    //var receiverAppId = 'CBEF8A9C'; // joseph, css.visualon.info
    //var receiverAppId = 'FAC6871E'; // joseph, css.visualon.info

    // init chromecast sender
    castSender = new oldmtn.CastSender(receiverAppId);


}

function addH5PListeners() {
    h5pShade.addEventListener('mouseenter', onH5PShadeMouseenter);
    h5pShade.addEventListener('mousemove', onH5PShadeMousemove);
    h5pShade.addEventListener('mouseleave', onH5PShadeMouseleave);

    h5pShade.addEventListener('click', onH5PShadeClick);

    h5pProgressBar.addEventListener('click', onH5PProgressBarClick);

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
function printLog(msg) {
    onLog({
        message: msg
    });
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
    timerControlBar = setTimeout(function () {
            onH5PShadeMouseleave();
        }, 3000);
}

function onH5PShadeMouseleave() {
    if (!player.isPaused()) {
        $('.html5-video-player').addClass('h5p-autohide');
    }
}

function onH5PShadeClick() {

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
    var paused;
    // execute ui cmd
    if (player.isPaused()) {
        player.play();

        paused = false;
    } else {
        player.pause();

        paused = true;
    }

    var ended = player.isEnded();
    updatePlayBtnUI(paused, ended);
}

function onBtnMute() {
    var muted;
    // execute ui cmd
    if (player.isMuted()) {
        player.unmute();

        muted = false;
    } else {
        player.mute();

        muted = true;
    }

    var volume = player.getVolume();
    updateMuteBtnUI(muted, volume);
}

function onCmdVolumeChange() {
    var value = document.querySelector('.h5p-volume-slider').value;
    player.setVolume(value / 100);
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

//
function onUICmdCastInit() {
  var cfg = getInitConfig();
  castSender.new_init(cfg);
}

function onUICmdCastOpen() {
  var info = getMediaInfo();
  castSender.new_open(info);
}

function onUICmdCastAddV() {
  castSender.new_addV();
}

function onUICmdCastAddPD() {
  castSender.new_addPD();
}

function onUICmdCastPlay() {
  castSender.new_play();
}

function onUICmdCastPause() {
  castSender.new_pause();
}

///////////////////////////////////////////////////////////////////////////////////
//
function onVideoShadeClick(e) {
    //printLog('--onVideoShadeClick--');
}

function onVideoControlBarClick() {
    //printLog('--onVideoControlBarClick--');
}

function onH5PRootClick() {
    //printLog('--onH5PRootClick--');
}

function onH5PProgressBarClick(e) {
    console.log('e.offsetX: ' + e.offsetX);
    console.log('e.offsetY: ' + e.offsetY);

    var percentage = e.offsetX / e.target.clientWidth;

    var duration = player.duration();
    var position = percentage * duration;

    player.seek(position);
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
    var paused = player.isPaused();
    var ended = player.isEnded();
    updatePlayBtnUI(paused, ended);
}

function onMediaLoadedData() {
    //
}

function onMediaLoadedMetaData(e) {
    // update external div's dimensions
    metaWidth = e.width;
    metaHeight = e.height;

    var vp = document.querySelector('.player');
    var v = document.querySelector('.html5-video-player');

    vp.style.paddingBottom = ((metaHeight / metaWidth) * 100).toString() + '%';

    console.log('vp.clientWidth: ' + vp.clientWidth);
    console.log('vp.clientHeight: ' + vp.clientHeight);
    player.resize(vp.clientWidth, vp.clientHeight);
}

function onMediaPaused() {
}

function onMediaPlaying() {
    endBuffering();
}

function onMediaSeeking() {
    printLog('+onMediaSeeking, currentTime: ' + player.currentTime());
}

function onMediaSeeked() {
    printLog('+onMediaSeeked, currentTime: ' + player.currentTime());
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
