import {
  h
} from 'preact';
import Preact from 'preact';

import ResizeSensor from 'resize-sensor';

import '../css/ui_skin_youtube.scss';

import UITools from './ui_tools';

// Menu Part
import UIPopupMenu from './components/ui_popup_menu';

import UIGradientBottom from './components/ui_gradient_bottom';
import UIControlBar from './components/ui_control_bar';

import UICaptionOverlay from './components/ui_caption_overlay';
import UIGiantButtonOverlay from './components/ui_giantbutton_overlay';
import UIBufferingOverlay from './components/ui_buffering_overlay';
import UILogoOverlay from './components/ui_logo_overlay';
import UIPlayOverlay from './components/ui_play_overlay';

import UIToolTip from './components/ui_tooltip';

export default class UISkinYoutube extends Preact.Component {
  constructor(props) {
    super(props);

    this.initVariable();
    this.player = props.player;
    this.state = {
      settingMenuUIData: this.settingMenuUIData
    };
  }

  componentWillMount() {
    printLog('UISkinYoutube, +componentWillMount');
  }

  componentDidMount() {
    printLog('UISkinYoutube, +componentDidMount');

    this.initUIElements();
    this.initUIElementsStyles();
    this.initUIEventListeners();
    this.initPlayerListeners();

    this.syncPlayerStateToUI();
  }

  componentWillUnmount() {
    printLog('+componentWillUnmount');
    this.uninitUIEventListeners();
    this.uninitPlayerListeners();

    this.removeAutohideAction();
    UITools.removeClass(this.vopPlayer, 'vop-autohide');
    // Since we want to use ads-container to show ad, if we add 'controls' attribute to video element,
    // it the video control will never shown, because ads-container is on top of it.
    //this.vopVideo.setAttribute('controls', 'true');
  }

  render() {
    // Update current component.
    switch (this.playerState) {
      case 'idle':
        break;
      case 'opened':
        break;
      case 'ended':
        UITools.removeClass(this.vopPlayer, 'vop-autohide');
        break;
      case 'closed':
        break;
      case 'playing':
        break;
      default:
        break;
    }

    return (
      <div className="vop-skin-youtube">
        <UILogoOverlay />
        <UIToolTip main={this} />
        <UIPopupMenu main={this} />
        <UIGradientBottom main={this} />
        <UICaptionOverlay />
        <UIBufferingOverlay />
        <UIGiantButtonOverlay main={this} />
        <UIControlBar main={this} />
        <UIPlayOverlay main={this} />
      </div>
    )
  }

  ///////////////////////////////////////////////////////////////////////
  initVariable() {
    this.player = null;
    this.playerState = '';
    this.castSender_ = null;
    this.ratio = 0.5625;

    // UI Controls
    this.vopPlayer = null;
    this.vopControlBar = null;
    
    this.vopSubtitlesBtn;
    this.vopSettingsBtn;

    this.uiLog = null;

    // UI Data
    this.metaWidth;
    this.metaHeight;

    // flag
    this.timerHideControlBar;

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

    this.onMediaEnded = this.onMediaEnded.bind(this);
    this.onMediaLoadedMetaData = this.onMediaLoadedMetaData.bind(this);
    
    this.onMediaPlaying = this.onMediaPlaying.bind(this);
    this.onMediaWaiting = this.onMediaWaiting.bind(this);

    this.onLog = this.onLog.bind(this);

    // ad callback event
    this.onAdStarted = this.onAdStarted.bind(this);
    this.onAdComplete = this.onAdComplete.bind(this);
    this.onAdCompanions = this.onAdCompanions.bind(this);

    //
    this.onResizeSensorCb = this.onResizeSensorCb.bind(this);
  }

