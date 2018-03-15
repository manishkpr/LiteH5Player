//
var browserInfo;

// player reference
var cfg_;
var mediaCfg_;
var player_ = null;
var castSender = null;

// flag
var flagPlayerInited = false;

// UI Controls
var vopH5Player = null;
var vopTooltip = null;
var vopTooltipBg = null;
var vopTooltipText = null;
var vopControlBar = null;
var vopProgressBar = null;
var vopLoadProgress = null;
var vopPlayProgress = null;
var vopHoverProgress = null;
var vopScrubberContainer = null;
var vopPlayButton = null;
var vopMuteButton = null;
var vopVolumeSlider = null;
var vopVolumeSliderHandle = null;

var vopPlaySvg;
var vopMuteSvg;
var vopSettingsBtn;
var vopSettingsBtnSvg;
var vopSettingsMenu;
var vopSettingsMenuPanel;
var vopSettingsMenuPanelMenu;
var vopFullscreen;
var vopFullScreenCorner0;
var vopFullScreenCorner1;
var vopFullScreenCorner2;
var vopFullScreenCorner3;
var vopSpinner;
var uiGiantBtnContainer;

var uiConsole = null;

// UI Data
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

// flag
var timerHideControlBar;

// flags reference variable of progress bar
var progressBarContext = {
    mousedown: false,
    pausedBeforeMousedown: false,
    endedBeforeMousedown: false,
    posBeforeMousedown: 0,
    timer: null,
    //
    movePos: 0
};
var flagThumbnailMode = false;

// flags reference variable of volume bar
var flagVolumeSliderMousedown = false;
var valueVolumeMovePosition = 0;

// menu context
var settingContext = {
    currMenu: 'none',

    qualityList: [
    {id: 5, bitrate: '1080p'}, {id: 4, bitrate: '720p'},
    {id: 3, bitrate: '480p'}, {id: 2, bitrate: '360p'},
    {id: 1, bitrate: '240p'}, {id: 0, bitrate: '144p'},
    {id: null, bitrate: 'Auto'}
    ],

    isQualityAuto: true,
    currQuality: '360p',

    audioTrackList: ['Bipbop1', 'Bipbop2'],
    isAudioTrackAuto: true,
    currAudioTrack: 'Bipbop1'
};

// reference variable of ad
var flagAdStarted = false;
var flagIsLinearAd = false;

// Title: init part
function initUI() {
    vopH5Player = document.querySelector('.html5-video-player');

    vopTooltip = document.querySelector('.vop-tooltip');
    vopTooltipBg = document.querySelector('.vop-tooltip-bg');
    vopTooltipText = document.querySelector('.vop-tooltip-text');

    vopControlBar = document.querySelector('.vop-control-bar');
    vopProgressBar = document.querySelector('.vop-progress-bar');
    vopLoadProgress = document.querySelector('.vop-load-progress');
    vopPlayProgress = document.querySelector('.vop-play-progress');
    vopHoverProgress = document.querySelector('.vop-hover-progress');

    vopScrubberContainer = document.querySelector('.vop-scrubber-container');
    vopPlayButton = document.querySelector('.vop-play-button');
    vopMuteButton = document.querySelector('.vop-mute-button');
    vopVolumeSlider = document.querySelector('.vop-volume-slider');
    vopVolumeSliderHandle = document.querySelector('.vop-volume-slider-handle');

    uiConsole = document.getElementById('idConsole');

    var v = document.querySelector('.vop-play-button');
    vopPlaySvg = v.querySelector('.vop-svg-fill');

    vopMuteSvg = vopMuteButton.querySelector('.vop-svg-fill');

    vopSettingsBtn = document.querySelector('.vop-settings-button');
    vopSettingsBtnSvg = vopSettingsBtn.querySelector('.vop-svg-fill');

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
    vopSettingsBtnSvg.setAttribute('d', icon_setting);

    vopFullScreenCorner0.setAttribute('d', fullscreen_no_corner_0);
    vopFullScreenCorner1.setAttribute('d', fullscreen_no_corner_1);
    vopFullScreenCorner2.setAttribute('d', fullscreen_no_corner_2);
    vopFullScreenCorner3.setAttribute('d', fullscreen_no_corner_3);

    // setting panel
    vopSettingsMenu = document.querySelector('.vop-settings-menu');
    vopSettingsMenuPanel = vopSettingsMenu.querySelector('.vop-panel');
    vopSettingsMenuPanelMenu = vopSettingsMenu.querySelector('.vop-panel-menu');

    vopSpinner = document.querySelector('.vop-spinner');

    uiGiantBtnContainer = document.querySelector('.vop-giant-button-container');
}

