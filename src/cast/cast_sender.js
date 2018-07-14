'use strict';

import CastUtils from './cast_utils';

import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/events';
import Debug from '../core/Debug';

///////////////////////////////////////////////////////////////////////////////
// RemotePlayerHandler
function RemotePlayerHandler() {
  function init(remotePlayer, remotePlayerController) {
    remotePlayer = remotePlayer;
    remotePlayerController = remotePlayerController;

    remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
      function() {
        console.log('muted: ' + remotePlayer.isMuted);
      });

    remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
      function() {
        var newVolume = remotePlayer.volumeLevel;
        console.log('newVolume is: ' + newVolume);
      });
  }

  function play() {
    if (remotePlayer.isPaused) {
      remotePlayerController.playOrPause();
    }
  }

  function pause() {
    if (!remotePlayer.isPaused) {
      remotePlayerController.playOrPause();
    }
  }

  function setVolume(volume) {
    remotePlayer.volumeLevel = volume;
    remotePlayerController.setVolumeLevel();

    // or
    //session_.setVolume(1.0);
  }

  function getVolume() {
    return remotePlayer.volumeLevel;
  }

  function seek(time) {
    remotePlayer.currentTime = time;
    remotePlayerController.seek();
  }

  function stop() {
    remotePlayerController.stop();
  }

  let instance = {
    init: init,
    play: play,
    pause: pause,
    setVolume: setVolume,
    getVolume: getVolume,
    seek: seek,
    stop: stop
  };
  return instance;
};

