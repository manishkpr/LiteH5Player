'use strict';

import CastUtils from './cast_utils';

///////////////////////////////////////////////////////////////////////////////////////////////////
function CastReceiver(element) {
    console.log('receiver, constructor');

    cast.player.api.setLoggerLevel(cast.player.api.LoggerLevel.DEBUG);
    cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);

    let element_ = element;
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

    function setup() {


        // Init Video Element
        mediaElement_ = (element_.querySelector('video'));
        // mediaElement_.addEventListener('error', onError_, false);
        // mediaElement_.addEventListener('playing', onPlaying_,
        //     false);
        // mediaElement_.addEventListener('pause', onPause_, false);
        // mediaElement_.addEventListener('ended', onEnded_, false);
        // mediaElement_.addEventListener('abort', onAbort_, false);
        mediaElement_.addEventListener('timeupdate', onTimeupdate,
            false);
        // mediaElement_.addEventListener('seeking', onSeekStart_,
        //     false);
        // mediaElement_.addEventListener('seeked', onSeekEnd_,
        //     false);

        // Init CastReceiverManager
        receiverManager_ = cast.receiver.CastReceiverManager.getInstance();
        receiverManager_.onReady = onReady_;
        receiverManager_.onSenderDisconnected = onSenderDisconnected_;
        receiverManager_.onVisibilityChanged = onVisibilityChanged_;

        // custom message bus
        genericBus_ = receiverManager_.getCastMessageBus(
                CastUtils.GENERIC_MESSAGE_NAMESPACE);
        genericBus_.onMessage = onGenericMessage_;

        oldmtnBus_ = receiverManager_.getCastMessageBus(
                CastUtils.OLDMTN_MESSAGE_NAMESPACE);
        oldmtnBus_.onMessage = onOldmtnMessage_;

        // Init Mediamanager
        mediaManager_ = new cast.receiver.MediaManager(mediaElement_);
        onLoadOrig_ =
            mediaManager_.onLoad.bind(mediaManager_);
        mediaManager_.onLoad = onLoad_;

        onGetStatusOrig_ =
            mediaManager_.onGetStatus.bind(mediaManager_);
        mediaManager_.onGetStatus = onGetStatus_;

        onMetadataLoadedOrig_ =
            mediaManager_.onMetadataLoaded.bind(mediaManager_);
        mediaManager_.onMetadataLoaded = onMetadataLoaded_;

        onStopOrig_ =
            mediaManager_.onStop.bind(mediaManager_);
        mediaManager_.onStop = onStop_;

        onLoadMetadataErrorOrig_ =
            mediaManager_.onLoadMetadataError.bind(mediaManager_);
        mediaManager_.onLoadMetadataError = onLoadMetadataError_;

        onErrorOrig_ = mediaManager_.onError.bind(mediaManager_);
        mediaManager_.onError = onError_;
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
        console.log('onReady');
    }

    function onSenderDisconnected_(event) {
        console.log('onSenderDisconnected');
        // When the last or only sender is connected to a receiver,
        // tapping Disconnect stops the app running on the receiver.
        if (receiverManager_.getSenders().length === 0 &&
            event.reason ===
            cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
            receiverManager_.stop();
        }
    }

    function onError_(error) {
        console.log('onError');
        onErrorOrig_(error);
    }

    function onPlaying_() {
        console.log('onPlaying');
    }

    function onPause_() {
        console.log('onPause');
    }

    function onStop_(event) {
        console.log('onStop');
        onStopOrig_(event);
    }

    function onEnded_() {
        console.log('onEnded');
    }

    function onAbort_() {
        console.log('onAbort');
    }

    function onTimeupdate() {
        var curTime = mediaElement_.currentTime;
        var totalTime = mediaElement_.duration;

        //console.log('onTimeupdate, ' + curTime + '/' + totalTime);

        // update local
        evHandlers['timeupdate'](curTime, totalTime);

        // send message to sender
        sendMessage_({
            type: 'timeupdate',
            data: {
                curTime: curTime,
                totalTime: totalTime
            }
        }, oldmtnBus_);
    }

    function onSeekStart_() {
        console.log('onSeekStart');
    }

    function onSeekEnd_() {
        console.log('onSeekEnd');
    }

    function onVisibilityChanged_(event) {
        console.log('onVisibilityChanged');
        if (!event.isVisible) {
            mediaElement_.pause();
            mediaManager_.broadcastStatus(false);
        }
    }

    function onGenericMessage_(event) {
        console.log('+onGenericMessage_, type: ' + event.type + ', senderId: ' + event.senderId);
        return;

        // console.log('type: ' + event.data.type);
        // console.log('requestId: ' + event.data.requestId);
        // console.log('namespace: ' + event.namespace);
        // console.log('senderId: ' + event.senderId);

        // var message = CastUtils.deserialize(event.data);
        // console.log('+onGenericMessage_: ' + message['type']);

        // TODO(ismena): error message on duplicate request id from the same sender
        //switch (message['type']) {
        switch (event.data.type) {
        case 'PLAY': {
                mediaElement_.play();
            }
            break;
        case 'PAUSE': {
                mediaElement_.pause();
            }
            break;
        case 'LOAD': {
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
        var message = CastUtils.deserialize(event.data);
        console.log('+onOldmtnMessage_, type: ' + message['type'] + ', targetName: ' + message[targetName] + ', methodName: ' + message[methodName]);

        //oldmtnBus_.broadcast("abcd1234");
    }

    function sendMessage_(message, bus, opt_senderId) {
        // Cuts log spam when debugging the receiver UI in Chrome.
        if (!isConnected_)
            return;

        var serialized = CastUtils.serialize(message);
        if (opt_senderId) {
            bus.getCastChannel(opt_senderId).send(serialized);
        } else {
            bus.broadcast(serialized);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    //
    function onLoad_(event) {
        console.log('onLoad_');

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
        console.log('--onGetStatus_--', event);
    }

    function onMetadataLoaded_(info) {
        console.log('onMetadataLoaded');

        var totalTime = mediaElement_.duration;
        console.log('total time: ' + totalTime);

        onMetadataLoadedOrig_(info);
    }

    function onLoadMetadataError_(event) {
        console.log('onLoadMetadataError_');
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