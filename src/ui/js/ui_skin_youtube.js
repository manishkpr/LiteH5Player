import {
  h,
  Component
} from 'preact';

import ResizeSensor from 'resize-sensor';

import '../css/ui_skin_youtube.scss';

import UITools from './ui_tools';
import Events from './events';
import {
  ErrorTypes
} from '../../core/errors';

import UITitleBar from './components/ui_title_bar';
import UIPopupMenu from './components/ui_popup_menu';

import UIGradientBottom from './components/ui_gradient_bottom';
import UIBottomBar from './components/ui_bottom_bar';

import UICaptionOverlay from './components/ui_caption_overlay';
import UIHugeButtonOverlay from './components/ui_hugebutton_overlay';
import UIBufferingOverlay from './components/ui_buffering_overlay';
import UILogoOverlay from './components/ui_logo_overlay';
import UIPlayOverlay from './components/ui_play_overlay';
import UIErrorMsgOverlay from './components/ui_error_msg_overlay';
import UIChromecastOverlay from './components/ui_chromecast_overlay';
import UIToolTip from './components/ui_tooltip';

import UIAdsContainer from './components/ui_ads_container';

import EventEmitter from 'events';

// 1. Render all components from React.
// 2. Just change css in 'html5-player-video' to control components visiblity.
// 3. 
class UISkinYoutube extends Component {
  constructor(props) {
    super(props);

    this.initVariable();
    this.player = props.player;
    this.evEmitter = new EventEmitter();

    this.adsContainer = new UIAdsContainer({
      main: this
    });
  }

  componentWillMount() {
    myPrintLog('UISkinYoutube, +componentWillMount');
  }

  componentDidMount() {
    myPrintLog('UISkinYoutube, +componentDidMount');

    this.initUIElements();
    this.initUIElementsStyles();
    this.initUIEventListeners();
    this.initPlayerListeners();

    this.syncPlayerStateToUI();
  }

  componentWillUnmount() {
    myPrintLog('+componentWillUnmount');
    this.uninitUIEventListeners();
    this.uninitPlayerListeners();

    this.removeAutohideAction();
    // Since we want to use ads-container to show ad, if we add 'controls' attribute to video element,
    // it the video control will never shown, because ads-container is on top of it.
    //this.vopVideo.setAttribute('controls', 'true');
  }

