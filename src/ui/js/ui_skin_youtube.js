import React from 'react';
import ResizeSensor from 'resize-sensor';

import '../css/ui_skin_youtube.scss';

import UITools from './ui_tools';

// Menu Part
import UISubtitleMenu from './components/ui_subtitle_menu';
import UISettingMenu from './components/ui_setting_menu';
import UIQualityMenu from './components/ui_quality_menu';
import UIAudioTrackMenu from './components/ui_audio_track_menu';
import UIFccMenu from './components/ui_fcc_menu';
import UIFccPropertyMenu from './components/ui_fcc_property_menu';
import UIXSpeedMenu from './components/ui_xspeed_menu';

import UIVolumeToggleButton from './components/ui_volumetogglebutton';
import UIVolumeBar from './components/ui_volumebar';

import UIGiantButtonOverlay from './components/ui_giantbutton_overlay';
import UIBufferingOverlay from './components/ui_buffering_overlay';
import UILogo from './components/ui_logo';

import UIFullscreenToggleButton from './components/ui_fullscreentogglebutton';


class UISkinYoutube extends React.Component {
  constructor(props) {
    super(props);

    this.initVariable();
    this.player_ = props.player;
    this.state = {
      settingMenuUIData: this.settingMenuUIData
    };
  }

  componentWillMount() {
    console.log('+componentWillMount');
  }

  componentDidMount() {
    console.log('+componentDidMount');

    this.initUIElements();
    this.initUIElementsStyles();
    this.initUIEventListeners();
    this.initPlayerListeners();

    this.syncPlayerStateToUI();
  }

  componentWillUnmount() {
    console.log('+componentWillUnmount');
    this.uninitUIEventListeners();
    this.uninitPlayerListeners();

    this.removeAutohideAction();
    UITools.removeClass(this.vopPlayer, 'vop-autohide');
    // Since we want to use ads-container to show ad, if we add 'controls' attribute to video element,
    // it the video control will never shown, because ads-container is on top of it.
    //this.vopVideo.setAttribute('controls', 'true');
  }

  render() {
    return (
      <div className="vop-skin-youtube"
        onMouseEnter={this.onPlayerMouseEnter.bind(this)}
        onMouseLeave={this.onPlayerMouseLeave.bind(this)}
        onMouseMove={this.onPlayerMouseMove.bind(this)}
        onMouseDown={this.onPlayerMouseDown.bind(this)}
        onMouseUp={this.onPlayerMouseUp.bind(this)}>
        <div className="vop-tooltip">
          <div className="vop-tooltip-bg"></div>
          <div className="vop-tooltip-text-wrapper">
            <span className="vop-tooltip-text">00:00</span>
          </div>
        </div>
        <div className="vop-popup vop-settings-menu"
          onMouseDown={this.onPopupMenuMouseDown.bind(this)}>
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
        <div className="vop-control-bar"
          onMouseDown={this.onUICmdControlBarMouseDown.bind(this)}>
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
              <button className="vop-button vop-play-button vop-style-play" title="play"
                onClick={this.onUICmdPlay.bind(this)}
                onMouseMove={this.onControlMouseMove.bind(this)}></button>
              <UIVolumeToggleButton player={this.player_} onControlMouseMove={this.onControlMouseMove.bind(this)} />
              <UIVolumeBar
                onVolumeSliderMouseDown={this.onVolumeSliderMouseDown.bind(this)}
                onVolumePanelMouseMove={this.onControlMouseMove.bind(this)}/>
              <div className="vop-time-display"><span className="vop-time-text">00:00/00:00</span></div>
            </div>
            <div className="vop-right-controls">
              <button className="vop-button vop-subtitles-button vop-style-subtitles" title="subtitles"
                onClick={this.onUICmdSubtitles.bind(this)}
                onMouseMove={this.onControlMouseMove.bind(this)}></button>
              <button className="vop-button vop-settings-button vop-style-settings" title="settings"
                onClick={this.onUICmdSettings.bind(this)}
                onMouseMove={this.onControlMouseMove.bind(this)}></button>
              <UIFullscreenToggleButton main={this} />
            </div>
          </div>
        </div>
        <div className="vop-caption-window">
        </div>
        <UIBufferingOverlay main={this}/>
        <UIGiantButtonOverlay main={this}/>
        <UILogo />
      </div>
    )
  }

