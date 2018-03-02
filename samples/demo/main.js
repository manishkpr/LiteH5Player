//
var browserInfo;

// UI Controls
var vopPlayer = null;
var vopShade = null;
var vopTooltip = null;
var vopTooltipText = null;
var vopChromeBottom = null;
var vopProgressBar = null;
var vopMuteButton = null;
var vopVolumeSlider = null;
var vopVolumeSliderHandle = null;

var vopPlaySvg;
var vopMuteSvg;
var vopSettingSvg;
var vopFullscreen;
var vopFullScreenCorner0;
var vopFullScreenCorner1;
var vopFullScreenCorner2;
var vopFullScreenCorner3;

var uiConsole = null;

var timerControlBar;

// UI Data
var player_ = null;
var castSender = null;

var metaWidth;
var metaHeight;

var colorList_contentProgress = ['red', 'rgb(133,133,133)', 'rgb(52,51,52)'];
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

// flags reference variable of progress bar
var flagProgressBarMousedown = false;
var flagPausedBeforeMousedown = false;
var flagEndedBeforeMousedown = false;
var flagPositionBeforeMousedown = 0;
var valueProgressMovePosition = 0;

// flags reference variable of volume bar
var flagVolumeSliderMousedown = false;
var valueVolumeMovePosition = 0;

// reference variable of ad
var flagAdStarted = false;
var flagIsLinearAd = false;

// Title: init part
function initUI() {
    vopPlayer = document.querySelector('.html5-video-player');
    vopShade = document.querySelector('.vop-shade');

    vopTooltip = document.querySelector('.vop-tooltip');
    vopTooltipText = document.querySelector('.vop-tooltip-text');

    vopChromeBottom = document.querySelector('.vop-chrome-bottom');
    vopProgressBar = document.querySelector('.vop-progress-bar');
    vopMuteButton = document.querySelector('.vop-mute-button');
    vopVolumeSlider = document.querySelector('.vop-volume-slider');
    vopVolumeSliderHandle = document.querySelector('.vop-volume-slider-handle');

    uiConsole = document.getElementById('idConsole');

    var v = document.querySelector('.vop-play-button');
    vopPlaySvg = v.querySelector('.vop-svg-fill');

    vopMuteSvg = vopMuteButton.querySelector('.vop-svg-fill');

    var v = document.querySelector('.vop-setting-button');
    vopSettingSvg = v.querySelector('.vop-svg-fill');

    vopFullscreen = document.querySelector('.vop-fullscreen-button');

    var v = document.querySelector('.vop-fullscreen-button-corner-0');
    vopFullScreenCorner0 = v.querySelector('.vop-svg-fill');
    var v = document.querySelector('.vop-fullscreen-button-corner-1');
    vopFullScreenCorner1 = v.querySelector('.vop-svg-fill');
    var v = document.querySelector('.vop-fullscreen-button-corner-2');
    vopFullScreenCorner2 = v.querySelector('.vop-svg-fill');
    var v = document.querySelector('.vop-fullscreen-button-corner-3');
    vopFullScreenCorner3 = v.querySelector('.vop-svg-fill');

    vopPlaySvg.setAttribute('d', icon_play);
    vopMuteSvg.setAttribute('d', icon_volume_high);
    vopSettingSvg.setAttribute('d', icon_setting);

    vopFullScreenCorner0.setAttribute('d', fullscreen_no_corner_0);
    vopFullScreenCorner1.setAttribute('d', fullscreen_no_corner_1);
    vopFullScreenCorner2.setAttribute('d', fullscreen_no_corner_2);
    vopFullScreenCorner3.setAttribute('d', fullscreen_no_corner_3);

    stopWaitingUI();
}