  // Title: init part
  initUIElements() {
    this.playerContainer = document.getElementById('player-container');
    this.vopPlayer = document.querySelector('.html5-video-player');

    this.vopSkinContainer = document.querySelector('.vop-skin-youtube');

    this.vopGardientBottom = document.querySelector('.vop-gradient-bottom');
    this.vopControlBar = document.querySelector('.vop-control-bar');

    this.vopProgressBar = document.querySelector('.vop-progress-bar');

    this.vopTooltip = document.querySelector('.vop-tooltip');
    this.vopTooltipBg = document.querySelector('.vop-tooltip-bg');
    this.vopTooltipText = document.querySelector('.vop-tooltip-text');

    this.vopTimeDisplay = document.querySelector('.vop-time-text');

    this.uiLog = document.getElementById('idLog');

    this.vopPlayButton = this.vopSkinContainer.querySelector('.vop-play-button');
    this.vopPauseButton = this.vopSkinContainer.querySelector('.vop-pause-button');
    this.vopSubtitlesBtn = this.vopSkinContainer.querySelector('.vop-subtitles-button');
    this.vopSettingsBtn = this.vopSkinContainer.querySelector('.vop-settings-button');

    //
    this.vopVideo = document.querySelector('.vop-video');
    this.vopVideo.removeAttribute('controls');
    this.vopAdContainer = document.querySelector('.vop-ads-container');
  }

  initUIElementsStyles() {
    // Can add ui style config here.
    //this.vopPlayProgress.style.backgroundColor = '#FA12FF';
  }

  initUIEventListeners() {
    this.onPlayerMouseEnter = this.onPlayerMouseEnter.bind(this);
    this.onPlayerMouseLeave = this.onPlayerMouseLeave.bind(this);
    this.onPlayerMouseMove = this.onPlayerMouseMove.bind(this);
    this.onPlayerMouseDown = this.onPlayerMouseDown.bind(this);
    this.onPlayerMouseUp = this.onPlayerMouseUp.bind(this);

    this.vopPlayer.addEventListener('mouseenter', this.onPlayerMouseEnter);
    this.vopPlayer.addEventListener('mouseleave', this.onPlayerMouseLeave);
    this.vopPlayer.addEventListener('mousemove', this.onPlayerMouseMove);
    this.vopPlayer.addEventListener('mousedown', this.onPlayerMouseDown);
    this.vopPlayer.addEventListener('mouseup', this.onPlayerMouseUp);

    this.onAdContainerMouseDown = this.onAdContainerMouseDown.bind(this);
    this.vopAdContainer.addEventListener('mousedown', this.onAdContainerMouseDown);

    // resize listener
    //if (window.ResizeObserver) {
    if (false) {
      function onPlayerSize(entries) {
        for (let i = 0; i < entries.length; i++) {
          let entry = entries[i];
          const cr = entry.contentRect;
          const cWidth = entry.target.clientWidth;
          const cHeight = entry.target.clientHeight;

          this.player.resize(cWidth, cHeight);
        }
      }
      let ro = new ResizeObserver(onPlayerSize.bind(this));

      // Observer one or multiple elements
      ro.observe(this.vopPlayer);
    } else {
      this.playerResizeSensor_ = new ResizeSensor(this.playerContainer, this.onResizeSensorCb);
    }
  }

  uninitUIEventListeners() {
    this.vopPlayer.removeEventListener('mouseenter', this.onPlayerMouseEnter);
    this.vopPlayer.removeEventListener('mouseleave', this.onPlayerMouseLeave);
    this.vopPlayer.removeEventListener('mousemove', this.onPlayerMouseMove);
    this.vopPlayer.removeEventListener('mousedown', this.onPlayerMouseDown);
    this.vopPlayer.removeEventListener('mouseup', this.onPlayerMouseUp);

    this.playerResizeSensor_ = null;
  }

