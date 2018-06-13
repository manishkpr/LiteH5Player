import React from 'react';
import ReactDOM from 'react-dom';
import ResizeSensor from 'resize-sensor';

import "./ui_player.css";

import UISubtitleMenu from './ui_subtitle_menu';
import UISettingMenu from './ui_setting_menu';
import UIQualityMenu from './ui_quality_menu';
import UIAudioTrackMenu from './ui_audio_track_menu';
import UIFccMenu from './ui_fcc_menu';
import UIFccPropertyMenu from './ui_fcc_property_menu';
import UIXSpeedMenu from './ui_xspeed_menu';

class UIPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.initVariable();

    this.state = {
      settingMenuUIData: this.settingMenuUIData
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.initUIElements();
    this.initUIEventListeners();
  }

  render() {
    return (
      <div className="html5-video-player vop-autohide"
        onClick={this.onPlayerClick.bind(this)}
        onMouseEnter={this.onPlayerMouseEnter.bind(this)}
        onMouseMove={this.onPlayerMouseMove.bind(this)}
        onMouseLeave={this.onPlayerMouseLeave.bind(this)}>
        <div className="vop-video-container">
          <video className="vop-video" playsInline="true" webkit-playsinline="true">
          </video>
        </div>
        <div className="vop-ads-container"></div>
        <div className="vop-tooltip">
          <div className="vop-tooltip-bg"></div>
          <div className="vop-tooltip-text-wrapper">
            <span className="vop-tooltip-text">00:00</span>
          </div>
        </div>
        <div className="vop-popup vop-settings-menu" onClick={this.onSettingsMenuClick.bind(this)}>
          <div className="vop-panel">
            <UISubtitleMenu state={this.state}
              onSubtitleMenuBack={this.onSubtitleMenuBack.bind(this)}
              onSubtitleMenuItemClick={this.onSubtitleMenuItemClick.bind(this)}
              onSubtitleMenuItemBlur={this.onSubtitleMenuItemBlur.bind(this)} />
            <UISettingMenu state={this.state}
              onMainMenuItemClick={this.onMainMenuItemClick.bind(this)}
              onMainMenuItemBlur={this.onMainMenuItemBlur.bind(this)} />
            <UIQualityMenu state={this.state}
              onQualityMenuBack={this.onQualityMenuBack.bind(this)}
              onQualityMenuItemClick={this.onQualityMenuItemClick.bind(this)}
              onQualityMenuItemBlur={this.onQualityMenuItemBlur.bind(this)} />
            <UIAudioTrackMenu state={this.state}
              onAudioTrackMenuBack={this.onAudioTrackMenuBack.bind(this)}
              onAudioTrackMenuItemClick={this.onAudioTrackMenuItemClick.bind(this)}
              onAudioTrackMenuItemBlur={this.onAudioTrackMenuItemBlur.bind(this)} />
            <UIFccMenu state={this.state}
              onFccMenuBack={this.onFccMenuBack.bind(this)}
              onFccMenuItemClick={this.onFccMenuItemClick.bind(this)}
              onFccMenuItemBlur={this.onFccMenuItemBlur.bind(this)} />
            <UIFccPropertyMenu state={this.state}
              onFccPropertyMenuBack={this.onFccPropertyMenuBack.bind(this)}
              onFccPropertyMenuItemClick={this.onFccPropertyMenuItemClick.bind(this)}
              onFccPropertyMenuItemBlur={this.onFccPropertyMenuItemBlur.bind(this)} />
            <UIXSpeedMenu state={this.state}
              onXSpeedMenuBack={this.onXSpeedMenuBack.bind(this)}
              onXSpeedMenuItemClick={this.onXSpeedMenuItemClick.bind(this)}
              onXSpeedMenuItemBlur={this.onXSpeedMenuItemBlur.bind(this)} />
          </div>
        </div>
        <div className="vop-gradient-bottom"></div>
        <div className="vop-control-bar" onClick={this.onUICmdControlBarClick.bind(this)}>
          <div className="vop-progress-bar"
            onMouseDown={this.onProgressBarMouseDown.bind(this)}
            onMouseMove={this.onProgressBarMouseMove.bind(this)}
            onMouseLeave={this.onProgressBarMouseLeave.bind(this)}>
            <div className="vop-progress-list">
              <div className="vop-load-progress"></div>
              <div className="vop-play-progress"></div>
              <div className="vop-hover-progress"></div>
            </div>
            <div className="vop-scrubber-container"></div>
          </div>
          <div className="vop-controls">
            <div className="vop-left-controls">
              <button className="vop-button material-icons vop-play-button" title="play"
                onClick={this.onUICmdPlay.bind(this)}
                onMouseMove={this.onControlMouseMove.bind(this)}>&#xe037;</button>
              <button className="vop-button material-icons vop-mute-button" title="mute"
                onClick={this.onUICmdMute.bind(this)}
                onMouseMove={this.onControlMouseMove.bind(this)}>&#xe050;</button>
              <div className="vop-volume-panel">
                <div className="vop-volume-slider" onMouseDown={this.onVolumeSliderMouseDown.bind(this)}>
                  <div className="vop-volume-slider-handle">
                  </div>
                </div>
              </div>
              <div className="vop-time-display"><span className="vop-time-text">00:00/00:00</span></div>
            </div>
            <div className="vop-right-controls">
              <button className="vop-button material-icons vop-subtitles-button" title="subtitles"
                onClick={this.onUICmdSubtitleMenu.bind(this)}
                onMouseMove={this.onControlMouseMove.bind(this)}>&#xe048;</button>
              <button className="vop-button material-icons vop-settings-button" title="settings"
                onClick={this.onUICmdSetting.bind(this)}
                onMouseMove={this.onControlMouseMove.bind(this)}>&#xe8b8;</button>
              <button className="vop-button material-icons vop-fullscreen-button" title="fullscreen"
                onClick={this.onUICmdFullscreen.bind(this)}
                onMouseMove={this.onControlMouseMove.bind(this)}>&#xe5d0;</button>
            </div>
          </div>
        </div>
        <div className="vop-caption-window">
        </div>
        <div className="vop-spinner">
          <div className="vop-spinner-container">
            <div className="vop-spinner-rotator">
              <div className="vop-spinner-left">
                <div className="vop-spinner-circle">
                </div>
              </div>
              <div className="vop-spinner-right">
                <div className="vop-spinner-circle">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="vop-giant-button-container" style={{display: 'none'}} onAnimationEnd={this.onGiantAnimationEnd.bind(this)}>
          <div className="material-icons vop-giant-button" style={{color: 'white', fontSize: '48px'}}>&#xe037;</div>
        </div>
      </div>
    )
  }

  ///////////////////////////////////////////////////////////////////////
  initVariable() {
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
    this.settingMenuUIData = {
      currMenu: 'none', // none, main_menu, quality_menu, audio_track_menu, fcc_menu, fcc_property_menu, subtitle_menu, xspeed_menu

      // main setting menu
      mainList: [{
        id: '1',
        text: 'Quality'
      }, {
        id: '2',
        text: 'Language'
      }, {
        id: '3',
        text: 'Subtitle'
      }, {
        id: '4',
        text: 'XSpeed'
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

      // subtitle menu
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
      currSubtitleId: '',

      // FCC settings menu
      currFccPropertyName: 'background_color', // only valid when currMenu is 'fcc_property_menu'.
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
      }],

      // X-Speed
      currSpeed: '3',
      xspeedList: [{
        id: '1',
        value: 0.25
      }, {
        id: '2',
        value: 0.5
      }, {
        id: '3',
        value: 1.0
      }, {
        id: '4',
        value: 1.5
      }, {
        id: '5',
        value: 2.0
      }]
    };

    // reference variable of ad
    this.flagAdStarted = false;
    this.flagIsLinearAd = false;
  }

  // Title: init part
  initUIElements() {
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

    //
    this.video_ = document.querySelector('.vop-video');
    this.adContainer_ = document.querySelector('.vop-ads-container');
  }

  initUIEventListeners() {
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
  }

  playerInit(cfg) {
    this.player_ = new oldmtn.Player(this.video_, this.adContainer_);
    this.player_.init(cfg);

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
    if (0) {
      var receiverAppId = 'E19ACDB8'; // joseph test app1
      //var receiverAppId = 'CBEF8A9C'; // joseph, css.visualon.info
      //var receiverAppId = 'FAC6871E'; // joseph, css.visualon.info

      // init chromecast sender
      this.castSender_ = new oldmtn.CastSender(receiverAppId);
    }

    // update state machine
    this.updateUIStateMachine('inited');
  };

  playerOpen(mediaCfg) {
    var p = this.player_.open(mediaCfg);
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

  playerClose() {
    printLog('+onBtnClose');
    this.player_.close();
    this.updateUIStateMachine('closed');
  };

  playerRequestAds() {
    this.player_.playAd();
  };

  onBtnInit() {
    this.player_.init(cfg_);
  };

  onBtnUninit() {
    this.player_.uninit(cfg_);
  };

  ///////////////////////////////////////////////////////////////////////////
  // Title: UI reference functions
  // This function is mainly focus on:
  // 1. Record the player state, and refect it to UI
  updateUIStateMachine(state) {
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
        {}
        break;
      default:
        break;
    }
  };

  startBufferingUI() {
    this.vopSpinner.style.display = 'block';
  };

  stopBufferingUI() {
    this.vopSpinner.style.display = 'none';
  };

  // begin progress bar
  updateVolumeMovePosition(e) {
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

  getProgressMovePosition(e) {
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

  updateProgressBarUI(position, duration) {
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

  updateProgressBarHoverUI() {
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

  updateTooltipUI(e) {
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

    // set the correct offset of tooltip.
    var offsetX = getTooltipOffsetX.call(this, e, this.vopTooltip.clientWidth);
    this.vopTooltip.style.left = offsetX.toString() + 'px';
  };

  updateAdProgressUI() {
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

  updatePlayBtnUI(paused, ended) {
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

  updateGiantPlayBtnUI(paused) {
    if (paused) {
      this.uiGiantButton.innerHTML = this.iconPause;
    } else {
      this.uiGiantButton.innerHTML = this.iconPlay;
    }
    this.uiGiantBtnContainer.style = '';
  };

  updateContentVolumeBarUI(muted, volume) {
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
  removeAutohideAction() {
    $('.html5-video-player').removeClass('vop-autohide');
    if (this.timerHideControlBar) {
      clearTimeout(this.timerHideControlBar);
      this.timerHideControlBar = null;
    }
  };

  docVolumeSliderMousemove(e) {
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

  docVolumeSliderMouseup(e) {
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
      this.onPlayerMouseLeave();
    }
  };

  captureVolumeSliderMouseEvents() {
    newVolumeSliderMousemove = this.docVolumeSliderMousemove.bind(this);
    newVolumeSliderMouseup = this.docVolumeSliderMouseup.bind(this);

    document.addEventListener('mousemove', newVolumeSliderMousemove, true);
    document.addEventListener('mouseup', newVolumeSliderMouseup, true);
  };

  releaseVolumeSliderMouseEvents() {
    document.removeEventListener('mousemove', newVolumeSliderMousemove, true);
    document.removeEventListener('mouseup', newVolumeSliderMouseup, true);
  };

  ///////////////////////////////////////////////////////////////////
  onPlayerMouseEnter() {
    // Don't show control bar if the stream is not initialized.
    if (this.playerState_ !== 'opened') {
      return;
    }

    $('.html5-video-player').removeClass('vop-autohide');
  };

  onPlayerMouseMove(e) {
    //printLog('+onPlayerMouseMove');
    // don't show control bar if the stream is not initialized.
    if (this.playerState_ !== 'opened') {
      return;
    }

    this.removeAutohideAction();
    this.timerHideControlBar = setTimeout(function() {
      this.onPlayerMouseLeave();
    }.bind(this), 3000);
  };

  onPlayerMouseLeave() {
    var paused = this.player_.isPaused();
    var fullscreen = isFullscreen();
    if (!paused && !this.progressBarContext.mousedown && !this.flagVolumeSliderMousedown && !fullscreen) {
      $('.html5-video-player').addClass('vop-autohide');
    }
  };

  onPlayerClick() {
    if (this.flagAdStarted && this.flagIsLinearAd) {
      return;
    }

    this.onUICmdPlay();
  };

  // browser & UI callback functions
  onUICmdPlay() {
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

  onControlMouseMove(e) {
    e.stopPropagation();
    this.removeAutohideAction();
  };

  onGiantAnimationEnd(e) {
    this.uiGiantBtnContainer.style.display = 'none';
  }

  onSettingsMenuClick(e) {
    // Don't route 'click' event from panel to its parent div
    e.stopPropagation();
  };

  onUICmdControlBarClick(e) {
    e.stopPropagation();
  };

  onUICmdMute() {
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
  }

  onBtnManualSchedule() {
    this.player_.manualSchedule();
  }

  onBtnInitAD() {
    this.player_.test();
  }

  onBtnDelAll() {
    this.player_.dellAll();
  }

  onBtnStop() {
    this.player_.close();
    this.player_ = null;
  }

  onUICmdSubtitleMenu() {
    printLog('+onUICmdSubtitleMenu, currMenu: ' + this.settingMenuUIData.currSubtitleId);

    if (this.settingMenuUIData.currMenu !== 'subtitle_menu') {
      this.settingMenuUIData.currMenu = 'subtitle_menu';
    } else {
      this.settingMenuUIData.currMenu = 'none';
    }
    this.updateUIState();
  }

  onUICmdSetting(e) {
    printLog('+onUICmdSetting, currMenu: ' + this.settingMenuUIData.currMenu);

    if (this.settingMenuUIData.currMenu !== 'none') {
      this.settingMenuUIData.currMenu = 'none';
    } else {
      this.settingMenuUIData.currMenu = 'main_menu';
    }

    this.updateUIState();
  }

  onUICmdFullscreen() {
    printLog('+onBtnFullscreen');
    if (isFullscreen()) {
      h5LeaveFullscreen();
    } else {
      h5EnterFullscreen();
    }
  };

  onBtnSeek() {
    var time = document.getElementById('seekedTime').value;
    this.player_.setPosition(time);
  };

  onBtnAddTextTrack() {
    if (this.player_) {
      this.player_.addTextTrack();
    }
  };

  onBtnRemoveTextTrack() {
    this.player_.removeTextTrack();
  };

  setTextTrackHidden() {
    this.player_.setTextTrackHidden();
  };

  setCueAlign(align) {
    this.player_.setCueAlign(align);
  };

  onFruitClick() {
    alert('aaaa');
  };

  onBtnAttribute() {
    //this.player_.attribute();
  };

  //
  onUICmdCastInit() {
    var cfg = getInitConfig();
    this.castSender.new_init(cfg);
  };

  onUICmdCastOpen() {
    var info = getMediaInfo();
    this.castSender.new_open(info);
  };

  onUICmdCastAddV() {
    this.castSender.new_addV();
  }

  onUICmdCastAddPD() {
    this.castSender.new_addPD();
  };

  onUICmdCastPlay() {
    this.castSender.new_play();
  };

  onUICmdCastPause() {
    this.castSender.new_pause();
  };

  onUICmdCastPlayAd() {
    this.castSender.new_playAd();
  };

  onUICmdCastTest() {
    this.castSender.new_test();
  };

  doEnterThumbnailMode() {
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

  doProcessThumbnailMove() {
    // for further action, you can add thumbnail popup here.
  };

  doProcessThumbnailUp() {
    // for further action, you can add thumbnail ended event here.
  };

  onProgressBarMouseDown(e) {
    printLog('+onProgressBarMouseDown');
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

  onProgressBarMouseMove(e) {
    //printLog('+onProgressBarMouseMove');
    e.stopPropagation();
    this.removeAutohideAction();

    // if mouse down, just return
    if (this.progressBarContext.mousedown ||
      this.settingMenuUIData.currMenu !== 'none') {
      return;
    }

    // update progress bar ui
    this.progressBarContext.movePos = this.getProgressMovePosition(e);
    this.updateProgressBarHoverUI();
    this.updateTooltipUI(e);
  };

  onProgressBarMouseLeave() {
    //printLog('+onProgressBarMouseLeave');
    this.vopTooltip.style.display = 'none';
  };

  captureProgressBarMouseEvents() {
    this.newProgressBarMousemove = this.docProgressBarMousemove.bind(this);
    this.newProgressBarMouseup = this.docProgressBarMouseup.bind(this);

    document.addEventListener('mousemove', this.newProgressBarMousemove, true);
    document.addEventListener('mouseup', this.newProgressBarMouseup, true);
  };

  releaseProgressBarMouseEvents() {
    document.removeEventListener('mousemove', this.newProgressBarMousemove, true);
    document.removeEventListener('mouseup', this.newProgressBarMouseup, true);
  };

  docProgressBarMousemove(e) {
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

  docProgressBarMouseup(e) {
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

  onVolumeSliderMouseDown(e) {
    printLog('+onVolumeSliderMouseDown');
    this.captureVolumeSliderMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    this.flagVolumeSliderMousedown = true;

    this.docVolumeSliderMousemove(e);
  };

  ////////////////////////////////////////////////////////////////////////////////////
  // this.player_ event callback
  onMediaDurationChanged() {
    this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());
  };

  onMediaEnded() {
    var paused = this.player_.isPaused();
    var ended = this.player_.isEnded();
    this.updatePlayBtnUI(paused, ended);

    //
    this.progressBarContext.movePos = this.player_.getPosition();
    this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());

    //
    this.updateUIStateMachine('ended');
  };

  onOpenComplete() {
    if (this.playerState_ === 'opening') {
      printLog('+onOpenComplete');
      this.updateUIStateMachine('opened');

      // update volume here
      var muted = this.player_.isMuted();
      var volume = this.player_.getVolume();

      this.updateContentVolumeBarUI(muted, volume);
    }
  };

  onMediaLoadedMetaData(e) {
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

  onMediaPaused() {};

  onMediaPlaying() {
    var paused = this.player_.isPaused();
    var ended = this.player_.isEnded();
    this.updatePlayBtnUI(paused, ended);

    this.stopBufferingUI();
  };

  onMediaSeeking() {
    printLog('+onMediaSeeking, pos: ' + this.player_.getPosition());
  };

  onMediaSeeked() {
    printLog('+onMediaSeeked, pos: ' + this.player_.getPosition());

    if (!this.progressBarContext.pausedBeforeMousedown || this.progressBarContext.endedBeforeMousedown) {
      this.player_.play();
      // update ui
      var paused = false;
      var ended = this.player_.isEnded();
      this.updatePlayBtnUI(paused, ended);
    }
  };

  onMediaTimeupdated() {
    //printLog('+onMediaTimeupdated, position: ' + this.player_.getPosition() + ', duration: ' + this.player_.getDuration());

    // Sometime, the timeupdate will trigger after we mouse down on the progress bar,
    // in this situation, we won't update progress bar ui.
    if (this.progressBarContext.mousedown) {} else {
      //this.progressBarContext.movePos = this.player_.getPosition();
      this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());
      this.updateProgressBarHoverUI();
    }
  };

  onMediaVolumeChanged() {
    var muted = this.player_.isMuted();
    var volume = this.player_.getVolume();
    this.updateContentVolumeBarUI(muted, volume);
  };

  onMediaWaiting() {
    this.startBufferingUI();
  };

  onLog(e) {
    printLogUI(e.message);
  };

  onAdStarted(e) {
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

  onAdComplete() {
    printLog('onAdComplete, linear: ' + this.flagIsLinearAd);
    this.flagAdStarted = false;

    // update control bar ui
    this.vopProgressBar.style.display = 'block';
    this.vopSubtitlesBtn.style.display = 'inline-block';
    this.vopSettingsBtn.style.display = 'inline-block';
  };

  onAdTimeUpdate() {
    var position = this.player_.getPosition();
    var duration = this.player_.getDuration();
    //printLog('ad position: ' + position + ', duration: ' + duration);
    this.updateAdProgressUI();
  };

  onAdCompanions(e) {
    var v = document.getElementById('idCompanionAd');
    for (var i = 0; i < e.companions.length; i++) {
      var companion = e.companions[i];
      if (v.clientWidth === companion.width && v.clientHeight === companion.height) {
        v.innerHTML = companion.content;
      }
    }
  };

  onFullscreenChanged() {
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
  // Title: Sub Components Callbacks
  onQualityMenuClick(e) {
    printLog('+onQualityMenuClick: ' + e.target.innerText);
    this.settingMenuUIData.currMenu = 'quality_menu';
    this.updateUIState();
  }

  onAudioTrackMenuClick(e) {
    this.settingMenuUIData.currMenu = 'audio_track_menu';
    this.updateUIState();
  }

  onFccMenuClick(e) {
    this.settingMenuUIData.currMenu = 'fcc_menu';
    this.updateUIState();
  }

  onXSpeedMenuClick(e) {
    this.settingMenuUIData.currMenu = 'xspeed_menu';
    this.updateUIState();
  }

  onMainMenuItemBlur(e) {
    var text = '';
    if (e.relatedTarget) {
      text = ', text: ' + e.relatedTarget.innerText;
    }

    printLog('+onMainMenuItemBlur, this.settingMenuUIData.currMenu: ' + this.settingMenuUIData.currMenu + text);

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
      this.settingMenuUIData.currMenu = 'none';
      this.updateUIState();
    }
  }

  onSubtitleMenuBack(e) {
    printLog('+onSubtitleMenuBack');
    this.settingMenuUIData.currMenu = 'none';
    this.updateUIState();
  }

  onSubtitleMenuItemClick(e) {
    e.stopPropagation();

    var id = e.currentTarget.dataset.id;
    if (this.settingMenuUIData.currSubtitleId === id) {
      this.settingMenuUIData.currSubtitleId = '';
    } else {
      this.settingMenuUIData.currSubtitleId = id;
    }

    this.updateUIState();
  }

  onSubtitleMenuItemBlur(e) {
    if (e.relatedTarget) {
      if (e.relatedTarget === this.vopSubtitlesBtn) {
        if (this.settingMenuUIData.currMenu === 'main_menu') {
          // do nothing
        }
      }
    } else {
      this.settingMenuUIData.currMenu = 'none';
      this.updateUIState();
    }

  }

  onQualityMenuBack(e) {
    this.settingMenuUIData.currMenu = 'main_menu';
    this.updateUIState();
  }

  onMainMenuItemClick(e) {
    printLog('+onMainMenuItemClick, '
      + ' this.settingMenuUIData.currMenu: ' + this.settingMenuUIData.currMenu
      + ', text: ' + e.target.innerText);
    var nextFocus = e.currentTarget;

    printLog('id: ' + nextFocus.dataset.id);
    switch (nextFocus.dataset.id) {
      case '1':
      this.onQualityMenuClick(e);
      break;
      case '2':
      this.onAudioTrackMenuClick(e);
      break;
      case '3':
      this.onFccMenuClick(e);
      break;
      case '4':
      this.onXSpeedMenuClick(e);
      default:
      break;
    }
  }

  onQualityMenuItemClick(e) {
    printLog('+onQualityMenuItemClick, this.settingMenuUIData.currMenu: ' + this.settingMenuUIData.currMenu +
      ', text: ' + e.target.innerText);
    var nextFocus = e.currentTarget;

    this.settingMenuUIData.currQualityId = nextFocus.dataset.id;
    this.updateUIState();
  }

  onQualityMenuItemBlur(e) {
    printLog('+onQualityMenuItemBlur');
    var nextFocus = e.relatedTarget;
    if (nextFocus) {
      printLog('className: ' + nextFocus.className);
      if (nextFocus.className.indexOf('vop-panel-title') !== -1 ||
        nextFocus.className.indexOf('vop-menuitem') !== -1) {
        // click on quality menu, do nothing
      } else {
        this.settingMenuUIData.currMenu = 'none';
        this.updateUIState();
      }
    } else {
      this.settingMenuUIData.currMenu = 'none';
      this.updateUIState();
    }
  };

  onAudioTrackMenuBack(e) {
    printLog('+onAudioTrackMenuBack');
    this.settingMenuUIData.currMenu = 'main_menu';
    this.updateUIState();
  };

  onAudioTrackMenuItemClick(e) {
    printLog('+onAudioTrackMenuItemClick');
    var nextFocus = e.currentTarget;

    this.settingMenuUIData.currAudioTrackId = nextFocus.dataset.id;
    this.updateUIState();
  }

  onAudioTrackMenuItemBlur(e) {
    printLog('+onAudioTrackMenuItemBlur');
    this.onQualityMenuItemBlur(e);
  }

  onFccMenuBack(e) {
    this.settingMenuUIData.currMenu = 'main_menu';
    this.updateUIState();
  }

  onFccMenuItemClick(e) {
    printLog('+onFccMenuItemClick, e.currentTarget.dataset.id: ' + e.currentTarget.dataset.id);

    this.settingMenuUIData.currMenu = 'fcc_property_menu';
    this.settingMenuUIData.currFccPropertyName = e.currentTarget.dataset.id;
    this.updateUIState();
  }

  onFccMenuItemBlur(e) {
  }

  onFccPropertyMenuBack(e) {
    this.settingMenuUIData.currMenu = 'fcc_menu';
    this.updateUIState();
  }

  onFccPropertyMenuItemClick(e) {
    printLog('+onFccPropertyMenuItemClick, e.currentTarget.dataset.id: ' + e.currentTarget.dataset.id);

    for (var i = 0; i < this.settingMenuUIData.fccPropertyList.length; i++) {
      var fccProperty = this.settingMenuUIData.fccPropertyList[i];
      if (fccProperty.name === this.settingMenuUIData.currFccPropertyName) {
        fccProperty.currValue = e.currentTarget.dataset.id;
        this.updateUIState();
        break;
      }
    }
  }

  onFccPropertyMenuItemBlur(e) {
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
      this.settingMenuUIData.currMenu = 'none';
      this.updateUIState();
    }
  }

  onXSpeedMenuBack(e) {
    this.settingMenuUIData.currMenu = 'main_menu';
    this.updateUIState();
  }

  onXSpeedMenuItemClick(e) {
    printLog('+onXSpeedMenuItemClick');
    var nextFocus = e.currentTarget;

    this.settingMenuUIData.currSpeed = nextFocus.dataset.id;
    this.updateUIState();
  }

  onXSpeedMenuItemBlur(e) {
    printLog('+onXSpeedMenuItemBlur');
    this.onQualityMenuItemBlur(e);
  }

  playerTest() {
    this.player_.test();
  }

  updateUIState() {
    this.setState({
      settingMenuUIData: this.settingMenuUIData
    });
  }
}

export default UIPlayer;