function initPlayer() {
    var cfg = getInitConfig();
    player_ = new oldmtn.Player('player-container');
    player_.init(cfg);

    player_.on(oldmtn.Events.MSE_OPENED, onMSEOpened, {});
    player_.on(oldmtn.Events.SB_UPDATE_ENDED, onSBUpdateEnded, {});

    player_.on(oldmtn.Events.MEDIA_DURATION_CHANGED, onMediaDurationChanged, {});
    player_.on(oldmtn.Events.MEDIA_ENDED, onMediaEnded, {});
    player_.on(oldmtn.Events.MEDIA_LOADEDDATA, onMediaLoadedData, {});
    player_.on(oldmtn.Events.MEDIA_LOADEDMETADATA, onMediaLoadedMetaData, {});
    player_.on(oldmtn.Events.MEDIA_PAUSED, onMediaPaused, {});
    player_.on(oldmtn.Events.MEDIA_PLAYING, onMediaPlaying, {});
    player_.on(oldmtn.Events.MEDIA_SEEKING, onMediaSeeking, {});
    player_.on(oldmtn.Events.MEDIA_SEEKED, onMediaSeeked, {});
    player_.on(oldmtn.Events.MEDIA_TIMEUPDATE, onMediaTimeupdated, {});
    player_.on(oldmtn.Events.MEDIA_VOLUME_CHANGED, onMediaVolumeChanged, {});
    player_.on(oldmtn.Events.MEDIA_WAITING, onMediaWaiting, {});

    player_.on(oldmtn.Events.LOG, onLog, {});

    // ad callback event
    player_.on(oldmtn.Events.AD_STARTED, onAdStarted, {});
    player_.on(oldmtn.Events.AD_COMPLETE, onAdComplete, {});
    player_.on(oldmtn.Events.AD_TIMEUPDATE, onAdTimeUpdate, {});

    //
    player_.on(oldmtn.Events.FULLSCREEN_CHANGE, onFullscreenChanged, {});

    // chrome cast part
    var receiverAppId = 'E19ACDB8'; // joseph test app1
    //var receiverAppId = 'CBEF8A9C'; // joseph, css.visualon.info
    //var receiverAppId = 'FAC6871E'; // joseph, css.visualon.info

    // init chromecast sender
    //castSender = new oldmtn.CastSender(receiverAppId);
}

function initUIEventListeners() {
    vopPlayer.addEventListener('mouseenter', onvopShadeMouseenter);
    vopPlayer.addEventListener('mousemove', onvopShadeMousemove);
    vopPlayer.addEventListener('mouseleave', onShadeMouseleave);

    vopPlayer.addEventListener('click', onvopShadeClick);

    vopProgressBar.addEventListener('mousedown', onvopProgressBarMousedown);
    vopProgressBar.addEventListener('mousemove', onvopProgressBarMousemove);
    vopProgressBar.addEventListener('mouseleave', onProgressBarMouseleave);

    vopChromeBottom.addEventListener('click', onvopChromeBottomClick);
    vopMuteButton.addEventListener('click', onvopMuteButtonClick);
    vopVolumeSlider.addEventListener('mousedown', onVolumeSliderMousedown);
    vopVolumeSlider.addEventListener('mousemove', onVolumeSliderMousemove);

    vopFullscreen.addEventListener('click', onFullscreenClick);

    // resize listener
    if (window.ResizeObserver) {
        function onPlayerSize(entries) {
            for (var i = 0; i < entries.length; i ++) {
                var entry = entries[i];
                const cr = entry.contentRect;
                const cWidth = entry.target.clientWidth;
                const cHeight = entry.target.clientHeight;

                player_.resize(cWidth, cHeight);
                // BD
                // console.log('resize event, width: ' + cWidth + ', height: ' + cr.height);
                // console.log('Element:', entry.target);
                // console.log(`Element size: ${cr.width}px x ${cr.height}px`);
                // console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
                // ED
            }
        }
        var ro = new ResizeObserver(onPlayerSize);

        // Observer one or multiple elements
        var v = document.querySelector('.html5-video-player');
        ro.observe(v);
    } else {
        var v = document.querySelector('.html5-video-player');
        new ResizeSensor(v, function () {
            printLog('ResizeSensor, html5-video-player, clientWidth: ' + v.clientWidth + ', clientHeight: ' + v.clientHeight);
            player_.resize(v.clientWidth, v.clientHeight);
        });
    }
}

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
function genGradientColor(posList, colorList) {
    var totalRange = posList[posList.length - 1];

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
    var rect = vopVolumeSlider.getBoundingClientRect();

    // part - logic process
    var offsetX = e.clientX - rect.left;
    if (offsetX < 0) {
        offsetX = 0;
    } else if (offsetX + vopVolumeSliderHandle.clientWidth > rect.width) {
        offsetX = rect.width;
    }

    // update time progress scrubber button
    valueVolumeMovePosition = (offsetX / rect.width) * 1.0;
}

function getProgressMovePosition(e) {
    // part - input
    var rect = vopProgressBar.getBoundingClientRect();

    // part - logic process
    var offsetX = e.clientX - rect.left;
    if (offsetX < 0) {
        offsetX = 0;
    } else if (offsetX > rect.width) {
        offsetX = rect.width;
    }

    // update time progress scrubber button
    var duration = player_.getDuration();
    return (offsetX / rect.width) * duration;
}