  initPlayerListeners() {
    this.player.on(oldmtn.Events.STATE_CHANGE, this.onStateChange);

    this.player.on(oldmtn.Events.MEDIA_ENDED, this.onMediaEnded);
    this.player.on(oldmtn.Events.MEDIA_LOADEDMETADATA, this.onMediaLoadedMetaData);

    this.player.on(oldmtn.Events.MEDIA_WAITING, this.onMediaWaiting);
    this.player.on(oldmtn.Events.MEDIA_PLAYING, this.onMediaPlaying);

    this.player.on(oldmtn.Events.LOG, this.onLog);

    // ad callback event
    this.player.on(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player.on(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
    this.player.on(oldmtn.Events.AD_COMPANIONS, this.onAdCompanions);


    // chrome cast part
    if (0) {
      let receiverAppId = 'E19ACDB8'; // joseph test app1
      //let receiverAppId = 'CBEF8A9C'; // joseph, css.visualon.info
      //let receiverAppId = 'FAC6871E'; // joseph, css.visualon.info

      // init chromecast sender
      this.castSender_ = new oldmtn.CastSender(receiverAppId);
    }
  }

  uninitPlayerListeners() {
    this.player.off(oldmtn.Events.STATE_CHANGE, this.onStateChange);

    this.player.off(oldmtn.Events.MEDIA_DURATION_CHANGED, this.onMediaDurationChanged);
    this.player.off(oldmtn.Events.MEDIA_ENDED, this.onMediaEnded);
    this.player.off(oldmtn.Events.MEDIA_LOADEDMETADATA, this.onMediaLoadedMetaData);

    this.player.off(oldmtn.Events.MEDIA_WAITING, this.onMediaWaiting);
    this.player.off(oldmtn.Events.MEDIA_PLAYING, this.onMediaPlaying);

    this.player.off(oldmtn.Events.LOG, this.onLog);

    // ad callback event
    this.player.off(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player.off(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
    this.player.off(oldmtn.Events.AD_COMPANIONS, this.onAdCompanions);
  }

  playerOpen(mediaCfg) {
    this.player.open(mediaCfg);
  }

  playerClose() {
    printLog('+onBtnClose');
    this.player.close();
    this.updateUIStateMachine('closed');
  }

  playerRequestAds() {
    this.player.playAd();
  }

  onBtnInit() {
    this.player.init(cfg_);
  }

  onBtnUninit() {
    this.player.uninit(cfg_);
  }

  ///////////////////////////////////////////////////////////////////////////
  // Title: UI reference functions
  onResizeSensorCb(e) {
    // PlayerContainer's width change, need to update its height
    // and player's metrics.
    let dstWidth = 0;
    let dstHeight = 0;
    if (this.player.isFullscreen()) {
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
      this.player.resize(dstWidth, dstHeight);

      printLog(('ResizeSensor, dstWidth: ' + dstWidth + ', dstHeight: ' + dstHeight));
      let position = this.player.getPosition();
      let duration = this.player.getDuration();
      //this.updateProgressBarUI(position, duration);
    }
  }

  // This function is mainly focus on:
  // 1. Record the player state, and refect it to UI
  updateUIStateMachine(state) {
    printLog('updateUIStateMachine, state: ' + state);

    //
    UITools.removeClass(this.vopPlayer, 'vop-player-' + this.playerState);
    UITools.addClass(this.vopPlayer, 'vop-player-' + state);

    // Update all child components.
    this.playerState = state;
    this.updateUIState();
  }

  updateTooltipUI(currMovePos) {
    let thumbnail = this.player.getThumbnail(currMovePos);

    function getTooltipOffsetX(currMovePos, tooltipWidth) {
      // part - input
      // bounding client rect can return the progress bar's rect relative to current page.
      let rect = this.vopProgressBar.getBoundingClientRect();
      let leftMin = 12;
      let rightMax = 12 + rect.width;

      let duration = this.player.getDuration();
        
      let currPosWidth = (currMovePos / duration) * rect.width;
      let tooltipLeft_RelativeToVideo = leftMin + currPosWidth - tooltipWidth / 2;
      let tooltipRight_RelativeToVideo = leftMin + currPosWidth + tooltipWidth / 2;

      if (tooltipLeft_RelativeToVideo < leftMin) {
        tooltipLeft_RelativeToVideo = leftMin;
      } else if (tooltipRight_RelativeToVideo > rightMax) {
        tooltipLeft_RelativeToVideo = rightMax - tooltipWidth;
      }
      
      //printLog('tooltipLeft_RelativeToVideo: ' + tooltipLeft_RelativeToVideo);

      return tooltipLeft_RelativeToVideo;
    }

    if (thumbnail) {
      UITools.addClass(this.vopTooltip, 'vop-tooltip-preview');
      //printLog('thumbnail info: ', thumbnail);
      let isSprite = (thumbnail.data.w && thumbnail.data.h);
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
      UITools.removeClass(this.vopTooltip, 'vop-tooltip-preview');
    }

    // update tooltip offset
    let strTime = oldmtn.CommonUtils.timeToString(currMovePos);
    this.vopTooltipText.innerText = strTime;

    // calculate metrics first
    // A very large offset to hide tooltip.
    this.vopTooltip.style.left = '10000px';
    this.vopTooltip.style.display = 'block';

    // set the correct offset of tooltip.
    let offsetX = getTooltipOffsetX.call(this, currMovePos, this.vopTooltip.clientWidth);
    this.vopTooltip.style.left = offsetX.toString() + 'px';
  }

  getTimeDisplay(position, duration) {
    let isLive = (duration === Infinity) ? true : false;

    let timeText = '';
    if (isLive) {
      // update time display label
      timeText = 'Live';
    } else {
      // update time display label
      let c = oldmtn.CommonUtils.timeToString(position);
      let d = oldmtn.CommonUtils.timeToString(duration);
      timeText = c + '/' + d;
    }

    return timeText;
  }

  updateTimeDisplay(position, duration) {
    this.vopTimeDisplay.innerText = this.getTimeDisplay(position, duration);
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
    //printLog('+onPlayerMouseEnter, element: ' + e.target.className);
    UITools.removeClass(this.vopPlayer, 'vop-autohide');
  }

  onPlayerMouseMove(e) {
    let element_name = (e && e.target) ? e.target.className : 'null';
    //printLog('+onPlayerMouseMove, element: ' + element_name);
    this.removeAutohideAction();
    this.timerHideControlBar = setTimeout(function() {
      //printLog('Call onPlayerMouseLeave at timerHideControlBar callback.');
      this.onPlayerMouseLeave();
    }.bind(this), 3000);
  }

  onPlayerMouseLeave(e) {
    //printLog('+onPlayerMouseLeave');
    let paused = this.player.isPaused();
    let fullscreen = this.player.isFullscreen();
    if (!paused &&
      !this.progressBarContext &&
      !this.flagVolumeSliderMousedown &&
      !fullscreen) {
      UITools.addClass(this.vopPlayer, 'vop-autohide');
    }
  }

  onPlayerMouseDown(e) {
    //printLog('+onPlayerMouseDown');
    // If playerState is 'opened', should let ui_play_overlay components handle play action.
    if (this.playerState === 'opened') {
      return;
    }

    this.flagPlayerMouseDown = true;
  }

  onPlayerMouseUp(e) {
    //printLog('+onPlayerMouseUp');
    if (this.flagPlayerMouseDown) {
      this.flagPlayerMouseDown = false;
      this.onUICmdPlay();
    }
  }

  onAdContainerMouseDown(e) {
    // If ad is playing, it will overlay on the top of 'html5-video-player',
    // when click on ad, we should stop this event transfer to its parent.
    e.stopPropagation();
  }

  // browser & UI callback functions
  onUICmdPlay() {
    // Get current play/pause state from UI.
    let currPaused = this.player.isPaused();
    let currEnded = this.player.isEnded();

    let newPaused;
    // Compute new play/pause state and apply it to player.
    if (currEnded) {
      // call play method when video is ended will trigger 'seeking' event and the target position is 0.
      newPaused = false;
    } else {
      // execute ui cmd
      if (currPaused) {
        newPaused = false;
      } else {
        newPaused = true;
      }
    }

    if (newPaused) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  onVolumeBarMouseDown(e) {
    this.flagVolumeSliderMousedown = true;
  }
  onVolumeBarMouseUp(e) {
    this.flagVolumeSliderMousedown = false;

    let pt = {
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

  onControlMouseMove(e) {
    e.stopPropagation();
    this.removeAutohideAction();
  }

  onBtnManualSchedule() {
    this.player.manualSchedule();
  }

  onBtnInitAD() {
    this.player.test();
  }

  onBtnDelAll() {
    this.player.dellAll();
  }

  onBtnStop() {
    this.player.close();
    this.player = null;
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
    let time = document.getElementById('seekedTime').value;
    this.player.setPosition(time);
  }

  onBtnAddTextTrack() {
    if (this.player) {
      this.player.addTextTrack();
    }
  }

  onBtnRemoveTextTrack() {
    this.player.removeTextTrack();
  }

  setTextTrackHidden() {
    this.player.setTextTrackHidden();
  }

  setCueAlign(align) {
    this.player.setCueAlign(align);
  }

  onFruitClick() {
    alert('aaaa');
  }

  onBtnAttribute() {
    //this.player.attribute();
  }

  //
  onUICmdCastInit() {
    let cfg = getInitConfig();
    this.castSender.new_init(cfg);
  }

  onUICmdCastOpen() {
    let info = getMediaInfo();
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

  onProgressBarMouseDown(e) {
    printLog('+onProgressBarMouseDown');
  }

  onProgressBarMouseMove(e, movePos) {
    this.updateTooltipUI(movePos);
  }

  onProgressBarMouseLeave() {
    this.vopTooltip.style.display = 'none';
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // this.player event callback
  onStateChange(e) {
    let newState = e.newState;
    this.updateUIStateMachine(newState);
  }

  onMediaEnded() {}

  onMediaLoadedMetaData(e) {
    // update external div's height only.
    this.metaWidth = e.width;
    this.metaHeight = e.height;

    this.ratio = (this.metaHeight / this.metaWidth);

    let v = this.playerContainer;
    let dstWidth = v.clientWidth;
    let dstHeight = dstWidth * this.ratio;

    //this.playerContainer.style.width = dstWidth.toString() + 'px';
    this.playerContainer.style.height = dstHeight.toString() + 'px';
    this.vopPlayer.style.width = dstWidth.toString() + 'px';
    this.vopPlayer.style.height = dstHeight.toString() + 'px';
    this.player.resize(dstWidth, dstHeight);
  }

  startBufferingUI() {
    UITools.addClass(this.vopPlayer, 'vop-buffering');
  }

  stopBufferingUI() {
    UITools.removeClass(this.vopPlayer, 'vop-buffering');
  }

  onMediaWaiting() {
    this.startBufferingUI();
  }

  onMediaPlaying() {
    this.stopBufferingUI();
  }

  onLog(e) {
    printLogUI(e.message);
  }

  onAdStarted(e) {
    // BD
    let videos = document.getElementsByTagName('video');
    printLog('onAdStarted, linear: ' + e.linear + ', videos length: ' + videos.length);
    // ED

    // Hide all popup menu.
    this.settingMenuUIData.currMenu = 'none';
  
    this.flagAdStarted = true;
    this.flagIsLinearAd = e.linear;
    this.flagIsVpaidAd = e.vpaid;
    // FIXME: How to trigger playing state when ad start play.
    this.updateUIStateMachine('playing');

    // update control bar ui
    if (this.flagIsVpaidAd) {
      this.vopAdContainer.style.zIndex = '1';
    } else {
      if (this.flagIsLinearAd) {
        this.vopAdContainer.style.zIndex = '1';
        this.vopControlBar.style.zIndex = '2';
        this.vopGardientBottom.style.zIndex = '2'
      } else {
        let adDstWidth = this.vopPlayer.clientWidth;
        let adDstHeight = e.height + 10;
        this.player.resize(adDstWidth, adDstHeight);
        this.vopAdContainer.style.bottom = (this.vopControlBar.clientHeight + 5).toString() + 'px';
        //this.vopAdContainer.style.width = adDstWidth.toString() + 'px';
        this.vopAdContainer.style.height = adDstHeight.toString() + 'px';
        this.vopAdContainer.style.zIndex = '1';
      }
    }
  }

  onAdComplete() {
    printLog('onAdComplete, linear: ' + this.flagIsLinearAd);
    this.flagAdStarted = false;
    this.updateUIState();

    if (this.flagIsVpaidAd) {
      this.vopAdContainer.style.zIndex = 'auto';
    } else {
      if (this.flagIsLinearAd) {
        this.vopAdContainer.style.zIndex = 'auto';
        this.vopControlBar.style.zIndex = 'auto';
        this.vopGardientBottom.style.zIndex = 'auto'
      } else {
        this.vopAdContainer.style.zIndex = 'auto';
      }
    }
  }

  onAdCompanions(e) {
    let v = document.getElementById('idCompanionAd');
    for (let i = 0; i < e.companions.length; i++) {
      let companion = e.companions[i];
      if (v.clientWidth === companion.width && v.clientHeight === companion.height) {
        v.innerHTML = companion.content;
      }
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
    let text = '';
    if (e.relatedTarget) {
      text = ', text: ' + e.relatedTarget.innerText;
    }

    printLog('+onMainMenuItemBlur, this.settingMenuUIData.currMenu: ' + this.settingMenuUIData.currMenu + text);

    let prevFocus = e.target;
    let nextFocus = e.relatedTarget;

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

    let id = e.currentTarget.dataset.id;
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
    let nextFocus = e.currentTarget;

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
    let nextFocus = e.currentTarget;

    this.settingMenuUIData.currQualityId = nextFocus.dataset.id;
    this.updateUIState();
  }

  onQualityMenuItemBlur(e) {
    printLog('+onQualityMenuItemBlur');
    let nextFocus = e.relatedTarget;
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
    let nextFocus = e.currentTarget;

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

    for (let i = 0; i < this.settingMenuUIData.fccPropertyList.length; i++) {
      let fccProperty = this.settingMenuUIData.fccPropertyList[i];
      if (fccProperty.name === this.settingMenuUIData.currFccPropertyName) {
        fccProperty.currValue = e.currentTarget.dataset.id;
        this.updateUIState();
        break;
      }
    }
  }

  onFccPropertyMenuItemBlur(e) {
    let prevFocus = e.target;
    let nextFocus = e.relatedTarget;

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
    let nextFocus = e.currentTarget;

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
    this.player.setAudioPlaybackSpeed(parseFloat(value));
  }

  onXSpeedMenuItemBlur(e) {
    printLog('+onXSpeedMenuItemBlur');
    this.onQualityMenuItemBlur(e);
  }

  playerTest() {
    this.player.test();
  }

  // When data changed, needs to update UI.
  updateUIState() {
    this.setState({
      settingMenuUIData: this.settingMenuUIData,
      // player state
      playerState: this.playerState,
      // ad state
      flagAdStarted: this.flagAdStarted,
      flagIsLinearAd: this.flagIsLinearAd,
      flagIsVpaidAd: this.flagIsVpaidAd
    });
  }

  // When the skin installed, needs to update UI
  syncPlayerStateToUI() {
    let state = this.player.getState();
    this.updateUIStateMachine(state);
  }

  isPlayerActive() {
    let currState = this.player.getState();
    if (this.player && currState !== 'idle' && currState !== 'inited') {
      return true;
    }

    return false;
  }
}