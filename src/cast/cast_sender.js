'use strict';

import CastUtils from './cast_utils'

///////////////////////////////////////////////////////////////////////////////
// RemotePlayerHandler
var RemotePlayerHandler = function() {};

RemotePlayerHandler.prototype.init = function(remotePlayer, remotePlayerController) {
    this.remotePlayer = remotePlayer;
    this.remotePlayerController = remotePlayerController;

    this.remotePlayerController.addEventListener(
            cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
            function() {
                console.log("muted: " + this.remotePlayer.isMuted);
            }.bind(this)
        );

    this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
        function() {
            var newVolume = this.remotePlayer.volumeLevel;
            console.log('newVolume is: ' + newVolume);
        }.bind(this)
    );
};

RemotePlayerHandler.prototype.play = function() {
    if (this.remotePlayer.isPaused) {
        this.remotePlayerController.playOrPause();
    }
};

RemotePlayerHandler.prototype.pause = function() {
    if (!this.remotePlayer.isPaused) {
        this.remotePlayerController.playOrPause();
    }
};

RemotePlayerHandler.prototype.setVolume = function(volume) {
    this.remotePlayer.volumeLevel = volume;
    this.remotePlayerController.setVolumeLevel();

    // or
    //this.session_.setVolume(1.0);
};

RemotePlayerHandler.prototype.getVolume = function() {
    return this.remotePlayer.volumeLevel;
};

RemotePlayerHandler.prototype.seek = function(time) {
    this.remotePlayer.currentTime = time;
    this.remotePlayerController.seek();
};

RemotePlayerHandler.prototype.stop = function() {
    this.remotePlayerController.stop();
};


////////////////////////////////////////////////////////////////////////////////////
// CastSender
var CastSender = function () {
    this.remotePlayer = null;
    this.remotePlayerController = null;
    this.castContext_ = null;
    this.session_ = null;

    this.remotePlayerHandler = new RemotePlayerHandler();
};

CastSender.prototype.onConnectedChanged = function () {
    console.log('cast, +onConnectedChanged, remotePlayer.isConnected: ' + this.remotePlayer.isConnected);

    this.session_ = cast.framework.CastContext.getInstance().getCurrentSession();
    if (this.session_) {
    this.session_.addMessageListener(CastUtils.MICROMTN_MESSAGE_NAMESPACE,
        this.onMessageReceived_.bind(this));
    } else {
        console.log('cast, this.session_ is null');
    }
};

CastSender.prototype.onMediaLoadedChanged = function () {
    console.log('--onMediaLoadedChanged--');
};

CastSender.prototype.loadMedia_SuccessCb = function () {
    console.log('--loadMedia_SuccessCb--');
};

CastSender.prototype.loadMedia_ErrorCb = function () {
    console.log('--loadMedia_ErrorCb--');
}

CastSender.prototype.init = function (receiverAppId) {
    console.log('cast, init');

    var options = {};

    // Set the receiver application ID to your own (created in the
    // Google Cast Developer Console), or optionally
    // use the chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    options.receiverApplicationId = receiverAppId;

    // Auto join policy can be one of the following three:
    // ORIGIN_SCOPED - Auto connect from same appId and page origin
    // TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
    // PAGE_SCOPED - No auto connect
    options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
    this.castContext_ = cast.framework.CastContext.getInstance();
    this.castContext_.setOptions(options);

    this.castContext_.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED,
        function(e) {
            console.log('cast, cast state: ', e);
        });

    this.castContext_.addEventListener(
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
        }
    );

    this.remotePlayer = new cast.framework.RemotePlayer();
    this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
    this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        this.onConnectedChanged.bind(this));
    this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED,
        this.onMediaLoadedChanged);

    // 
    this.remotePlayerHandler.init(this.remotePlayer, this.remotePlayerController);
};

// Opens the cast selection UI, to allow user to start or stop session.
CastSender.prototype.requestSession = function () {
    if (!this.castContext_) {
        console.warn('cast, you should call init first.');
        return;
    }

    this.castContext_.requestSession();
};

CastSender.prototype.endSession = function () {
    if (!this.castContext_) {
        return;
    }

    let castSession = this.castContext_.getCurrentSession();
    // End the session and pass 'true' to indicate
    // that receiver application should be stopped.
    castSession.endSession(true);
};

CastSender.prototype.loadMedia = function (url, type) {
    console.log('+loadMedia');

    if (cast && cast.framework && this.remotePlayer.isConnected) {
        var mediaInfo = new chrome.cast.media.MediaInfo(url, type);

        mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
        mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;

        var request = new chrome.cast.media.LoadRequest(mediaInfo);

        // For cast to voReceiver
        //request.customData = { drmInfoList: null };

        this.session_.loadMedia(request, this.loadMedia_SuccessCb, this.loadMedia_ErrorCb);
    } else {
        this.remotePlayer = null;
        this.remotePlayerController = null;
    }

    console.log('-loadMedia');
};

CastSender.prototype.onMessageReceived_ = function(namespace, serialized) {
    console.log('receive msg, namespace: ' + namespace);
    console.log('receive msg, serialized: ' + serialized);

    var message = CastUtils.deserialize(serialized);
    switch (message.type) {
        case 'timeupdate':
        {
            console.log(`timeupdate: curTime: ${message.data.curTime}/${message.data.totalTime}`);
        } break;
        default:
        break;
    }
};

CastSender.prototype.play = function () {
    this.remotePlayerHandler.play();
};

CastSender.prototype.pause = function () {
    this.remotePlayerHandler.pause();
};

CastSender.prototype.addVolume = function () {
    var volume = this.RemotePlayerHandler.getVolume() + 0.1;

    this.remotePlayerHandler.setVolume(volume);
};

CastSender.prototype.delVolume = function (volume) {
    var volume = this.RemotePlayerHandler.getVolume() - 0.1;
    this.remotePlayerHandler.setVolume(volume);
};

CastSender.prototype.setVolume = function (volume) {
    this.remotePlayerHandler.setVolume(volume);
};

CastSender.prototype.isConnected = function () {
    return this.remotePlayer && this.remotePlayer.isConnected;
};

CastSender.prototype.seek = function (time) {
    this.remotePlayerHandler.seek(parseFloat(time));
};

CastSender.prototype.stop = function () {
    this.remotePlayerHandler.stop();
};

CastSender.prototype.attribute = function() {
    console.log('remote player time: ' + this.remotePlayer.currentTime);
    if (this.remotePlayer.savedPlayerState) {
        console.log('remotePlayer.savedPlayerState.currentTime: ' + this.remotePlayer.savedPlayerState.currentTime);
    }
};

CastSender.prototype.test = function() {
    //console.log('--test--');

    this.castContext_.requestSession();

    // console.log('before remoteCall_');
    // this.remoteCall_("abc", "1234");
    // console.log('after remoteCall_');
};

CastSender.prototype.remoteCall_ = function(targetName, methodName) {
  var args = Array.prototype.slice.call(arguments, 2);
  this.sendMessage_({
        'type': 'call',
        'targetName': targetName,
        'methodName': methodName,
        'args': args
    });
};

CastSender.prototype.sendMessage_ = function(message) {
  var serialized = CastUtils.serialize(message);
  // TODO: have never seen this fail.  When would it and how should we react?
  this.session_.sendMessage(CastUtils.MICROMTN_MESSAGE_NAMESPACE,
    serialized, function() {},  // success callback
    function() {});  // error callback
};



export default CastSender;