////////////////////////////////////////////////////////////////////////////////////
// CastSender
function CastSender(receiverAppId) {
  let context_ = this.context;
  let receiverAppId_ = receiverAppId;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let remotePlayer = null;
  let remotePlayerController = null;
  let castContext_ = null;
  let session_ = null;

  let remotePlayerHandler = new RemotePlayerHandler();

  // 
  let position_;
  let duration_;
  let paused_;
  let muted_;
  let volume_;

  function setup() {
    console.log('cast, setup');

    var options = {};

    // Set the receiver application ID to your own (created in the
    // Google Cast Developer Console), or optionally
    // use the chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    options.receiverApplicationId = receiverAppId;

    // Auto join policy can be one of the following three:
    // ORIGIN_SCOPED - Auto connect from same appId and page origin
    // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
    // PAGE_SCOPED - No auto connect
    //options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
    castContext_ = cast.framework.CastContext.getInstance();
    castContext_.setOptions(options);

    castContext_.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      function(e) {
        //console.log('cast, cast state: ', e);
      }
    );

    castContext_.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      function(event) {
        console.log('cast, sessionState: ' + event.sessionState);
        switch (event.sessionState) {
          case cast.framework.SessionState.SESSION_STARTED:
          case cast.framework.SessionState.SESSION_RESUMED:
            break;
          case cast.framework.SessionState.SESSION_ENDED:
            //console.log('CastContext: CastSession disconnected');
            // Update locally as necessary
            break;
        }
      });

    remotePlayer = new cast.framework.RemotePlayer();
    remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);
    remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      onConnectedChanged);
    remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED,
      onMediaLoadedChanged);

    //
    remotePlayerHandler.init(remotePlayer, remotePlayerController);
  }

  function onConnectedChanged() {
    console.log('cast, +onConnectedChanged, remotePlayer.isConnected: ' + remotePlayer.isConnected);

    session_ = cast.framework.CastContext.getInstance().getCurrentSession();
    if (session_) {
      // BD
      let castDev = session_.getCastDevice();
      // ED
      session_.addMessageListener(CastUtils.OLDMTN_MESSAGE_NAMESPACE,
        onMessageReceived_);
    } else {
      console.log('cast, session_ is null');
    }

    // Notify upper layer
    if (remotePlayer.isConnected) {
      eventBus_.trigger(Events.CAST_CONNECTED);
    } else {
      eventBus_.trigger(Events.CAST_DISCONNECTED);
    }
  }

  function onMediaLoadedChanged() {
    console.log('--onMediaLoadedChanged--');
  }

  function loadMedia_SuccessCb() {
    console.log('--loadMedia_SuccessCb--');
  }

  function loadMedia_ErrorCb() {
    console.log('--loadMedia_ErrorCb--');
  }

  function init(cfg) {
    let msg = {
      cmdType: 'init',
      data: cfg
    };
    sendMessage_(msg);
  }

  function open(message) {
    message.cmdType = 'open';
    sendMessage_(message);
  }

  function add() {
    let msg = {
      'cmdType': 'add'
    };
    sendMessage_(msg);
  }

  function play() {
    let msg = {
      'cmdType': 'play'
    };
    sendMessage_(msg);
  }

  function pause() {
    let msg = {
      'cmdType': 'pause'
    };
    sendMessage_(msg);
  }

  function isPaused() {
    return paused_;
  }

  function setPosition(pos) {
    let msg = {
      cmdType: 'setPosition',
      data: {
        position: pos
      }
    };
    sendMessage_(msg);
  }

  function getPosition() {
    return position_;
  }

  function getDuration() {
    return duration_;
  }

  function setVolume(volume) {
    let msg = {
      cmdType: 'setVolume',
      data: {
        volume: volume
      }
    };
    sendMessage_(msg);

    // old
    //remotePlayerHandler.setVolume(volume);
  }

  function getVolume() {
    return volume_;
  }

  function mute() {
    let msg = {
      cmdType: 'mute'
    };
    sendMessage_(msg);
  }

  function unmute() {
    let msg = {
      cmdType: 'unmute'
    };
    sendMessage_(msg);
  }

  function isMuted() {
    return muted_;
  }

  // Opens the cast selection UI, to allow user to start or stop session.
  function requestSession() {
    if (!castContext_) {
      console.warn('cast, you should call init first.');
      return;
    }

    castContext_.requestSession();
  }

  function endSession() {
    if (!castContext_) {
      return;
    }

    let castSession = castContext_.getCurrentSession();
    // End the session and pass 'true' to indicate
    // that receiver application should be stopped.
    castSession.endSession(true);
  }

  var tmp = 1;

  function test() {
    //console.log('--test--');
    session_.sendMessage(CastUtils.OLDMTN_MESSAGE_NAMESPACE,
      tmp.toString(),
      function() {}, // success callback
      function() {}); // error callback
    tmp++;
    play();
    // let msg = {
    //   'cmdType': 'test'
    // };
    // sendMessage_(msg);
  }

  function loadMedia(url, type) {
    console.log('+loadMedia');

    if (cast && cast.framework && remotePlayer.isConnected) {
      var mediaInfo = new chrome.cast.media.MediaInfo(url, type);

      mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
      mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;

      var request = new chrome.cast.media.LoadRequest(mediaInfo);

      // For cast to voReceiver
      //request.customData = { drmInfoList: null };

      session_.loadMedia(request, loadMedia_SuccessCb, loadMedia_ErrorCb);
    } else {
      remotePlayer = null;
      remotePlayerController = null;
    }

    console.log('-loadMedia');
  }

  function onMessageReceived_(namespace, serialized) {
    let message = CastUtils.deserialize(serialized);
    let e = message.data || {};
    e.from = 'chromecast';

    console.log('receive msg, namespace: ' + namespace + ', serialized: ' + serialized + ', type: ' + message.type);
    switch (message.type) {
      case Events.STATE_CHANGE:
        if (e.newState === 'opened') {
          // do some initialization here
          position_ = e.position;
          duration_ = e.duration;
          muted_ = e.muted;
          volume_ = e.volume;
          paused_ = e.paused;
        }
        //eventBus_.trigger(Events.STATE_CHANGE, e);
        break;
      case Events.MEDIA_TIMEUPDATE:
        position_ = e.position;
        duration_ = e.duration;
        eventBus_.trigger(Events.MEDIA_TIMEUPDATE);
        console.log(`timeupdate, ${message.data.position}/${message.data.duration}`);
        break;
      case Events.MEDIA_PLAYING:
        paused_ = false;
        eventBus_.trigger(Events.MEDIA_PLAYING);
        break;
      case Events.MEDIA_PAUSED:
        paused_ = true;
        eventBus_.trigger(Events.MEDIA_PAUSED);
        break;
      case Events.MEDIA_SEEKING:
        position_ = e.position;
        duration_ = e.duration;
        eventBus_.trigger(Events.MEDIA_SEEKING);
        break;
      case Events.MEDIA_SEEKED:
        position_ = e.position;
        duration_ = e.duration;
        eventBus_.trigger(Events.MEDIA_SEEKED);
        break;
      case Events.MEDIA_VOLUME_CHANGED:
        muted_ = e.muted;
        volume_ = e.volume;
        eventBus_.trigger(Events.MEDIA_VOLUME_CHANGED);
        break;
      default:
        break;
    }
  }

  function old_play() {
    remotePlayerHandler.play();
  }

  function old_pause() {
    remotePlayerHandler.pause();
  }

  function addVolume() {
    var volume = RemotePlayerHandler.getVolume() + 0.1;

    remotePlayerHandler.setVolume(volume);
  }

  function delVolume(volume) {
    var volume = RemotePlayerHandler.getVolume() - 0.1;
    remotePlayerHandler.setVolume(volume);
  }

  function isConnected() {
    return remotePlayer && remotePlayer.isConnected;
  }

  function seek(time) {
    remotePlayerHandler.seek(parseFloat(time));
  }

  function stop() {
    remotePlayerHandler.stop();
  }

  function attribute() {
    console.log('remote player time: ' + remotePlayer.currentTime);
    if (remotePlayer.savedPlayerState) {
      console.log('remotePlayer.savedPlayerState.currentTime: ' + remotePlayer.savedPlayerState.currentTime);
    }
  }

  function remoteCall_(targetName, methodName) {
    var args = Array.prototype.slice.call(arguments, 2);
    sendMessage_({
      'type': 'call',
      'targetName': targetName,
      'methodName': methodName,
      'args': args
    });
  }

  function sendMessage_(message) {
    var serialized = CastUtils.serialize(message);
    console.log('send msg: ' + serialized);
    // TODO: have never seen this fail.  When would it and how should we react?
    session_.sendMessage(
      CastUtils.OLDMTN_MESSAGE_NAMESPACE,
      serialized,
      function() {}, // success callback
      function() {}); // error callback
  }

  let instance = {
    // 
    requestSession: requestSession,
    endSession: endSession,
    init: init,
    open: open,
    add: add,
    play: play,
    pause: pause,
    isPaused: isPaused,
    setPosition: setPosition,
    getPosition: getPosition,
    getDuration: getDuration,
    setVolume: setVolume,
    getVolume: getVolume,
    mute: mute,
    unmute: unmute,
    isMuted: isMuted,
    test: test,
    // old left
    loadMedia: loadMedia,
    stop: stop,
    old_play: old_play,
    old_pause: old_pause,
    addVolume: addVolume,
    delVolume: delVolume,
    seek: seek,
    attribute: attribute
  };

  setup();
  return instance;
};

CastSender.__h5player_factory_name = 'CastSender';
export default FactoryMaker.getSingletonFactory(CastSender);