  render() {
    return (
      <div className='vop-skin-youtube'>
        <UIChromecastOverlay main={this} />
        <UITitleBar main={this} />
        <UILogoOverlay />
        <UICaptionOverlay main={this} />
        <UIPopupMenu main={this} />
        <UIToolTip main={this} />
        <UIGradientBottom main={this} />
        <UIBottomBar main={this} />
        <UIBufferingOverlay main={this} />
        <UIHugeButtonOverlay main={this} />
        <UIPlayOverlay main={this} />
        <UIErrorMsgOverlay main={this} />
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  initVariable() {
    this.player = null;
    this.playerState = '';
    this.ratio = 0.5625;

    // UI Controls
    this.vopPlayer = null;
    this.vopBottomBar = null;

    // UI Data
    this.metaWidth;
    this.metaHeight;

    // flag
    this.timerHideControlBar;

    // menu context
    this.settingMenuUIData = {
      currMenu: 'none', // none, settings_menu, quality_menu, audio_track_menu, fcc_menu, fcc_property_menu, subtitles_menu, xspeed_menu

      // main setting menu
      // quality settings menu
      currQualityId: '2',

      // audio track settings menu
      currAudioTrackId: '1',

      // FCC settings menu
      currFccPropertyName: 'background_color', // only valid when currMenu is 'fcc_property_menu'.
      isEnableFCC: true,

      // X-Speed
      currSpeedId: '3'
    };

    // reference variable of ad
    this.flagAdStarted = false;
    this.flagIsLinearAd = false;

    //
    this.onStateChange = this.onStateChange.bind(this);

    this.onMediaLoadedMetaData = this.onMediaLoadedMetaData.bind(this);

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

    this.vopBottomBar = document.querySelector('.vop-bottom-bar');

    this.vopCaptionOverlay = document.querySelector('.vop-caption-overlay');

    //
    this.vopVideo = document.querySelector('.vop-video');
    this.vopVideo.removeAttribute('controls');
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

    this.player.on(oldmtn.Events.MEDIA_LOADEDMETADATA, this.onMediaLoadedMetaData);

    this.player.on(oldmtn.Events.LOG, this.onLog);
    this.player.on(oldmtn.Events.ERROR, this.onError);

    // ad callback event
    this.player.on(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player.on(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
    this.player.on(oldmtn.Events.AD_COMPANIONS, this.onAdCompanions);
  }

  uninitPlayerListeners() {
    this.player.off(oldmtn.Events.STATE_CHANGE, this.onStateChange);

    this.player.off(oldmtn.Events.MEDIA_LOADEDMETADATA, this.onMediaLoadedMetaData);

    // log
    this.player.off(oldmtn.Events.LOG, this.onLog);
    this.player.off(oldmtn.Events.ERROR, this.onError);

    // ad callback event
    this.player.off(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player.off(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
    this.player.off(oldmtn.Events.AD_COMPANIONS, this.onAdCompanions);
  }

  playerOpen(mediaCfg) {
    this.player.open(mediaCfg);
  }

  playerClose() {
    myPrintLog('+onBtnClose');
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

      myPrintLog(('ResizeSensor, dstWidth: ' + dstWidth + ', dstHeight: ' + dstHeight));
      let position = this.player.getPosition();
      let duration = this.player.getDuration();
      //this.updateProgressBarUI(position, duration);
    }
  }

  // This function is mainly focus on:
  // 1. Record the player state, and refect it to UI
  updateUIStateMachine(state) {
    myPrintLog('updateUIStateMachine, state: ' + state);

    //
    UITools.removeClass(this.vopPlayer, 'vop-player-' + this.playerState);
    UITools.addClass(this.vopPlayer, 'vop-player-' + state);

    // Update all child components.
    this.playerState = state;

    if (this.playerState === 'opening') {
      UITools.addClass(this.vopPlayer, 'vop-buffering');
    } else if (this.playerState === 'opened') {
      UITools.removeClass(this.vopPlayer, 'vop-buffering');
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // Title: Tool function
  updateCaptionOverlay() {
    let adDstHeight = 0;
    let controlBarHeight = 0;
    if (this.flagAdStarted && !this.flagIsLinearAd) {
      adDstHeight = this.vopAdContainer.clientHeight;
      controlBarHeight = this.vopBottomBar.clientHeight;
    } else {
      if (!UITools.hasClass(this.vopPlayer, 'vop-autohide')) {
        controlBarHeight = this.vopBottomBar.clientHeight;
      }
    }

    let height = adDstHeight + controlBarHeight;
    this.vopCaptionOverlay.style.bottom = height.toString() + 'px';
  }

  addAutohideAction() {
    UITools.addClass(this.vopPlayer, 'vop-autohide');
    this.evEmitter.emit(Events.AUTOHIDE_CHANGE, {
      autohide: true
    });
  }

  removeAutohideAction() {
    UITools.removeClass(this.vopPlayer, 'vop-autohide');
    if (this.timerHideControlBar) {
      clearTimeout(this.timerHideControlBar);
      this.timerHideControlBar = null;
    }
    this.evEmitter.emit(Events.AUTOHIDE_CHANGE, {
      autohide: false
    });
  }

  ///////////////////////////////////////////////////////////////////
  onPlayerMouseEnter(e) {
    if (this.playerState !== 'playing') {
      return;
    }
    // When mouse enter any elements in 'vop-skin-youtube', it needs to remove the 'vop-autohide' attribute.
    //myPrintLog('+onPlayerMouseEnter, element: ' + e.target.className);
    this.removeAutohideAction();
  }

  onPlayerMouseMove(e) {
    //let element_name = (e && e.target) ? e.target.className : 'null';
    //myPrintLog('+onPlayerMouseMove, element: ' + element_name);
    if (this.playerState !== 'playing') {
      return;
    }

    this.removeAutohideAction();
    this.timerHideControlBar = setTimeout(function() {
      //myPrintLog('Call onPlayerMouseLeave at timerHideControlBar callback.');
      this.onPlayerMouseLeave();
    }.bind(this), 3000);
  }

  onPlayerMouseLeave(e) {
    //myPrintLog('+onPlayerMouseLeave');
    if (this.playerState !== 'playing') {
      return;
    }

    let paused = this.player.isPaused();
    let fullscreen = this.player.isFullscreen();
    if (!paused &&
      !this.progressBarContext &&
      !this.flagVolumeSliderMousedown &&
      !fullscreen) {
      this.addAutohideAction();
    }
  }

  onPlayerMouseDown(e) {
    //myPrintLog('+onPlayerMouseDown');
    // If playerState is 'opened', let ui_play_overlay components handle play action.
    if (this.playerState === 'opened') {
      return;
    }

    this.flagPlayerMouseDown = true;
  }

  onPlayerMouseUp(e) {
    //myPrintLog('+onPlayerMouseUp');
    if (this.flagPlayerMouseDown) {
      this.flagPlayerMouseDown = false;
      this.onUICmdPlay();
    }
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
      if (UITools.isPtInElement(pt, this.vopBottomBar)) {
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

  ////////////////////////////////////////////////////////////////////////////////////
  // this.player event callback
  onStateChange(e) {
    let newState = e.newState;
    this.updateUIStateMachine(newState);
  }

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

  onLog(e) {
    printLogUI(e.message);
  }

  onError(e) {
    if (e.type === ErrorTypes.LICENSE_ERROR) {
      console.log('--ErrorTypes.LICENSE_ERROR--');
    }
  }

  onAdStarted(e) {
    this.updateUIStateMachine('playing');

    // Hide all popup menu.
    this.settingMenuUIData.currMenu = 'none';
  }

  onAdComplete() {}

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
  onQualityMenuItemBlur(e) {
    myPrintLog('+onQualityMenuItemBlur');
    let nextFocus = e.relatedTarget;
    if (nextFocus) {
      myPrintLog('className: ' + nextFocus.className);
      if (nextFocus.className.indexOf('vop-panel-title') !== -1 ||
        nextFocus.className.indexOf('vop-menuitem') !== -1 ||
        nextFocus.className.indexOf('vop-settings-button') !== -1) {
        // click on quality menu, do nothing
        // click on settings menu, do nothing, since onUICmdSettings will do it for us.
      } else {
        this.settingMenuUIData.currMenu = 'none';
        this.evEmitter.emit(Events.POPUPMENU_CHANGE, {
          menu: this.settingMenuUIData.currMenu
        });
      }
    } else {
      this.settingMenuUIData.currMenu = 'none';
      this.evEmitter.emit(Events.POPUPMENU_CHANGE, {
        menu: this.settingMenuUIData.currMenu
      });
    }
  }

  onAudioTrackMenuItemBlur(e) {
    this.onQualityMenuItemBlur(e);
  }

  onFccMenuItemBlur(e) {
    this.onQualityMenuItemBlur(e);
  }

  onXSpeedMenuItemBlur(e) {
    this.onQualityMenuItemBlur(e);
  }

  // When data changed, needs to update UI.

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

export default UISkinYoutube;