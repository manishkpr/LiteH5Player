'use strict';

import CastUtils from './cast_utils';

var evHandlers = {};

var CastReceiver = function (element) {
  console.log('receiver, constructor');

  this.element_ = element;
  this.castContext_ = cast.framework.CastReceiverContext.getInstance();


  

};

CastReceiver.prototype.start = function () {
  this.castContext_.start();
};

CastReceiver.prototype.addEventListener = function (ev, cb) {
  evHandlers[ev] = cb;
};


export default CastReceiver;

///////////////////////////////////////////////////////////////////////////////////////////////////
// old
// var evHandlers = {};
// var CastReceiver = function(element) {
//   console.log('receiver, constructor');

//   cast.player.api.setLoggerLevel(cast.player.api.LoggerLevel.DEBUG);
//   cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);

//   this.element_ = element;

//   // Init Video Element
//   this.mediaElement_ = (this.element_.querySelector('video'));
//   // this.mediaElement_.addEventListener('error', this.onError_.bind(this), false);
//   // this.mediaElement_.addEventListener('playing', this.onPlaying_.bind(this),
//   //     false);
//   // this.mediaElement_.addEventListener('pause', this.onPause_.bind(this), false);
//   // this.mediaElement_.addEventListener('ended', this.onEnded_.bind(this), false);
//   // this.mediaElement_.addEventListener('abort', this.onAbort_.bind(this), false);
//   this.mediaElement_.addEventListener('timeupdate', this.onTimeupdate.bind(this),
//        false);
//   // this.mediaElement_.addEventListener('seeking', this.onSeekStart_.bind(this),
//   //     false);
//   // this.mediaElement_.addEventListener('seeked', this.onSeekEnd_.bind(this),
//   //     false);

//   // Init Mediamanager
//   this.mediaManager_ = new cast.receiver.MediaManager(this.mediaElement_);
//   this.onLoadOrig_ =
//       this.mediaManager_.onLoad.bind(this.mediaManager_);
//   this.mediaManager_.onLoad = this.onLoad_.bind(this);

//   this.onGetStatusOrig_ =
//       this.mediaManager_.onGetStatus.bind(this.mediaManager_);
//   this.mediaManager_.onGetStatus = this.onGetStatus_.bind(this);

//   this.onMetadataLoadedOrig_ =
//       this.mediaManager_.onMetadataLoaded.bind(this.mediaManager_);
//   this.mediaManager_.onMetadataLoaded = this.onMetadataLoaded_.bind(this);

//   this.onStopOrig_ =
//       this.mediaManager_.onStop.bind(this.mediaManager_);
//   this.mediaManager_.onStop = this.onStop_.bind(this);
  
//   this.onLoadMetadataErrorOrig_ =
//       this.mediaManager_.onLoadMetadataError.bind(this.mediaManager_);
//   this.mediaManager_.onLoadMetadataError = this.onLoadMetadataError_.bind(this);
  
//   this.onErrorOrig_ = this.mediaManager_.onError.bind(this.mediaManager_);
//   this.mediaManager_.onError = this.onError_.bind(this);

//   // Init CastReceiverManager
//   this.receiverManager_ = cast.receiver.CastReceiverManager.getInstance();
//   this.receiverManager_.onReady = this.onReady_.bind(this);
//   this.receiverManager_.onSenderDisconnected =
//       this.onSenderDisconnected_.bind(this);
//   this.receiverManager_.onVisibilityChanged =
//       this.onVisibilityChanged_.bind(this);

//   // this.genericBus_ = this.receiverManager_.getCastMessageBus(
//   //     CastUtils.GENERIC_MESSAGE_NAMESPACE);
//   // this.genericBus_.onMessage = this.onGenericMessage_.bind(this);

//   this.micromtnBus_ = this.receiverManager_.getCastMessageBus(
//       CastUtils.MICROMTN_MESSAGE_NAMESPACE);
//   this.micromtnBus_.onMessage = this.onMicromtnMessage_.bind(this);
// };

// //
// CastReceiver.prototype.getMediaElement = function() {
//   return this.mediaElement_;
// };

// CastReceiver.prototype.getMediaManager = function() {
//   return this.mediaManager_;
// };

// CastReceiver.prototype.getPlayer = function() {
//   return this.player_;
// };