function getTooltipOffsetX(e) {
    // part - input
    // bounding client rect can return the progress bar's rect relative to current page.
    var rect = vopProgressBar.getBoundingClientRect();
    var tooltipTextWidth = 44;

    // part - logic process
    var offsetToProgressBar = (e.clientX - rect.left);
    var offsetToVideo = offsetToProgressBar + 12;

    var tooltipLeft = offsetToVideo - tooltipTextWidth/2;
    var tooltipRight = offsetToVideo + tooltipTextWidth/2;

    if (tooltipLeft < 12) {
        tooltipLeft = 12;
    } else if (tooltipRight > rect.right) {
        tooltipLeft = rect.right - tooltipTextWidth;
    }

    return tooltipLeft;
}

function updateProgressBarUI() {
    // part - input
    var getPosition = player_.getPosition();
    var duration = player_.getDuration();
    var paused = player_.isPaused();
    var ended = player_.isEnded();
    var isProgressBarMousedown = flagProgressBarMousedown;

    // part - logic process
    var uiPosition;
    var uiBufferedPos;
    if (ended) {
        if (isProgressBarMousedown) {
            uiPosition = valueProgressMovePosition;
        } else {
            // when the playback is ended, the getPosition should be equal to the duration.
            uiPosition = getPosition;
        }
    } else {
        if (paused) {
            uiPosition = valueProgressMovePosition;
        } else {
            uiPosition = getPosition;
        }
    }

    // part - output, update ui
    // update time progress bar
    uiBufferedPos = player_.getValidBufferPosition(uiPosition);
    var progressList = [uiPosition, uiBufferedPos, duration];
    vopProgressBar.style.background = genGradientColor(progressList, colorList_contentProgress);

    // update time progress scrubber button
    var vScrubber = document.querySelector('.vop-scrubber-container');
    vScrubber.style.transform = 'translateX(' + ((uiPosition / duration) * vopProgressBar.clientWidth).toString() + 'px)';

    // update time display label
    var c = oldmtn.CommonUtils.timeToString(uiPosition);
    var d = oldmtn.CommonUtils.timeToString(duration);
    var fmtTime = c + '/' + d;
    var tDisplay = document.querySelector('.vop-time-text');
    tDisplay.innerText = fmtTime;
}

function updateAdProgressUI() {
    var getPosition = player_.getPosition();
    var duration = player_.getDuration();

    // update time progress bar
    var progressList = [getPosition, duration];
    vopProgressBar.style.background = genGradientColor(progressList, colorList_adProgress);

    // update time display label
    var c = oldmtn.CommonUtils.timeToString(getPosition);
    var d = oldmtn.CommonUtils.timeToString(duration);
    var fmtTime = c + '/' + d;

    //printLog('--onMediaDurationChanged--, p: ' + c + ', d: ' + d);
    var tDisplay = document.querySelector('.vop-time-text');
    tDisplay.innerText = fmtTime;
}

function updatePlayBtnUI(paused, ended) {
    if (ended) {
        vopPlaySvg.setAttribute('d', icon_replay);
    } else {
        if (paused) {
            vopPlaySvg.setAttribute('d', icon_play);
        } else {
            vopPlaySvg.setAttribute('d', icon_pause);
        }
    }
}

function updateContentVolumeBarUI(muted, volume) {
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

        var vLeft = (volume / 1) * vopVolumeSlider.clientWidth;
        if (vLeft + vopVolumeSliderHandle.clientWidth > vopVolumeSlider.clientWidth) {
            vLeft = vopVolumeSlider.clientWidth - vopVolumeSliderHandle.clientWidth;
        }

        uiVolumeHandleLeft = vLeft.toString() + 'px';
    }

    // update muted button
    vopMuteSvg.setAttribute('d', uiMutedIcon);
    // update volume slider background
    vopVolumeSlider.style.background = genGradientColor(uiVolumeList, colorList_volume);
    // update volume slider handle
    vopVolumeSliderHandle.style.left = uiVolumeHandleLeft;
}


