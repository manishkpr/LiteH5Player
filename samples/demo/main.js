//
var browserInfo;

var cfg_ = getInitConfig();
var mediaCfg_ = getMediaInfo();
//

var playerUI = {};

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

playerUI.initVariable = function() {
  this.player_ = null;
  this.playerState_ = 'none'; // none, inited, opening, opened, failed, ended
  this.castSender_ = null;

  // Google Material Icon
  this.iconPlay = '&#xe037';
  this.iconPause = '&#xe034';
  this.iconReplay = '&#xe042';
  this.iconVolumeOff = '&#xe04f';
  this.iconVolumeUp = '&#xe050';
  this.iconVolumeDown = '&#xe04d';

  // UI Controls
  this.vopPlayer = null;
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
  this.uiGiantButton;

  this.uiLog = null;

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
    pausedBeforeMousedown: true,
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
    currMenu: 'none', // could be 'none'
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
    }],
    currSubtitleId: ''
  };

  this.settingMenuContext = {
    currMenu: 'none', // none, main_menu, quality_menu, audio_track_menu, fcc_menu, fcc_property_menu

    // main setting menu
    mainList: [{
      id: 1,
      text: 'Quality'
    }, {
      id: 2,
      text: 'Language'
    }, {
      id: 3,
      text: 'Subtitle'
    }],

    // quality settings menu
    qualityList: [{
      id: '6',
      bitrate: '1080p'
    }, {
      id: '5',
      bitrate: '720p'
    }, {
      id: '4',
      bitrate: '480p'
    }, {
      id: '3',
      bitrate: '360p'
    }, {
      id: '2',
      bitrate: '240p'
    }, {
      id: '1',
      bitrate: '144p'
    }, {
      id: '-1',
      bitrate: 'Auto'
    }],
    isQualityAuto: true,
    currQualityId: '2',

    // audio track settings menu
    audioTrackList: [{
      id: '1',
      lang: 'Bipbop1'
    }, {
      id: '2',
      lang: 'Bipbop2'
    }, {
      id: '3',
      lang: 'Bipbop3'
    }, {
      id: '4',
      lang: 'Bipbop4'
    }, {
      id: '5',
      lang: 'Bipbop5'
    }, {
      id: '6',
      lang: 'Bipbop6'
    }],
    currAudioTrackId: '1',

    // FCC settings menu
    isEnableFCC: true,
    fccPropertyList: [{
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
    }]
  };

  // reference variable of ad
  this.flagAdStarted = false;
  this.flagIsLinearAd = false;
}

// Title: init part
playerUI.initUIElements = function() {
  this.vopPlayer = document.querySelector('.html5-video-player');

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

  this.uiLog = document.getElementById('idLog');

  this.vopSubtitlesBtn = document.querySelector('.vop-subtitles-button');
  this.vopSettingsBtn = document.querySelector('.vop-settings-button');
  this.vopFullscreen = document.querySelector('.vop-fullscreen-button');

  // setting panel
  this.vopSettingsMenu = document.querySelector('.vop-settings-menu');
  this.vopPanel = this.vopSettingsMenu.querySelector('.vop-panel');
  this.vopPanelMenu = this.vopSettingsMenu.querySelector('.vop-panel-menu');

  this.vopSpinner = document.querySelector('.vop-spinner');

  this.uiGiantBtnContainer = document.querySelector('.vop-giant-button-container');
  this.uiGiantButton = document.querySelector('.vop-giant-button');
};

playerUI.initUIEventListeners = function() {
  this.vopPlayer.addEventListener('mouseenter', this.onPlayerMouseenter.bind(this));
  this.vopPlayer.addEventListener('mousemove', this.onPlayerMousemove.bind(this));
  this.vopPlayer.addEventListener('mouseleave', this.onPlayerMouseleave.bind(this));

  this.vopPlayer.addEventListener('click', this.onPlayerClick.bind(this));

  this.vopProgressBar.addEventListener('mousedown', this.onProgressBarMousedown.bind(this));
  this.vopProgressBar.addEventListener('mousemove', this.onProgressBarMousemove.bind(this));
  this.vopProgressBar.addEventListener('mouseleave', this.onProgressBarMouseleave.bind(this));

  this.vopControlBar.addEventListener('click', this.onUICmdControlBarClick.bind(this));
  this.vopPlayButton.addEventListener('click', this.onUICmdPlay.bind(this));
  this.vopMuteButton.addEventListener('click', this.onUICmdMute.bind(this));
  this.vopSubtitlesBtn.addEventListener('click', this.onUICmdSwitchSubtitle.bind(this));
  this.vopSettingsBtn.addEventListener('click', this.onUICmdSetting.bind(this));
  this.vopFullscreen.addEventListener('click', this.onUICmdFullscreen.bind(this));

  this.vopVolumeSlider.addEventListener('mousedown', this.onVolumeSliderMousedown.bind(this));

  this.vopPlayButton.addEventListener('mousemove', this.onControlMousemove.bind(this));
  this.vopMuteButton.addEventListener('mousemove', this.onControlMousemove.bind(this));
  this.vopSubtitlesBtn.addEventListener('mousemove', this.onControlMousemove.bind(this));
  this.vopSettingsBtn.addEventListener('mousemove', this.onControlMousemove.bind(this));
  this.vopFullscreen.addEventListener('mousemove', this.onControlMousemove.bind(this));
  this.vopVolumeSlider.addEventListener('mousemove', this.onControlMousemove.bind(this));

  this.vopSettingsMenu.addEventListener('click', this.onSettingsMenuClick.bind(this));

  // listen for animation end
  this.uiGiantBtnContainer.addEventListener("animationend", function(e) {
    this.uiGiantBtnContainer.style.display = 'none';
  }.bind(this), false);

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
    var v = document.querySelector('.player');
    new ResizeSensor(v, function(e) {
      var dstWidth = 0;
      var dstHeight = 0;
      if (isFullscreen()) {
        dstWidth = v.clientWidth;
        dstHeight = v.clientHeight;
      } else {
        if (v.clientWidth > 720) {
          dstWidth = 720;
          dstHeight = dstWidth * 0.5625;
        } else {
          dstWidth = v.clientWidth;
          dstHeight = dstWidth * 0.5625;
        }
      }

      this.vopPlayer.style.width = dstWidth.toString() + 'px';
      this.vopPlayer.style.height = dstHeight.toString() + 'px';
      //h5Player.style.marginLeft = h5Player.style.marginRight = 'auto';
      this.player_.resize(dstWidth, dstHeight);

      printLog(('ResizeSensor, dstWidth: ' + dstWidth + ', dstHeight: ' + dstHeight));
      this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());
    }.bind(this));
  }
};

