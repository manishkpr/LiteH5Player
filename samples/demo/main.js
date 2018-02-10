// UI Controls
var h5pPlayer = null;
var h5pShade = null;
var h5pProgressBar = null;
var h5pMuteButton = null;
var h5pVolumeSlider = null;
var h5pVolumeSliderHandle = null;

var uiConsole = null;

var h5pPlaySvg;
var h5pMuteSvg;
var h5pSettingSvg;
var h5pFullScreenCorner0;
var h5pFullScreenCorner1;
var h5pFullScreenCorner2;
var h5pFullScreenCorner3;

// UI Data
var timerControlBar;

var player = null;
var castSender = null;

var metaWidth;
var metaHeight;

var colorList_contentProgress = ['red', 'rgba(192,192,192,0.3)'];
var colorList_adProgress = ['orange', 'rgba(192,192,192,0.3)'];
var colorList_volume = ['#ccc', 'rgba(192,192,192,0.3)'];

// UI Matrial Icon
var icon_play = 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z';
var icon_pause = 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z';
var icon_replay = 'M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z';
var icon_volume_muted = 'm 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z';
var icon_volume_low = 'M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z';
var icon_volume_high = 'M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z';
var icon_setting = 'm 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z';
var fullscreen_no_corner_0 = 'm 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z';
var fullscreen_no_corner_1 = 'm 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z';
var fullscreen_no_corner_2 = 'm 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z';
var fullscreen_no_corner_3 = 'M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z';
var fullscreen_yes_corner_0 = 'm 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z';
var fullscreen_yes_corner_1 = 'm 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z';
var fullscreen_yes_corner_2 = 'm 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z';
var fullscreen_yes_corner_3 = 'm 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z';

// flag & value of progress var
var flagH5PProgressBarMousedown = false;
var flagPausedBeforeMousedown = false;
var flagEndedBeforeMousedown = false;
var flagPositionBeforeMousedown = 0;
var valueProgressMovePosition = 0;

// flag & value of volume var
var flagH5PVolumeSliderMousedown = false;
var valueVolumeMovePosition = 0;




///////////////////////////////////////////////////////////////////////////
// Title: UI reference functions
function startWaitingUI() {
    var idBufferingContainer = document.getElementById('idBufferingContainer');
    idBufferingContainer.style.display = 'block';
}