  ///////////////////////////////////////////////////////////////////////
  initVariable() {
    this.player_ = null;
    this.castSender_ = null;
    this.ratio = 0.5625;

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
    this.vopVolumeSlider = null;
    this.vopVolumeSliderHandle = null;

    this.vopSubtitlesBtn;
    this.vopSettingsBtn;
    this.vopSettingsMenu;
    this.vopPanel;
    this.vopPanelMenu;

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

    //
    this.onStateChange = this.onStateChange.bind(this);

    this.onMediaDurationChanged = this.onMediaDurationChanged.bind(this);
    this.onMediaEnded = this.onMediaEnded.bind(this);
    this.onMediaLoadedMetaData = this.onMediaLoadedMetaData.bind(this);
    this.onMediaPaused = this.onMediaPaused.bind(this);
    this.onMediaSeeking = this.onMediaSeeking.bind(this);
    this.onMediaSeeked = this.onMediaSeeked.bind(this);
    this.onMediaTimeupdated = this.onMediaTimeupdated.bind(this);
    this.onMediaVolumeChanged = this.onMediaVolumeChanged.bind(this);
    
    this.onLog = this.onLog.bind(this);

    // ad callback event
    this.onAdStarted = this.onAdStarted.bind(this);
    this.onAdComplete = this.onAdComplete.bind(this);
    this.onAdTimeUpdate = this.onAdTimeUpdate.bind(this);
    this.onAdCompanions = this.onAdCompanions.bind(this);

    //
    this.onResizeSensorCb = this.onResizeSensorCb.bind(this);
    this.onFullscreenChanged = this.onFullscreenChanged.bind(this);
  }

  // Title: init part
  initUIElements() {
    this.playerContainer = document.getElementById('player-container');
    this.vopPlayer = document.querySelector('.html5-video-player');

    this.vopSkinContainer = document.querySelector('.vop-skin-youtube');

    this.vopTooltip = document.querySelector('.vop-tooltip');
    this.vopTooltipBg = document.querySelector('.vop-tooltip-bg');
    this.vopTooltipText = document.querySelector('.vop-tooltip-text');

    this.vopControlBar = document.querySelector('.vop-control-bar');
    this.vopProgressBar = document.querySelector('.vop-progress-bar');
    this.vopLoadProgress = document.querySelector('.vop-load-progress');
    this.vopPlayProgress = document.querySelector('.vop-play-progress');
    this.vopHoverProgress = document.querySelector('.vop-hover-progress');

    this.vopScrubberContainer = document.querySelector('.vop-scrubber-container');
    this.vopVolumeSlider = document.querySelector('.vop-volume-slider');
    this.vopVolumeSliderHandle = document.querySelector('.vop-volume-slider-handle');

    this.uiLog = document.getElementById('idLog');

    this.vopPlayButton = this.vopSkinContainer.querySelector('.vop-play-button');
    this.vopVolumeButton = this.vopSkinContainer.querySelector('.vop-volume-button');
    this.vopPauseButton = this.vopSkinContainer.querySelector('.vop-pause-button');
    this.vopSubtitlesBtn = this.vopSkinContainer.querySelector('.vop-subtitles-button');
    this.vopSettingsBtn = this.vopSkinContainer.querySelector('.vop-settings-button');
    this.vopFullscreenBtn = this.vopSkinContainer.querySelector('.vop-fullscreen-button');

    // setting panel
    this.vopSettingsMenu = this.vopSkinContainer.querySelector('.vop-settings-menu');
    this.vopPanel = this.vopSettingsMenu.querySelector('.vop-panel');
    this.vopPanelMenu = this.vopSettingsMenu.querySelector('.vop-panel-menu');

    //
    this.vopVideo = document.querySelector('.vop-video');
    this.vopVideo.removeAttribute('controls');
    this.vopAdContainer = document.querySelector('.vop-ads-container');
  }