playerUI.playerInit = function() {
  this.player_ = new oldmtn.Player('player-container');
  this.player_.init(cfg_);

  this.player_.on(oldmtn.Events.MEDIA_DURATION_CHANGED, this.onMediaDurationChanged.bind(this), {});
  this.player_.on(oldmtn.Events.MEDIA_ENDED, this.onMediaEnded.bind(this), {});
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
  this.player_.on(oldmtn.Events.AD_COMPANIONS, this.onAdCompanions.bind(this), {});

  //
  this.player_.on(oldmtn.Events.FULLSCREEN_CHANGE, this.onFullscreenChanged.bind(this), {});

  // chrome cast part
  var receiverAppId = 'E19ACDB8'; // joseph test app1
  //var receiverAppId = 'CBEF8A9C'; // joseph, css.visualon.info
  //var receiverAppId = 'FAC6871E'; // joseph, css.visualon.info

  // init chromecast sender
  this.castSender_ = new oldmtn.CastSender(receiverAppId);

  // update state machine
  this.updateUIStateMachine('inited');
};

playerUI.uninitPlayer = function() {
  if (this.player_) {
    this.player_.close();
    this.player_ = null;
  }
};

playerUI.playerOpen = function() {
  var p = this.player_.open(mediaCfg_);
  p.then(function(v) {
      printLog('open ret: ' + v);
      this.onOpenComplete();
    }.bind(this))
    .catch(function(e) {
      printLog('e: ' + e);
    });
  // since open is an async operation, we transition it to opening state.
  this.updateUIStateMachine('opening');
};

playerUI.playerClose = function() {
  printLog('+onBtnClose');
  this.player_.close();
  this.updateUIStateMachine('closed');
};

playerUI.playerRequestAds = function() {
  this.player_.playAd();
};

playerUI.onBtnInit = function() {
  this.player_.init(cfg_);
};

playerUI.onBtnUninit = function() {
  this.player_.uninit(cfg_);
};

///////////////////////////////////////////////////////////////////////////
// Title: UI reference functions
// This function is mainly focus on:
// 1. Record the player state, and refect it to UI
playerUI.updateUIStateMachine = function(state) {
  printLog('oldState: ' + this.playerState_ + ', newState: ' + state);
  this.playerState_ = state;
  switch (this.playerState_) {
    case 'inited':
      {}
      break;
    case 'opening':
      {
        this.startBufferingUI();
      }
      break;
    case 'opened':
      {
        this.stopBufferingUI();

        this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());
        this.vopControlBar.style.display = 'block';
      }
      break;
    case 'ended':
      {
        $('.html5-video-player').removeClass('vop-autohide');
      }
      break;
    case 'closed':
      {

      }
      break;
    default:
      break;
  }
};

playerUI.startBufferingUI = function() {
  this.vopSpinner.style.display = 'block';
};

playerUI.stopBufferingUI = function() {
  this.vopSpinner.style.display = 'none';
};