function initUIEventListeners() {
    vopH5Player.addEventListener('mouseenter', onPlayerMouseenter);
    vopH5Player.addEventListener('mousemove', onPlayerMousemove);
    vopH5Player.addEventListener('mouseleave', onPlayerMouseleave);

    vopH5Player.addEventListener('click', onPlayerClick);

    vopProgressBar.addEventListener('mousedown', onProgressBarMousedown);
    vopProgressBar.addEventListener('mousemove', onProgressBarMousemove);
    vopProgressBar.addEventListener('mouseleave', onProgressBarMouseleave);

    vopControlBar.addEventListener('click', onChromeBottomClick);
    vopPlayButton.addEventListener('click', onPlayButtonClick);
    vopPlayButton.addEventListener('mousemove', onPlayButtonMousemove);
    vopMuteButton.addEventListener('click', onMuteButtonClick);
    vopMuteButton.addEventListener('mousemove', onMuteButtonMousemove);
    vopVolumeSlider.addEventListener('mousedown', onVolumeSliderMousedown);
    vopVolumeSlider.addEventListener('mousemove', onVolumeSliderMousemove);

    vopSettingsBtn.addEventListener('click', onSettingClick);
    vopFullscreen.addEventListener('click', onFullscreenClick);

    // don't route 'click' event from panel to its parent div
    vopSettingsMenuPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    uiGiantBtnContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        onPlayFromGiantButton();
    });

    // resize listener
    //if (window.ResizeObserver) {
    if (false) {
        function onPlayerSize(entries) {
            for (var i = 0; i < entries.length; i ++) {
                var entry = entries[i];
                const cr = entry.contentRect;
                const cWidth = entry.target.clientWidth;
                const cHeight = entry.target.clientHeight;

                player_.resize(cWidth, cHeight);
            }
        }
        var ro = new ResizeObserver(onPlayerSize);

        // Observer one or multiple elements
        var v = document.querySelector('.html5-video-player');
        ro.observe(v);
    } else {
        var v = document.querySelector('.html5-video-player');
        new ResizeSensor(v, function () {
            printLog(('ResizeSensor, Width: ' + v.clientWidth + ', Height: ' + v.clientHeight));
            updateProgressBarUI();
            player_.resize(v.clientWidth, v.clientHeight);
        });
    }
}


