﻿import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';
import TimeRanges from './utils/timeRanges';

/* During the loading process of an audio/video, the following events occur, in this order:
loadstart
durationchange
loadedmetadata
loadeddata
progress
canplay
canplaythrough
 */

function MediaEngine(media) {
    let media_ = media;
    let eventBus_;
    let debug_;

    function setup() {
        eventBus_ = EventBus(oldmtn).getInstance();
        debug_ = Debug(oldmtn).getInstance();
        addEventListeners();
    }

    // Begin -- public functions
    function play() {
        debug_.log('Native video element request: play');
        return media_.play();
    }

    function pause() {
        debug_.log('Native video element request: pause');
        media_.pause();
    }

    function isPaused() {
        return media_.paused;
    }

    function currentTime() {
        return media_.currentTime;
    }

    function duration() {
        return media_.duration;
    }

    function seek(time) {
        media_.currentTime = time;
    }

    function isSeeking() {
        return media_.seeking;
    }

    function isEnded() {
        return media_.ended;
    }

    function mute() {
        media_.muted = true;
    }

    function unmute() {
        media_.muted = false;
    }

    function isMuted() {
        return media_.muted;
    }

    function setVolume(volume) {
        media_.volume = volume;
    }

    function getVolume() {
        return media_.volume;
    }

    function videoWidth() {
        return media_.videoWidth;
    }

    function videoHeight() {
        return media_.videoHeight;
    }
    // End -- public functions

    // Begin - private function
    function onMediaCanplay() {
        //The canplay event occurs when the browser can start playing the specified audio/video (when it has buffered enough to begin).
        debug_.log('+Native video element event: canplay');
    }

    function onMediaCanplayThrough() {
        debug_.log('+Native video element event: canplaythrough');
    }

    function onMediaDurationChanged() {
        debug_.log('+Native video element event: durationchange' +
            ', currentTime: ' + media_.currentTime +
            ', duration: ' + media_.duration);
        eventBus_.trigger(Events.MEDIA_DURATION_CHANGED);
    }

    function onMediaEnded() {
        debug_.log('+Native video element event: ended');
        eventBus_.trigger(Events.MEDIA_ENDED);
    }

    function onMediaLoadedData() {
        debug_.log('+Native video element event: loadeddata');
        function hasAudio() {
            if (typeof media_.webkitAudioDecodedByteCount !== "undefined") {
                // non-zero if video has audio track
                if (media_.webkitAudioDecodedByteCount > 0) {
                    console.log("video has audio");
                } else {
                    console.log("video doesn't have audio");
                }
            } else if (typeof media_.mozHasAudio !== "undefined") {
                // true if video has audio track
                if (media_.mozHasAudio) {
                    console.log("video has audio");
                } else {
                    console.log("video doesn't have audio");
                }
            } else {
                console.log("can't tell if video has audio");
            }
        }

        debug_.log('hasAudio: ' + hasAudio());
        eventBus_.trigger(Events.MEDIA_LOADEDDATA);
    }

    function onMediaLoadedMetadata() {
        debug_.log('+Native video element event: metadata' +
            ', width: ' + media_.videoWidth +
            ', height: ' + media_.videoHeight +
            ', duration: ' + media_.duration);
        let width = media_.videoWidth;
        let height = media_.videoHeight;
        eventBus_.trigger(Events.MEDIA_LOADEDMETADATA, {
            width: width,
            height: height
        });
    }

    function onMediaLoadStart() {
        debug_.log('+Native video element event: loadstart');
    }

    function onMediaPaused() {
        debug_.log('+Native video element event: pause');
        eventBus_.trigger(Events.MEDIA_PAUSED);
    }

    function onMediaPlay() {
        debug_.log('+Native video element event: play');
    }

    function onMediaPlaying() {
        debug_.log('+Native video element event: playing');
        eventBus_.trigger(Events.MEDIA_PLAYING);
    }

    function onMediaProgress(e) {
        var progress = TimeRanges.toString(media_.buffered);

        debug_.log('+Native video element event: progress, ' + progress);
    }

    function onMediaReadyState(e) {
        debug_.log('+Native video element event: readyState');
    }

    function onMediaSeeking() {
        eventBus_.trigger(Events.MEDIA_SEEKING);
    }

    function onMediaSeeked() {
        eventBus_.trigger(Events.MEDIA_SEEKED);
    }

    function onMediaTimeUpdated(e) {
        eventBus_.trigger(Events.MEDIA_TIMEUPDATE);
        //debug_.log(`main buffered : ${TimeRanges.toString(media.buffered)}` + ', currentTime: ' + media.currentTime);
    }

    function onMediaVolumeChanged() {
        debug_.log('+Native video element event: volumechange, muted: ' + media_.muted + ', volume: ' + media_.volume);
        eventBus_.trigger(Events.MEDIA_VOLUME_CHANGED);
    }

    function onMediaWaiting() {
        debug_.log('+Native video element event: waiting');
        eventBus_.trigger(Events.MEDIA_WAITING);
    }
    // End

    // public function
    function addEventListeners() {
        media_.addEventListener('canplay', onMediaCanplay);
        media_.addEventListener('canplaythrough', onMediaCanplayThrough);
        media_.addEventListener('durationchange', onMediaDurationChanged);
        media_.addEventListener('ended', onMediaEnded);
        media_.addEventListener('loadeddata', onMediaLoadedData);
        media_.addEventListener('loadedmetadata', onMediaLoadedMetadata);
        media_.addEventListener('loadstart', onMediaLoadStart);
        media_.addEventListener('pause', onMediaPaused);
        media_.addEventListener('play', onMediaPlay);
        media_.addEventListener('playing', onMediaPlaying);
        media_.addEventListener('progress', onMediaProgress);
        media_.addEventListener('readyState', onMediaReadyState);
        media_.addEventListener('seeking', onMediaSeeking);
        media_.addEventListener('seeked', onMediaSeeked);
        media_.addEventListener('timeupdate', onMediaTimeUpdated);
        media_.addEventListener('volumechange', onMediaVolumeChanged);
        media_.addEventListener('waiting', onMediaWaiting);
    }

    function removeEventsListeners() {
        media_.removeEventListener('canplay', onMediaCanplay);
        media_.removeEventListener('durationchange', onMediaDurationChanged);
        media_.removeEventListener('ended', onMediaEnded);
        media_.removeEventListener('loadeddata', onMediaLoadedData);
        media_.removeEventListener('loadedmetadata', onMediaMetadata);
        media_.removeEventListener('loadstart', onMediaLoadStart);
        media_.removeEventListener('pause', onMediaPaused);
        media_.removeEventListener('play', onMediaPlay);
        media_.removeEventListener('playing', onMediaPlaying);
        media_.removeEventListener('progress', onMediaProgress);
        media_.removeEventListener('readyState', onMediaReadyState);
        media_.removeEventListener('seeking', onMediaSeeking);
        media_.removeEventListener('seeked', onMediaSeeked);
        media_.removeEventListener('timeupdate', onMediaTimeUpdated);
        media_.removeEventListener('volumechange', onMediaVolumeChanged);
        media_.removeEventListener('waiting', onMediaWaiting);
    };

    function setSrc(objURL) {
        media_.src = objURL;
    }

    function getSrc() {
        return media_.src;
    }

    function revokeSrc() {
        URL.revokeObjectURL(media_.src);
    }

    function close() {
        debug_.log('+media_engine.js, close');
        // Detach properly the MediaSource from the HTMLMediaElement as
        // suggested in https://github.com/w3c/media-source/issues/53
        if (media_) {
            media_.removeAttribute('src');
            media_.load();
        }
    }

    let instance = {
        play: play,
        pause: pause,
        isPaused: isPaused,
        currentTime: currentTime,
        duration: duration,
        seek: seek,
        isSeeking: isSeeking,
        isEnded: isEnded,
        mute: mute,
        unmute: unmute,
        isMuted: isMuted,
        setVolume: setVolume,
        getVolume: getVolume,
        videoWidth: videoWidth,
        videoHeight: videoHeight,

        close: close,
        setSrc: setSrc,
        revokeSrc: revokeSrc
    };

    setup();
    return instance;
}

export default MediaEngine;