// begin progress bar
playerUI.updateVolumeMovePosition = function(e) {
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

playerUI.getProgressMovePosition = function(e) {
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

playerUI.updateProgressBarUI = function(position, duration) {
  // part - input

  // part - logic process
  var isLive = (duration === Infinity) ? true : false;
  var timeText = '';
  if (isLive) {
    var seekable = this.player_.getSeekableRange();
    var buffered = this.player_.getBufferedRanges();
    printLog('seekable: ' + TimeRangesToString(seekable) + ', buffered: ' + TimeRangesToString(buffered));

    // update time display label
    timeText = 'Live';
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
    timeText = c + '/' + d;
  }

  var tDisplay = document.querySelector('.vop-time-text');
  tDisplay.innerText = timeText;
};

playerUI.updateProgressBarHoverUI = function() {
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

playerUI.updateTooltipUI = function(e) {
  var thumbnail = this.player_.getThumbnail(this.progressBarContext.movePos);

  function getTooltipOffsetX(e, tooltipWidth) {
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
        this.vopTooltipBg.style.background = 'url(' + thumbnail.data.url + ')' +
          ' -' + thumbnail.data.x.toString() + 'px' +
          ' -' + thumbnail.data.y.toString() + 'px';
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
  } else {
    $('.vop-tooltip').removeClass('vop-preview');
  }

  // update tooltip offset
  var strTime = timeToString(this.progressBarContext.movePos);
  this.vopTooltipText.innerText = strTime;

  // calculate metrics first
  this.vopTooltip.style.left = '10000px';
  this.vopTooltip.style.display = 'block';
  tooltipWidth = this.vopTooltip.clientWidth;
  // set the correct offset of tooltip.
  var offsetX = getTooltipOffsetX.call(this, e, tooltipWidth);
  this.vopTooltip.style.left = offsetX.toString() + 'px';
};

playerUI.updateAdProgressUI = function() {
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

playerUI.updatePlayBtnUI = function(paused, ended) {
  if (ended) {
    this.vopPlayButton.innerHTML = this.iconReplay;
  } else {
    if (paused) {
      this.vopPlayButton.innerHTML = this.iconPlay;
    } else {
      this.vopPlayButton.innerHTML = this.iconPause;
    }
  }
};

playerUI.updateGiantPlayBtnUI = function(paused) {
  if (paused) {
    this.uiGiantButton.innerHTML = this.iconPause;
  } else {
    this.uiGiantButton.innerHTML = this.iconPlay;
  }
  this.uiGiantBtnContainer.style = '';
};

playerUI.updateContentVolumeBarUI = function(muted, volume) {
  var uiMutedIcon;
  var uiVolumeList;
  var uiVolumeHandleLeft;

  if (volume === 0 || muted) {
    uiMutedIcon = this.iconVolumeOff;
    uiVolumeList = [0, 1];
    uiVolumeHandleLeft = '0px';
  } else {
    if (volume >= 0.5) {
      uiMutedIcon = this.iconVolumeUp;
    } else {
      uiMutedIcon = this.iconVolumeDown;
    }

    uiVolumeList = [volume, 1];

    var vLeft = (volume / 1) * this.vopVolumeSlider.clientWidth;
    if (vLeft + this.vopVolumeSliderHandle.clientWidth > this.vopVolumeSlider.clientWidth) {
      vLeft = this.vopVolumeSlider.clientWidth - this.vopVolumeSliderHandle.clientWidth;
    }

    uiVolumeHandleLeft = vLeft.toString() + 'px';
  }

  // update muted button
  this.vopMuteButton.innerHTML = uiMutedIcon;
  // update volume slider background
  this.vopVolumeSlider.style.background = genGradientColor(uiVolumeList, this.colorList_volume);
  // update volume slider handle
  this.vopVolumeSliderHandle.style.left = uiVolumeHandleLeft;
};

///////////////////////////////////////////////////////////////////////////
// Title: Tool function
playerUI.removeAutohideAction = function() {
  $('.html5-video-player').removeClass('vop-autohide');
  if (this.timerHideControlBar) {
    clearTimeout(this.timerHideControlBar);
    this.timerHideControlBar = null;
  }
};

playerUI.docVolumeSliderMousemove = function(e) {
  this.updateVolumeMovePosition(e);

  var muted = this.player_.isMuted();
  var volume = this.valueVolumeMovePosition;
  if (volume === 0) {} else {
    if (muted === true) {
      this.player_.unmute();
    }

    muted = false;
  }

  this.player_.setVolume(this.valueVolumeMovePosition);

  this.updateContentVolumeBarUI(muted, volume);
};

playerUI.docVolumeSliderMouseup = function(e) {
  printLog('+docVolumeSliderMouseup');
  this.releaseVolumeSliderMouseEvents();
  e.preventDefault();

  this.flagVolumeSliderMousedown = false;

  // if mouse up out of 'vop-shade', hide control bar directly
  var pt = {
    x: e.clientX,
    y: e.clientY
  };
  if (!isPtInElement(pt, this.vopPlayer)) {
    this.onPlayerMouseleave();
  }
};

playerUI.captureVolumeSliderMouseEvents = function() {
  playerUI.newVolumeSliderMousemove = this.docVolumeSliderMousemove.bind(this);
  playerUI.newVolumeSliderMouseup = this.docVolumeSliderMouseup.bind(this);

  document.addEventListener('mousemove', playerUI.newVolumeSliderMousemove, true);
  document.addEventListener('mouseup', playerUI.newVolumeSliderMouseup, true);
};

playerUI.releaseVolumeSliderMouseEvents = function() {
  document.removeEventListener('mousemove', playerUI.newVolumeSliderMousemove, true);
  document.removeEventListener('mouseup', playerUI.newVolumeSliderMouseup, true);
};

///////////////////////////////////////////////////////////////////
playerUI.onPlayerMouseenter = function() {
  // Don't show control bar if the stream is not initialized.
  if (this.playerState_ !== 'opened') {
    return;
  }

  $('.html5-video-player').removeClass('vop-autohide');
};

playerUI.onPlayerMousemove = function(e) {
  //printLog('+onPlayerMousemove');
  // don't show control bar if the stream is not initialized.
  if (this.playerState_ !== 'opened') {
    return;
  }

  this.removeAutohideAction();
  this.timerHideControlBar = setTimeout(function() {
    this.onPlayerMouseleave();
  }.bind(this), 3000);
};

playerUI.onPlayerMouseleave = function() {
  var paused = this.player_.isPaused();
  var fullscreen = isFullscreen();
  if (!paused && !this.progressBarContext.mousedown && !this.flagVolumeSliderMousedown && !fullscreen) {
    $('.html5-video-player').addClass('vop-autohide');
  }
};

playerUI.onPlayerClick = function() {
  if (this.flagAdStarted && this.flagIsLinearAd) {
    return;
  }

  this.onUICmdPlay();
};

// browser & UI callback functions
playerUI.onUICmdPlay = function() {
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
    this.updateGiantPlayBtnUI(newPaused);
  }
};

playerUI.onControlMousemove = function(e) {
  e.stopPropagation();
  this.removeAutohideAction();
};

playerUI.onSettingsMenuClick = function(e) {
  // Don't route 'click' event from panel to its parent div
  e.stopPropagation();
};

playerUI.onUICmdControlBarClick = function(e) {
  e.stopPropagation();
};

playerUI.onUICmdMute = function() {
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

playerUI.onBtnManualSchedule = function() {
  this.player_.manualSchedule();
};

playerUI.onBtnInitAD = function() {
  this.player_.test();
};

playerUI.onBtnDelAll = function() {
  this.player_.dellAll();
};

playerUI.onBtnStop = function() {
  this.player_.close();
  this.player_ = null;
}

playerUI.onUICmdSwitchSubtitle = function() {
  printLog('+onUICmdSwitchSubtitle, currMenu: ' + this.subtitlesMenuContext.currSubtitleId);

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

playerUI.onUICmdSetting = function(e) {
  printLog('+onUICmdSetting, currMenu: ' + this.settingMenuContext.currMenu);

  // Part - destroy subtitle menu first if it's visible
  if (this.subtitlesMenuContext.currMenu !== 'none') {
    this.destroySettingsMenu();
  }

  // Part - process setting event
  if (this.settingMenuContext.currMenu === 'none') {
    this.createSettingsMenu();
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

playerUI.onUICmdFullscreen = function() {
  printLog('+onBtnFullscreen');
  if (isFullscreen()) {
    h5LeaveFullscreen();
  } else {
    h5EnterFullscreen();
  }
};

playerUI.onBtnSeek = function() {
  var time = document.getElementById('seekedTime').value;
  this.player_.setPosition(time);
};

playerUI.onBtnAddTextTrack = function() {
  if (this.player_) {
    this.player_.addTextTrack();
  }
};

playerUI.onBtnRemoveTextTrack = function() {
  this.player_.removeTextTrack();
};

playerUI.setTextTrackHidden = function() {
  this.player_.setTextTrackHidden();
};

playerUI.setCueAlign = function(align) {
  this.player_.setCueAlign(align);
};

playerUI.onFruitClick = function() {
  alert('aaaa');
};

playerUI.onBtnAttribute = function() {
  //this.player_.attribute();
};

//
playerUI.onUICmdCastInit = function() {
  var cfg = getInitConfig();
  this.castSender.new_init(cfg);
};

playerUI.onUICmdCastOpen = function() {
  var info = getMediaInfo();
  this.castSender.new_open(info);
};

playerUI.onUICmdCastAddV = function() {
  this.castSender.new_addV();
}

playerUI.onUICmdCastAddPD = function() {
  this.castSender.new_addPD();
};

playerUI.onUICmdCastPlay = function() {
  this.castSender.new_play();
};

playerUI.onUICmdCastPause = function() {
  this.castSender.new_pause();
};

playerUI.onUICmdCastPlayAd = function() {
  this.castSender.new_playAd();
};

playerUI.onUICmdCastTest = function() {
  this.castSender.new_test();
};

playerUI.doEnterThumbnailMode = function() {
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
};

playerUI.doProcessThumbnailMove = function() {
  // for further action, you can add thumbnail popup here.
};

playerUI.doProcessThumbnailUp = function() {
  // for further action, you can add thumbnail ended event here.
};

playerUI.onProgressBarMousedown = function(e) {
  printLog('+onProgressBarMousedown');
  this.captureProgressBarMouseEvents();
  e.preventDefault();
  e.stopPropagation();

  this.progressBarContext.mousedown = true;
  this.progressBarContext.pausedBeforeMousedown = this.player_.isPaused();
  this.progressBarContext.endedBeforeMousedown = this.player_.isEnded();
  this.progressBarContext.posBeforeMousedown = this.player_.getPosition();
  this.flagThumbnailMode = false;
  this.progressBarContext.timer = setTimeout(function() {
    this.doEnterThumbnailMode();
  }.bind(this), 200);

  // update progress bar ui
  this.progressBarContext.movePos = this.getProgressMovePosition(e);
  this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());
  this.updateProgressBarHoverUI();
};

playerUI.onProgressBarMousemove = function(e) {
  //printLog('+onProgressBarMousemove');
  e.stopPropagation();
  this.removeAutohideAction();

  // if mouse down, just return
  if (this.progressBarContext.mousedown ||
    this.settingMenuContext.currMenu !== 'none' ||
    this.subtitlesMenuContext.currMenu !== 'none') {
    return;
  }

  // update progress bar ui
  this.progressBarContext.movePos = this.getProgressMovePosition(e);
  this.updateProgressBarHoverUI();
  this.updateTooltipUI(e);
};

playerUI.onProgressBarMouseleave = function() {
  //printLog('+onProgressBarMouseleave');
  this.vopTooltip.style.display = 'none';
};

playerUI.captureProgressBarMouseEvents = function() {
  playerUI.newProgressBarMousemove = this.docProgressBarMousemove.bind(this);
  playerUI.newProgressBarMouseup = this.docProgressBarMouseup.bind(this);

  document.addEventListener('mousemove', playerUI.newProgressBarMousemove, true);
  document.addEventListener('mouseup', playerUI.newProgressBarMouseup, true);
};

playerUI.releaseProgressBarMouseEvents = function() {
  document.removeEventListener('mousemove', playerUI.newProgressBarMousemove, true);
  document.removeEventListener('mouseup', playerUI.newProgressBarMouseup, true);
};

playerUI.docProgressBarMousemove = function(e) {
  printLog('+docProgressBarMousemove');

  var movePos = this.getProgressMovePosition(e);
  if (this.progressBarContext.movePos === movePos) {
    return;
  }

  this.doEnterThumbnailMode();
  this.doProcessThumbnailMove();

  this.progressBarContext.movePos = movePos;
  this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());
  this.updateProgressBarHoverUI();
};

playerUI.docProgressBarMouseup = function(e) {
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
  this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());
  this.updateProgressBarHoverUI();

  if (this.progressBarContext.posBeforeMousedown != this.progressBarContext.movePos) {
    this.player_.setPosition(this.progressBarContext.movePos);
  }

  this.progressBarContext.mousedown = false;
};

playerUI.onVolumeSliderMousedown = function(e) {
  printLog('+onVolumeSliderMousedown');
  this.captureVolumeSliderMouseEvents();
  e.preventDefault();
  e.stopPropagation();

  this.flagVolumeSliderMousedown = true;

  this.docVolumeSliderMousemove(e);
};

////////////////////////////////////////////////////////////////////////////////////
// this.player_ event callback
playerUI.onMediaDurationChanged = function() {
  this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());
};

playerUI.onMediaEnded = function() {
  var paused = this.player_.isPaused();
  var ended = this.player_.isEnded();
  this.updatePlayBtnUI(paused, ended);

  //
  this.progressBarContext.movePos = this.player_.getPosition();
  this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());

  //
  this.updateUIStateMachine('ended');
};

playerUI.onOpenComplete = function() {
  if (this.playerState_ === 'opening') {
    printLog('+onOpenComplete');
    this.updateUIStateMachine('opened');

    // update volume here
    var muted = this.player_.isMuted();
    var volume = this.player_.getVolume();

    this.updateContentVolumeBarUI(muted, volume);
  }
};

playerUI.onMediaLoadedMetaData = function(e) {
  // update external div's dimensions
  this.metaWidth = e.width;
  this.metaHeight = e.height;

  var ratio = (this.metaHeight / this.metaWidth);

  var v = document.querySelector('.player');
  var dstWidth = v.clientWidth;
  var dstHeight = dstWidth * ratio;
  var h5Player = document.querySelector('.html5-video-player');
  h5Player.style.width = dstWidth.toString() + 'px';
  h5Player.style.height = dstHeight.toString() + 'px';
  this.player_.resize(dstWidth, dstHeight);
};

playerUI.onMediaPaused = function() {};

playerUI.onMediaPlaying = function() {
  var paused = this.player_.isPaused();
  var ended = this.player_.isEnded();
  this.updatePlayBtnUI(paused, ended);

  this.stopBufferingUI();
};

playerUI.onMediaSeeking = function() {
  printLog('+onMediaSeeking, pos: ' + this.player_.getPosition());
};

playerUI.onMediaSeeked = function() {
  printLog('+onMediaSeeked, pos: ' + this.player_.getPosition());

  if (!this.progressBarContext.pausedBeforeMousedown || this.progressBarContext.endedBeforeMousedown) {
    this.player_.play();
    // update ui
    var paused = false;
    var ended = this.player_.isEnded();
    this.updatePlayBtnUI(paused, ended);
  }
};

playerUI.onMediaTimeupdated = function() {
  //printLog('+onMediaTimeupdated, position: ' + this.player_.getPosition() + ', duration: ' + this.player_.getDuration());

  // Sometime, the timeupdate will trigger after we mouse down on the progress bar,
  // in this situation, we won't update progress bar ui.
  if (this.progressBarContext.mousedown) {} else {
    //this.progressBarContext.movePos = this.player_.getPosition();
    this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());
    this.updateProgressBarHoverUI();
  }
};

playerUI.onMediaVolumeChanged = function() {
  var muted = this.player_.isMuted();
  var volume = this.player_.getVolume();
  this.updateContentVolumeBarUI(muted, volume);
};

playerUI.onMediaWaiting = function() {
  this.startBufferingUI();
};

playerUI.onLog = function(e) {
  printLogUI(e.message);
};

playerUI.onAdStarted = function(e) {
  // BD
  var videos = document.getElementsByTagName('video');
  // ED
  printLog('onAdStarted, linear: ' + e.isLinearAd + ', videos length: ' + videos.length);
  this.flagAdStarted = true;
  this.flagIsLinearAd = e.isLinearAd;
  // update control bar ui
  if (this.flagIsLinearAd) {
    this.vopSubtitlesBtn.style.display = 'none';
    this.vopSettingsBtn.style.display = 'none';
  } else {
    var v = document.querySelector('.vop-ads-container');
    v.style.marginTop = '-' + (this.vopControlBar.clientHeight + 10).toString() + 'px';
  }
};

playerUI.onAdComplete = function() {
  printLog('onAdComplete, linear: ' + this.flagIsLinearAd);
  this.flagAdStarted = false;

  // update control bar ui
  this.vopProgressBar.style.display = 'block';
  this.vopSubtitlesBtn.style.display = 'inline-block';
  this.vopSettingsBtn.style.display = 'inline-block';
};

playerUI.onAdTimeUpdate = function() {
  var position = this.player_.getPosition();
  var duration = this.player_.getDuration();
  //printLog('ad position: ' + position + ', duration: ' + duration);
  this.updateAdProgressUI();
};

playerUI.onAdCompanions = function(e) {
  var v = document.getElementById('idCompanionAd');
  for (var i = 0; i < e.companions.length; i++) {
    var companion = e.companions[i];
    if (v.clientWidth === companion.width && v.clientHeight === companion.height) {
      v.innerHTML = companion.content;
    }
  }
};

playerUI.onFullscreenChanged = function() {
  var v = this.player_.isFullscreen();
  var v1 = document.querySelector('.player');
  printLog('fullscreen changed, ret: ' + v + ', width: ' + window.screen.width + ', height: ' + window.screen.height);
  printLog('player, width: ' + v1.clientWidth + ', height: ' + v1.clientHeight);
  if (v) {
    this.vopFullscreen.innerText = 'fullscreen_exit';
  } else {
    this.vopFullscreen.innerText = 'fullscreen';
  }
};

/////////////////////////////////////////////////////////////////////////
// Title: Dynamic create UI
playerUI.createSubtitlesMenu = function() {
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

  var title = document.createElement('button');
  title.setAttribute('class', 'vop-panel-title');
  title.innerText = 'Subtitles';
  title.addEventListener('click', this.onSubitlesBack.bind(this));
  title.setAttribute('role', 'plain');

  header.appendChild(title);
  this.vopPanel.insertBefore(header, this.vopPanelMenu);

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
  this.vopSettingsMenu.style.display = 'block';
  firstMenuitem.focus();

  this.subtitlesMenuContext.currMenu = 'main_menu';
};

playerUI.destroySettingsMenu = function() {
  var v = document.querySelector('.vop-panel-header');
  if (v) {
    this.vopPanel.removeChild(v);
  }
  while (this.vopPanelMenu.firstChild) {
    this.vopPanelMenu.firstChild.onblur = null;
    this.vopPanelMenu.removeChild(this.vopPanelMenu.firstChild);
  }

  this.settingMenuContext.currMenu = 'none';
  this.subtitlesMenuContext.currMenu = 'none';
};

playerUI.createHeaderItemUI = function(text, cb) {
  var header = document.createElement('div');
  header.setAttribute('class', 'vop-panel-header');

  var title = document.createElement('button');
  title.innerText = text;
  title.setAttribute('class', 'vop-panel-title');

  header.appendChild(title);
  header.addEventListener('click', cb);

  return header;
};

playerUI.createRadioMenuItem = function(text, cbBlur, cbClick) {
  var menuitem = document.createElement('div');
  menuitem.setAttribute('class', 'vop-menuitem');
  menuitem.setAttribute('role', 'menuitemradio');

  menuitem.setAttribute('tabindex', '0');
  menuitem.addEventListener('blur', cbBlur);
  menuitem.addEventListener('click', cbClick);

  var label = document.createElement('div');
  label.innerText = text;
  label.setAttribute('class', 'vop-menuitem-label');

  menuitem.appendChild(label);
  return menuitem;
};

playerUI.createSettingsMenu = function() {
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
  function getQualityText() {
    var qualityText = '';
    for (var i = 0; i < this.settingMenuContext.qualityList.length; i++) {
      var qualityId = this.settingMenuContext.qualityList[i].id;
      if (qualityId === this.settingMenuContext.currQualityId) {
        qualityText = this.settingMenuContext.qualityList[i].bitrate;
        break;
      }
    }
    return qualityText;
  }

  function getLangText() {
    var langText = '';
    for (var i = 0; i < this.settingMenuContext.audioTrackList.length; i++) {
      var langId = this.settingMenuContext.audioTrackList[i].id;
      if (langId === this.settingMenuContext.currAudioTrackId) {
        langText = this.settingMenuContext.audioTrackList[i].lang;
        break;
      }
    }
    return langText;
  }

  // Part - process: created quality menu item
  var qualityCnt = this.settingMenuContext.qualityList.length;
  var qualityMenuitem = document.createElement('div');
  qualityMenuitem.setAttribute('class', 'vop-menuitem');
  qualityMenuitem.setAttribute('role', 'menuitem');
  if (qualityCnt > 1) {
    qualityMenuitem.setAttribute('aria-haspopup', 'true');
  }
  qualityMenuitem.setAttribute('tabindex', '0');
  qualityMenuitem.onblur = this.onMainMenuBlur.bind(this);

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
  contentText.innerText = getQualityText.call(this);
  contentText.setAttribute('class', 'vop-menuitem-content-text');
  content.appendChild(contentText);

  qualityMenuitem.appendChild(label);
  qualityMenuitem.appendChild(content);

  qualityMenuitem.addEventListener('click', this.onQualityMenuClick.bind(this));

  // create audio track menu item
  var audioTrackCnt = this.settingMenuContext.audioTrackList.length;
  var audioMenuitem = document.createElement('div');
  audioMenuitem.setAttribute('class', 'vop-menuitem');
  audioMenuitem.setAttribute('role', 'menuitem');
  if (audioTrackCnt > 1) {
    audioMenuitem.setAttribute('aria-haspopup', 'true');
  }
  audioMenuitem.setAttribute('tabindex', '0');
  audioMenuitem.onblur = this.onMainMenuBlur.bind(this);

  label = document.createElement('div');
  label.innerText = 'Language';
  label.setAttribute('class', 'vop-menuitem-label');

  content = document.createElement('div');
  content.setAttribute('class', 'vop-menuitem-content');

  contentText = document.createElement('span');
  contentText.innerText = getLangText.call(this);
  contentText.setAttribute('class', 'vop-menuitem-content-text');
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
  fccMenuitem.onblur = this.onMainMenuBlur.bind(this);

  label = document.createElement('div');
  label.innerText = 'Subtitle';
  label.setAttribute('class', 'vop-menuitem-label');

  content = document.createElement('div');
  content.setAttribute('class', 'vop-menuitem-content');

  contentText = document.createElement('span');
  contentText.innerText = 'Options';
  contentText.setAttribute('class', 'vop-menuitem-content-text');

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
};

playerUI.createQualityMenu = function() {
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
  var header = this.createHeaderItemUI('Quality', this.onQualityBack.bind(this));
  this.vopPanel.insertBefore(header, this.vopPanelMenu);

  // add quality menuitem
  var focusItem = null;
  for (var i = 0; i < this.settingMenuContext.qualityList.length; i++) {
    var quality = this.settingMenuContext.qualityList[i].bitrate;
    var id = this.settingMenuContext.qualityList[i].id;

    var menuitem = this.createRadioMenuItem(quality, this.onQualityItemBlur.bind(this), this.onQualityItemClick.bind(this));
    menuitem.dataset.id = id;
    if (id == this.settingMenuContext.currQualityId) {
      menuitem.setAttribute('aria-checked', 'true');
    }
    if (id == this.settingMenuContext.currQualityId) {
      focusItem = menuitem;
    }

    this.vopPanelMenu.appendChild(menuitem);
  }

  //
  this.vopSettingsMenu.style.display = 'block';
  focusItem.focus();

  this.settingMenuContext.currMenu = 'quality_menu';
}

playerUI.createAudioTrackMenu = function() {
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
  var header = this.createHeaderItemUI('Audio', this.onAudioTrackBack.bind(this));
  this.vopPanel.insertBefore(header, this.vopPanelMenu);

  // add quality menuitem
  var firstItem = null;
  for (var i = 0; i < this.settingMenuContext.audioTrackList.length; i++) {
    var audioLang = this.settingMenuContext.audioTrackList[i].lang;
    var id = this.settingMenuContext.audioTrackList[i].id;

    var menuitem = this.createRadioMenuItem(audioLang, this.onAudioTrackItemBlur.bind(this), this.onAudioTrackItemClick.bind(this));
    menuitem.dataset.id = id;
    if (audioLang == this.settingMenuContext.currAudioTrackId) {
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

playerUI.createFccMenu = function() {
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
  var header = this.createHeaderItemUI('Subtitles Optoins', this.onFccBack.bind(this));
  this.vopPanel.insertBefore(header, this.vopPanelMenu);

  // Part - fcc property item
  var firstItem = null;
  for (var i = 0; i < this.settingMenuContext.fccPropertyList.length; i++) {
    var fcc = this.settingMenuContext.fccPropertyList[i];

    var menuitem = document.createElement('div');
    menuitem.setAttribute('class', 'vop-menuitem');
    menuitem.setAttribute('aria-haspopup', 'true');
    menuitem.setAttribute('tabindex', '0');
    menuitem.addEventListener('blur', this.onFccItemBlur.bind(this));

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

playerUI.createFccItemMenu = function(name) {
  // Part - fcc property title
  var header = this.createHeaderItemUI(name, this.onFccPropertyItemBack.bind(this));
  this.vopPanel.insertBefore(header, this.vopPanelMenu);

  for (var i = 0; i < this.settingMenuContext.fccPropertyList.length; i++) {
    var fccProperty = this.settingMenuContext.fccPropertyList[i];
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

playerUI.updatePanelMenuUI = function(id) {
  var elem_child = this.vopPanelMenu.children;
  for (var i = 0; i < elem_child.length; i++) {
    var menuitem = elem_child[i];

    if (menuitem.dataset.id === id) {
      menuitem.setAttribute('aria-checked', 'true');
    } else {
      menuitem.removeAttribute('aria-checked');
    }
  }
}

playerUI.onQualityMenuClick = function(e) {
  printLog('+onQualityMenuClick: ' + e.target.innerText);

  this.destroySettingsMenu();
  this.createQualityMenu();
}

playerUI.onAudioTrackMenuClick = function(e) {
  this.destroySettingsMenu();
  this.createAudioTrackMenu();
}

playerUI.onFccMenuClick = function(e) {
  this.destroySettingsMenu();
  this.createFccMenu();
}

playerUI.onMainMenuBlur = function(e) {
  var text = '';
  if (e.relatedTarget) {
    text = ', text: ' + e.relatedTarget.innerText;
  }

  printLog('+onMainMenuBlur, this.settingMenuContext.currMenu: ' + this.settingMenuContext.currMenu + text);

  var prevFocus = e.target;
  var nextFocus = e.relatedTarget;

  if (nextFocus) {
    if (nextFocus === this.vopSettingsBtn) {
      // means we click 'setting' button, do nothing here, onUICmdSetting will handle for us.
    } else {
      if (prevFocus) {
        if (-1 === prevFocus.className.indexOf('vop-menuitem')) {
          // means click another item, do nothing here, on***ItemClick will handle for us.
        } else {}
      } else {}
    }
  } else {
    this.destroySettingsMenu();
  }
}

playerUI.onSubtitleItemClick = function(e) {
  e.stopPropagation();

  var id = e.currentTarget.dataset.id;
  if (this.subtitlesMenuContext.currSubtitleId === id) {
    this.subtitlesMenuContext.currSubtitleId = '';
  } else {
    this.subtitlesMenuContext.currSubtitleId = id;
  }

  this.updatePanelMenuUI(this.subtitlesMenuContext.currSubtitleId);
}

playerUI.onSubtitleItemBlur = function(e) {
  if (e.relatedTarget) {
    if (e.relatedTarget === this.vopSubtitlesBtn) {
      if (this.subtitlesMenuContext.currMenu === 'main_menu') {
        // do nothing
      }
    }
  } else {
    this.destroySettingsMenu();
  }
};

playerUI.onSubitlesBack = function(e) {
  printLog('+onSubitlesBack');
};

playerUI.onQualityBack = function(e) {
  printLog('+onQualityBack');
  this.destroySettingsMenu();
  this.createSettingsMenu();
};

playerUI.onQualityItemClick = function(e) {
  printLog('+onQualityItemClick, this.settingMenuContext.currMenu: ' + this.settingMenuContext.currMenu +
    ', text: ' + e.target.innerText);
  var nextFocus = e.currentTarget;

  this.settingMenuContext.currQualityId = nextFocus.dataset.id;
  this.updatePanelMenuUI(this.settingMenuContext.currQualityId);
};

playerUI.onQualityItemBlur = function(e) {
  printLog('+onQualityItemBlur');
  var nextFocus = e.relatedTarget;
  if (nextFocus) {
    printLog('className: ' + nextFocus.className);
    if (nextFocus.className.indexOf('vop-panel-title') !== -1 ||
      nextFocus.className.indexOf('vop-menuitem') !== -1) {
      // click on quality menu, do nothing
    } else {
      this.destroySettingsMenu();
    }
  } else {
    this.destroySettingsMenu();
  }
};

playerUI.onAudioTrackBack = function(e) {
  printLog('+onAudioTrackBack');
  this.destroySettingsMenu();
  this.createSettingsMenu();
};

playerUI.onAudioTrackItemClick = function(e) {
  printLog('+onAudioTrackItemClick');
  var nextFocus = e.currentTarget;

  this.settingMenuContext.currAudioTrackId = nextFocus.dataset.id;
  this.updatePanelMenuUI(this.settingMenuContext.currAudioTrackId);
};

playerUI.onAudioTrackItemBlur = function(e) {
  printLog('+onAudioTrackItemBlur');
  this.onQualityItemBlur(e);
};

playerUI.onFccBack = function(e) {
  this.destroySettingsMenu();
  this.createSettingsMenu();
};

playerUI.onFccItemClick = function(e) {
  printLog('+onFccItemClick, e.currentTarget.dataset.name: ' + e.currentTarget.dataset.name);

  // Part - destroy old ui
  this.destroySettingsMenu();

  // Part - fcc item ui
  var nextFocus = e.currentTarget;
  this.createFccItemMenu(nextFocus.dataset.name);
};

playerUI.onFccItemBlur = function(e) {

};

playerUI.onFccPropertyItemBack = function(e) {
  this.destroySettingsMenu();
  this.createFccMenu();
};

playerUI.onFccPropertyItemClick = function(e) {
  printLog('+onFccPropertyItemClick');
  printLog('this.vopPanelMenu.dataset.fccProperty: ' + this.vopPanelMenu.dataset.fccProperty);
  printLog('new value: ' + e.currentTarget.dataset.id);

  for (var i = 0; i < this.settingMenuContext.fccPropertyList.length; i++) {
    var fccProperty = this.settingMenuContext.fccPropertyList[i];
    if (fccProperty.name === this.vopPanelMenu.dataset.fccProperty) {
      fccProperty.currValue = e.currentTarget.dataset.id;
      this.updatePanelMenuUI(fccProperty.currValue);
      break;
    }
  }
};

playerUI.onFccPropertyItemBlur = function(e) {
  var prevFocus = e.target;
  var nextFocus = e.relatedTarget;

  if (nextFocus) {
    if (nextFocus === this.vopSettingsBtn) {
      // means we click 'setting' button, do nothing here, onUICmdSetting will handle for us.
    } else {
      if (prevFocus) {
        if (-1 === prevFocus.className.indexOf('vop-menuitem')) {
          // means click another item, do nothing here, on***ItemClick will handle for us.
        } else {}
      } else {}
    }
  } else {
    this.destroySettingsMenu();
  }
};

playerUI.playerTest = function() {
  this.player_.test();
};

/////////////////////////////////////////////////////////////////////////
// Title: UI Command
function onBtnInit() {

}

function onBtnUninit() {

}

function onBtnOpen() {
  playerUI.playerOpen();
}

function onBtnClose() {
  playerUI.playerClose();
}

function onBtnPlay() {
  playerUI.vopPlayButton.click();
}

function onBtnManualSchedule() {
  playerUI.onBtnManualSchedule();
}

function onBtnInitAD() {
  playerUI.playerRequestAds();
}

function onBtnDelAll() {}

function onBtnStop() {}

function onBtnPlayAd() {}

function onBtnTest() {
  playerUI.playerTest();
}

function onBtnTest2() {
  printLog('--onBtnTest2--');
  playerUI.player_.setAudioPlaybackSpeed(2);

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

function onBtnSeek() {
  var time = document.getElementById('seekedTime').value;
  playerUI.player_.setPosition(time);
}

/////////////////////////////////////////////////////////////////////////
// Title: experience functions
function onBtnTmp1() {
  // visual viewport 鍙瑙嗗彛 灞忓箷瀹藉害
  // layout viewport 甯冨眬瑙嗗彛 DOM瀹藉害
  // ideal viewport 鐞嗘兂閫傚彛锛氫娇甯冨眬瑙嗗彛灏辨槸鍙瑙嗗彛
  // 璁惧瀹藉害(visual viewport)涓嶥OM瀹藉害(layout viewport), scale鐨勫叧绯讳负锛

  // 锛坴isual viewport锛? 锛坙ayout viewport锛? scale
  // 鑾峰彇灞忓箷瀹藉害(visual viewport)鐨勫昂瀵革細window. innerWidth/Height銆
  // 鑾峰彇DOM瀹藉害(layout viewport)鐨勫昂瀵革細document. documentElement. clientWidth/Height銆

  printLog('visual viewport, width: ' + window.width + ', height: ' + window.height);
  printLog('layout viewport, width: ' + document.width + ', height: ' + document.height);

  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  printLog('screen, width: ' + width);
}

/////////////////////////////////////////////////////////////////////////
// Title: chromecast cmd part
var castSender = null;

function onUICmdCastInit() {
  playerUI.castSender_.new_init(cfg_);

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
  playerUI.castSender_.new_open(mediaCfg_);
}

function onUICmdCastAdd() {
  playerUI.castSender_.new_add();
}

function onUICmdCastAddPD() {}

function onUICmdCastPlay() {
  playerUI.castSender_.new_play();
}

function onUICmdCastPause() {}

function onUICmdCastPlayAd() {}

function onUICmdCastTest() {
  playerUI.castSender_.new_test();
}

function onUICmdCastSeek() {
  var time = document.getElementById('castSeekedTime').value;
  playerUI.castSender_.new_setPosition(time);
}

/////////////////////////////////////////////////////////////////////////
// dynamic load main.css file
window.onload = function() {
  // print browser version info
  browserInfo = oldmtn.CommonUtils.getBrowserInfo();
  console.log('browser: ' + browserInfo.browser + ', version: ' + browserInfo.version);

  playerUI.initVariable();
  playerUI.initUIElements();
  playerUI.initUIEventListeners();

  playerUI.playerInit();

  // BD
  //onBtnTmp1();
  // ED
};

window.onunload = function() {
  //onBtnStop();
};