function initPlayer() {
    cfg_ = getInitConfig();
    player_ = new oldmtn.Player('player-container');
    player_.init(cfg_);

    player_.on(oldmtn.Events.MEDIA_CANPLAY, onMediaCanPlay, {});
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

///////////////////////////////////////////////////////////////////////////
// Title: UI reference functions
function startWaitingUI() {
    vopSpinner.style.display = 'block';
}

function stopWaitingUI() {
    vopSpinner.style.display = 'none';
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

function updateProgressBarUI() {
    // part - input
    var position = player_.getPosition();
    var duration = player_.getDuration();
    var paused = player_.isPaused();
    var ended = player_.isEnded();

    // part - logic process
    var isLive = (duration === Infinity) ? true : false;
    if (isLive) {
        var seekable = player_.getSeekableRange();
        var buffered = player_.getBufferedRanges();
        console.log('seekable: ' + TimeRangesToString(seekable));
        console.log('buffered: ' + TimeRangesToString(buffered));

        // update time display label
        var tDisplay = document.querySelector('.vop-time-text');
        tDisplay.innerText = 'Live';
    } else {
        var uiPosition;
        var uiBufferedPos;
        if (ended) {
            if (progressBarContext.mousedown) {
                uiPosition = progressBarContext.movePos;
            } else {
                // when the playback is ended, the position should be equal to the duration.
                uiPosition = position;
            }
        } else {
            if (progressBarContext.mousedown) {
                uiPosition = progressBarContext.movePos;
            } else {
                uiPosition = position;
            }
        }

        // part - output, update ui
        // update time progress bar
        uiBufferedPos = player_.getValidBufferPosition(uiPosition);
        vopLoadProgress.style.transform = 'scaleX(' + uiBufferedPos/duration + ')';
        vopPlayProgress.style.transform = 'scaleX(' + uiPosition/duration + ')';

        // update time progress scrubber button
        vopScrubberContainer.style.transform = 'translateX(' + ((uiPosition / duration) * vopProgressBar.clientWidth).toString() + 'px)';

        // update time display label
        var c = oldmtn.CommonUtils.timeToString(uiPosition);
        var d = oldmtn.CommonUtils.timeToString(duration);
        var fmtTime = c + '/' + d;
        var tDisplay = document.querySelector('.vop-time-text');
        tDisplay.innerText = fmtTime;
    }
}

function updateProgressBarHoverUI() {
    var position = player_.getPosition();
    var duration = player_.getDuration();

    if (progressBarContext.movePos <= position || progressBarContext.mousedown) {
        vopHoverProgress.style.transform = 'scaleX(0)';
    } else {
        var rect = vopProgressBar.getBoundingClientRect();
        var offsetX = (position/duration)*rect.width;
        vopHoverProgress.style.left = offsetX + 'px';
        vopHoverProgress.style.transform = 'scaleX(' + (progressBarContext.movePos - position)/duration + ')';
    }
}

function updateTooltipUI(e) {
    var hasVttThumbnail = true;
    function getTooltipOffsetX(e) {
        // part - input
        // bounding client rect can return the progress bar's rect relative to current page.
        var rect = vopProgressBar.getBoundingClientRect();
        var leftMin = 12;
        var rightMax = 12 + rect.width;
        var tooltipWidth = (hasVttThumbnail === true) ? 162 : 60;

        // part - logic process
        var offsetToProgressBar = (e.clientX - rect.left);
        var offsetToVideo = offsetToProgressBar + 12;

        var tooltipLeft_RelativeToVideo = offsetToVideo - tooltipWidth/2;
        var tooltipRight_RelativeToVideo = offsetToVideo + tooltipWidth/2;

        if (tooltipLeft_RelativeToVideo < leftMin) {
            tooltipLeft_RelativeToVideo = leftMin;
        } else if (tooltipRight_RelativeToVideo > rightMax) {
            tooltipLeft_RelativeToVideo = rightMax - tooltipWidth;
        }

        return tooltipLeft_RelativeToVideo;
    }

    if (hasVttThumbnail) {
        $('.vop-tooltip').addClass('vop-preview');
        vopTooltipBg.style.background = 'url("https://i9.ytimg.com/sb/pQ9eej56xbU/storyboard3_L2/M1.jpg?sigh=rs%24AOn4CLDgQvL4F2LQ1qWeY-hwNqbP3xWkPw") -180px -0px';
    } else {
        $('.vop-tooltip').removeClass('vop-preview');
    }

    // update tooltip offset
    var strTime = timeToString(progressBarContext.movePos);
    vopTooltipText.innerText = strTime;

    var offsetX = getTooltipOffsetX(e);
    vopTooltip.style.left = offsetX.toString() + 'px';
    vopTooltip.style.display = 'block';
}

function updateAdProgressUI() {
    var position = player_.getPosition();
    var duration = player_.getDuration();

    // update time progress bar
    vopPlayProgress.style.transform = 'scaleX(' + position/duration + ')';

    // update time display label
    var c = oldmtn.CommonUtils.timeToString(position);
    var d = oldmtn.CommonUtils.timeToString(duration);
    var fmtTime = c + '/' + d;

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
function removeAutohideAction() {
    $('.html5-video-player').removeClass('vop-autohide');
    if (timerHideControlBar) {
        clearTimeout(timerHideControlBar);
        timerHideControlBar = null;
    }
}

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
    printLog('+docVolumeSliderMouseup');
    releaseVolumeSliderMouseEvents();
    e.preventDefault();

    flagVolumeSliderMousedown = false;

    // if mouse up out of 'vop-shade', hide control bar directly
    var pt = { x: e.clientX, y: e.clientY };
    if (!isPtInElement(pt, vopH5Player)) {
        onPlayerMouseleave();
    }
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
function onPlayerMouseenter() {
    $('.html5-video-player').removeClass('vop-autohide');
}

function onPlayerMousemove(e) {
    printLog('+onPlayerMousemove');
    removeAutohideAction();
    timerHideControlBar = setTimeout(function () {
        onPlayerMouseleave();
    }, 3000);
}

function onPlayerMouseleave() {
    var paused = player_.isPaused();
    var fullscreen = isFullscreen();
    if (!paused && !progressBarContext.mousedown && !flagVolumeSliderMousedown && !fullscreen) {
        $('.html5-video-player').addClass('vop-autohide');
    }
}

function onPlayerClick() {
    if (flagAdStarted && flagIsLinearAd) { return; }

    onPlayButtonClick();
}

// browser & UI callback functions
function onBtnOpen() {
    mediaCfg_ = getMediaInfo();
    player_.open(mediaCfg_);
}

function onBtnClose() {
    printLog('+onBtnClose');
    player_.close();
    printLog('-onBtnClose');
}

function onPlayButtonClick() {
    var currPaused = player_.isPaused();
    var currEnded = player_.isEnded();
    if (currEnded) {
        progressBarContext.pausedBeforeMousedown = true;
        progressBarContext.endedBeforeMousedown = true;
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

function onPlayButtonMousemove(e) {
    e.stopPropagation();
    removeAutohideAction();
}

function onChromeBottomClick(e) {
    e.stopPropagation();
}

function onMuteButtonClick() {
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

function onMuteButtonMousemove(e) {
    e.stopPropagation();
    removeAutohideAction();
}

function onBtnAddA() {
    player_.addA();
}

function onBtnManualSchedule() {
    player_.manualSchedule();
}

function onBtnInitAD() {
    player_.test();
}

function onBtnDelAll() {
    player_.dellAll();
}

function onBtnStop() {
    player_.close();
    player_ = null;
}

function onPlayButtonClickAd() {
    if (player_) {
        player_.playAd();
    }
}

function onSettingClick() {
    printLog('+onBtnSetting, currMenu: ' + settingContext.currMenu);

    if (settingContext.currMenu === 'none') {
        createMainMenu();
        settingContext.currMenu = 'main_menu';
    } else if (settingContext.currMenu === 'main_menu') {
        if (vopSettingsMenu.style.display === 'none') {
            vopSettingsMenu.style.display = 'block';
            var elem_child = vopSettingsMenuPanelMenu.childNodes;
            elem_child[1].focus();
        } else {
            vopSettingsMenu.style.display = 'none';
        }
    } else if (settingContext.currMenu === 'quality_menu' ||
        settingContext.currMenu === 'audioTrack_menu') {
        destroyMenu();
        settingContext.currMenu = 'none';
    }
}

function onFullscreenClick() {
    printLog('+onBtnFullscreen');
    if (isFullscreen()) {
        h5LeaveFullscreen();
    } else {
        h5EnterFullscreen();
    }
}

function onPlayFromGiantButton() {
    onPlayButtonClick();
    uiGiantBtnContainer.style.display = 'none';
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
    // var v = document.querySelector('.vop-control-bar');
    // v.setAttribute('aria-hidden', false);

    // var v = document.querySelector('.ytp-play-button');
    // var v1 = v.querySelector('.ytp-svg-fill');
    // v1.setAttribute('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');


    // if (player_) {
    //   player_.mute();
    // }

    //player_.test();
}

function onBtnTest2() {
    printLog('--onBtnTest2--');
    player_.test2();

    //player_.resize(1024, 768);
    //stopWaitingUI();

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
}

function onVideoControlBarClick() {
}

function doEnterThumbnailMode() {
    printLog('+doEnterThumbnailMode');
    if (!flagThumbnailMode) {
        // need to pause content first before starting a seek operation.
        if (!progressBarContext.pausedBeforeMousedown) {
            player_.pause();

            var paused = true;
            var ended = player_.isEnded();
            updatePlayBtnUI(paused, ended);
        }

        progressBarContext.timer = null;
        flagThumbnailMode = true;
    }
}

function doProcessThumbnailMove() {
    // for further action, you can add thumbnail popup here.
}

function doProcessThumbnailUp() {
    // for further action, you can add thumbnail ended event here.
}

function onProgressBarMousedown(e) {
    printLog('+onProgressBarMousedown');
    captureProgressBarMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    progressBarContext.mousedown = true;
    progressBarContext.pausedBeforeMousedown = player_.isPaused();
    progressBarContext.endedBeforeMousedown = player_.isEnded();
    progressBarContext.posBeforeMousedown = player_.getPosition();
    flagThumbnailMode = false;
    progressBarContext.timer = setTimeout(function() {
        doEnterThumbnailMode();
    }, 200);

    // update progress bar ui
    progressBarContext.movePos = getProgressMovePosition(e);
    updateProgressBarUI();
    updateProgressBarHoverUI();
}

function onProgressBarMousemove(e) {
    printLog('+onProgressBarMousemove');
    e.stopPropagation();
    removeAutohideAction();

    // if mouse down, just return
    if (progressBarContext.mousedown) {
        return;
    }

    // part - process
    // process normal mouse move logic
    progressBarContext.movePos = getProgressMovePosition(e);

    // part - output
    updateProgressBarHoverUI();
    updateTooltipUI(e);
}

function onProgressBarMouseleave() {
    printLog('+onProgressBarMouseleave');
    vopTooltip.style.display = 'none';
}

function captureProgressBarMouseEvents() {
    document.addEventListener('mousemove', docProgressBarMousemove, true);
    document.addEventListener('mouseup', docProgressBarMouseup, true);
}

function releaseProgressBarMouseEvents() {
    document.removeEventListener ('mousemove', docProgressBarMousemove, true);
    document.removeEventListener ('mouseup', docProgressBarMouseup, true);
}

function docProgressBarMousemove(e) {
    printLog('+docProgressBarMousemove');

    var movePos = getProgressMovePosition(e);
    if (progressBarContext.movePos === movePos) {
        return;
    }

    doEnterThumbnailMode();
    doProcessThumbnailMove();

    progressBarContext.movePos = movePos;
    updateProgressBarUI();
    updateProgressBarHoverUI();
}

function docProgressBarMouseup(e) {
    printLog('+docProgressBarMouseup');
    releaseProgressBarMouseEvents();
    e.preventDefault();

    if (flagThumbnailMode) {
        // thumbnail mode click event
        doProcessThumbnailUp();
    } else {
        // plain click event
        if (progressBarContext.timer) {
            // it's quick click, don't need to pause
            clearTimeout(progressBarContext.timer);
            progressBarContext.timer = null;
        }
    }

    // update ui first
    progressBarContext.movePos = getProgressMovePosition(e);
    updateProgressBarUI();
    updateProgressBarHoverUI();

    if (progressBarContext.posBeforeMousedown != progressBarContext.movePos) {
        player_.setPosition(progressBarContext.movePos);
    }

    progressBarContext.mousedown = false;
}

function onVolumeSliderMousedown(e) {
    printLog('+onVolumeSliderMousedown');
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


////////////////////////////////////////////////////////////////////////////////////
// player_ event callback
function onMediaCanPlay() {
    if (!flagPlayerInited) {
        flagPlayerInited = true;

        updateProgressBarUI();
        vopControlBar.style.display = 'block';

        // process config parameter
        if (cfg_.autoplay) {
            onPlayFromGiantButton();
        }
    }
}

function onMediaDurationChanged() {
    updateProgressBarUI();
}

function onMediaEnded() {
    var paused = player_.isPaused();
    var ended = player_.isEnded();
    updatePlayBtnUI(paused, ended);

    //
    progressBarContext.movePos = player_.getPosition();
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
    vp.style.paddingBottom = ((metaHeight / metaWidth) * 100).toString() + '%';

    printLog('vp.clientWidth: ' + vp.clientWidth);
    printLog('vp.clientHeight: ' + vp.clientHeight);
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
    printLog('+onMediaSeeking, pos: ' + player_.getPosition());
}

function onMediaSeeked() {
    printLog('+onMediaSeeked, pos: ' + player_.getPosition());

    if (!progressBarContext.pausedBeforeMousedown || progressBarContext.endedBeforeMousedown) {
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
    if (progressBarContext.mousedown) {
    } else {
        //progressBarContext.movePos = player_.getPosition();
        updateProgressBarUI();
        updateProgressBarHoverUI();
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
    printLog('onAdStarted, linear: ' + e.isLinearAd);
    flagAdStarted = true;
    flagIsLinearAd = e.isLinearAd;
    if (!flagIsLinearAd) {
        var v = document.querySelector('.vop-ads-container');
        v.style.marginTop = '-' + (vopControlBar.clientHeight + 10).toString() + 'px';
    }
}

function onAdComplete() {
    printLog('onAdComplete, linear: ' + flagIsLinearAd);
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
// Title: Dynamic create UI
function destroyMenu() {
    var v = document.querySelector('.vop-panel-header');
    if (v) {
        vopSettingsMenuPanel.removeChild(v);
    }
    while (vopSettingsMenuPanelMenu.firstChild) {
        vopSettingsMenuPanelMenu.removeChild(vopSettingsMenuPanelMenu.firstChild);
    }
}

function createMainMenu() {
// The main menu html:
// <div class="vop-panel-menu">
//     <div class="vop-menuitem" role="menuitem" aria-haspopup="true" onclick="onQualityItemClick(event)">
//         <div class="vop-menuitem-label">
//             Quality
//         </div>
//         <div class="vop-menuitem-content">
//             <span class="vop-menu-content-text">360p</span>
//         </div>
//     </div>
//     <div class="vop-menuitem" role="menuitem" aria-haspopup="true" onclick="onAudioTrackMenuClick(event)">
//         <div class="vop-menuitem-label">
//             Language
//         </div>
//         <div class="vop-menuitem-content">
//             <span>Auto</span>
//             <span class="vop-menu-content-text">Bipbop1</span>
//         </div>
//     </div>
// </div>

    // Part - input: current quality, current audio track, etc.
    var qualityCnt = 3;
    var audioTrackCnt = 2;

    // Part - process: created quality menu item
    var qualityMenuitem = document.createElement('div');
    qualityMenuitem.setAttribute('class', 'vop-menuitem');
    qualityMenuitem.setAttribute('role', 'menuitem');
    if (qualityCnt > 1) {
        qualityMenuitem.setAttribute('aria-haspopup', 'true');
    }
    qualityMenuitem.setAttribute('tabindex', '0');
    qualityMenuitem.addEventListener('blur', onMainMenuBlur);

    var label = document.createElement('div');
    label.setAttribute('class', 'vop-menuitem-label');
    label.innerText = 'Quality';

    var content = document.createElement('div');
    content.setAttribute('class', 'vop-menuitem-content');

    if (settingContext.isQualityAuto) {
        var spanAuto = document.createElement('span');
        spanAuto.innerText = 'Auto';

        content.appendChild(spanAuto);
    }

    var contentText = document.createElement('span');
    contentText.setAttribute('class', 'vop-menu-content-text');
    contentText.innerText = settingContext.currQuality;
    content.appendChild(contentText);

    qualityMenuitem.appendChild(label);
    qualityMenuitem.appendChild(content);

    qualityMenuitem.addEventListener('click', onQualityMenuClick);

    // create audio track menu item
    var audioMenuitem = document.createElement('div');
    audioMenuitem.setAttribute('class', 'vop-menuitem');
    audioMenuitem.setAttribute('role', 'menuitem');
    if (audioTrackCnt > 1) {
        audioMenuitem.setAttribute('aria-haspopup', 'true');
    }
    audioMenuitem.setAttribute('tabindex', '0');
    audioMenuitem.addEventListener('blur', onMainMenuBlur);

    label = document.createElement('div');
    label.setAttribute('class', 'vop-menuitem-label');
    label.innerText = 'Language';

    content = document.createElement('div');
    content.setAttribute('class', 'vop-menuitem-content');

    if (settingContext.isAudioTrackAuto) {
        var spanAuto = document.createElement('span');
        spanAuto.innerText = 'Auto';

        content.appendChild(spanAuto);
    }

    contentText = document.createElement('span');
    contentText.setAttribute('class', 'vop-menu-content-text');
    contentText.innerText = settingContext.currAudioTrack;
    content.appendChild(contentText);

    audioMenuitem.appendChild(label);
    audioMenuitem.appendChild(content);

    audioMenuitem.addEventListener('click', onAudioTrackMenuClick);

    // Part post process
    vopSettingsMenuPanelMenu.appendChild(qualityMenuitem);
    vopSettingsMenuPanelMenu.appendChild(audioMenuitem);

    //
    vopSettingsMenu.style.display = 'block';
    qualityMenuitem.focus();
}

function createQualityMenu() {
// The quality menu html:
// <div class="vop-panel-header">
//     <button class="vop-panel-title" onclick="onQualityBack(event)">Quality</button>
// </div>
// <div class="vop-panel-menu">
//     <div class="vop-menuitem" role="menuitemradio">
//         <div class="vop-menuitem-label">
//             <span>720p</span>
//         </div>
//     </div>
//     <div class="vop-menuitem" role="menuitemradio">
//         <div class="vop-menuitem-label">
//             <span>480p</span>
//         </div>
//     </div>
//     <div class="vop-menuitem" role="menuitemradio">
//         <div class="vop-menuitem-label">
//             <span>360p</span>
//         </div>
//     </div>
//     <div class="vop-menuitem" role="menuitemradio" aria-checked="true">
//         <div class="vop-menuitem-label">
//             <span>Auto</span>
//         </div>
//     </div>
// </div>

    // add quality back menu
    var header = document.createElement('div');
    header.setAttribute('class', 'vop-panel-header');

    var button = document.createElement('button');
    button.setAttribute('class', 'vop-panel-title');
    button.innerText = 'Quality';
    button.addEventListener('click', onQualityBack);

    header.appendChild(button);

    // add quality menuitem
    var focusItem = null;
    for (var i = 0; i < settingContext.qualityList.length; i ++) {
        var quality = settingContext.qualityList[i].bitrate;

        var menuitem = document.createElement('div');
        menuitem.setAttribute('class', 'vop-menuitem');
        menuitem.setAttribute('role', 'menuitemradio');
        if (quality == settingContext.currQuality) {
            menuitem.setAttribute('aria-checked', 'true');
        }
        menuitem.setAttribute('tabindex', '0');
        menuitem.addEventListener('blur', onMainMenuBlur);
        if (quality == settingContext.currQuality) {
            focusItem = menuitem;
        }
        menuitem.addEventListener('click', onQualityItemClick);

        var label = document.createElement('div');
        label.setAttribute('class', 'vop-menuitem-label');
        label.innerText = quality;

        menuitem.appendChild(label);
        vopSettingsMenuPanelMenu.appendChild(menuitem);
    }

    vopSettingsMenuPanel.insertBefore(header, vopSettingsMenuPanelMenu);
    //
    vopSettingsMenu.style.display = 'block';
    focusItem.focus();
}

function updateQualityMenuUI() {
    var elem_child = vopSettingsMenuPanelMenu.childNodes;
    for (var i = 0; i < elem_child.length; i ++) {
        var menuitem = elem_child[i];

        var label = menuitem.querySelector('.vop-menuitem-label');
        if (label.innerText === settingContext.currQuality) {
            menuitem.setAttribute('aria-checked', 'true');
        } else {
            menuitem.setAttribute('aria-checked', 'false');
        }
    }
}

function createAudioTrackMenu() {
// The audio track menu html:
// <div class="vop-panel-header">
//     <button class="vop-panel-title" onclick="onAudioTrackBack(event)">Audio</button>
// </div>
// <div class="vop-panel-menu">
//     <div class="vop-menuitem" role="menuitemradio">
//         <div class="vop-menuitem-label">
//             <span>Bipbop1</span>
//         </div>
//     </div>
//     <div class="vop-menuitem" role="menuitemradio">
//         <div class="vop-menuitem-label">
//             <span>Bipbop2</span>
//         </div>
//     </div>
//     <div class="vop-menuitem" role="menuitemradio" aria-checked="true">
//         <div class="vop-menuitem-label">
//             <span>Auto</span>
//         </div>
//     </div>
// </div>

    // add quality back menu
    var header = document.createElement('div');
    header.setAttribute('class', 'vop-panel-header');

    var button = document.createElement('button');
    button.setAttribute('class', 'vop-panel-title');
    button.innerText = 'Audio';
    button.addEventListener('click', onQualityBack);

    header.appendChild(button);

    // add quality menuitem
    var focusItem = null;
    for (var i = 0; i < settingContext.audioTrackList.length; i ++) {
        var audioTrack = settingContext.audioTrackList[i];

        var menuitem = document.createElement('div');
        menuitem.setAttribute('class', 'vop-menuitem');
        menuitem.setAttribute('role', 'menuitemradio');
        if (audioTrack == settingContext.currAudioTrack) {
            menuitem.setAttribute('aria-checked', 'true');
        }
        menuitem.setAttribute('tabindex', '0');
        menuitem.addEventListener('blur', onMainMenuBlur);
        if (i === 0) {
            focusItem = menuitem;
        }
        menuitem.addEventListener('click', onAudioTrackItemClick);

        var label = document.createElement('div');
        label.setAttribute('class', 'vop-menuitem-label');
        label.innerText = audioTrack;
        
        menuitem.appendChild(label);
        vopSettingsMenuPanelMenu.appendChild(menuitem);
    }

    vopSettingsMenuPanel.insertBefore(header, vopSettingsMenuPanelMenu);
    //
    vopSettingsMenu.style.display = 'block';
    focusItem.focus();
}

function updateAudioTrackMenuUI() {
    var elem_child = vopSettingsMenuPanelMenu.childNodes;
    for (var i = 0; i < elem_child.length; i ++) {
        var menuitem = elem_child[i];

        var label = menuitem.querySelector('.vop-menuitem-label');
        if (label.innerText === settingContext.currAudioTrack) {
            menuitem.setAttribute('aria-checked', 'true');
        } else {
            menuitem.setAttribute('aria-checked', 'false');
        }
    }
}

function onQualityMenuClick(e) {
    e.stopPropagation();
    printLog('+onQualityMenuClick: ' + e.target.innerText);

    destroyMenu();
    createQualityMenu();
    settingContext.currMenu = 'quality_menu';
}

function onAudioTrackMenuClick(e) {
    e.stopPropagation();

    destroyMenu();
    createAudioTrackMenu();
    settingContext.currMenu = 'audioTrack_menu';
}

function onMainMenuBlur(e) {
    var text = '';
    if (e.relatedTarget) {
        text = ', text: ' + e.relatedTarget.innerText;
    }
    
    printLog('+onMainMenuBlur, settingContext.currMenu: ' + settingContext.currMenu + text);

    if (e.relatedTarget) {
        if (e.relatedTarget === vopSettingsBtn) {
            if (settingContext.currMenu === 'main_menu' ||
                settingContext.currMenu === 'quality_menu' ||
                settingContext.currMenu === 'audioTrack_menu') {
                // do nothing
            }
        } else if (e.relatedTarget.getAttribute('tabindex') === '0') {
            // do nothing
            var a1 = e.relatedTarget.getAttribute('tabindex');
            console.log('a1: ' + a1 + ', innerText: ' + e.relatedTarget.innerText);
        }
    } else {
        printLog('+onMainMenuBlur, before onSettingClick');
        onSettingClick();
    }
}

function onQualityBack(e) {
    e.stopPropagation();

    destroyMenu();
    createMainMenu();
    settingContext.currMenu = 'main_menu';
}

function onQualityItemClick(e) {
    printLog('onQualityItemClick, settingContext.currMenu: ' + settingContext.currMenu
        + ', text: ' + e.target.innerText);
    e.stopPropagation();

    settingContext.currQuality = e.target.innerText;
    updateQualityMenuUI();
}

function onAudioTrackItemClick(e) {
    e.stopPropagation();

    settingContext.currAudioTrack = e.target.innerText;
    updateAudioTrackMenuUI();
}

function onAudioTrackBack(e) {
    e.stopPropagation();

    destroyMenu();
    createMainMenu();
    settingContext.currMenu = 'main_menu';
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