///////////////////////////////////////////////////////////////////////////
// Title: Tool function
function h5EnterFullscreen() {
    printLog('+h5EnterFullscreen');
    //var v = document.querySelector('.player');
    //var v = document.querySelector('.vop-video-container');
    //var v = document.querySelector('.vop-video');
    //var v = document.querySelector('video');
    // Refer to youtube player
    var v = document.querySelector('.html5-video-player');

    // Try to enter fullscreen mode in the browser
    var requestFullscreen =
    v.requestFullscreen ||
    v.requestFullScreen ||
    v.webkitRequestFullscreen ||
    v.webkitRequestFullScreen ||
    v.mozRequestFullscreen ||
    v.mozRequestFullScreen ||
    v.msRequestFullscreen ||
    v.msRequestFullScreen;

    requestFullscreen.call(v);
}

function h5LeaveFullscreen() {
    printLog('+h5LeaveFullscreen');

    var cancelFullscreen =
    document.exitFullscreen ||
    document.exitFullScreen ||
    document.webkitCancelFullScreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen ||
    document.msExitFullscreen;
    if (cancelFullscreen) {
        cancelFullscreen.call(document);
    }
}

function docProgressBarMousemove(e) {
    console.log('+docProgressBarMousemove');

    valueProgressMovePosition = getProgressMovePosition(e);
    updateProgressBarUI();
}

function docProgressBarMouseup(e) {
    console.log('+docProgressBarMouseup');
    releaseProgressBarMouseEvents();
    e.preventDefault();

    // update ui first
    valueProgressMovePosition = getProgressMovePosition(e);
    updateProgressBarUI();

    if (flagPositionBeforeMousedown != valueProgressMovePosition) {
        player_.setPosition(valueProgressMovePosition);
    }

    flagProgressBarMousedown = false;
}

function docVolumeSliderMousemove(e) {
    updateVolumeMovePosition(e);
    
    var muted = player_.isMuted();
    var volume = valueVolumeMovePosition;
    if (volume === 0) {
        
    } else {
        if (muted === true) {
            player_.unmute();
        }

        muted = false;
    }
    
    player_.setVolume(valueVolumeMovePosition);

    updateContentVolumeBarUI(muted, volume);
}