// CastReceiver.prototype.start = function() {
//   this.receiverManager_.start();
// };

// CastReceiver.prototype.onReady_ = function() {
//   console.log('onReady');
// };

// CastReceiver.prototype.onSenderDisconnected_ = function(event) {
//   console.log('onSenderDisconnected');
//   // When the last or only sender is connected to a receiver,
//   // tapping Disconnect stops the app running on the receiver.
//   if (this.receiverManager_.getSenders().length === 0 &&
//       event.reason ===
//           cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
//     this.receiverManager_.stop();
//   }
// };

// CastReceiver.prototype.onError_ = function(error) {
//   console.log('onError');
//   this.onErrorOrig_(error);
// };

// CastReceiver.prototype.onPlaying_ = function() {
//   console.log('onPlaying');
// };

// CastReceiver.prototype.onPause_ = function() {
//   console.log('onPause');
// };

// CastReceiver.prototype.onStop_ = function(event) {
//   console.log('onStop');
//   this.onStopOrig_(event);
// };

// CastReceiver.prototype.onEnded_ = function() {
//   console.log('onEnded');
// };

// CastReceiver.prototype.onAbort_ = function() {
//   console.log('onAbort');
// };

// CastReceiver.prototype.onTimeupdate = function() {
//   var curTime = this.mediaElement_.currentTime;
//   var totalTime = this.mediaElement_.duration;

//   //console.log('onTimeupdate, ' + curTime + '/' + totalTime);

//   // update local
//   evHandlers['timeupdate'](curTime, totalTime);

//   // send message to sender
//   this.sendMessage_({
//     type: 'timeupdate',
//     data: {
//       curTime: curTime,
//       totalTime: totalTime
//     }
//   }, this.micromtnBus_);
// };

// CastReceiver.prototype.onSeekStart_ = function() {
//   console.log('onSeekStart');
// };

// CastReceiver.prototype.onSeekEnd_ = function() {
//   console.log('onSeekEnd');
// };

// CastReceiver.prototype.onVisibilityChanged_ = function(event) {
//   console.log('onVisibilityChanged');
//   if (!event.isVisible) {
//     this.mediaElement_.pause();
//     this.mediaManager_.broadcastStatus(false);
//   }
// };

// CastReceiver.prototype.onGenericMessage_ = function(event) {
//   // console.log('+onGenericMessage_, type: ' + event.type + ', senderId: ' + event.senderId);
//   // console.log('type: ' + event.data.type);
//   // console.log('requestId: ' + event.data.requestId);
//   // console.log('namespace: ' + event.namespace);
//   // console.log('senderId: ' + event.senderId);

//   // var message = CastUtils.deserialize(event.data);
//   // console.log('+onGenericMessage_: ' + message['type']);

//   // TODO(ismena): error message on duplicate request id from the same sender
//   //switch (message['type']) {
//     switch (event.data.type) {
//     case 'PLAY': {
//       this.mediaElement_.play();
//     } break;
//     case 'PAUSE': {
//       this.mediaElement_.pause();
//     } break;
//     case 'LOAD': {
//       var mediaInfo = event.data.media;
//       var contentId = mediaInfo['contentId'];
//       var manifestUri = contentId;

//       // var mediaInfo = message['media'];
//       // var contentId = mediaInfo['contentId'];
//       // var currentTime = message['currentTime'];
//       // var manifestUri = contentId;
// // sample
// // contentId: "http://10.2.72.104/7/hls/v8/gear1/test.m3u8"
// // contentType: "application/dash+xml"
// // metadata: Object
// // streamType: "BUFFERED"
//       // var protocolFunc = CastReceiver.getProtocolFunction_(mediaInfo);
//       // var host = new cast.player.api.Host({
//       //   'url': manifestUri,
//       //   'mediaElement': this.mediaElement_
//       // });
//       // this.player_ = new cast.player.api.Player(host);
//       // this.player_.load(protocolFunc(host));
//     } break;
//     default:
//       break;
//   }
// }

// CastReceiver.prototype.onMicromtnMessage_ = function(event) {
//   var message = CastUtils.deserialize(event.data);
//   //console.log('+onMicromtnMessage_, type: ' + message['type'] + ', targetName: ' + message[targetName] + ', methodName: ' + message[methodName]);

