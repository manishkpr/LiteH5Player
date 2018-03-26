//
var browserInfo;

var cfg_ = getInitConfig();
var mediaCfg_ = getMediaInfo();
//

var playerUI = {};

playerUI.initVariable = function () {

this.player_ = null;
this.castSender = null;

this.flagPlayerInited = false;

// UI Controls
this.vopH5Player = null;
this.vopTooltip = null;
this.vopTooltipBg = null;
this.vopTooltipText = null;
this.vopControlBar = null;
this.vopProgressBar = null;
this.vopLoadProgress = null;
this.vopPlayProgress = null;
this.vopHoverProgress = null;
this.vopScrubberContainer = null;
this.vopPlayButton = null;
this.vopMuteButton = null;
this.vopVolumeSlider = null;
this.vopVolumeSliderHandle = null;

this.vopSubtitlesBtn;
this.vopSettingsBtn;
this.vopSettingsMenu;
this.vopPanel;
this.vopPanelMenu;
this.vopFullscreen;
this.vopSpinner;
this.uiGiantBtnContainer;

this.uiConsole = null;

// UI Data
this.metaWidth;
this.metaHeight;

this.colorList_contentProgress = ['red', 'rgb(133,133,133)', 'rgb(52,51,52)'];
this.colorList_adProgress = ['orange', 'rgba(192,192,192,0.3)'];
this.colorList_volume = ['#ccc', 'rgba(192,192,192,0.3)'];

// flag
this.timerHideControlBar;

// flags reference variable of progress bar
this.progressBarContext = {
    mousedown: false,
    pausedBeforeMousedown: false,
    endedBeforeMousedown: false,
    posBeforeMousedown: 0,
    timer: null,
    //
    movePos: 0
};
this.flagThumbnailMode = false;

// flags reference variable of volume bar
this.flagVolumeSliderMousedown = false;
this.valueVolumeMovePosition = 0;

// menu context
this.subtitlesMenuContext = {
    currMenu: 'none',

    subtitleTracks: [{
            id: '1',
            lang: 'English'
        }, {
            id: '2',
            lang: 'France'
        }, {
            id: '3',
            lang: 'Chinese'
        }, {
            id: '4',
            lang: '444'
        }, {
            id: '5',
            lang: '5555'
        }, {
            id: '6',
            lang: '666'
        }, {
            id: '7',
            lang: '777'
        }
    ],

    currSubtitleId: ''
};

this.settingMenuContext = {
    currMenu: 'none',   // none, main_menu, quality_menu, audio_track_menu, fcc_menu, fcc_property_menu

    // quality settings
    qualityList: [{
            id: 5,
            bitrate: '1080p'
        }, {
            id: 4,
            bitrate: '720p'
        }, {
            id: 3,
            bitrate: '480p'
        }, {
            id: 2,
            bitrate: '360p'
        }, {
            id: 1,
            bitrate: '240p'
        }, {
            id: 0,
            bitrate: '144p'
        }, {
            id: null,
            bitrate: 'Auto'
        }
    ],
    isQualityAuto: true,
    currQuality: '360p',

    // audio track settings
    audioTrackList: ['Bipbop1', 'Bipbop2'],
    isAudioTrackAuto: true,
    currAudioTrack: 'Bipbop1',

    // FCC settings
    isEnableFCC: true,
    fccProperties: [{
            // white/black(default)/red/green/blue/yellow/magenta/cyan
            name: 'background_color',
            values: ['white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
            currValue: 'black'
        }, {
            name: 'background_opacity',
            values: ['0%', '25%', '50%', '75%', '100%'],
            currValue: '100%'
        }, {
            // white/black(default)/red/green/blue/yellow/magenta/cyan
            name: 'font_color',
            values: ['white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
            currValue: 'black'
        }, {
            name: 'font_opacity',
            values: ['0%', '25%', '50%', '75%', '100%'],
            currValue: '100%'
        }, {
            // Arial(default)/Courier/Times New Roman/Helvetica/Dom/Coronet/Gothic
            name: 'font_family',
            values: ['Arial', 'Courier', 'Times New Roman', 'Helvetica', 'Dom', 'Coronet', 'Gothic'],
            currValue: 'Arial'
        }, {
            // none/dropshadow/raised(default)/depressed/uniform
            name: 'font_edge_type',
            values: ['none', 'leftDropShadow', 'rightDropShadow', 'raised', 'depressed', 'uniform'],
            currValue: 'none'
        }, {
            // white/black/red/green/blue(default)/yellow/magenta/cyan
            name: 'font_edge_color',
            values: ['white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
            currValue: 'black'
        }, {
            name: 'font_edge_opacity',
            values: ['0%', '25%', '50%', '75%', '100%'],
            currValue: '100%'
        }, {
            name: 'font_size',
            values: ['50%', '75%', '100%', '150%', '200%', '300%', '400%'],
            currValue: '100%'
        }, {
            name: 'font_bold',
            values: ['true', 'false'],
            currValue: 'false'
        }, {
            name: 'font_underline',
            values: ['true', 'false'],
            currValue: 'false'
        }, {
            name: 'font_italic',
            values: ['true', 'false'],
            currValue: 'false'
        }, {
            // white/black/red/green/blue(default)/yellow/magenta/cyan
            name: 'window_color',
            values: ['white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
            currValue: 'green'
        }, {
            name: 'window_color_opacity',
            values: ['0%', '25%', '50%', '75%', '100%'],
            currValue: '50%'
        }, {
            name: 'bounding_box',
            values: ['Left', 'Top', 'Right', 'Bottom'],
            currValue: 'Left'
        }, {
            name: 'horizontal_position',
            values: ['left', 'center', 'right'],
            currValue: 'left'
        }, {
            name: 'vertical_position',
            values: ['top', 'middle', 'bottom'],
            currValue: 'top'
        }
    ]
};

// reference variable of ad
this.flagAdStarted = false;
this.flagIsLinearAd = false;
}

// Title: init part
playerUI.initUI = function () {
    this.vopH5Player = document.querySelector('.html5-video-player');

    this.vopTooltip = document.querySelector('.vop-tooltip');
    this.vopTooltipBg = document.querySelector('.vop-tooltip-bg');
    this.vopTooltipText = document.querySelector('.vop-tooltip-text');

    this.vopControlBar = document.querySelector('.vop-control-bar');
    this.vopProgressBar = document.querySelector('.vop-progress-bar');
    this.vopLoadProgress = document.querySelector('.vop-load-progress');
    this.vopPlayProgress = document.querySelector('.vop-play-progress');
    this.vopHoverProgress = document.querySelector('.vop-hover-progress');

    this.vopScrubberContainer = document.querySelector('.vop-scrubber-container');
    this.vopPlayButton = document.querySelector('.vop-play-button');
    this.vopMuteButton = document.querySelector('.vop-mute-button');
    this.vopVolumeSlider = document.querySelector('.vop-volume-slider');
    this.vopVolumeSliderHandle = document.querySelector('.vop-volume-slider-handle');

    this.uiConsole = document.getElementById('idConsole');

    this.vopSubtitlesBtn = document.querySelector('.vop-subtitles-button');
    this.vopSettingsBtn = document.querySelector('.vop-settings-button');
    this.vopFullscreen = document.querySelector('.vop-fullscreen-button');

    // setting panel
    this.vopSettingsMenu = document.querySelector('.vop-settings-menu');
    this.vopPanel = this.vopSettingsMenu.querySelector('.vop-panel');
    this.vopPanelMenu = this.vopSettingsMenu.querySelector('.vop-panel-menu');

    this.vopSpinner = document.querySelector('.vop-spinner');

    this.uiGiantBtnContainer = document.querySelector('.vop-giant-button-container');
};

playerUI.initUIEventListeners = function () {
    this.vopH5Player.addEventListener('mouseenter', this.onPlayerMouseenter.bind(this));
    this.vopH5Player.addEventListener('mousemove', this.onPlayerMousemove.bind(this));
    this.vopH5Player.addEventListener('mouseleave', this.onPlayerMouseleave.bind(this));

    this.vopH5Player.addEventListener('click', this.onPlayerClick.bind(this));

    this.vopProgressBar.addEventListener('mousedown', this.onProgressBarMousedown.bind(this));
    this.vopProgressBar.addEventListener('mousemove', this.onProgressBarMousemove.bind(this));
    this.vopProgressBar.addEventListener('mouseleave', this.onProgressBarMouseleave.bind(this));

    this.vopControlBar.addEventListener('click', this.onChromeBottomClick.bind(this));
    this.vopPlayButton.addEventListener('click', this.onBtnPlay.bind(this));
    this.vopMuteButton.addEventListener('click', this.onBtnMute.bind(this));
    this.vopVolumeSlider.addEventListener('mousedown', this.onVolumeSliderMousedown.bind(this));
    this.vopSubtitlesBtn.addEventListener('click', this.onSubtitlesClick.bind(this));
    this.vopSettingsBtn.addEventListener('click', this.onSettingClick.bind(this));
    this.vopFullscreen.addEventListener('click', this.onFullscreenClick.bind(this));

    this.vopPlayButton.addEventListener('mousemove', this.onControlMousemove.bind(this));
    this.vopMuteButton.addEventListener('mousemove', this.onControlMousemove.bind(this));
    this.vopSubtitlesBtn.addEventListener('mousemove', this.onControlMousemove.bind(this));
    this.vopSettingsBtn.addEventListener('mousemove', this.onControlMousemove.bind(this));
    this.vopFullscreen.addEventListener('mousemove', this.onControlMousemove.bind(this));
    this.vopVolumeSlider.addEventListener('mousemove', this.onControlMousemove.bind(this));

    // don't route 'click' event from panel to its parent div
    this.vopPanel.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    this.uiGiantBtnContainer.addEventListener('click', function (e) {
        e.stopPropagation();
        this.onPlayFromGiantButton();
    }.bind(this));

    // resize listener
    //if (window.ResizeObserver) {
    if (false) {
        function onPlayerSize(entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                const cr = entry.contentRect;
                const cWidth = entry.target.clientWidth;
                const cHeight = entry.target.clientHeight;

                this.player_.resize(cWidth, cHeight);
            }
        }
        var ro = new ResizeObserver(onPlayerSize.bind(this));

        // Observer one or multiple elements
        var v = document.querySelector('.html5-video-player');
        ro.observe(v);
    } else {
        var v = document.querySelector('.html5-video-player');
        new ResizeSensor(v, function () {
            printLog(('ResizeSensor, Width: ' + v.clientWidth + ', Height: ' + v.clientHeight));
            this.updateProgressBarUI();
            this.player_.resize(v.clientWidth, v.clientHeight);
        }.bind(this));
    }
};

playerUI.initPlayer = function () {
    this.player_ = new oldmtn.Player('player-container');
    this.player_.init(cfg_);

    this.player_.on(oldmtn.Events.MEDIA_CANPLAY, this.onMediaCanPlay.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_DURATION_CHANGED, this.onMediaDurationChanged.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_ENDED, this.onMediaEnded.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_LOADEDDATA, this.onMediaLoadedData.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_LOADEDMETADATA, this.onMediaLoadedMetaData.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_PAUSED, this.onMediaPaused.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_PLAYING, this.onMediaPlaying.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_SEEKING, this.onMediaSeeking.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_SEEKED, this.onMediaSeeked.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_TIMEUPDATE, this.onMediaTimeupdated.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged.bind(this), {});
    this.player_.on(oldmtn.Events.MEDIA_WAITING, this.onMediaWaiting.bind(this), {});

    this.player_.on(oldmtn.Events.LOG, this.onLog.bind(this), {});

    // ad callback event
    this.player_.on(oldmtn.Events.AD_STARTED, this.onAdStarted.bind(this), {});
    this.player_.on(oldmtn.Events.AD_COMPLETE, this.onAdComplete.bind(this), {});
    this.player_.on(oldmtn.Events.AD_TIMEUPDATE, this.onAdTimeUpdate.bind(this), {});

    //
    this.player_.on(oldmtn.Events.FULLSCREEN_CHANGE, this.onFullscreenChanged.bind(this), {});

    // chrome cast part
    var receiverAppId = 'E19ACDB8'; // joseph test app1
    //var receiverAppId = 'CBEF8A9C'; // joseph, css.visualon.info
    //var receiverAppId = 'FAC6871E'; // joseph, css.visualon.info

    // init chromecast sender
    //this.castSender = new oldmtn.CastSender(receiverAppId);
};

playerUI.loadThumbnail = function (url) {
    this.player_.loadThumbnail(url);
};

///////////////////////////////////////////////////////////////////////////
// Title: UI reference functions
playerUI.startWaitingUI = function () {
    this.vopSpinner.style.display = 'block';
}

playerUI.stopWaitingUI = function () {
    this.vopSpinner.style.display = 'none';
}

// begin progress bar
playerUI.updateVolumeMovePosition = function (e) {
    // part - input
    var rect = this.vopVolumeSlider.getBoundingClientRect();

    // part - logic process
    var offsetX = e.clientX - rect.left;
    if (offsetX < 0) {
        offsetX = 0;
    } else if (offsetX + this.vopVolumeSliderHandle.clientWidth > rect.width) {
        offsetX = rect.width;
    }

    // update time progress scrubber button
    this.valueVolumeMovePosition = (offsetX / rect.width) * 1.0;
};

playerUI.getProgressMovePosition = function (e) {
    // part - input
    var rect = this.vopProgressBar.getBoundingClientRect();

    // part - logic process
    var offsetX = e.clientX - rect.left;
    if (offsetX < 0) {
        offsetX = 0;
    } else if (offsetX > rect.width) {
        offsetX = rect.width;
    }

    // update time progress scrubber button
    var duration = this.player_.getDuration();
    return (offsetX / rect.width) * duration;
};

playerUI.updateProgressBarUI = function () {
    // part - input
    var position = this.player_.getPosition();
    var duration = this.player_.getDuration();
    var paused = this.player_.isPaused();
    var ended = this.player_.isEnded();

    // part - logic process
    var isLive = (duration === Infinity) ? true : false;
    if (isLive) {
        var seekable = this.player_.getSeekableRange();
        var buffered = this.player_.getBufferedRanges();
        console.log('seekable: ' + TimeRangesToString(seekable));
        console.log('buffered: ' + TimeRangesToString(buffered));

        // update time display label
        var tDisplay = document.querySelector('.vop-time-text');
        tDisplay.innerText = 'Live';
    } else {
        var uiPosition;
        var uiBufferedPos;
        if (this.progressBarContext.mousedown) {
            uiPosition = this.progressBarContext.movePos;
        } else {
            uiPosition = position;
        }

        // part - output, update ui
        // update time progress bar
        uiBufferedPos = this.player_.getValidBufferPosition(uiPosition);
        this.vopLoadProgress.style.transform = 'scaleX(' + uiBufferedPos / duration + ')';
        this.vopPlayProgress.style.transform = 'scaleX(' + uiPosition / duration + ')';

        // update time progress scrubber button
        this.vopScrubberContainer.style.transform = 'translateX(' + ((uiPosition / duration) * this.vopProgressBar.clientWidth).toString() + 'px)';

        // update time display label
        var c = oldmtn.CommonUtils.timeToString(uiPosition);
        var d = oldmtn.CommonUtils.timeToString(duration);
        var fmtTime = c + '/' + d;
        var tDisplay = document.querySelector('.vop-time-text');
        tDisplay.innerText = fmtTime;
    }
};

playerUI.updateProgressBarHoverUI = function () {
    var position = this.player_.getPosition();
    var duration = this.player_.getDuration();

    if (this.progressBarContext.movePos <= position || this.progressBarContext.mousedown) {
        this.vopHoverProgress.style.transform = 'scaleX(0)';
    } else {
        var rect = this.vopProgressBar.getBoundingClientRect();
        var offsetX = (position / duration) * rect.width;
        this.vopHoverProgress.style.left = offsetX + 'px';
        this.vopHoverProgress.style.transform = 'scaleX(' + (this.progressBarContext.movePos - position) / duration + ')';
    }
};

playerUI.updateTooltipUI = function (e) {
    let thumbnail = this.player_.getThumbnail(this.progressBarContext.movePos);
    var tooltipWidth = 0;
    function getTooltipOffsetX(e) {
        // part - input
        // bounding client rect can return the progress bar's rect relative to current page.
        var rect = this.vopProgressBar.getBoundingClientRect();
        var leftMin = 12;
        var rightMax = 12 + rect.width;

        // part - logic process
        var offsetToProgressBar = (e.clientX - rect.left);
        var offsetToVideo = offsetToProgressBar + 12;

        var tooltipLeft_RelativeToVideo = offsetToVideo - tooltipWidth / 2;
        var tooltipRight_RelativeToVideo = offsetToVideo + tooltipWidth / 2;

        if (tooltipLeft_RelativeToVideo < leftMin) {
            tooltipLeft_RelativeToVideo = leftMin;
        } else if (tooltipRight_RelativeToVideo > rightMax) {
            tooltipLeft_RelativeToVideo = rightMax - tooltipWidth;
        }

        return tooltipLeft_RelativeToVideo;
    }

    if (thumbnail) {
        $('.vop-tooltip').addClass('vop-preview');
        if (thumbnail) {
            printLog('thumbnail info: ', thumbnail);
            var isSprite = (thumbnail.data.w && thumbnail.data.h);
            if (isSprite) {
            this.vopTooltipBg.style.width = thumbnail.data.w.toString() + 'px';
            this.vopTooltipBg.style.height = thumbnail.data.h.toString() + 'px';
            this.vopTooltipBg.style.background = 'url(' + thumbnail.data.url + ')'
                + ' -' + thumbnail.data.x.toString() + 'px'
                + ' -' + thumbnail.data.y.toString() + 'px';
            } else {
                this.vopTooltipBg.style.width = '158px';
                this.vopTooltipBg.style.height = '90px';
                this.vopTooltipBg.style.background = 'url(' + thumbnail.data.url + ') no-repeat';
                this.vopTooltipBg.style.backgroundSize = '100% 100%';
            }
        } else {
            this.vopTooltipBg.style.width = '158px';
            this.vopTooltipBg.style.height = '90px';
            this.vopTooltipBg.style.background = 'url("https://i9.ytimg.com/sb/pQ9eej56xbU/storyboard3_L2/M1.jpg?sigh=rs%24AOn4CLDgQvL4F2LQ1qWeY-hwNqbP3xWkPw") -180px -0px';
        }

        tooltipWidth = $('.vop-preview').innerWidth();
    } else {
        $('.vop-tooltip').removeClass('vop-preview');
        tooltipWidth = 60;
    }

    // update tooltip offset
    var strTime = timeToString(this.progressBarContext.movePos);
    this.vopTooltipText.innerText = strTime;

    var offsetX = getTooltipOffsetX.call(this, e);
    this.vopTooltip.style.left = offsetX.toString() + 'px';
    this.vopTooltip.style.display = 'block';
};

playerUI.updateAdProgressUI = function () {
    var position = this.player_.getPosition();
    var duration = this.player_.getDuration();

    // update time progress bar
    this.vopPlayProgress.style.transform = 'scaleX(' + position / duration + ')';

    // update time display label
    var c = oldmtn.CommonUtils.timeToString(position);
    var d = oldmtn.CommonUtils.timeToString(duration);
    var fmtTime = c + '/' + d;

    var tDisplay = document.querySelector('.vop-time-text');
    tDisplay.innerText = fmtTime;
};

playerUI.updatePlayBtnUI = function (paused, ended) {
    if (ended) {
        this.vopPlayButton.innerText = 'replay';
    } else {
        if (paused) {
            this.vopPlayButton.innerText = 'play_arrow';
        } else {
            this.vopPlayButton.innerText = 'pause';
        }
    }
};

playerUI.updateContentVolumeBarUI = function (muted, volume) {
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

        var vLeft = (volume / 1) * this.vopVolumeSlider.clientWidth;
        if (vLeft + this.vopVolumeSliderHandle.clientWidth > this.vopVolumeSlider.clientWidth) {
            vLeft = this.vopVolumeSlider.clientWidth - this.vopVolumeSliderHandle.clientWidth;
        }

        uiVolumeHandleLeft = vLeft.toString() + 'px';
    }

    // update muted button
    this.vopMuteButton.innerText = uiMutedIcon;
    // update volume slider background
    this.vopVolumeSlider.style.background = genGradientColor(uiVolumeList, this.colorList_volume);
    // update volume slider handle
    this.vopVolumeSliderHandle.style.left = uiVolumeHandleLeft;
};

///////////////////////////////////////////////////////////////////////////
// Title: Tool function
playerUI.removeAutohideAction = function () {
    $('.html5-video-player').removeClass('vop-autohide');
    if (this.timerHideControlBar) {
        clearTimeout(this.timerHideControlBar);
        this.timerHideControlBar = null;
    }
};

playerUI.docVolumeSliderMousemove = function (e) {
    this.updateVolumeMovePosition(e);

    var muted = this.player_.isMuted();
    var volume = this.valueVolumeMovePosition;
    if (volume === 0) {}
    else {
        if (muted === true) {
            this.player_.unmute();
        }

        muted = false;
    }

    this.player_.setVolume(this.valueVolumeMovePosition);

    this.updateContentVolumeBarUI(muted, volume);
};

playerUI.docVolumeSliderMouseup = function (e) {
    printLog('+docVolumeSliderMouseup');
    this.releaseVolumeSliderMouseEvents();
    e.preventDefault();

    this.flagVolumeSliderMousedown = false;

    // if mouse up out of 'vop-shade', hide control bar directly
    var pt = {
        x: e.clientX,
        y: e.clientY
    };
    if (!isPtInElement(pt, this.vopH5Player)) {
        this.onPlayerMouseleave();
    }
};

playerUI.captureVolumeSliderMouseEvents = function () {
    playerUI.newVolumeSliderMousemove = this.docVolumeSliderMousemove.bind(this);
    playerUI.newVolumeSliderMouseup = this.docVolumeSliderMouseup.bind(this);

    document.addEventListener('mousemove', playerUI.newVolumeSliderMousemove, true);
    document.addEventListener('mouseup', playerUI.newVolumeSliderMouseup, true);
};

playerUI.releaseVolumeSliderMouseEvents = function () {
    document.removeEventListener('mousemove', playerUI.newVolumeSliderMousemove, true);
    document.removeEventListener('mouseup', playerUI.newVolumeSliderMouseup, true);
};

///////////////////////////////////////////////////////////////////
playerUI.onPlayerMouseenter = function () {
    // don't show control bar if the stream is not initialized.
    if (!this.flagPlayerInited) {
        return;
    }

    $('.html5-video-player').removeClass('vop-autohide');
};

playerUI.onPlayerMousemove = function (e) {
    //printLog('+onPlayerMousemove');
    // don't show control bar if the stream is not initialized.
    if (!this.flagPlayerInited) {
        return;
    }

    this.removeAutohideAction();
    this.timerHideControlBar = setTimeout(function () {
        this.onPlayerMouseleave();
    }.bind(this), 3000);
};

playerUI.onPlayerMouseleave = function () {
    var paused = this.player_.isPaused();
    var fullscreen = isFullscreen();
    if (!paused && !this.progressBarContext.mousedown && !this.flagVolumeSliderMousedown && !fullscreen) {
        $('.html5-video-player').addClass('vop-autohide');
    }
};

playerUI.onPlayerClick = function () {
    if (this.flagAdStarted && this.flagIsLinearAd) {
        return;
    }

    this.onBtnPlay();
};

// browser & UI callback functions
playerUI.onBtnOpen = function () {
    this.player_.open(mediaCfg_);
};

playerUI.onBtnClose = function () {
    printLog('+onBtnClose');
    this.player_.close();
    printLog('-onBtnClose');
};

playerUI.onBtnPlay = function () {
    var currPaused = this.player_.isPaused();
    var currEnded = this.player_.isEnded();
    if (currEnded) {
        this.progressBarContext.pausedBeforeMousedown = true;
        this.progressBarContext.endedBeforeMousedown = true;
        this.player_.setPosition(0);
    } else {
        var newPaused;
        // execute ui cmd
        if (currPaused) {
            this.player_.play();

            newPaused = false;
        } else {
            this.player_.pause();

            newPaused = true;
        }

        // update ui
        this.updatePlayBtnUI(newPaused, currEnded);
    }
};

playerUI.onControlMousemove = function (e) {
    e.stopPropagation();
    this.removeAutohideAction();
};

playerUI.onChromeBottomClick = function (e) {
    e.stopPropagation();
};

playerUI.onBtnMute = function () {
    var muted = this.player_.isMuted();
    var volume = this.player_.getVolume();

    if (volume === 0) {
        if (muted) {
            this.player_.unmute();
            muted = false;
        }

        // If the this.player_ is muted, and volume is 0,
        // in this situation, we will restore volume to 0.2
        volume = 0.1;
        this.player_.setVolume(volume);
    } else {
        if (muted) {
            this.player_.unmute();
            muted = false;
        } else {
            this.player_.mute();
            muted = true;
        }
    }
    this.updateContentVolumeBarUI(muted, volume);
};

playerUI.onBtnManualSchedule = function () {
    this.player_.manualSchedule();
};

playerUI.onBtnInitAD = function () {
    this.player_.test();
};

playerUI.onBtnDelAll = function () {
    this.player_.dellAll();
};

playerUI.onBtnStop = function () {
    this.player_.close();
    this.player_ = null;
}

playerUI.onPlayButtonClickAd = function () {
    if (this.player_) {
        this.player_.playAd();
    }
}

playerUI.onSubtitlesClick = function () {
    printLog('+onSubtitlesClick, currMenu: ' + this.subtitlesMenuContext.currSubtitleId);

    // Part - process
    if (this.settingMenuContext.currMenu !== 'none') {
        this.destroySettingsMenu();
    }

    if (this.subtitlesMenuContext.currMenu === 'none') {
        this.createSubtitlesMenu();
    } else if (this.subtitlesMenuContext.currMenu === 'main_menu') {
        if (this.vopSettingsMenu.style.display === 'none') {
            this.vopSettingsMenu.style.display = 'block';
            var elem_child = this.vopPanelMenu.children;
            elem_child[0].focus();
        } else {
            this.vopSettingsMenu.style.display = 'none';
        }
    }
};

playerUI.onSettingClick = function () {
    printLog('+onSettingClick, currMenu: ' + this.settingMenuContext.currMenu);

    // Part - process
    if (this.subtitlesMenuContext.currMenu !== 'none') {
        this.destroySettingsMenu();
    }

    // Part - process setting event
    if (this.settingMenuContext.currMenu === 'none') {
        this.createMainMenu();
    } else if (this.settingMenuContext.currMenu === 'main_menu') {
        if (this.vopSettingsMenu.style.display === 'none') {
            this.vopSettingsMenu.style.display = 'block';
            var elem_child = this.vopPanelMenu.children;
            elem_child[0].focus();
        } else {
            this.vopSettingsMenu.style.display = 'none';
        }
    } else if (this.settingMenuContext.currMenu === 'quality_menu' ||
        this.settingMenuContext.currMenu === 'audio_track_menu' ||
        this.settingMenuContext.currMenu === 'fcc_menu' ||
        this.settingMenuContext.currMenu === 'fcc_property_menu') {
        this.destroySettingsMenu();
    }
};

playerUI.onFullscreenClick = function () {
    printLog('+onBtnFullscreen');
    if (isFullscreen()) {
        h5LeaveFullscreen();
    } else {
        h5EnterFullscreen();
    }
};

playerUI.onPlayFromGiantButton = function () {
    this.onBtnPlay();
    this.uiGiantBtnContainer.style.display = 'none';
};

playerUI.onBtnSeek = function () {
    var time = document.getElementById('seekedTime').value;
    this.player_.setPosition(time);
};

playerUI.onBtnAddTextTrack = function () {
    if (this.player_) {
        this.player_.addTextTrack();
    }
};

playerUI.onBtnRemoveTextTrack = function () {
    this.player_.removeTextTrack();
};

playerUI.setTextTrackHidden = function () {
    this.player_.setTextTrackHidden();
};

playerUI.setCueAlign = function (align) {
    this.player_.setCueAlign(align);
};

playerUI.onFruitClick = function () {
    alert('aaaa');
};

playerUI.onBtnTest = function () {
    // if (this.player_) {
    //   //this.player_.signalEndOfStream();
    // }
    // if (this.player_) {
    this.player_.test();
    // }

    //startWaitingUI();
    // var v = document.querySelector('.vop-control-bar');
    // v.setAttribute('aria-hidden', false);

    // var v = document.querySelector('.ytp-play-button');
    // var v1 = v.querySelector('.ytp-svg-fill');
    // v1.setAttribute('d', 'M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z');


    // if (this.player_) {
    //   this.player_.mute();
    // }

    //this.player_.test();
};

playerUI.onBtnTest2 = function () {
    printLog('--onBtnTest2--');
    this.player_.test2();

    //this.player_.resize(1024, 768);
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
};

playerUI.onBtnAttribute = function () {
    //this.player_.attribute();
};

//
playerUI.onUICmdCastInit = function () {
    var cfg = getInitConfig();
    this.castSender.new_init(cfg);
}

playerUI.onUICmdCastOpen = function () {
    var info = getMediaInfo();
    this.castSender.new_open(info);
}

playerUI.onUICmdCastAddV = function () {
    this.castSender.new_addV();
}

playerUI.onUICmdCastAddPD = function () {
    this.castSender.new_addPD();
}

playerUI.onUICmdCastPlay = function () {
    this.castSender.new_play();
}

playerUI.onUICmdCastPause = function () {
    this.castSender.new_pause();
}

playerUI.onUICmdCastPlayAd = function () {
    this.castSender.new_playAd();
}

playerUI.onUICmdCastTest = function () {
    this.castSender.new_test();
}

playerUI.doEnterThumbnailMode = function () {
    printLog('+doEnterThumbnailMode');
    if (!this.flagThumbnailMode) {
        // need to pause content first before starting a seek operation.
        if (!this.progressBarContext.pausedBeforeMousedown) {
            this.player_.pause();

            var paused = true;
            var ended = this.player_.isEnded();
            this.updatePlayBtnUI(paused, ended);
        }

        this.progressBarContext.timer = null;
        this.flagThumbnailMode = true;
    }
}

playerUI.doProcessThumbnailMove = function () {
    // for further action, you can add thumbnail popup here.
}

playerUI.doProcessThumbnailUp = function () {
    // for further action, you can add thumbnail ended event here.
}

playerUI.onProgressBarMousedown = function (e) {
    printLog('+onProgressBarMousedown');
    this.captureProgressBarMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    this.progressBarContext.mousedown = true;
    this.progressBarContext.pausedBeforeMousedown = this.player_.isPaused();
    this.progressBarContext.endedBeforeMousedown = this.player_.isEnded();
    this.progressBarContext.posBeforeMousedown = this.player_.getPosition();
    this.flagThumbnailMode = false;
    this.progressBarContext.timer = setTimeout(function () {
            this.doEnterThumbnailMode();
        }.bind(this), 200);

    // update progress bar ui
    this.progressBarContext.movePos = this.getProgressMovePosition(e);
    this.updateProgressBarUI();
    this.updateProgressBarHoverUI();
}

playerUI.onProgressBarMousemove = function (e) {
    //printLog('+onProgressBarMousemove');
    e.stopPropagation();
    this.removeAutohideAction();

    // if mouse down, just return
    if (this.progressBarContext.mousedown) {
        return;
    }

    // update progress bar ui
    this.progressBarContext.movePos = this.getProgressMovePosition(e);
    this.updateProgressBarHoverUI();
    this.updateTooltipUI(e);
}

playerUI.onProgressBarMouseleave = function () {
    printLog('+onProgressBarMouseleave');
    this.vopTooltip.style.display = 'none';
}

playerUI.captureProgressBarMouseEvents = function () {
    playerUI.newProgressBarMousemove = this.docProgressBarMousemove.bind(this);
    playerUI.newProgressBarMouseup = this.docProgressBarMouseup.bind(this);

    document.addEventListener('mousemove', playerUI.newProgressBarMousemove, true);
    document.addEventListener('mouseup', playerUI.newProgressBarMouseup, true);
}

playerUI.releaseProgressBarMouseEvents = function () {
    document.removeEventListener('mousemove', playerUI.newProgressBarMousemove, true);
    document.removeEventListener('mouseup', playerUI.newProgressBarMouseup, true);
}

playerUI.docProgressBarMousemove = function (e) {
    printLog('+docProgressBarMousemove');

    var movePos = this.getProgressMovePosition(e);
    if (this.progressBarContext.movePos === movePos) {
        return;
    }

    this.doEnterThumbnailMode();
    this.doProcessThumbnailMove();

    this.progressBarContext.movePos = movePos;
    this.updateProgressBarUI();
    this.updateProgressBarHoverUI();
}

playerUI.docProgressBarMouseup = function (e) {
    printLog('+docProgressBarMouseup');
    e.preventDefault();
    this.releaseProgressBarMouseEvents();

    if (this.flagThumbnailMode) {
        // thumbnail mode click event
        this.doProcessThumbnailUp();
    } else {
        // plain click event
        if (this.progressBarContext.timer) {
            // it's quick click, don't need to pause
            clearTimeout(this.progressBarContext.timer);
            this.progressBarContext.timer = null;
        }
    }

    // update ui first
    this.progressBarContext.movePos = this.getProgressMovePosition(e);
    this.updateProgressBarUI();
    this.updateProgressBarHoverUI();

    if (this.progressBarContext.posBeforeMousedown != this.progressBarContext.movePos) {
        this.player_.setPosition(this.progressBarContext.movePos);
    }

    this.progressBarContext.mousedown = false;
}

playerUI.onVolumeSliderMousedown = function (e) {
    printLog('+onVolumeSliderMousedown');
    this.captureVolumeSliderMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    this.flagVolumeSliderMousedown = true;

    this.docVolumeSliderMousemove(e);
}

////////////////////////////////////////////////////////////////////////////////////
// this.player_ event callback
playerUI.onMediaCanPlay = function () {
    if (!this.flagPlayerInited) {
        this.flagPlayerInited = true;

        this.updateProgressBarUI();
        this.vopControlBar.style.display = 'block';

        // process config parameter
        if (cfg_.autoplay) {
            this.onPlayFromGiantButton();
        }
    }
}

playerUI.onMediaDurationChanged = function () {
    this.updateProgressBarUI();
}

playerUI.onMediaEnded = function () {
    var paused = this.player_.isPaused();
    var ended = this.player_.isEnded();
    this.updatePlayBtnUI(paused, ended);

    //
    this.progressBarContext.movePos = this.player_.getPosition();
    this.updateProgressBarUI();

    //
    $('.html5-video-player').removeClass('vop-autohide');
}

playerUI.onMediaLoadedData = function () {
    // update volume here
    var muted = this.player_.isMuted();
    var volume = this.player_.getVolume();

    this.updateContentVolumeBarUI(muted, volume);
}

playerUI.onMediaLoadedMetaData = function (e) {
    // update external div's dimensions
    this.metaWidth = e.width;
    this.metaHeight = e.height;

    var vp = document.querySelector('.player');
    vp.style.paddingBottom = ((this.metaHeight / this.metaWidth) * 100).toString() + '%';

    printLog('vp.clientWidth: ' + vp.clientWidth);
    printLog('vp.clientHeight: ' + vp.clientHeight);
    this.player_.resize(vp.clientWidth, vp.clientHeight);
}

playerUI.onMediaPaused = function () {}

playerUI.onMediaPlaying = function () {
    var paused = this.player_.isPaused();
    var ended = this.player_.isEnded();
    this.updatePlayBtnUI(paused, ended);

    this.stopWaitingUI();
}

playerUI.onMediaSeeking = function () {
    printLog('+onMediaSeeking, pos: ' + this.player_.getPosition());
}

playerUI.onMediaSeeked = function () {
    printLog('+onMediaSeeked, pos: ' + this.player_.getPosition());

    if (!this.progressBarContext.pausedBeforeMousedown || this.progressBarContext.endedBeforeMousedown) {
        this.player_.play();
        // update ui
        var paused = false;
        var ended = this.player_.isEnded();
        this.updatePlayBtnUI(paused, ended);
    }
}

playerUI.onMediaTimeupdated = function () {
    //printLog('+onMediaTimeupdated, position: ' + this.player_.getPosition() + ', duration: ' + this.player_.getDuration());

    // Sometime, the timeupdate will trigger after we mouse down on the progress bar,
    // in this situation, we won't update progress bar ui.
    if (this.progressBarContext.mousedown) {}
    else {
        //this.progressBarContext.movePos = this.player_.getPosition();
        this.updateProgressBarUI();
        this.updateProgressBarHoverUI();
    }
}

playerUI.onMediaVolumeChanged = function () {
    var muted = this.player_.isMuted();
    var volume = this.player_.getVolume();
    this.updateContentVolumeBarUI(muted, volume);
}

playerUI.onMediaWaiting = function () {
    this.startWaitingUI();
}

playerUI.onLog = function (e) {
    this.uiConsole.innerHTML = (this.uiConsole.innerHTML + '<br/>' + e.message);
}

playerUI.onAdStarted = function (e) {
    printLog('onAdStarted, linear: ' + e.isLinearAd);
    this.flagAdStarted = true;
    this.flagIsLinearAd = e.isLinearAd;
    // update control bar ui
    if (this.flagIsLinearAd) {
        this.vopProgressBar.style.display = 'none';
        this.vopSettingsBtn.style.display = 'none';
    } else {
        var v = document.querySelector('.vop-ads-container');
        v.style.marginTop = '-' + (this.vopControlBar.clientHeight + 10).toString() + 'px';
    }
}

playerUI.onAdComplete = function () {
    printLog('onAdComplete, linear: ' + this.flagIsLinearAd);
    this.flagAdStarted = false;

    // update control bar ui
    this.vopProgressBar.style.display = 'block';
    this.vopSettingsBtn.style.display = 'inline-block';
}

playerUI.onAdTimeUpdate = function () {
    var position = this.player_.getPosition();
    var duration = this.player_.getDuration();
    //printLog('ad position: ' + position + ', duration: ' + duration);
    this.updateAdProgressUI();
}

playerUI.onFullscreenChanged = function () {
    var v = this.player_.isFullscreen();
    printLog('fullscreen changed, ret: ' + v);
    if (v) {
        this.vopFullscreen.innerText = 'fullscreen_exit';
    } else {
        this.vopFullscreen.innerText = 'fullscreen';
    }
}

/////////////////////////////////////////////////////////////////////////
// Title: Dynamic create UI
playerUI.createSubtitlesMenu = function () {
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

    // Part - process, remove all children of this.vopPanelMenu
    this.destroySettingsMenu();

    // Part - input
    var header = document.createElement('div');
    header.setAttribute('class', 'vop-panel-header');

    var panelTitle = document.createElement('button');
    panelTitle.setAttribute('class', 'vop-panel-title');
    panelTitle.innerText = 'Subtitles';
    panelTitle.addEventListener('click', this.onSubitlesBack.bind(this));
    panelTitle.setAttribute('role', 'plain');

    header.appendChild(panelTitle);

    // Part - input
    var firstMenuitem = null;
    for (var i = 0; i < this.subtitlesMenuContext.subtitleTracks.length; i++) {
        var subtitleTrack = this.subtitlesMenuContext.subtitleTracks[i];

        var menuitem = document.createElement('div');
        menuitem.setAttribute('class', 'vop-menuitem');
        menuitem.setAttribute('role', 'menuitem');
        menuitem.setAttribute('tabindex', '0');
        menuitem.addEventListener('blur', this.onSubtitleItemBlur.bind(this));
        if (subtitleTrack.id === this.subtitlesMenuContext.currSubtitleId) {
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
        menuitem.addEventListener('click', this.onSubtitleItemClick.bind(this));

        if (firstMenuitem === null) {
            firstMenuitem = menuitem;
        }
        this.vopPanelMenu.appendChild(menuitem);
    }

    //
    this.vopPanel.insertBefore(header, this.vopPanelMenu);
    this.vopSettingsMenu.style.display = 'block';
    firstMenuitem.focus();

    this.subtitlesMenuContext.currMenu = 'main_menu';
}

playerUI.destroySettingsMenu = function () {
    var v = document.querySelector('.vop-panel-header');
    if (v) {
        this.vopPanel.removeChild(v);
    }
    while (this.vopPanelMenu.firstChild) {
        this.vopPanelMenu.firstChild.removeEventListener('blur', playerUI.onMainMenuBlur);
        this.vopPanelMenu.removeChild(this.vopPanelMenu.firstChild);
    }

    this.settingMenuContext.currMenu = 'none';
    this.subtitlesMenuContext.currMenu = 'none';
}

playerUI.createHeaderItemUI = function (text, cb) {
    var header = document.createElement('div');
    header.setAttribute('class', 'vop-panel-header');

    var title = document.createElement('button');
    title.setAttribute('class', 'vop-panel-title');
    title.innerText = text;

    header.appendChild(title);
    header.addEventListener('click', cb);
    this.vopPanel.insertBefore(header, this.vopPanelMenu);
}

playerUI.createRadioMenuItem = function (text, cbBlur, cbClick) {
    var menuitem = document.createElement('div');
    menuitem.setAttribute('class', 'vop-menuitem');
    menuitem.setAttribute('role', 'menuitemradio');

    menuitem.setAttribute('tabindex', '0');
    menuitem.addEventListener('blur', cbBlur);
    menuitem.addEventListener('click', cbClick);

    var label = document.createElement('div');
    label.setAttribute('class', 'vop-menuitem-label');
    label.innerText = text;

    menuitem.appendChild(label);
    return menuitem;
}

playerUI.createMainMenu = function () {
    // The main menu html:
    // <div class="vop-panel-menu">
    //     <div class="vop-menuitem" role="menuitem" aria-haspopup="true" onclick="onQualityItemClick(event)">
    //        <div class="vop-menuitem-label">
    //            Quality
    //        </div>
    //        <div class="vop-menuitem-content">
    //            <span class="vop-menuitem-content-text">360p</span>
    //        </div>
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

    // Part - process, remove all children of this.vopPanelMenu
    this.destroySettingsMenu();

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
    qualityMenuitem.addEventListener('blur', this.onMainMenuBlur.bind(this));

    var label = document.createElement('div');
    label.setAttribute('class', 'vop-menuitem-label');
    label.innerText = 'Quality';

    var content = document.createElement('div');
    content.setAttribute('class', 'vop-menuitem-content');

    if (this.settingMenuContext.isQualityAuto) {
        var spanAuto = document.createElement('span');
        spanAuto.innerText = 'Auto';
        spanAuto.style.paddingRight = '6px';

        content.appendChild(spanAuto);
    }

    var contentText = document.createElement('span');
    contentText.setAttribute('class', 'vop-menuitem-content-text');
    contentText.innerText = this.settingMenuContext.currQuality;
    content.appendChild(contentText);

    qualityMenuitem.appendChild(label);
    qualityMenuitem.appendChild(content);

    qualityMenuitem.addEventListener('click', this.onQualityMenuClick.bind(this));

    // create audio track menu item
    var audioMenuitem = document.createElement('div');
    audioMenuitem.setAttribute('class', 'vop-menuitem');
    audioMenuitem.setAttribute('role', 'menuitem');
    if (audioTrackCnt > 1) {
        audioMenuitem.setAttribute('aria-haspopup', 'true');
    }
    audioMenuitem.setAttribute('tabindex', '0');
    audioMenuitem.addEventListener('blur', this.onMainMenuBlur.bind(this));

    label = document.createElement('div');
    label.setAttribute('class', 'vop-menuitem-label');
    label.innerText = 'Language';

    content = document.createElement('div');
    content.setAttribute('class', 'vop-menuitem-content');

    if (this.settingMenuContext.isAudioTrackAuto) {
        var spanAuto = document.createElement('span');
        spanAuto.innerText = 'Auto';
        spanAuto.style.paddingRight = '6px';

        content.appendChild(spanAuto);
    }

    contentText = document.createElement('span');
    contentText.setAttribute('class', 'vop-menuitem-content-text');
    contentText.innerText = this.settingMenuContext.currAudioTrack;
    content.appendChild(contentText);

    audioMenuitem.appendChild(label);
    audioMenuitem.appendChild(content);
    audioMenuitem.addEventListener('click', this.onAudioTrackMenuClick.bind(this));

    // create fcc menuitem
    var fccMenuitem = document.createElement('div');
    fccMenuitem.setAttribute('class', 'vop-menuitem');
    fccMenuitem.setAttribute('role', 'menuitem');
    fccMenuitem.setAttribute('aria-haspopup', 'true');
    fccMenuitem.setAttribute('tabindex', '0');

    label = document.createElement('div');
    label.setAttribute('class', 'vop-menuitem-label');
    label.innerText = 'Subtitle';

    content = document.createElement('div');
    content.setAttribute('class', 'vop-menuitem-content');
    contentText = document.createElement('span');
    contentText.setAttribute('class', 'vop-menuitem-content-text');
    contentText.innerText = 'Options';
    content.appendChild(contentText);

    fccMenuitem.appendChild(label);
    fccMenuitem.appendChild(content);
    fccMenuitem.addEventListener('click', this.onFccMenuClick.bind(this));

    // Part post process
    this.vopPanelMenu.appendChild(qualityMenuitem);
    this.vopPanelMenu.appendChild(audioMenuitem);
    this.vopPanelMenu.appendChild(fccMenuitem);

    //
    this.vopSettingsMenu.style.display = 'block';
    qualityMenuitem.focus();

    this.settingMenuContext.currMenu = 'main_menu';
}

playerUI.createQualityMenu = function () {
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

    // Part - process, remove all children of this.vopPanelMenu
    this.destroySettingsMenu();

    // add quality back menu
    this.createHeaderItemUI('Quality', this.onQualityBack.bind(this));

    // add quality menuitem
    var focusItem = null;
    for (var i = 0; i < this.settingMenuContext.qualityList.length; i++) {
        var quality = this.settingMenuContext.qualityList[i].bitrate;

        var menuitem = this.createRadioMenuItem(quality, playerUI.onMainMenuBlur, this.onQualityItemClick.bind(this));
        if (quality == this.settingMenuContext.currQuality) {
            menuitem.setAttribute('aria-checked', 'true');
        }
        if (quality == this.settingMenuContext.currQuality) {
            focusItem = menuitem;
        }

        this.vopPanelMenu.appendChild(menuitem);
    }

    //
    this.vopSettingsMenu.style.display = 'block';
    focusItem.focus();

    this.settingMenuContext.currMenu = 'quality_menu';
}

playerUI.createAudioTrackMenu = function () {
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

    // Part - process, remove all children of this.vopPanelMenu
    this.destroySettingsMenu();

    // add quality back menu
    this.createHeaderItemUI('Audio', this.onAudioTrackBack.bind(this));

    // add quality menuitem
    var firstItem = null;
    for (var i = 0; i < this.settingMenuContext.audioTrackList.length; i++) {
        var audioTrack = this.settingMenuContext.audioTrackList[i];

        var menuitem = this.createRadioMenuItem(audioTrack, this.onMainMenuBlur.bind(this), this.onAudioTrackItemClick.bind(this));
        if (audioTrack == this.settingMenuContext.currAudioTrack) {
            menuitem.setAttribute('aria-checked', 'true');
        }
        if (!firstItem) {
            firstItem = menuitem;
        }

        this.vopPanelMenu.appendChild(menuitem);
    }

    //
    this.vopSettingsMenu.style.display = 'block';
    firstItem.focus();

    this.settingMenuContext.currMenu = 'audio_track_menu';
}

playerUI.createFccMenu = function () {
    // The fcc menu html:
    // <div class="vop-panel-menu">
    //     <div class="vop-menuitem" role="menuitem" aria-haspopup="true" onclick="onFccItemClick(event)">
    //        <div class="vop-menuitem-label">
    //            Font Family
    //        </div>
    //        <div class="vop-menuitem-content">
    //           Default
    //        </div>
    //     </div>
    //     <div class="vop-menuitem" role="menuitem" aria-haspopup="true" onclick="onFccItemClick(event)">
    //         <div class="vop-menuitem-label">
    //             Font Color
    //         </div>
    //         <div class="vop-menuitem-content">
    //           Yellow
    //         </div>
    //     </div>
    // </div>

    // Part - process, remove all children of this.vopPanelMenu
    this.destroySettingsMenu();

    // Part - fcc property title
    this.createHeaderItemUI('Subtitles Optoins', onFccBack);

    // Part - fcc property item
    var firstItem = null;
    for (var i = 0; i < this.settingMenuContext.fccProperties.length; i ++) {
        var fcc = this.settingMenuContext.fccProperties[i];

        var menuitem = document.createElement('div');
        menuitem.setAttribute('class', 'vop-menuitem');
        menuitem.setAttribute('aria-haspopup', 'true');
        menuitem.setAttribute('tabindex', '0');
        menuitem.addEventListener('blur', this.onMainMenuBlur.bind(this));

        var label = document.createElement('div');
        label.setAttribute('class', 'vop-menuitem-label');
        label.innerText = fcc.name;

        var content = document.createElement('div');
        content.setAttribute('class', 'vop-menuitem-content');
        content.innerText = fcc.currValue;

        menuitem.appendChild(label);
        menuitem.appendChild(content);
        menuitem.dataset.name = fcc.name;
        menuitem.addEventListener('click', this.onFccItemClick.bind(this));

        if (!firstItem) {
            firstItem = menuitem;
        }

        this.vopPanelMenu.appendChild(menuitem);
    }

    this.vopSettingsMenu.style.display = 'block';
    this.settingMenuContext.currMenu = 'fcc_menu';
    firstItem.focus();
}

playerUI.createFccItemMenu = function (name) {
    // Part - fcc property title
    this.createHeaderItemUI(name, this.onFccPropertyItemBack.bind(this));

    for (var i = 0; i < this.settingMenuContext.fccProperties.length; i ++) {
        var fccProperty = this.settingMenuContext.fccProperties[i];
        if (fccProperty.name === name) {
            var firstItem = null;
            for (var j = 0; j < fccProperty.values.length; j++) {
                var propertyValue = fccProperty.values[j];

                var menuitem = this.createRadioMenuItem(propertyValue, this.onFccPropertyItemBlur.bind(this), this.onFccPropertyItemClick.bind(this));
                menuitem.dataset.id = propertyValue;
                if (propertyValue == fccProperty.currValue) {
                    menuitem.setAttribute('aria-checked', 'true');
                }

                if (!firstItem) {
                    firstItem = menuitem;
                }

                this.vopPanelMenu.dataset.fccProperty = name;
                this.vopPanelMenu.appendChild(menuitem);

                this.settingMenuContext.currMenu = 'fcc_property_menu';
                firstItem.focus();
            }
            break;
        }
    }
}

playerUI.updatePanelMenuUI = function (currValue) {
    var elem_child = this.vopPanelMenu.childNodes;
    for (var i = 0; i < elem_child.length; i++) {
        var menuitem = elem_child[i];

        var label = menuitem.querySelector('.vop-menuitem-label');
        if (label.innerText === currValue) {
            menuitem.setAttribute('aria-checked', 'true');
        } else {
            menuitem.removeAttribute('aria-checked');
        }
    }
}

playerUI.onQualityMenuClick = function (e) {
    e.stopPropagation();
    printLog('+onQualityMenuClick: ' + e.target.innerText);

    this.destroySettingsMenu();
    this.createQualityMenu();
}

playerUI.onAudioTrackMenuClick = function (e) {
    e.stopPropagation();

    this.destroySettingsMenu();
    this.createAudioTrackMenu();
}

playerUI.onFccMenuClick = function (e) {
    e.stopPropagation();

    this.destroySettingsMenu();
    this.createFccMenu();
}

playerUI.onMainMenuBlur = function (e) {
    var text = '';
    if (e.relatedTarget) {
        text = ', text: ' + e.relatedTarget.innerText;
    }

    printLog('+onMainMenuBlur, this.settingMenuContext.currMenu: ' + this.settingMenuContext.currMenu + text);

    var prevFocus = e.target;
    var nextFocus = e.relatedTarget;

    if (nextFocus) {
        if (nextFocus === this.vopSettingsBtn) {
            // means we click 'setting' button, do nothing here, onSettingClick will handle for us.
        } else {
            if (prevFocus) {
                if (-1 === prevFocus.className.indexOf('vop-menuitem')) {
                    // means click another item, do nothing here, on***ItemClick will handle for us.
                } else {
                }
            } else {
            }
        }
    } else {
        this.destroySettingsMenu();
    }
}

playerUI.onSubtitleItemClick = function (e) {
    e.stopPropagation();

    var id = e.currentTarget.dataset.id;
    if (this.subtitlesMenuContext.currSubtitleId === id) {
        this.subtitlesMenuContext.currSubtitleId = '';
    } else {
        this.subtitlesMenuContext.currSubtitleId = id;
    }

    this.updatePanelMenuUI(this.subtitlesMenuContext.currSubtitleId);
}

playerUI.onSubtitleItemBlur = function (e) {
    if (e.relatedTarget) {
        if (e.relatedTarget === this.vopSubtitlesBtn) {
            if (this.subtitlesMenuContext.currMenu === 'main_menu') {
                // do nothing
            }
        }
    } else {
        this.destroySettingsMenu();
    }
}

playerUI.onSubitlesBack = function (e) {
    printLog('+onSubitlesBack');
}

playerUI.onQualityBack = function (e) {
    printLog('+onQualityBack');
    e.stopPropagation();

    this.destroySettingsMenu();
    this.createMainMenu();
}

playerUI.onQualityItemClick = function (e) {
    printLog('onQualityItemClick, this.settingMenuContext.currMenu: ' + this.settingMenuContext.currMenu
         + ', text: ' + e.target.innerText);
    e.stopPropagation();

    this.settingMenuContext.currQuality = e.target.innerText;
    this.updatePanelMenuUI(this.settingMenuContext.currQuality);
}

playerUI.onAudioTrackBack = function (e) {
    e.stopPropagation();

    this.destroySettingsMenu();
    this.createMainMenu();
}

playerUI.onAudioTrackItemClick = function (e) {
    e.stopPropagation();

    this.settingMenuContext.currAudioTrack = e.target.innerText;
    this.updatePanelMenuUI(this.settingMenuContext.currAudioTrack);
};

playerUI.onFccBack = function (e) {
    e.stopPropagation();

    this.destroySettingsMenu();
    this.createMainMenu();
};

playerUI.onFccItemClick = function (e) {
    e.stopPropagation();
    printLog('+onFccItemClick, e.currentTarget.dataset.name: ' + e.currentTarget.dataset.name);

    // Part - destroy old ui
    this.destroySettingsMenu();

    // Part - fcc item ui
    this.createFccItemMenu(e.currentTarget.dataset.name);
};

playerUI.onFccPropertyItemBack = function (e) {
    e.stopPropagation();

    this.destroySettingsMenu();
    this.createFccMenu();
};

playerUI.onFccPropertyItemClick = function (e) {
    e.stopPropagation();

    printLog('+onFccPropertyItemClick');
    printLog('this.vopPanelMenu.dataset.fccProperty: ' + this.vopPanelMenu.dataset.fccProperty);
    printLog('new value: ' + e.currentTarget.dataset.id);

    for (var i = 0; i < this.settingMenuContext.fccProperties.length; i ++) {
        var fccProperty = this.settingMenuContext.fccProperties[i];
        if (fccProperty.name === this.vopPanelMenu.dataset.fccProperty) {
            fccProperty.currValue = e.currentTarget.dataset.id;
            this.updatePanelMenuUI(fccProperty.currValue);
            break;
        }
    }
};

playerUI.onFccPropertyItemBlur = function (e) {
    e.stopPropagation();

    var prevFocus = e.target;
    var nextFocus = e.relatedTarget;

    if (nextFocus) {
        if (nextFocus === this.vopSettingsBtn) {
            // means we click 'setting' button, do nothing here, onSettingClick will handle for us.
        } else {
            if (prevFocus) {
                if (-1 === prevFocus.className.indexOf('vop-menuitem')) {
                    // means click another item, do nothing here, on***ItemClick will handle for us.
                } else {
                }
            } else {
            }
        }
    } else {
        this.destroySettingsMenu();
    }
};

/////////////////////////////////////////////////////////////////////////
// Title: UI Command

function onBtnOpen()
{
    playerUI.onBtnOpen();
}

function onBtnClose()
{}

function onBtnPlay()
{}

function onBtnManualSchedule()
{
    playerUI.onBtnManualSchedule();
}

function onBtnInitAD()
{}

function onBtnDelAll()
{}

function onBtnStop()
{}

function onBtnPlayAd()
{}


/////////////////////////////////////////////////////////////////////////
// dynamic load main.css file
window.onload = function () {
    // print browser version info
    browserInfo = oldmtn.CommonUtils.getBrowserInfo();
    console.log('browser: ' + browserInfo.browser + ', version: ' + browserInfo.version);

    playerUI.initVariable();
    playerUI.initUI();
    playerUI.initUIEventListeners();
    playerUI.initPlayer();

    // BD
    //onBtnOpen();
    // ED
};

window.onunload = function () {
    //onBtnStop();
};