  initUIElementsStyles() {
    //this.vopPlayProgress.style.backgroundColor = '#FA12FF';
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
      ro.observe(this.vopPlayer);
    } else {
      this.playerResizeSensor_ = new ResizeSensor(this.playerContainer, this.onResizeSensorCb);
    }
  }

  uninitUIEventListeners() {
    this.playerResizeSensor_ = null;
  }

  initPlayerListeners() {
    this.player_.on(oldmtn.Events.STATE_CHANGE, this.onStateChange);

    this.player_.on(oldmtn.Events.MEDIA_DURATION_CHANGED, this.onMediaDurationChanged);
    this.player_.on(oldmtn.Events.MEDIA_ENDED, this.onMediaEnded);
    this.player_.on(oldmtn.Events.MEDIA_LOADEDMETADATA, this.onMediaLoadedMetaData);
    this.player_.on(oldmtn.Events.MEDIA_PAUSED, this.onMediaPaused);
    this.player_.on(oldmtn.Events.MEDIA_SEEKING, this.onMediaSeeking);
    this.player_.on(oldmtn.Events.MEDIA_SEEKED, this.onMediaSeeked);
    this.player_.on(oldmtn.Events.MEDIA_TIMEUPDATE, this.onMediaTimeupdated);
    this.player_.on(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged);

    this.player_.on(oldmtn.Events.LOG, this.onLog);

    // ad callback event
    this.player_.on(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player_.on(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
    this.player_.on(oldmtn.Events.AD_TIMEUPDATE, this.onAdTimeUpdate);
    this.player_.on(oldmtn.Events.AD_COMPANIONS, this.onAdCompanions);

    //
    this.player_.on(oldmtn.Events.FULLSCREEN_CHANGE, this.onFullscreenChanged);

    // chrome cast part
    if (0) {
      var receiverAppId = 'E19ACDB8'; // joseph test app1
      //var receiverAppId = 'CBEF8A9C'; // joseph, css.visualon.info
      //var receiverAppId = 'FAC6871E'; // joseph, css.visualon.info

      // init chromecast sender
      this.castSender_ = new oldmtn.CastSender(receiverAppId);
    }
  }

  uninitPlayerListeners() {
    this.player_.off(oldmtn.Events.STATE_CHANGE, this.onStateChange);

    this.player_.off(oldmtn.Events.MEDIA_DURATION_CHANGED, this.onMediaDurationChanged);
    this.player_.off(oldmtn.Events.MEDIA_ENDED, this.onMediaEnded);
    this.player_.off(oldmtn.Events.MEDIA_LOADEDMETADATA, this.onMediaLoadedMetaData);
    this.player_.off(oldmtn.Events.MEDIA_PAUSED, this.onMediaPaused);
    this.player_.off(oldmtn.Events.MEDIA_SEEKING, this.onMediaSeeking);
    this.player_.off(oldmtn.Events.MEDIA_SEEKED, this.onMediaSeeked);
    this.player_.off(oldmtn.Events.MEDIA_TIMEUPDATE, this.onMediaTimeupdated);
    this.player_.off(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged);

    this.player_.off(oldmtn.Events.LOG, this.onLog);

    // ad callback event
    this.player_.off(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player_.off(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
    this.player_.off(oldmtn.Events.AD_TIMEUPDATE, this.onAdTimeUpdate);
    this.player_.off(oldmtn.Events.AD_COMPANIONS, this.onAdCompanions);

    //
    this.player_.off(oldmtn.Events.FULLSCREEN_CHANGE, this.onFullscreenChanged);
  }

  playerOpen(mediaCfg) {
    this.player_.open(mediaCfg);
  }

  playerClose() {
    printLog('+onBtnClose');
    this.player_.close();
    this.updateUIStateMachine('closed');
  }

  playerRequestAds() {
    this.player_.playAd();
  }

  onBtnInit() {
    this.player_.init(cfg_);
  }

  onBtnUninit() {
    this.player_.uninit(cfg_);
  }

  ///////////////////////////////////////////////////////////////////////////
  // Title: UI reference functions
  onResizeSensorCb(e) {
    // PlayerContainer's width change, need to update its height
    // and player's metrics.
    var dstWidth = 0;
    var dstHeight = 0;
    if (this.player_.isFullscreen()) {
      dstWidth = this.playerContainer.clientWidth;
      dstHeight = this.playerContainer.clientHeight;
    } else {
      if (this.playerContainer.clientWidth > 720) {
        dstWidth = 720;
      } else {
        dstWidth = this.playerContainer.clientWidth;
      }
      dstHeight = dstWidth * this.ratio;
    }

    this.playerContainer.style.height = dstHeight.toString() + 'px';

    this.vopPlayer.style.width = dstWidth.toString() + 'px';
    this.vopPlayer.style.height = dstHeight.toString() + 'px';

    if (this.isPlayerActive()) {
      //h5Player.style.marginLeft = h5Player.style.marginRight = 'auto';
      this.player_.resize(dstWidth, dstHeight);

      printLog(('ResizeSensor, dstWidth: ' + dstWidth + ', dstHeight: ' + dstHeight));
      let position = this.player_.getPosition();
      let duration = this.player_.getDuration();
      this.updateProgressBarUI(position, duration);
    }
  }

  // This function is mainly focus on:
  // 1. Record the player state, and refect it to UI
  updateUIStateMachine(state) {
    printLog('updateUIStateMachine, state: ' + state);
    switch (state) {
      case 'idle':
        {}
        break;
      case 'opened':
        {
          let position = this.player_.getPosition();
          let duration = this.player_.getDuration();
          this.updateProgressBarUI(position, duration);
          this.vopControlBar.style.display = 'block';

          // update volume here
          let muted = this.player_.isMuted();
          let volume = this.player_.getVolume();
          this.updateContentVolumeBarUI(muted, volume);
        }
        break;
      case 'ended':
        {
          let paused = this.player_.isPaused();
          let ended = this.player_.isEnded();
          this.updatePlayBtnUI(paused, ended);

          let position = this.player_.getPosition();
          let duration = this.player_.getDuration();
          this.progressBarContext.movePos = position;
          this.updateProgressBarUI(position, duration);

          UITools.removeClass(this.vopPlayer, 'vop-autohide');
        }
        break;
      case 'closed':
        {}
        break;
      case 'waiting':
        break;
      case 'playing':
        let paused = this.player_.isPaused();
        let ended = this.player_.isEnded();
        this.updatePlayBtnUI(paused, ended);
        break;
      default:
        break;
    }
  }

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
  }

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
  }

  updateProgressBarUI(position, duration) {
    // part - input

    // part - logic process
    var isLive = (duration === Infinity) ? true : false;
    var timeText = '';
    if (isLive) {
      var seekable = this.player_.getSeekableRange();
      var buffered = this.player_.getBufferedRanges();
      printLog('seekable: ' + oldmtn.CommonUtils.TimeRangesToString(seekable) + ', buffered: ' + oldmtn.CommonUtils.TimeRangesToString(buffered));

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
  }

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
  }

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
      UITools.addClass(this.vopTooltip, 'vop-preview');
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
      UITools.removeClass(this.vopTooltip, 'vop-preview');
    }

    // update tooltip offset
    var strTime = oldmtn.CommonUtils.timeToString(this.progressBarContext.movePos);
    this.vopTooltipText.innerText = strTime;

    // calculate metrics first
    // A very large offset to hide tooltip.
    this.vopTooltip.style.left = '10000px';
    this.vopTooltip.style.display = 'block';

    // set the correct offset of tooltip.
    var offsetX = getTooltipOffsetX.call(this, e, this.vopTooltip.clientWidth);
    this.vopTooltip.style.left = offsetX.toString() + 'px';
  }

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
  }

  updatePlayBtnUI(paused, ended) {
    UITools.removeClass(this.vopPlayButton, 'vop-style-play');
    UITools.removeClass(this.vopPlayButton, 'vop-style-pause');
    UITools.removeClass(this.vopPlayButton, 'vop-style-replay');

    if (ended) {
      UITools.addClass(this.vopPlayButton, 'vop-style-replay');
    } else {
      if (paused) {
        UITools.addClass(this.vopPlayButton, 'vop-style-play');
      } else {
        UITools.addClass(this.vopPlayButton, 'vop-style-pause');
      }
    }
  }

  updateContentVolumeBarUI(muted, volume) {
    var uiVolumeIcon;
    var uiVolumeList;
    var uiVolumeHandleLeft;

    if (volume === 0 || muted) {
      uiVolumeIcon = 'vop-style-volumeoff';
      uiVolumeList = [0, 1];
      uiVolumeHandleLeft = '0px';
    } else {
      if (volume >= 0.5) {
        uiVolumeIcon = 'vop-style-volumeup';
      } else {
        uiVolumeIcon = 'vop-style-volumedown';
      }

      uiVolumeList = [volume, 1];

      var vLeft = (volume / 1) * this.vopVolumeSlider.clientWidth;
      if (vLeft + this.vopVolumeSliderHandle.clientWidth > this.vopVolumeSlider.clientWidth) {
        vLeft = this.vopVolumeSlider.clientWidth - this.vopVolumeSliderHandle.clientWidth;
      }

      uiVolumeHandleLeft = vLeft.toString() + 'px';
    }

    // update muted button
    UITools.removeClass(this.vopVolumeButton, 'vop-style-volumedown');
    UITools.removeClass(this.vopVolumeButton, 'vop-style-volumeup');
    UITools.removeClass(this.vopVolumeButton, 'vop-style-volumeoff');
    UITools.addClass(this.vopVolumeButton, uiVolumeIcon);
    // update volume slider background
    this.vopVolumeSlider.style.background = UITools.genGradientColor(uiVolumeList, this.colorList_volume);
    // update volume slider handle
    this.vopVolumeSliderHandle.style.left = uiVolumeHandleLeft;
  }

  ///////////////////////////////////////////////////////////////////////////
  // Title: Tool function
  removeAutohideAction() {
    UITools.removeClass(this.vopPlayer, 'vop-autohide');
    if (this.timerHideControlBar) {
      clearTimeout(this.timerHideControlBar);
      this.timerHideControlBar = null;
    }
  }

  ///////////////////////////////////////////////////////////////////
  onPlayerMouseEnter(e) {
    // When mouse enter any elements in 'vop-skin-youtube', it needs to remove the 'vop-autohide' attribute.
    printLog('+onPlayerMouseEnter, element: ' + e.target.className);
    UITools.removeClass(this.vopPlayer, 'vop-autohide');
  }

  onPlayerMouseMove(e) {
    let element_name = (e && e.target) ? e.target.className : 'null';
    printLog('+onPlayerMouseMove, element: ' + element_name);
    this.removeAutohideAction();
    this.timerHideControlBar = setTimeout(function() {
      printLog('Call onPlayerMouseLeave at timerHideControlBar callback.');
      this.onPlayerMouseLeave();
    }.bind(this), 3000);
  }

  onPlayerMouseLeave(e) {
    //printLog('+onPlayerMouseLeave');
    var paused = this.player_.isPaused();
    var fullscreen = this.player_.isFullscreen();
    if (!paused && !this.progressBarContext.mousedown && !this.flagVolumeSliderMousedown && !fullscreen) {
      UITools.addClass(this.vopPlayer, 'vop-autohide');
    }
  }

  onPlayerMouseDown(e) {
    printLog('+onPlayerMouseDown');
    this.flagPlayerMouseDown = true;
  }

  onPlayerMouseUp(e) {
    printLog('+onPlayerMouseUp');
    if (this.flagPlayerMouseDown) {
      this.flagPlayerMouseDown = false;

      if (this.flagAdStarted && this.flagIsLinearAd) {
        return;
      }

      this.onUICmdPlay();
    }
  }

  // browser & UI callback functions
  onUICmdPlay() {
    // Get current play/pause state from UI.
    let currPaused;
    let currEnded;

    if (UITools.hasClass(this.vopPlayButton, 'vop-style-play')) {
      currPaused = true;
      currEnded = false;
    } else if (UITools.hasClass(this.vopPlayButton, 'vop-style-pause')) {
      currPaused = false;
      currEnded = false;
    } else if (UITools.hasClass(this.vopPlayButton, 'vop-style-replay')) {
      currPaused = false;
      currEnded = true;
    } else {
      console.log('Play button can\'t have this style');
    }

    // Compute new play/pause state and apply it to player.
    if (currEnded) {
      // call play method when video is ended will trigger 'seeking' event and the target position is 0.
      // this.progressBarContext.pausedBeforeMousedown = false;
      // this.progressBarContext.endedBeforeMousedown = false;
      // this.player_.play();
      // old
      this.progressBarContext.pausedBeforeMousedown = true;
      this.progressBarContext.endedBeforeMousedown = true;
      this.player_.setPosition(0);
    } else {
      let newPaused;
      // execute ui cmd
      if (currPaused) {
        newPaused = false;
      } else {
        newPaused = true;
      }

      // update ui
      this.updatePlayBtnUI(newPaused, currEnded);

      // update logic
      if (this.isPlayerActive()) {
        if (newPaused) {
          this.player_.pause();
        } else {
          this.player_.play();
        }
      }
    }
  }

  onControlMouseMove(e) {
    e.stopPropagation();
    this.removeAutohideAction();
  }

  onPopupMenuMouseDown(e) {
    // Don't route 'click' event from panel to its parent div
    e.stopPropagation();
  }

  onUICmdControlBarMouseDown(e) {
    e.stopPropagation();
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

  onUICmdSubtitles() {
    printLog('+onUICmdSubtitles, currMenu: ' + this.settingMenuUIData.currSubtitleId);

    if (this.settingMenuUIData.currMenu !== 'subtitle_menu') {
      this.settingMenuUIData.currMenu = 'subtitle_menu';
    } else {
      this.settingMenuUIData.currMenu = 'none';
    }
    this.updateUIState();
  }

  onUICmdSettings(e) {
    printLog('+onUICmdSettings, currMenu: ' + this.settingMenuUIData.currMenu);

    if (this.settingMenuUIData.currMenu === 'subtitle_menu') {
      this.settingMenuUIData.currMenu = 'main_menu';
    } else {
      if (this.settingMenuUIData.currMenu !== 'none') {
        this.settingMenuUIData.currMenu = 'none';
      } else {
        this.settingMenuUIData.currMenu = 'main_menu';
      }
    }

    this.updateUIState();
  }

  onBtnSeek() {
    var time = document.getElementById('seekedTime').value;
    this.player_.setPosition(time);
  }

  onBtnAddTextTrack() {
    if (this.player_) {
      this.player_.addTextTrack();
    }
  }

  onBtnRemoveTextTrack() {
    this.player_.removeTextTrack();
  }

  setTextTrackHidden() {
    this.player_.setTextTrackHidden();
  }

  setCueAlign(align) {
    this.player_.setCueAlign(align);
  }

  onFruitClick() {
    alert('aaaa');
  }

  onBtnAttribute() {
    //this.player_.attribute();
  }

  //
  onUICmdCastInit() {
    var cfg = getInitConfig();
    this.castSender.new_init(cfg);
  }

  onUICmdCastOpen() {
    var info = getMediaInfo();
    this.castSender.new_open(info);
  }

  onUICmdCastAddV() {
    this.castSender.new_addV();
  }

  onUICmdCastAddPD() {
    this.castSender.new_addPD();
  }

  onUICmdCastPlay() {
    this.castSender.new_play();
  }

  onUICmdCastPause() {
    this.castSender.new_pause();
  }

  onUICmdCastPlayAd() {
    this.castSender.new_playAd();
  }

  onUICmdCastTest() {
    this.castSender.new_test();
  }

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
  }

  doProcessThumbnailMove() {
    // for further action, you can add thumbnail popup here.
  }

  doProcessThumbnailUp() {
    // for further action, you can add thumbnail ended event here.
  }

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
  }

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
  }

  onProgressBarMouseLeave() {
    //printLog('+onProgressBarMouseLeave');
    this.vopTooltip.style.display = 'none';
  }

  captureProgressBarMouseEvents() {
    this.newProgressBarMousemove = this.docProgressBarMousemove.bind(this);
    this.newProgressBarMouseup = this.docProgressBarMouseup.bind(this);

    document.addEventListener('mousemove', this.newProgressBarMousemove, true);
    document.addEventListener('mouseup', this.newProgressBarMouseup, true);
  }

  releaseProgressBarMouseEvents() {
    document.removeEventListener('mousemove', this.newProgressBarMousemove, true);
    document.removeEventListener('mouseup', this.newProgressBarMouseup, true);
  }

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
  }

  onVolumeSliderMouseDown(e) {
    printLog('+onVolumeSliderMouseDown');
    this.captureVolumeSliderMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    this.flagVolumeSliderMousedown = true;

    this.docVolumeSliderMousemove(e);
  }

  docVolumeSliderMousemove(e) {
    this.updateVolumeMovePosition(e);

    var muted = this.player_.isMuted();
    var volume = this.valueVolumeMovePosition;
    if (volume === 0) {
      // do nothing
    } else {
      if (muted === true) {
        this.player_.unmute();
      }

      muted = false;
    }

    this.player_.setVolume(this.valueVolumeMovePosition);
  }

  docVolumeSliderMouseup(e) {
    printLog('+docVolumeSliderMouseup');
    this.releaseVolumeSliderMouseEvents();
    e.preventDefault();

    this.flagVolumeSliderMousedown = false;

    var pt = {
      x: e.clientX,
      y: e.clientY
    };

    if (UITools.isPtInElement(pt, this.vopPlayer)) {
      if (UITools.isPtInElement(pt, this.vopControlBar)) {
        // do nothing
        this.removeAutohideAction();
      } else {
        this.onPlayerMouseMove();
      }
    } else {
      this.onPlayerMouseMove();
    }
  }

  captureVolumeSliderMouseEvents() {
    this.newVolumeSliderMousemove = this.docVolumeSliderMousemove.bind(this);
    this.newVolumeSliderMouseup = this.docVolumeSliderMouseup.bind(this);

    document.addEventListener('mousemove', this.newVolumeSliderMousemove, true);
    document.addEventListener('mouseup', this.newVolumeSliderMouseup, true);
  }

  releaseVolumeSliderMouseEvents() {
    document.removeEventListener('mousemove', this.newVolumeSliderMousemove, true);
    document.removeEventListener('mouseup', this.newVolumeSliderMouseup, true);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // this.player_ event callback
  onStateChange(e) {
    let newState = e.newState;
    printLog(`onStateChange, newState: ${newState}`);
    this.updateUIStateMachine(newState);
  }

  onMediaDurationChanged() {
    this.updateProgressBarUI(this.player_.getPosition(), this.player_.getDuration());
  }

  onMediaEnded() {}

  onMediaLoadedMetaData(e) {
    // update external div's height only.
    this.metaWidth = e.width;
    this.metaHeight = e.height;

    this.ratio = (this.metaHeight / this.metaWidth);

    var v = this.playerContainer;
    var dstWidth = v.clientWidth;
    var dstHeight = dstWidth * this.ratio;

    //this.playerContainer.style.width = dstWidth.toString() + 'px';
    this.playerContainer.style.height = dstHeight.toString() + 'px';
    this.vopPlayer.style.width = dstWidth.toString() + 'px';
    this.vopPlayer.style.height = dstHeight.toString() + 'px';
    this.player_.resize(dstWidth, dstHeight);
  }

  onMediaPaused() {};

  onMediaSeeking() {
    printLog('+onMediaSeeking, pos: ' + this.player_.getPosition());
  }

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

  onLog(e) {
    printLogUI(e.message);
  }

  onAdStarted(e) {
    // Hide all popup menu.
    this.settingMenuUIData.currMenu = 'none';
    this.updateUIState();

    // BD
    var videos = document.getElementsByTagName('video');
    // ED
    printLog('onAdStarted, linear: ' + e.linear + ', videos length: ' + videos.length);
    this.flagAdStarted = true;
    this.flagIsLinearAd = e.linear;
    this.flagIsVpaidAd = e.vpaid;
    // update control bar ui
    if (this.flagIsLinearAd) {
      this.vopSubtitlesBtn.style.display = 'none';
      this.vopSettingsBtn.style.display = 'none';
    } else {
      this.vopAdContainer.style.marginTop = '-' + (this.vopControlBar.clientHeight + 10).toString() + 'px';
    }
    
    if (this.flagIsVpaidAd) {
      this.vopAdContainer.style.zIndex = 100;
    }
  }

  onAdComplete() {
    printLog('onAdComplete, linear: ' + this.flagIsLinearAd);
    this.flagAdStarted = false;

    // update control bar ui
    this.vopProgressBar.style.display = 'block';
    this.vopSubtitlesBtn.style.display = 'inline-block';
    this.vopSettingsBtn.style.display = 'inline-block';

    if (this.flagIsVpaidAd) {
      this.vopAdContainer.style.zIndex = 'auto';
    }
  }

  onAdTimeUpdate() {
    var position = this.player_.getPosition();
    var duration = this.player_.getDuration();
    //printLog('ad position: ' + position + ', duration: ' + duration);
    this.updateAdProgressUI();
  }

  onAdCompanions(e) {
    var v = document.getElementById('idCompanionAd');
    for (var i = 0; i < e.companions.length; i++) {
      var companion = e.companions[i];
      if (v.clientWidth === companion.width && v.clientHeight === companion.height) {
        v.innerHTML = companion.content;
      }
    }
  }

  onFullscreenChanged() {
    let flagIsFullscreen = this.player_.isFullscreen();
    printLog('fullscreen changed, ret: ' + flagIsFullscreen + ', width: ' + window.screen.width + ', height: ' + window.screen.height);
    printLog('player, width: ' + this.playerContainer.clientWidth + ', height: ' + this.playerContainer.clientHeight);
    
    UITools.removeClass(this.vopFullscreenBtn, 'vop-style-fullscreen');
    UITools.removeClass(this.vopFullscreenBtn, 'vop-style-fullscreen-exit');
    if (flagIsFullscreen) {
      UITools.addClass(this.vopFullscreenBtn, 'vop-style-fullscreen-exit');
    } else {
      UITools.addClass(this.vopFullscreenBtn, 'vop-style-fullscreen');
    }
  }

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
        // means we click 'setting' button, do nothing here, onUICmdSettings will handle for us.
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
    printLog('+onMainMenuItemClick, ' +
      ' this.settingMenuUIData.currMenu: ' + this.settingMenuUIData.currMenu +
      ', text: ' + e.target.innerText);
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
        nextFocus.className.indexOf('vop-menuitem') !== -1 ||
        nextFocus.className.indexOf('vop-settings-button') !== -1) {
        // click on quality menu, do nothing
        // click on settings menu, do nothing, since onUICmdSettings will do it for us.
      } else {
        this.settingMenuUIData.currMenu = 'none';
        this.updateUIState();
      }
    } else {
      this.settingMenuUIData.currMenu = 'none';
      this.updateUIState();
    }
  }

  onAudioTrackMenuBack(e) {
    printLog('+onAudioTrackMenuBack');
    this.settingMenuUIData.currMenu = 'main_menu';
    this.updateUIState();
  }

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

  onFccMenuItemBlur(e) {}

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
        // means we click 'setting' button, do nothing here, onUICmdSettings will handle for us.
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

    //
    function getXSpeedValue(id) {
      let value = '';
      for (let i = 0; i < this.settingMenuUIData.xspeedList.length; i++) {
        let item = this.settingMenuUIData.xspeedList[i];
        if (item.id === id) {
          value = item.value;
          break;
        }
      }

      return value;
    }
    let value = getXSpeedValue.call(this, this.settingMenuUIData.currSpeed);
    this.player_.setAudioPlaybackSpeed(parseFloat(value));
  }

  onXSpeedMenuItemBlur(e) {
    printLog('+onXSpeedMenuItemBlur');
    this.onQualityMenuItemBlur(e);
  }

  playerTest() {
    this.player_.test();
  }

  // When data changed, needs to update UI.
  updateUIState() {
    this.setState({
      settingMenuUIData: this.settingMenuUIData
    });
  }

  // When the skin installed, needs to update UI
  syncPlayerStateToUI() {
    let position = this.player_.getPosition();
    let duration = this.player_.getDuration();
    this.updateProgressBarUI(position, duration);

    let paused = this.player_.isPaused();
    let ended = this.player_.isEnded();
    this.updatePlayBtnUI(paused, ended);

    // update volume here
    let muted = this.player_.isMuted();
    let volume = this.player_.getVolume();
    this.updateContentVolumeBarUI(muted, volume);
  }

  isPlayerActive() {
    let currState = this.player_.getState();
    if (this.player_ && currState !== 'idle' && currState !== 'inited') {
      return true;
    }

    return false;
  }
}

export default UISkinYoutube;




