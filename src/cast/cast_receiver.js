'use strict';

import EventBus from '../core/EventBus';
import Events from '../core/CoreEvents';
import Debug from '../core/Debug';

import CastUtils from './cast_utils';
import UITools from '../ui/js/ui_tools';

function printLog(msg) {
  console.log('CastReceiver: ' + msg);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
function CastReceiver(elementId) {
  printLog('receiver, constructor');

  let context_ = {};
  let eventBus_;
  let debug_;

  let elementId_ = elementId;
  let mediaElement_ = null;
  let receiverManager_ = null;
  let genericBus_ = null;
  let oldmtnBus_ = null;
  let mediaManager_ = null;
  let onLoadOrig_ = null;
  let onGetStatusOrig_ = null;
  let onMetadataLoadedOrig_ = null;
  let onStopOrig_ = null;
  let onLoadMetadataErrorOrig_ = null;
  let onErrorOrig_ = null;
  let evHandlers = {};
  let player_ = null;
  let isConnected_ = null;

  let omPlayer_;
  let omUIEngine_;

  function setup() {
    // init html5 reference
    eventBus_ = EventBus(context_).getInstance();
    debug_ = Debug(context_).getInstance();

    cast.player.api.setLoggerLevel(cast.player.api.LoggerLevel.DEBUG);
    cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);

    // Init CastReceiverManager
    receiverManager_ = cast.receiver.CastReceiverManager.getInstance();
    receiverManager_.onReady = onReady_;
    receiverManager_.onSenderDisconnected = onSenderDisconnected_;
    receiverManager_.onVisibilityChanged = onVisibilityChanged_;

    // custom message bus
    printLog('CastUtils.GENERIC_MESSAGE_NAMESPACE: ' + CastUtils.GENERIC_MESSAGE_NAMESPACE);
    printLog('CastUtils.OLDMTN_MESSAGE_NAMESPACE: ' + CastUtils.OLDMTN_MESSAGE_NAMESPACE);

    oldmtnBus_ = receiverManager_.getCastMessageBus(
      CastUtils.OLDMTN_MESSAGE_NAMESPACE);
    oldmtnBus_.onMessage = onOldmtnMessage_;

    // // Init Video Element
    // let v = document.getElementById(elementId_);
    // mediaElement_ = v.querySelector('.h5p-video');
    // // mediaElement_.addEventListener('timeupdate', onTimeupdate,
    // //     false);

    // // Init MediaManager
    // mediaManager_ = new cast.receiver.MediaManager(mediaElement_);

    // // The default GENERIC_MESSAGE_NAMESPACE should called after creating MediaManager. 
    // genericBus_ = receiverManager_.getCastMessageBus(
    //         CastUtils.GENERIC_MESSAGE_NAMESPACE);
    // genericBus_.onMessage = onGenericMessage_;

    // onLoadOrig_ =
    //     mediaManager_.onLoad.bind(mediaManager_);
    // mediaManager_.onLoad = onLoad_;

    // onGetStatusOrig_ =
    //     mediaManager_.onGetStatus.bind(mediaManager_);
    // mediaManager_.onGetStatus = onGetStatus_;

    // onMetadataLoadedOrig_ =
    //     mediaManager_.onMetadataLoaded.bind(mediaManager_);
    // mediaManager_.onMetadataLoaded = onMetadataLoaded_;

    // onStopOrig_ =
    //     mediaManager_.onStop.bind(mediaManager_);
    // mediaManager_.onStop = onStop_;

    // onLoadMetadataErrorOrig_ =
    //     mediaManager_.onLoadMetadataError.bind(mediaManager_);
    // mediaManager_.onLoadMetadataError = onLoadMetadataError_;

    // onErrorOrig_ = mediaManager_.onError.bind(mediaManager_);
    // mediaManager_.onError = onError_;
  }

  function initPlayer() {
    omPlayer_ = new oldmtn.Player(elementId_);
    omUIEngine_ = new oldmtn.UIEngine(omPlayer_);
    omUIEngine_.installSkin();

    omPlayer_.on(Events.STATE_CHANGE, onStateChange);
    omPlayer_.on(Events.MEDIA_TIMEUPDATE, onMediaTimeupdated);
    omPlayer_.on(Events.MEDIA_PLAYING, onMediaPlaying);
    omPlayer_.on(Events.MEDIA_PAUSED, onMediaPaused);
    omPlayer_.on(Events.MEDIA_SEEKING, onMediaSeeking);
    omPlayer_.on(Events.MEDIA_SEEKED, onMediaSeeked);
    omPlayer_.on(Events.MEDIA_VOLUME_CHANGED, onMediaVolumeChanged);
  }

  //
  function getMediaElement() {
    return mediaElement_;
  }

  function getMediaManager() {
    return mediaManager_;
  }

  function getPlayer() {
    return player_;
  }

  function onReady_() {
    printLog('onReady');
    isConnected_ = true;
  }

  function onSenderDisconnected_(event) {
    printLog('onSenderDisconnected');
    // When the last or only sender is connected to a receiver,
    // tapping Disconnect stops the app running on the receiver.
    if (receiverManager_.getSenders().length === 0 &&
      event.reason ===
      cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
      receiverManager_.stop();
    }
  }

  function onStateChange(e) {
    let newState = e.newState;
    if (newState === 'opened') {
      e.position = omPlayer_.getPosition();
      e.duration = omPlayer_.getDuration();
      e.volume = omPlayer_.getVolume();
      e.muted = omPlayer_.isMuted();
      e.paused = omPlayer_.isPaused();
    }
    sendMessage_({
      type: Events.STATE_CHANGE,
      data: e
    }, oldmtnBus_);
  }

  function onMediaTimeupdated() {
    let position = omPlayer_.getPosition();
    let duration = omPlayer_.getDuration();

    printLog(`position: ${position}, duration: ${duration}`);
    // send message to sender
    sendMessage_({
      type: Events.MEDIA_TIMEUPDATE,
      data: {
        position: position,
        duration: duration
      }
    }, oldmtnBus_);
  }

  function onMediaPlaying() {
    sendMessage_({
      type: Events.MEDIA_PLAYING
    }, oldmtnBus_);
  }

  function onMediaPaused() {
    sendMessage_({
      type: Events.MEDIA_PAUSED
    }, oldmtnBus_);
  }

  function onMediaSeeking() {
    let position = omPlayer_.getPosition();
    let duration = omPlayer_.getDuration();

    sendMessage_({
      type: Events.MEDIA_SEEKING,
      data: {
        position: position,
        duration: duration
      }
    }, oldmtnBus_);
  }

  function onMediaSeeked() {
    let position = omPlayer_.getPosition();
    let duration = omPlayer_.getDuration();

    sendMessage_({
      type: Events.MEDIA_SEEKED,
      data: {
        position: position,
        duration: duration
      }
    }, oldmtnBus_);
  }

  function onMediaVolumeChanged() {
    let muted = omPlayer_.isMuted();
    let volume = omPlayer_.getVolume();
    sendMessage_({
      type: Events.MEDIA_VOLUME_CHANGED,
      data: {
        muted: muted,
        volume: volume
      }
    }, oldmtnBus_);
  }

  function onSeekStart_() {
    printLog('onSeekStart');
  }

  function onSeekEnd_() {
    printLog('onSeekEnd');
  }

  function onVisibilityChanged_(event) {
    printLog('onVisibilityChanged');
    // if (!event.isVisible) {
    //     mediaElement_.pause();
    //     mediaManager_.broadcastStatus(false);
    // }
  }

  function onGenericMessage_(event) {
    printLog('+onGenericMessage_, type: ' + event.type + ', senderId: ' + event.senderId);
    return;

    // printLog('type: ' + event.data.type);
    // printLog('requestId: ' + event.data.requestId);
    // printLog('namespace: ' + event.namespace);
    // printLog('senderId: ' + event.senderId);

    // var message = CastUtils.deserialize(event.data);
    // printLog('+onGenericMessage_: ' + message['type']);

    // TODO(ismena): error message on duplicate request id from the same sender
    //switch (message['type']) {
    switch (event.data.type) {
      case 'PLAY':
        {
          mediaElement_.play();
        }
        break;
      case 'PAUSE':
        {
          mediaElement_.pause();
        }
        break;
      case 'LOAD':
        {
          var mediaInfo = event.data.media;
          var contentId = mediaInfo['contentId'];
          var manifestUri = contentId;

          // var mediaInfo = message['media'];
          // var contentId = mediaInfo['contentId'];
          // var currentTime = message['currentTime'];
          // var manifestUri = contentId;
          // sample
          // contentId: "http://10.2.72.104/7/hls/v8/gear1/test.m3u8"
          // contentType: "application/dash+xml"
          // metadata: Object
          // streamType: "BUFFERED"
          // var protocolFunc = CastReceiver.getProtocolFunction_(mediaInfo);
          // var host = new cast.player.api.Host({
          //   'url': manifestUri,
          //   'mediaElement': mediaElement_
          // });
          // player_ = new cast.player.api.Player(host);
          // player_.load(protocolFunc(host));
        }
        break;
      default:
        break;
    }
  }

  function onOldmtnMessage_(event) {
    let message = CastUtils.deserialize(event.data);
    let data = message.data;
    printLog('onOldmtnMessage_, event.data: ' + event.data);
    printLog('onOldmtnMessage_, message: ' + message);

    if (message.cmdType === 'init') {
      initPlayer(data);
      //printLog('poster: ' + message.poster);
      omPlayer_.init(data);
    } else if (message.cmdType === 'open') {
      omPlayer_.open(message);
    } else if (message.cmdType === 'add') {
      omPlayer_.manualSchedule();
    } else if (message.cmdType === 'play') {
      omPlayer_.play();
    } else if (message.cmdType === 'pause') {
      omPlayer_.pause();
    } else if (message.cmdType === 'playAd') {
      omPlayer_.playAd();
    } else if (message.cmdType === 'setPosition') {
      omPlayer_.setPosition(data.position);
    } else if (message.cmdType === 'setVolume') {
      omPlayer_.setVolume(data.volume);
    } else if (message.cmdType === 'mute') {
      omPlayer_.mute();
    } else if (message.cmdType === 'unmute') {
      omPlayer_.unmute();
    } else if (message.cmdType === 'test') {
      omPlayer_.test();
      // uiEngine_ = new oldmtn.UIEngine(omPlayer_);
      // uiEngine_.installSkin();
      // let v = document.querySelector('.html5-video-player');
      // UITools.removeClass(v, 'vop-autohide');
    }
    //oldmtnBus_.broadcast("abcd1234");
  }

  function sendMessage_(message, bus, opt_senderId) {
    // Cuts log spam when debugging the receiver UI in Chrome.
    if (!isConnected_) {
      return;
    }

    let serialized = CastUtils.serialize(message);
    if (opt_senderId) {
      bus.getCastChannel(opt_senderId).send(serialized);
    } else {
      bus.broadcast(serialized);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  //
  function onLoad_(event) {
    printLog('onLoad_');

    if (player_) {
      player_.unload();
      player_ = null;
    }

    var info = new cast.receiver.MediaManager.LoadInfo(event.data, event.senderId);

    var url = info.message.media.contentId;
    var protocolFunc = getProtocolFunction_(info.message.media);
    var host = new cast.player.api.Host({
      'url': url,
      'mediaElement': mediaElement_
    });
    player_ = new cast.player.api.Player(host);
    player_.load(protocolFunc(host));
  };

  function onGetStatus_(event) {
    printLog('onGetStatus_', event);
  }

  function onMetadataLoaded_(info) {
    var totalTime = mediaElement_.duration;

    printLog('onMetadataLoaded, ' + 'total time: ' + totalTime);
    onMetadataLoadedOrig_(info);
  }

  function onLoadMetadataError_(event) {
    printLog('onLoadMetadataError_');
    onLoadMetadataErrorOrig_(event);
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  // object function
  function getProtocolFunction_(mediaInformation) {
    var url = mediaInformation.contentId;
    var type = mediaInformation.contentType || '';
    var path = getPath_(url) || '';
    if (getExtension_(path) === 'm3u8' ||
      type === 'application/x-mpegurl' ||
      type === 'application/vnd.apple.mpegurl') {
      return cast.player.api.CreateHlsStreamingProtocol;
    } else if (getExtension_(path) === 'mpd' ||
      type === 'application/dash+xml') {
      return cast.player.api.CreateDashStreamingProtocol;
    } else if (path.indexOf('.ism') > -1 ||
      type === 'application/vnd.ms-sstr+xml') {
      return cast.player.api.CreateSmoothStreamingProtocol;
    }
    return null;
  }

  function formatDuration_(dur) {
    dur = Math.floor(dur);

    function digit(n) {
      return ('00' + Math.round(n)).slice(-2);
    }
    var hr = Math.floor(dur / 3600);
    var min = Math.floor(dur / 60) % 60;
    var sec = dur % 60;
    if (!hr) {
      return digit(min) + ':' + digit(sec);
    } else {
      return digit(hr) + ':' + digit(min) + ':' + digit(sec);
    }
  }

  /**
   * Utility function to get the extension of a URL file path.
   *
   * @param {string} url the URL
   * @return {string} the extension or "" if none
   * @private
   */
  function getExtension_(url) {
    var parts = url.split('.');
    // Handle files with no extensions and hidden files with no extension
    if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) {
      return '';
    }
    return parts.pop().toLowerCase();
  }

  /**
   * Returns the URL path.
   *
   * @param {string} url The URL
   * @return {string} The URL path.
   * @private
   */
  function getPath_(url) {
    var href = document.createElement('a');
    href.href = url;
    return href.pathname || '';
  }

  function start() {
    receiverManager_.start();
  }

  function addEventListener(ev, cb) {
    evHandlers[ev] = cb;
  }

  let instance = {
    start: start,
    addEventListener: addEventListener
  };
  setup();
  return instance;
}

export default CastReceiver;