//   this.micromtnBus_.broadcast("abcd1234");
// };

// CastReceiver.prototype.sendMessage_ =
//     function(message, bus, opt_senderId) {
//   // Cuts log spam when debugging the receiver UI in Chrome.
//   if (!this.isConnected_) return;

//   var serialized = CastUtils.serialize(message);
//   if (opt_senderId) {
//     bus.getCastChannel(opt_senderId).send(serialized);
//   } else {
//     bus.broadcast(serialized);
//   }
// };

// ////////////////////////////////////////////////////////////////////////////////////////
// // 
// CastReceiver.prototype.onLoad_ = function(event) {
//   console.log('onLoad_');

//   if (this.player_) {
//     this.player_.unload();
//     this.player_ = null;
//   }

//   var info = new cast.receiver.MediaManager.LoadInfo(event.data, event.senderId);

//   var url = info.message.media.contentId;
//   var protocolFunc = CastReceiver.getProtocolFunction_(info.message.media);
//   var host = new cast.player.api.Host({
//     'url': url,
//     'mediaElement': this.mediaElement_
//   });
//   this.player_ = new cast.player.api.Player(host);
//   this.player_.load(protocolFunc(host));
// };

// CastReceiver.prototype.onGetStatus_ = function(event) {
//   console.log('--onGetStatus_--', event);
// };

// CastReceiver.prototype.onMetadataLoaded_ = function(info) {
//   console.log('onMetadataLoaded');
  
//   var totalTime = this.mediaElement_.duration;
//   console.log('total time: ' + totalTime);

//   this.onMetadataLoadedOrig_(info);
// };

// CastReceiver.prototype.onLoadMetadataError_ = function(event) {
//   console.log('onLoadMetadataError_');
//   this.onLoadMetadataErrorOrig_(event);
// };

// ////////////////////////////////////////////////////////////////////////////////////////
// // object function
// CastReceiver.getProtocolFunction_ = function(mediaInformation) {
//   var url = mediaInformation.contentId;
//   var type = mediaInformation.contentType || '';
//   var path = CastReceiver.getPath_(url) || '';
//   if (CastReceiver.getExtension_(path) === 'm3u8' ||
//           type === 'application/x-mpegurl' ||
//           type === 'application/vnd.apple.mpegurl') {
//     return cast.player.api.CreateHlsStreamingProtocol;
//   } else if (CastReceiver.getExtension_(path) === 'mpd' ||
//           type === 'application/dash+xml') {
//     return cast.player.api.CreateDashStreamingProtocol;
//   } else if (path.indexOf('.ism') > -1 ||
//           type === 'application/vnd.ms-sstr+xml') {
//     return cast.player.api.CreateSmoothStreamingProtocol;
//   }
//   return null;
// };

// CastReceiver.formatDuration_ = function(dur) {
//   dur = Math.floor(dur);
//   function digit(n) { return ('00' + Math.round(n)).slice(-2); }
//   var hr = Math.floor(dur / 3600);
//   var min = Math.floor(dur / 60) % 60;
//   var sec = dur % 60;
//   if (!hr) {
//     return digit(min) + ':' + digit(sec);
//   } else {
//     return digit(hr) + ':' + digit(min) + ':' + digit(sec);
//   }
// };

// /**
//  * Utility function to get the extension of a URL file path.
//  *
//  * @param {string} url the URL
//  * @return {string} the extension or "" if none
//  * @private
//  */
// CastReceiver.getExtension_ = function(url) {
//   var parts = url.split('.');
//   // Handle files with no extensions and hidden files with no extension
//   if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) {
//     return '';
//   }
//   return parts.pop().toLowerCase();
// };

// /**
//  * Returns the URL path.
//  *
//  * @param {string} url The URL
//  * @return {string} The URL path.
//  * @private
//  */
// CastReceiver.getPath_ = function(url) {
//   var href = document.createElement('a');
//   href.href = url;
//   return href.pathname || '';
// };


// //////////////////////////////////////////////////////////////////////////////////
// // Begin event
// CastReceiver.prototype.addEventListener = function (ev, cb) {
//   evHandlers[ev] = cb;
// };


// export default CastReceiver;