function stopWaitingUI() {
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

function updateVolumeMovePosition(e) {
    // part - input
    var rect = h5pVolumeSlider.getBoundingClientRect();

    // part - logic process
    var offsetX = e.clientX - rect.left;
    if (offsetX < 0) {
        offsetX = 0;
    } else if (offsetX + h5pVolumeSliderHandle.clientWidth > rect.width) {
        offsetX = rect.width;
    }

    // update time progress scrubber button
    valueVolumeMovePosition = (offsetX / rect.width) * 1.0;
}

function updateProgressMovePosition(e) {
    // part - input
    var v = document.querySelector('.h5p-progress-bar');
    var rect = v.getBoundingClientRect();

    // part - logic process
    var offsetX = e.clientX - rect.left;
    if (offsetX < 0) {
        offsetX = 0;
    } else if (offsetX > rect.width) {
        offsetX = rect.width;
    }

    // update time progress scrubber button
    var duration = player.duration();
    valueProgressMovePosition = (offsetX / rect.width) * duration;
}

function updateProgressUI() {
    // part - input
    var currentTime = player.currentTime();
    var duration = player.duration();
    var paused = player.isPaused();
    var ended = player.isEnded();
    var isProgressBarMousedown = flagH5PProgressBarMousedown;

    // part - logic process
    var uiPosition;
    if (ended) {
        if (isProgressBarMousedown) {
            uiPosition = valueProgressMovePosition;
        } else {
            // when the playback is ended, the currentTime should be equal to the duration.
            uiPosition = currentTime;
        }
    } else {
        if (paused) {
            uiPosition = valueProgressMovePosition;
        } else {
            uiPosition = currentTime;
        }
    }

    // part - output, update ui
    // update time progress bar
    var progressList = [uiPosition, duration];
    h5pProgressBar.style.background = genGradientColor(progressList, duration, colorList_contentProgress);

    // update time progress scrubber button
    var vScrubber = document.querySelector('.h5p-scrubber-container');
    vScrubber.style.transform = 'translateX(' + ((uiPosition / duration) * h5pProgressBar.clientWidth).toString() + 'px)';

    // update time display label
    var c = oldmtn.CommonUtils.timeToString(uiPosition);
    var d = oldmtn.CommonUtils.timeToString(duration);
    var fmtTime = c + '/' + d;

    //printLog('--onMediaDurationChanged--, p: ' + c + ', d: ' + d);
    var tDisplay = document.querySelector('.h5p-time-text');
    tDisplay.innerText = fmtTime;
}

function updateAdProgressUI() {
    var currentTime = player.currentTime();
    var duration = player.duration();

    // update time progress bar
    var progressList = [currentTime, duration];
    h5pProgressBar.style.background = genGradientColor(progressList, duration, colorList_adProgress);

    // update time display label
    var c = oldmtn.CommonUtils.timeToString(currentTime);
    var d = oldmtn.CommonUtils.timeToString(duration);
    var fmtTime = c + '/' + d;

    //printLog('--onMediaDurationChanged--, p: ' + c + ', d: ' + d);
    var tDisplay = document.querySelector('.h5p-time-text');
    tDisplay.innerText = fmtTime;
}

function updatePlayBtnUI(paused, ended) {
    if (ended) {
        h5pPlaySvg.setAttribute('d', icon_replay);
    } else {
        if (paused) {
            h5pPlaySvg.setAttribute('d', icon_play);
        } else {
            h5pPlaySvg.setAttribute('d', icon_pause);
        }
    }
}

function updateContentVolumeBarUI(muted, volume) {
    var vVolumeSlider = document.querySelector('.h5p-volume-slider');
    var vVolumeSliderHandle = document.querySelector('.h5p-volume-slider-handle');

    var uiMutedIcon;
    var uiVolumeList;
    var uiVolumeHandleLeft;
    if (volume === 0 || muted) {
        uiMutedIcon = icon_volume_muted;
        uiVolumeList = [0, 1];
        uiVolumeHandleLeft = '0px';
    } else {
        if (volume >= 0.5) {
            uiMutedIcon = icon_volume_high;
        } else {
            uiMutedIcon = icon_volume_low;
        }

        uiVolumeList = [volume, 1];

        var vLeft = (volume / 1) * vVolumeSlider.clientWidth;
        if (vLeft + vVolumeSliderHandle.clientWidth > vVolumeSlider.clientWidth) {
            vLeft = vVolumeSlider.clientWidth - vVolumeSliderHandle.clientWidth;
        }

        uiVolumeHandleLeft = vLeft.toString() + 'px';
    }

    // update muted button
    h5pMuteSvg.setAttribute('d', uiMutedIcon);
    // update volume slider background
    vVolumeSlider.style.background = genGradientColor(uiVolumeList, 1, colorList_volume);
    // update volume slider handle
    vVolumeSliderHandle.style.left = uiVolumeHandleLeft;
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
    //var v = document.querySelector('.h5p-video');
    //var v = document.querySelector('video');
    // Refer to youtube player
    var v = document.querySelector('.html5-video-player');

    // Try to enter fullscreen mode in the browser
    var requestFullscreen = v.requestFullscreen ||
    v.webkitRequestFullscreen ||
    v.mozRequestFullscreen ||
    v.requestFullScreen ||
    v.webkitRequestFullScreen ||
    v.mozRequestFullScreen;
    requestFullscreen.call(v);
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

function docProgressBarMousemove(e) {
    console.log('+docProgressBarMousemove');

    updateProgressMovePosition(e);
    updateProgressUI();
}

function docProgressBarMouseup(e) {
    console.log('+docProgressBarMouseup');
    releaseProgressBarMouseEvents();
    e.preventDefault();

    // update ui first
    updateProgressMovePosition(e);
    updateProgressUI();

    if (flagPositionBeforeMousedown != valueProgressMovePosition) {
        player.seek(valueProgressMovePosition);
    }

    flagH5PProgressBarMousedown = false;
}

function docVolumeSliderMousemove(e) {
    updateVolumeMovePosition(e);
    
    var muted = player.isMuted();
    var volume = valueVolumeMovePosition;
    if (volume === 0) {
        
    } else {
        if (muted === true) {
            player.unmute();
        }

        muted = false;
    }
    
    player.setVolume(valueVolumeMovePosition);

    updateContentVolumeBarUI(muted, volume);
}

function docVolumeSliderMouseup(e) {
    console.log('+docVolumeSliderMouseup');
    releaseVolumeSliderMouseEvents();
    e.preventDefault();

    flagH5PVolumeSliderMousedown = false;

    // if mouse up out of 'h5p-shade', hide control bar directly
    var pt = { x: e.clientX, y: e.clientY };
    if (!isPtInElement(pt, h5pShade)) {
        onH5PShadeMouseleave();
    }
}

function captureProgressBarMouseEvents() {
    document.addEventListener('mousemove', docProgressBarMousemove, true);
    document.addEventListener('mouseup', docProgressBarMouseup, true);
}

function releaseProgressBarMouseEvents() {
    document.removeEventListener ('mousemove', docProgressBarMousemove, true);
    document.removeEventListener ('mouseup', docProgressBarMouseup, true);
}

function captureVolumeSliderMouseEvents() {
    document.addEventListener('mousemove', docVolumeSliderMousemove, true);
    document.addEventListener('mouseup', docVolumeSliderMouseup, true);
}

function releaseVolumeSliderMouseEvents() {
    document.removeEventListener ('mousemove', docVolumeSliderMousemove, true);
    document.removeEventListener ('mouseup', docVolumeSliderMouseup, true);
}

function initUI() {
    h5pPlayer = document.querySelector('.html5-video-player');
    h5pShade = document.querySelector('.h5p-shade');
    h5pProgressBar = document.querySelector('.h5p-progress-bar');
    h5pMuteButton = document.querySelector('.h5p-mute-button');
    h5pVolumeSlider = document.querySelector('.h5p-volume-slider');
    h5pVolumeSliderHandle = document.querySelector('.h5p-volume-slider-handle');

    uiConsole = document.getElementById('idConsole');

    var v = document.querySelector('.h5p-play-button');
    h5pPlaySvg = v.querySelector('.h5p-svg-fill');

    var v = document.querySelector('.h5p-mute-button');
    h5pMuteSvg = v.querySelector('.h5p-svg-fill');

    var v = document.querySelector('.h5p-setting-button');
    h5pSettingSvg = v.querySelector('.h5p-svg-fill');

    var v = document.querySelector('.h5p-fullscreen-button-corner-0');
    h5pFullScreenCorner0 = v.querySelector('.h5p-svg-fill');
    var v = document.querySelector('.h5p-fullscreen-button-corner-1');
    h5pFullScreenCorner1 = v.querySelector('.h5p-svg-fill');
    var v = document.querySelector('.h5p-fullscreen-button-corner-2');
    h5pFullScreenCorner2 = v.querySelector('.h5p-svg-fill');
    var v = document.querySelector('.h5p-fullscreen-button-corner-3');
    h5pFullScreenCorner3 = v.querySelector('.h5p-svg-fill');

    h5pPlaySvg.setAttribute('d', icon_play);
    h5pMuteSvg.setAttribute('d', icon_volume_high);
    h5pSettingSvg.setAttribute('d', icon_setting);

    h5pFullScreenCorner0.setAttribute('d', fullscreen_no_corner_0);
    h5pFullScreenCorner1.setAttribute('d', fullscreen_no_corner_1);
    h5pFullScreenCorner2.setAttribute('d', fullscreen_no_corner_2);
    h5pFullScreenCorner3.setAttribute('d', fullscreen_no_corner_3);

    stopWaitingUI();
}

function initData() {
    var cfg = getInitConfig();
    player = new oldmtn.Player('player-container');
    player.init(cfg);

    player.on(oldmtn.Events.MSE_OPENED, onMSEOpened, {});
    player.on(oldmtn.Events.SB_UPDATE_ENDED, onSBUpdateEnded, {});

    player.on(oldmtn.Events.MEDIA_DURATION_CHANGED, onMediaDurationChanged, {});
    player.on(oldmtn.Events.MEDIA_ENDED, onMediaEnded, {});
    player.on(oldmtn.Events.MEDIA_LOADEDDATA, onMediaLoadedData, {});
    player.on(oldmtn.Events.MEDIA_LOADEDMETADATA, onMediaLoadedMetaData, {});
    player.on(oldmtn.Events.MEDIA_PAUSED, onMediaPaused, {});
    player.on(oldmtn.Events.MEDIA_PLAYING, onMediaPlaying, {});
    player.on(oldmtn.Events.MEDIA_SEEKING, onMediaSeeking, {});
    player.on(oldmtn.Events.MEDIA_SEEKED, onMediaSeeked, {});
    player.on(oldmtn.Events.MEDIA_TIMEUPDATE, onMediaTimeupdated, {});
    player.on(oldmtn.Events.MEDIA_VOLUME_CHANGED, onMediaVolumeChanged, {});
    player.on(oldmtn.Events.MEDIA_WAITING, onMediaWaiting, {});

    player.on(oldmtn.Events.LOG, onLog, {});

    //
    player.on(oldmtn.Events.AD_TIMEUPDATE, onAdTimeUpdate, {});

    player.on(oldmtn.Events.FULLSCREEN_CHANGE, onFullscreenChanged, {});

    // chrome cast part
    var receiverAppId = 'E19ACDB8'; // joseph test app1
    //var receiverAppId = 'CBEF8A9C'; // joseph, css.visualon.info
    //var receiverAppId = 'FAC6871E'; // joseph, css.visualon.info

    // init chromecast sender
    //castSender = new oldmtn.CastSender(receiverAppId);
}

function addH5PListeners() {
    h5pShade.addEventListener('mouseenter', onH5PShadeMouseenter);
    h5pShade.addEventListener('mousemove', onH5PShadeMousemove);
    h5pShade.addEventListener('mouseleave', onH5PShadeMouseleave);

    h5pShade.addEventListener('click', onH5PShadeClick);

    h5pProgressBar.addEventListener('mousedown', onH5PProgressBarMousedown);
    h5pProgressBar.addEventListener('mousemove', onH5PProgressBarMousemove);

    h5pMuteButton.addEventListener('click', onH5PMuteButtonClick);
    h5pVolumeSlider.addEventListener('mousedown', onH5PVolumeSliderMousedown);
    h5pVolumeSlider.addEventListener('mousemove', onH5PVolumeSliderMousemove);

    // resize listener
    if (window.ResizeObserver) {
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
            }
        );

        // Observer one or multiple elements
        var v = document.querySelector('.player');
        ro.observe(v);
    }
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

function onH5PShadeMousemove(e) {
    //console.log('+onH5PShadeMousemove');

    $('.html5-video-player').removeClass('h5p-autohide');

    if (timerControlBar) {
        clearTimeout(timerControlBar);
        timerControlBar = null;
    }
    timerControlBar = setTimeout(function () {
        onH5PShadeMouseleave();
    }, 3000);
}

function onH5PShadeMouseleave() {
    var paused = player.isPaused();

    if (!paused && !flagH5PProgressBarMousedown && !flagH5PVolumeSliderMousedown) {
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
    var currPaused = player.isPaused();
    var currEnded = player.isEnded();
    if (currEnded) {
        flagPausedBeforeMousedown = true;
        flagEndedBeforeMousedown = true;
        player.seek(0);
    } else {
        var newPaused;
        // execute ui cmd
        if (currPaused) {
            player.play();

            newPaused = false;
        } else {
            player.pause();

            newPaused = true;
        }

        // update ui
        var ended = player.isEnded();
        updatePlayBtnUI(newPaused, ended);
    }
}

function onH5PMuteButtonClick() {
    var muted = player.isMuted();
    var volume = player.getVolume();

    // 
    if (volume === 0) {
        if (muted) {
            player.unmute();
            muted = false;
        }

        // If the player is muted, and volume is 0,
        // in this situation, we will restore volume to 0.2
        volume = 0.1;
        player.setVolume(volume);
    } else {
        if (muted) {
            player.unmute();
            muted = false;
        } else {
            player.mute();
            muted = true;
        }
    }
    updateContentVolumeBarUI(muted, volume);
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

function onBtnPlayAd() {
    if (player) {
        player.playAd();
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
    player.test();
    // }

    //startWaitingUI();
    // var v = document.querySelector('.h5p-chrome-bottom');
    // v.setAttribute('aria-hidden', false);

    // var v = document.querySelector('.ytp-play-button');
    // var v1 = v.querySelector('.ytp-svg-fill');
    // v1.setAttribute('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');


    // if (player) {
    //   player.mute();
    // }

    //player.test();

    var progressList = [0.5, 1];
    h5pProgressBar.style.background = genGradientColor(progressList, 1, colorList_contentProgress);

}

function onBtnTest2() {
    printLog('--onBtnTest2--');
    //player.test2();

    player.resize(1024, 768);
    //stopWaitingUI();

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

function onUICmdCastPlayAd() {
  castSender.new_playAd();
}

function onUICmdCastTest() {
  castSender.new_test();
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

function onH5PProgressBarMousedown(e) {
    console.log('+onH5PProgressBarMousedown');
    captureProgressBarMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    flagH5PProgressBarMousedown = true;
    flagPausedBeforeMousedown = player.isPaused();
    flagEndedBeforeMousedown = player.isEnded();
    flagPositionBeforeMousedown = player.currentTime();

    // need to pause content first before starting a seek operation.
    if (!flagPausedBeforeMousedown) {
        player.pause();

        var paused = true;
        var ended = player.isEnded();
        updatePlayBtnUI(paused, ended);
    }

    // update progress bar ui
    updateProgressMovePosition(e);
    updateProgressUI();
}

function onH5PProgressBarMousemove(e) {
    // if mouse down, just return
    if (flagH5PProgressBarMousedown) {
        return;
    }

    // process normal mouse move logic
}

function onH5PVolumeSliderMousedown(e) {
    console.log('+onH5PVolumeSliderMousedown');
    captureVolumeSliderMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    flagH5PVolumeSliderMousedown = true;

    docVolumeSliderMousemove(e);
}

function onH5PVolumeSliderMousemove() {
    // if mouse down, just return
    if (flagH5PVolumeSliderMousedown) {
        return;
    }

    // process normal mouse move logic
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
    updateProgressUI();
}

function onMediaEnded() {
    // 
    var paused = player.isPaused();
    var ended = player.isEnded();
    updatePlayBtnUI(paused, ended);

    //
    valueProgressMovePosition = player.currentTime();
    updateProgressUI();

    //
    $('.html5-video-player').removeClass('h5p-autohide');
}

function onMediaLoadedData() {
    // update volume here
    var muted = player.isMuted();
    var volume = player.getVolume();

    updateContentVolumeBarUI(muted, volume);
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
    var paused = player.isPaused();
    var ended = player.isEnded();
    updatePlayBtnUI(paused, ended);

    stopWaitingUI();
}

function onMediaSeeking() {
    printLog('+onMediaSeeking, currentTime: ' + player.currentTime());
}

function onMediaSeeked() {
    printLog('+onMediaSeeked, currentTime: ' + player.currentTime());

    if (!flagPausedBeforeMousedown || flagEndedBeforeMousedown) {
        player.play();
        // update ui
        var paused = false;
        var ended = player.isEnded();
        updatePlayBtnUI(paused, ended);
    }
}

function onMediaTimeupdated() {
    //printLog('+onMediaTimeupdated, position: ' + player.currentTime() + ', duration: ' + player.duration());

    // Sometime, the timeupdate will trigger after we mouse down on the progress bar,
    // in this situation, we won't update progress bar ui.
    if (flagH5PProgressBarMousedown) {

    } else {
        valueProgressMovePosition = player.currentTime();
        updateProgressUI();
    }
}

function onMediaVolumeChanged() {

}

function onMediaWaiting() {
    startWaitingUI();
}

function onLog(e) {
    uiConsole.innerHTML = (uiConsole.innerHTML + '<br/>' + e.message);
}

function onAdTimeUpdate() {
    var position = player.currentTime();
    var duration = player.duration();
    //printLog('ad position: ' + position + ', duration: ' + duration);
    updateAdProgressUI();
}

function onFullscreenChanged() {
    var v = player.isFullscreen();
    if (v) {
        h5pFullScreenCorner0.setAttribute('d', fullscreen_yes_corner_0);
        h5pFullScreenCorner1.setAttribute('d', fullscreen_yes_corner_1);
        h5pFullScreenCorner2.setAttribute('d', fullscreen_yes_corner_2);
        h5pFullScreenCorner3.setAttribute('d', fullscreen_yes_corner_3);
    } else {
        h5pFullScreenCorner0.setAttribute('d', fullscreen_no_corner_0);
        h5pFullScreenCorner1.setAttribute('d', fullscreen_no_corner_1);
        h5pFullScreenCorner2.setAttribute('d', fullscreen_no_corner_2);
        h5pFullScreenCorner3.setAttribute('d', fullscreen_no_corner_3);
    }
}

/////////////////////////////////////////////////////////////////////////
// dynamic load main.css file
window.onload = function () {
    initUI();
    initData();
    addH5PListeners();

    // BD
    onBtnOpen();
    // ED
};

window.onunload = function () {
    //onBtnStop();
};
