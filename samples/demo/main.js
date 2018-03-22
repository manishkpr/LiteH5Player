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

var vopSubtitlesBtn;
var vopSettingsBtn;
var vopSettingsMenu;
var vopPanel;
var vopPanelMenu;
var vopFullscreen;
var vopSpinner;
var uiGiantBtnContainer;

var uiConsole = null;

// UI Data
var metaWidth;
var metaHeight;

var colorList_contentProgress = ['red', 'rgb(133,133,133)', 'rgb(52,51,52)'];
var colorList_adProgress = ['orange', 'rgba(192,192,192,0.3)'];
var colorList_volume = ['#ccc', 'rgba(192,192,192,0.3)'];


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
var subtitlesMenuContext = {
    currMenu: 'none',
    
    subtitleTracks: [
    {id: '1', lang: 'English'},
    {id: '2', lang: 'France'},
    {id: '3', lang: 'Chinese'},
    {id: '4', lang: '444'},
    {id: '5', lang: '5555'},
    {id: '6', lang: '666'},
    {id: '7', lang: '777'}
    ],

    currSubtitleId: ''
};

var settingMenuContext = {
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

    vopSubtitlesBtn = document.querySelector('.vop-subtitles-button');
    vopSettingsBtn = document.querySelector('.vop-settings-button');
    vopFullscreen = document.querySelector('.vop-fullscreen-button');

    // setting panel
    vopSettingsMenu = document.querySelector('.vop-settings-menu');
    vopPanel = vopSettingsMenu.querySelector('.vop-panel');
    vopPanelMenu = vopSettingsMenu.querySelector('.vop-panel-menu');

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
    vopMuteButton.addEventListener('click', onMuteButtonClick);
    vopVolumeSlider.addEventListener('mousedown', onVolumeSliderMousedown);
    vopSubtitlesBtn.addEventListener('click', onSubtitlesClick);
    vopSettingsBtn.addEventListener('click', onSettingClick);
    vopFullscreen.addEventListener('click', onFullscreenClick);

    vopPlayButton.addEventListener('mousemove', onControlMousemove);
    vopMuteButton.addEventListener('mousemove', onControlMousemove);
    vopSubtitlesBtn.addEventListener('mousemove', onControlMousemove);
    vopSettingsBtn.addEventListener('mousemove', onControlMousemove);
    vopFullscreen.addEventListener('mousemove', onControlMousemove);
    vopVolumeSlider.addEventListener('mousemove', onControlMousemove);

    // don't route 'click' event from panel to its parent div
    vopPanel.addEventListener('click', function(e) {
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
        if (progressBarContext.mousedown) {
            uiPosition = progressBarContext.movePos;
        } else {
            uiPosition = position;
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
        vopPlayButton.innerText = 'replay';
    } else {
        if (paused) {
            vopPlayButton.innerText = 'play_arrow';
        } else {
            vopPlayButton.innerText = 'pause';
        }
    }
}

function updateContentVolumeBarUI(muted, volume) {
    var uiMutedIcon;
    var uiVolumeList;
    var uiVolumeHandleLeft;
    if (volume === 0 || muted) {
        uiMutedIcon = 'volume_off';
        uiVolumeList = [0, 1];
        uiVolumeHandleLeft = '0px';
    } else {
        if (volume >= 0.5) {
            uiMutedIcon = 'volume_up';
        } else {
            uiMutedIcon = 'volume_down';
        }

        uiVolumeList = [volume, 1];

        var vLeft = (volume / 1) * vopVolumeSlider.clientWidth;
        if (vLeft + vopVolumeSliderHandle.clientWidth > vopVolumeSlider.clientWidth) {
            vLeft = vopVolumeSlider.clientWidth - vopVolumeSliderHandle.clientWidth;
        }

        uiVolumeHandleLeft = vLeft.toString() + 'px';
    }

    // update muted button
    vopMuteButton.innerText = uiMutedIcon;
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
    // don't show control bar if the stream is not initialized.
    if (!flagPlayerInited) {
        return;
    }

    $('.html5-video-player').removeClass('vop-autohide');
}

function onPlayerMousemove(e) {
    //printLog('+onPlayerMousemove');
    // don't show control bar if the stream is not initialized.
    if (!flagPlayerInited) {
        return;
    }

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

function onControlMousemove(e) {
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

function onSubtitlesClick() {
    printLog('+onSubtitlesClick, currMenu: ' + subtitlesMenuContext.currSubtitleId);

    // Part - process
    if (settingMenuContext.currMenu !== 'none') {
        destroySettingsMenu();
        settingMenuContext.currMenu = 'none';
    }

    if (subtitlesMenuContext.currMenu === 'none') {
        createSubtitlesMenu();
        subtitlesMenuContext.currMenu = 'main_menu';
    } else if (subtitlesMenuContext.currMenu === 'main_menu') {
        if (vopSettingsMenu.style.display === 'none') {
            vopSettingsMenu.style.display = 'block';
            var elem_child = vopPanelMenu.children;
            elem_child[0].focus();
        } else {
            vopSettingsMenu.style.display = 'none';
        }
    }
}

function onSettingClick() {
    printLog('+onSettingClick, currMenu: ' + settingMenuContext.currMenu);

    // Part - process
    if (subtitlesMenuContext.currMenu !== 'none') {
        destroySettingsMenu();
        subtitlesMenuContext.currMenu = 'none';
    }

    //
    if (settingMenuContext.currMenu === 'none') {
        createMainMenu();
        settingMenuContext.currMenu = 'main_menu';
    } else if (settingMenuContext.currMenu === 'main_menu') {
        if (vopSettingsMenu.style.display === 'none') {
            vopSettingsMenu.style.display = 'block';
            var elem_child = vopPanelMenu.children;
            elem_child[0].focus();
        } else {
            vopSettingsMenu.style.display = 'none';
        }
    } else if (settingMenuContext.currMenu === 'quality_menu' ||
        settingMenuContext.currMenu === 'audioTrack_menu') {
        destroySettingsMenu();
        settingMenuContext.currMenu = 'none';
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

    // update progress bar ui
    progressBarContext.movePos = getProgressMovePosition(e);
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
    e.preventDefault();
    releaseProgressBarMouseEvents();

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
    // update control bar ui
    if (flagIsLinearAd) {
        vopProgressBar.style.display = 'none';
        vopSettingsBtn.style.display = 'none';
    } else {
        var v = document.querySelector('.vop-ads-container');
        v.style.marginTop = '-' + (vopControlBar.clientHeight + 10).toString() + 'px';
    }
}

function onAdComplete() {
    printLog('onAdComplete, linear: ' + flagIsLinearAd);
    flagAdStarted = false;

    // update control bar ui
    vopProgressBar.style.display = 'block';
    vopSettingsBtn.style.display = 'inline-block';
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
        vopFullscreen.innerText = 'fullscreen_exit';
    } else {
        vopFullscreen.innerText = 'fullscreen';
    }
}

/////////////////////////////////////////////////////////////////////////
// Title: Dynamic create UI
function createSubtitlesMenu() {
// The subtitle menu html:
// <div class="vop-panel-header">
//     <button class="vop-panel-title" onclick="onSubitlesBack(event)">Subtitles</button>
// </div>
// <div class="vop-panel-menu">
//     <div class="vop-menuitem" role="menuitem" aria-checked="true">
//         <div class="vop-menuitem-label">
//             English
//         </div>
//         <div class="vop-menuitem-content">
//             <div class="vop-menuitem-toggle-checkbox">
//             </div>
//         </div>
//     </div>
//     <div class="vop-menuitem" role="menuitem" aria-checked="true">
//         <div class="vop-menuitem-label">
//             Svenska
//         </div>
//         <div class="vop-menuitem-content">
//             <div class="vop-menuitem-toggle-checkbox">
//             </div>
//         </div>
//     </div>
// </div>

    // Part - process, remove all children of vopPanelMenu
    destroySettingsMenu();

    // Part - input
    var header = document.createElement('div');
    header.setAttribute('class', 'vop-panel-header');

    var panelTitle = document.createElement('button');
    panelTitle.setAttribute('class', 'vop-panel-title');
    panelTitle.innerText = 'Subtitles';
    panelTitle.addEventListener('click', onSubitlesBack);
    panelTitle.setAttribute('role', 'plain');

    header.appendChild(panelTitle);

    // Part - input
    var firstMenuitem = null;
    for (var i = 0; i < subtitlesMenuContext.subtitleTracks.length; i ++) {
        var subtitleTrack = subtitlesMenuContext.subtitleTracks[i];

        var menuitem = document.createElement('div');
        menuitem.setAttribute('class', 'vop-menuitem');
        menuitem.setAttribute('role', 'menuitem');
        menuitem.setAttribute('tabindex', '0');
        if (subtitleTrack.id === subtitlesMenuContext.currSubtitleId) {
            menuitem.setAttribute('aria-checked', 'true');
        }

        var label = document.createElement('div');
        label.setAttribute('class', 'vop-menuitem-label');
        label.innerText = subtitleTrack.lang;

        var content = document.createElement('div');
        content.setAttribute('class', 'vop-menuitem-content');

        var checkBox = document.createElement('div');
        checkBox.setAttribute('class', 'vop-menuitem-toggle-checkbox');
        content.appendChild(checkBox);

        menuitem.appendChild(label);
        menuitem.appendChild(content);

        menuitem.dataset.id = subtitleTrack.id;
        menuitem.addEventListener('click', onSubtitleItemClick);
        menuitem.addEventListener('blur', onSubtitleItemBlur);

        if (firstMenuitem === null) {
            firstMenuitem = menuitem;
        }
        vopPanelMenu.appendChild(menuitem);
    }

    //
    vopPanel.insertBefore(header, vopPanelMenu);
    vopSettingsMenu.style.display = 'block';
    firstMenuitem.focus();
}

function updateSubtitlesMenuUI() {
    var children = vopPanelMenu.children;
    for (var i = 0; i < children.length; i ++) {
        var menuitem = children[i];

        var label = menuitem.querySelector('.vop-menuitem-label');
        if (menuitem.dataset.id === subtitlesMenuContext.currSubtitleId) {
            menuitem.setAttribute('aria-checked', 'true');
        } else {
            menuitem.removeAttribute('aria-checked');
        }
    }
}

function destroySettingsMenu() {
    var v = document.querySelector('.vop-panel-header');
    if (v) {
        vopPanel.removeChild(v);
    }

    while (vopPanelMenu.firstChild) {
        vopPanelMenu.removeChild(vopPanelMenu.firstChild);
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
//             <span class="vop-menuitem-content-text">360p</span>
//         </div>
//     </div>
//     <div class="vop-menuitem" role="menuitem" aria-haspopup="true" onclick="onAudioTrackMenuClick(event)">
//         <div class="vop-menuitem-label">
//             Language
//         </div>
//         <div class="vop-menuitem-content">
//             <span>Auto</span>
//             <span class="vop-menuitem-content-text">Bipbop1</span>
//         </div>
//     </div>
// </div>

    // Part - process, remove all children of vopPanelMenu
    destroySettingsMenu();

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

    if (settingMenuContext.isQualityAuto) {
        var spanAuto = document.createElement('span');
        spanAuto.innerText = 'Auto';

        content.appendChild(spanAuto);
    }

    var contentText = document.createElement('span');
    contentText.setAttribute('class', 'vop-menuitem-content-text');
    contentText.innerText = settingMenuContext.currQuality;
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

    if (settingMenuContext.isAudioTrackAuto) {
        var spanAuto = document.createElement('span');
        spanAuto.innerText = 'Auto';

        content.appendChild(spanAuto);
    }

    contentText = document.createElement('span');
    contentText.setAttribute('class', 'vop-menuitem-content-text');
    contentText.innerText = settingMenuContext.currAudioTrack;
    content.appendChild(contentText);

    audioMenuitem.appendChild(label);
    audioMenuitem.appendChild(content);

    audioMenuitem.addEventListener('click', onAudioTrackMenuClick);

    // Part post process
    vopPanelMenu.appendChild(qualityMenuitem);
    vopPanelMenu.appendChild(audioMenuitem);

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

    // Part - process, remove all children of vopPanelMenu
    destroySettingsMenu();

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
    for (var i = 0; i < settingMenuContext.qualityList.length; i ++) {
        var quality = settingMenuContext.qualityList[i].bitrate;

        var menuitem = document.createElement('div');
        menuitem.setAttribute('class', 'vop-menuitem');
        menuitem.setAttribute('role', 'menuitemradio');
        if (quality == settingMenuContext.currQuality) {
            menuitem.setAttribute('aria-checked', 'true');
        }
        menuitem.setAttribute('tabindex', '0');
        menuitem.addEventListener('blur', onMainMenuBlur);
        if (quality == settingMenuContext.currQuality) {
            focusItem = menuitem;
        }
        menuitem.addEventListener('click', onQualityItemClick);

        var label = document.createElement('div');
        label.setAttribute('class', 'vop-menuitem-label');
        label.innerText = quality;

        menuitem.appendChild(label);
        vopPanelMenu.appendChild(menuitem);
    }

    vopPanel.insertBefore(header, vopPanelMenu);
    vopSettingsMenu.style.display = 'block';
    focusItem.focus();
}

function updateQualityMenuUI() {
    var elem_child = vopPanelMenu.childNodes;
    for (var i = 0; i < elem_child.length; i ++) {
        var menuitem = elem_child[i];

        var label = menuitem.querySelector('.vop-menuitem-label');
        if (label.innerText === settingMenuContext.currQuality) {
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

    // Part - process, remove all children of vopPanelMenu
    destroySettingsMenu();

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
    for (var i = 0; i < settingMenuContext.audioTrackList.length; i ++) {
        var audioTrack = settingMenuContext.audioTrackList[i];

        var menuitem = document.createElement('div');
        menuitem.setAttribute('class', 'vop-menuitem');
        menuitem.setAttribute('role', 'menuitemradio');
        if (audioTrack == settingMenuContext.currAudioTrack) {
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
        vopPanelMenu.appendChild(menuitem);
    }

    vopPanel.insertBefore(header, vopPanelMenu);
    //
    vopSettingsMenu.style.display = 'block';
    focusItem.focus();
}

function updateAudioTrackMenuUI() {
    var elem_child = vopPanelMenu.childNodes;
    for (var i = 0; i < elem_child.length; i ++) {
        var menuitem = elem_child[i];

        var label = menuitem.querySelector('.vop-menuitem-label');
        if (label.innerText === settingMenuContext.currAudioTrack) {
            menuitem.setAttribute('aria-checked', 'true');
        } else {
            menuitem.setAttribute('aria-checked', 'false');
        }
    }
}

function onQualityMenuClick(e) {
    e.stopPropagation();
    printLog('+onQualityMenuClick: ' + e.target.innerText);

    destroySettingsMenu();
    createQualityMenu();
    settingMenuContext.currMenu = 'quality_menu';
}

function onAudioTrackMenuClick(e) {
    e.stopPropagation();

    destroySettingsMenu();
    createAudioTrackMenu();
    settingMenuContext.currMenu = 'audioTrack_menu';
}

function onMainMenuBlur(e) {
    var text = '';
    if (e.relatedTarget) {
        text = ', text: ' + e.relatedTarget.innerText;
    }
    
    printLog('+onMainMenuBlur, settingMenuContext.currMenu: ' + settingMenuContext.currMenu + text);

    if (e.relatedTarget) {
        if (e.relatedTarget === vopSettingsBtn) {
            if (settingMenuContext.currMenu === 'main_menu' ||
                settingMenuContext.currMenu === 'quality_menu' ||
                settingMenuContext.currMenu === 'audioTrack_menu') {
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

function onSubtitleItemClick(e) {
    e.stopPropagation();

    var id = e.currentTarget.dataset.id;
    if (subtitlesMenuContext.currSubtitleId === id) {
        subtitlesMenuContext.currSubtitleId = -1;
    } else {
        subtitlesMenuContext.currSubtitleId = id;
    }

    console.log('id: ' + id);
    updateSubtitlesMenuUI();
}

function onSubtitleItemBlur(e) {
    if (e.relatedTarget) {
        if (e.relatedTarget === vopSubtitlesBtn) {
            if (subtitlesMenuContext.currMenu === 'main_menu') {
                // do nothing
            }
        }
    } else {
        onSubtitlesClick();
    }
}

function onSubitlesBack(e) {
    printLog('+onSubitlesBack');
}

function onQualityBack(e) {
    e.stopPropagation();

    destroySettingsMenu();
    createMainMenu();
    settingMenuContext.currMenu = 'main_menu';
}

function onQualityItemClick(e) {
    printLog('onQualityItemClick, settingMenuContext.currMenu: ' + settingMenuContext.currMenu
        + ', text: ' + e.target.innerText);
    e.stopPropagation();

    settingMenuContext.currQuality = e.target.innerText;
    updateQualityMenuUI();
}

function onAudioTrackBack(e) {
    e.stopPropagation();

    destroySettingsMenu();
    createMainMenu();
    settingMenuContext.currMenu = 'main_menu';
}

function onAudioTrackItemClick(e) {
    e.stopPropagation();

    settingMenuContext.currAudioTrack = e.target.innerText;
    updateAudioTrackMenuUI();
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