function docVolumeSliderMouseup(e) {
    console.log('+docVolumeSliderMouseup');
    releaseVolumeSliderMouseEvents();
    e.preventDefault();

    flagVolumeSliderMousedown = false;

    // if mouse up out of 'vop-shade', hide control bar directly
    var pt = { x: e.clientX, y: e.clientY };
    if (!isPtInElement(pt, vopShade)) {
        onShadeMouseleave();
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

///////////////////////////////////////////////////////////////////
function printLog(msg) {
    onLog({
        message: msg
    });
    console.log(msg);
}

///////////////////////////////////////////////////////////////////
function onvopShadeMouseenter() {
    $('.html5-video-player').removeClass('vop-autohide');
}

function onvopShadeMousemove(e) {
    //console.log('+onvopShadeMousemove');

    $('.html5-video-player').removeClass('vop-autohide');

    if (timerControlBar) {
        clearTimeout(timerControlBar);
        timerControlBar = null;
    }
    timerControlBar = setTimeout(function () {
        onShadeMouseleave();
    }, 3000);
}

function onShadeMouseleave() {
    var paused = player_.isPaused();
    var fullscreen = isFullscreen();
    if (!paused && !flagProgressBarMousedown && !flagVolumeSliderMousedown && !fullscreen) {
        $('.html5-video-player').addClass('vop-autohide');
    }
}

function onvopShadeClick() {
    if (flagAdStarted && flagIsLinearAd) {
        return;
    }

    onBtnPlay();
}

// browser & UI callback functions
function onBtnOpen() {
    var playerCfg = getMediaInfo();
    player_.open(playerCfg);
}

function onBtnClose() {
    printLog('+onBtnClose');
    player_.close();
    printLog('-onBtnClose');
}

function onBtnPlay() {
    var currPaused = player_.isPaused();
    var currEnded = player_.isEnded();
    if (currEnded) {
        flagPausedBeforeMousedown = true;
        flagEndedBeforeMousedown = true;
        player_.setPosition(0);
    } else {
        var newPaused;
        // execute ui cmd
        if (currPaused) {
            player_.play();

            newPaused = false;
        } else {
            player_.pause();

            newPaused = true;
        }

        // update ui
        updatePlayBtnUI(newPaused, currEnded);
    }
}

function onvopChromeBottomClick(e) {
    e.stopPropagation();
}

function onvopMuteButtonClick() {
    var muted = player_.isMuted();
    var volume = player_.getVolume();

    if (volume === 0) {
        if (muted) {
            player_.unmute();
            muted = false;
        }

        // If the player_ is muted, and volume is 0,
        // in this situation, we will restore volume to 0.2
        volume = 0.1;
        player_.setVolume(volume);
    } else {
        if (muted) {
            player_.unmute();
            muted = false;
        } else {
            player_.mute();
            muted = true;
        }
    }
    updateContentVolumeBarUI(muted, volume);
}

function onBtnAddA() {
    player_.addA();
}

function onBtnAddV() {
    player_.addV();
}

function onBtnAddPD() {
    player_.addPD();
}

function onBtnDelAll() {
    player_.dellAll();
}

function onBtnStop() {
    player_.close();
    player_ = null;
}

function onBtnPlayAd() {
    if (player_) {
        player_.playAd();
    }
}

function onBtnSetting() {
    printLog('--onBtnSetting--');
}

function onFullscreenClick() {
    printLog('--onBtnFullscreen--');
    if (isFullscreen()) {
        h5LeaveFullscreen();
    } else {
        h5EnterFullscreen();
    }
}

function onBtnSeek() {
    var time = document.getElementById('seekedTime').value;
    player_.setPosition(time);
}

function onBtnAddTextTrack() {
    if (player_) {
        player_.addTextTrack();
    }
}

function onBtnRemoveTextTrack() {
    player_.removeTextTrack();
}

function setTextTrackHidden() {
    player_.setTextTrackHidden();
}

function setCueAlign(align) {
    player_.setCueAlign(align);
}

function onFruitClick() {
    alert('aaaa');
}

function onBtnTest() {
    // if (player_) {
    //   //player_.signalEndOfStream();
    // }
    // if (player_) {
    player_.test();
    // }

    //startWaitingUI();
    // var v = document.querySelector('.vop-chrome-bottom');
    // v.setAttribute('aria-hidden', false);

    // var v = document.querySelector('.ytp-play-button');
    // var v1 = v.querySelector('.ytp-svg-fill');
    // v1.setAttribute('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');


    // if (player_) {
    //   player_.mute();
    // }

    //player_.test();

    var progressList = [0.5, 1];
    vopProgressBar.style.background = genGradientColor(progressList, colorList_contentProgress);
}

function onBtnTest2() {
    printLog('--onBtnTest2--');
    //player_.test2();

    player_.resize(1024, 768);
    //stopWaitingUI();

    // var v = document.querySelector('.ytp-play-button');
    // var v1 = v.querySelector('.ytp-svg-fill');
    // v1.setAttribute('d', 'M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z');


    // var v = document.querySelector('.vop-video');
    // v.addEventListener("webkitfullscreenchange", function() {
    //   printLog('--webkitfullscreenchange--');
    //     //console.log(document.webkitIsFullScreen);
    // }, false);

    // v.webkitEnterFullScreen();

    //v.setAttribute('aria-hidden', true);
}

function onBtnAttribute() {
    //player_.attribute();
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

function onvopRootClick() {
    //printLog('--onvopRootClick--');
}

function onvopProgressBarMousedown(e) {
    console.log('+onvopProgressBarMousedown');
    captureProgressBarMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    flagProgressBarMousedown = true;
    flagPausedBeforeMousedown = player_.isPaused();
    flagEndedBeforeMousedown = player_.isEnded();
    flagPositionBeforeMousedown = player_.getPosition();

    // need to pause content first before starting a setPosition operation.
    if (!flagPausedBeforeMousedown) {
        player_.pause();

        var paused = true;
        var ended = player_.isEnded();
        updatePlayBtnUI(paused, ended);
    }

    // update progress bar ui
    valueProgressMovePosition = getProgressMovePosition(e);
    updateProgressBarUI();
}

function onvopProgressBarMousemove(e) {
    // if mouse down, just return
    if (flagProgressBarMousedown) {
        return;
    }

    // part - process
    // process normal mouse move logic
    valueProgressMovePosition = getProgressMovePosition(e);

    // part - output
    // update tooltip offset
    var offsetX = getTooltipOffsetX(e);
    var strTime = timeToString(valueProgressMovePosition);
    vopTooltip.style.left = offsetX.toString() + 'px';
    vopTooltip.style.display = 'block';

    vopTooltipText.innerText = strTime;
    //console.log('vopTooltip.style.left: ' + vopTooltip.style.left);
}

function onProgressBarMouseleave() {
    vopTooltip.style.display = 'none';
}

function onVolumeSliderMousedown(e) {
    console.log('+onVolumeSliderMousedown');
    captureVolumeSliderMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    flagVolumeSliderMousedown = true;

    docVolumeSliderMousemove(e);
}

function onVolumeSliderMousemove() {
    // if mouse down, just return
    if (flagVolumeSliderMousedown) {
        return;
    }

    // process normal mouse move logic
}

function onBufferIconClick() {
    //printLog('--onBufferIconClick--');
}

////////////////////////////////////////////////////////////////////////////////////
// player_ event callback
function onMSEOpened(ev) {
    //player_.addV();
}

function onSBUpdateEnded(ev) {
    //player_.addV();
}

function onMediaDurationChanged() {
    updateProgressBarUI();
}

function onMediaEnded() {
    var paused = player_.isPaused();
    var ended = player_.isEnded();
    updatePlayBtnUI(paused, ended);

    //
    valueProgressMovePosition = player_.getPosition();
    updateProgressBarUI();

    //
    $('.html5-video-player').removeClass('vop-autohide');
}

function onMediaLoadedData() {
    // update volume here
    var muted = player_.isMuted();
    var volume = player_.getVolume();

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
    player_.resize(vp.clientWidth, vp.clientHeight);
}

function onMediaPaused() {
}

function onMediaPlaying() {
    var paused = player_.isPaused();
    var ended = player_.isEnded();
    updatePlayBtnUI(paused, ended);

    stopWaitingUI();
}

function onMediaSeeking() {
    printLog('+onMediaSeeking, getPosition: ' + player_.getPosition());
}

function onMediaSeeked() {
    printLog('+onMediaSeeked, getPosition: ' + player_.getPosition());

    if (!flagPausedBeforeMousedown || flagEndedBeforeMousedown) {
        player_.play();
        // update ui
        var paused = false;
        var ended = player_.isEnded();
        updatePlayBtnUI(paused, ended);
    }
}

function onMediaTimeupdated() {
    //printLog('+onMediaTimeupdated, position: ' + player_.getPosition() + ', duration: ' + player_.getDuration());

    // Sometime, the timeupdate will trigger after we mouse down on the progress bar,
    // in this situation, we won't update progress bar ui.
    if (flagProgressBarMousedown) {
    } else {
        valueProgressMovePosition = player_.getPosition();
        updateProgressBarUI();
    }
}

function onMediaVolumeChanged() {
    var muted = player_.isMuted();
    var volume = player_.getVolume();
    updateContentVolumeBarUI(muted, volume);
}

function onMediaWaiting() {
    startWaitingUI();
}

function onLog(e) {
    uiConsole.innerHTML = (uiConsole.innerHTML + '<br/>' + e.message);
}

function onAdStarted(e) {
    flagAdStarted = true;
    flagIsLinearAd = e.isLinearAd;
}

function onAdComplete() {
    flagAdStarted = false;
}

function onAdTimeUpdate() {
    var position = player_.getPosition();
    var duration = player_.getDuration();
    //printLog('ad position: ' + position + ', duration: ' + duration);
    updateAdProgressUI();
}

function onFullscreenChanged() {
    var v = player_.isFullscreen();
    printLog('fullscreen changed, ret: ' + v);
    if (v) {
        vopFullScreenCorner0.setAttribute('d', fullscreen_yes_corner_0);
        vopFullScreenCorner1.setAttribute('d', fullscreen_yes_corner_1);
        vopFullScreenCorner2.setAttribute('d', fullscreen_yes_corner_2);
        vopFullScreenCorner3.setAttribute('d', fullscreen_yes_corner_3);
    } else {
        vopFullScreenCorner0.setAttribute('d', fullscreen_no_corner_0);
        vopFullScreenCorner1.setAttribute('d', fullscreen_no_corner_1);
        vopFullScreenCorner2.setAttribute('d', fullscreen_no_corner_2);
        vopFullScreenCorner3.setAttribute('d', fullscreen_no_corner_3);
    }
}

/////////////////////////////////////////////////////////////////////////
// dynamic load main.css file
window.onload = function () {
    // print browser version info
    browserInfo = oldmtn.CommonUtils.getBrowserInfo();
    console.log('browser: ' + browserInfo.browser + ', version: ' + browserInfo.version);

    initUI();
    initUIEventListeners();
    initPlayer();

    // BD
    //onBtnOpen();
    // ED
};

window.onunload = function () {
    //onBtnStop();
};











