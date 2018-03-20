import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';
import TimeRanges from './utils/timeRanges';
import CommonUtils from './utils/common_utils';

/* During the loading process of an audio/video, the following events occur, in this order:
loadstart
durationchange
loadedmetadata
loadeddata
progress
canplay
canplaythrough
 */

function MediaEngine(media, cfg) {
    let context_ = this.context;
    
    let media_ = media;
    let cfg_ = cfg;
    let eventBus_ = EventBus(context_).getInstance();
    let debug_ = Debug(context_).getInstance();

    // flag
    let autoplayAllowed_;
    let autoplayRequiresMuted_;

    function setup() {
        addEventListeners();
    }

    // Begin -- public functions
    function detectAutoplay() {
        debug_.log('+detectAutoplay: ' + cfg_.autoplay);
        if (cfg_.autoplay) {
            //media_.autoplay = true;
            let playPromise = play(); // This is asynchronous!
            if (playPromise !== undefined) {
                // console.log('webkitAudioDecodedByteCount: ' + media_.webkitAudioDecodedByteCount);
                // console.log('webkitVideoDecodedByteCount: ' + media_.webkitVideoDecodedByteCount);
                // if (CommonUtils.isSafari()) {
                //     console.log('audioTracks length: ' + media_.audioTracks.length);
                // }

                playPromise.then(onAutoplayWithSoundSuccess).catch(onAutoplayWithSoundFail);
            }
        }
    }

    function play() {
        debug_.log('+Native video element request: play');
        return media_.play();
    }

    function pause() {
        debug_.log('+Native video element request: pause');
        media_.pause();
    }

    function isPaused() {
        return media_.paused;
    }

    function getPosition() {
        return media_.currentTime;
    }

    function getDuration() {
        return media_.duration;
    }

    function getSeekableRange() {
        return media_.seekable;
    }

    function getBufferedRanges() {
        return media_.buffered;
    }

    function setPosition(time) {
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


    ///////////////////////////////////////////////////////////////////////////
    // Begin autoplay policy
    // see https://developers.google.com/interactive-media-ads/docs/sdks/html5/desktop-autoplay
    function onMutedAutoplaySuccess() {
        debug_.log('+onMutedAutoplaySuccess');
        autoplayAllowed_ = true;
        autoplayRequiresMuted_ = true;
    }

    function onMutedAutoplayFail() {
        debug_.log('+onMutedAutoplayFail');
        // Both muted and unmuted autoplay failed. Fall back to click to play.
        autoplayAllowed_ = false;
        autoplayRequiresMuted_ = false;

        setVolume(1);
        unmute();
    }

    function checkMutedAutoplaySupport() {
        debug_.log('+checkMutedAutoplaySupport');
        setVolume(0);
        mute();
        let playPromise = play();
        if (playPromise !== undefined) {
            playPromise.then(onMutedAutoplaySuccess).catch(onMutedAutoplayFail);
        }
    }

    function onAutoplayWithSoundSuccess(info) {
        // If we make it here, unmuted autoplay works.
        debug_.log('+onAutoplayWithSoundSuccess');
        autoplayAllowed_ = true;
        autoplayRequiresMuted_ = false;
    }

    function onAutoplayWithSoundFail(err) {
        // Unmuted autoplay failed. Now try muted autoplay.
        debug_.log('+onAutoplayWithSoundFail, err: ', err);
        autoplayAllowed_ = false;
        if (cfg_.mutedAutoplay) {
            checkMutedAutoplaySupport();
        }
    }
    // End autoplay policy

    // Begin - private function
    function onMediaAudioAvailable() {
        debug_.log('+Native video element event: audioavailable');
    }

    function onMediaAbort() {
        debug_.log('+Native video element event: abort');
    }

    function onMediaCanplay() {
        //The canplay event occurs when the browser can start playing the specified audio/video (when it has buffered enough to begin).
        debug_.log('+Native video element event: canplay');
        eventBus_.trigger(Events.MEDIA_CANPLAY);
    }

    function onMediaCanplayThrough() {
        debug_.log('+Native video element event: canplaythrough');
        let a = media_;
        eventBus_.trigger(Events.MEDIA_CANPLAY_THROUGH);
    }

    function onMediaDurationChanged() {
        // debug_.log('+Native video element event: durationchange' +
        //     ', getPosition: ' + media_.getPosition +
        //     ', duration: ' + media_.duration);
        eventBus_.trigger(Events.MEDIA_DURATION_CHANGED);
    }

    function onMediaEnded() {
        debug_.log('+Native video element event: ended');
        eventBus_.trigger(Events.MEDIA_ENDED);
    }

    function onMediaError() {
        debug_.log('+Native video element event: error');
    }

    function onMediaInterruptBegin() {
        debug_.log('+Native video element event: interruptbegin');
    }

    function onMediaInterruptEnd() {
        debug_.log('+Native video element event: interruptend');
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

        //debug_.log('+Native video element event: progress, ' + progress);
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

    function onMediaSuspend() {
        debug_.log('+Native video element event: suspend');
    }

    function onMediaTimeUpdated(e) {
        eventBus_.trigger(Events.MEDIA_TIMEUPDATE);
        //debug_.log(`main buffered : ${TimeRanges.toString(media.buffered)}` + ', getPosition: ' + media.getPosition);
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
        media_.addEventListener('mozaudioavailable', onMediaAudioAvailable);
        media_.addEventListener('abort', onMediaAbort);
        media_.addEventListener('canplay', onMediaCanplay);
        media_.addEventListener('canplaythrough', onMediaCanplayThrough);
        media_.addEventListener('durationchange', onMediaDurationChanged);
        media_.addEventListener('ended', onMediaEnded);
        media_.addEventListener('error', onMediaError);
        media_.addEventListener('interruptbegin', onMediaInterruptBegin);
        media_.addEventListener('interruptend', onMediaInterruptEnd);
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
        media_.addEventListener('suspend', onMediaSuspend);
        media_.addEventListener('timeupdate', onMediaTimeUpdated);
        media_.addEventListener('volumechange', onMediaVolumeChanged);
        media_.addEventListener('waiting', onMediaWaiting);
    }

    function removeEventsListeners() {
        media_.removeEventListener('mozaudioavailable', onMediaAudioAvailable);
        media_.removeEventListener('abort', onMediaAbort);
        media_.removeEventListener('canplay', onMediaCanplay);
        media_.removeEventListener('canplaythrough', onMediaCanplayThrough);
        media_.removeEventListener('durationchange', onMediaDurationChanged);
        media_.removeEventListener('ended', onMediaEnded);
        media_.removeEventListener('error', onMediaError);
        media_.removeEventListener('interruptbegin', onMediaInterruptBegin);
        media_.removeEventListener('interruptend', onMediaInterruptEnd);
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
        media_.removeEventListener('suspend', onMediaSuspend);
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

    function getValidBufferPosition(currentPos) {
        let bufferedEnd;
        for (let i = 0; i < media_.buffered.length; ++i) {
            let start = media_.buffered.start(i);
            let end = media_.buffered.end(i)

            if (currentPos >= start && currentPos <= end) {
                bufferedEnd = end;
                break;
            }
        }

        return bufferedEnd;
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
        detectAutoplay: detectAutoplay,
        play: play,
        pause: pause,
        isPaused: isPaused,
        getPosition: getPosition,
        setPosition: setPosition,
        getDuration: getDuration,
        getSeekableRange: getSeekableRange,
        getBufferedRanges: getBufferedRanges,
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
        revokeSrc: revokeSrc,
        getValidBufferPosition: getValidBufferPosition
    };

    setup();
    return instance;
}

MediaEngine.__h5player_factory_name = 'MediaEngine';
export default FactoryMaker.getSingletonFactory(MediaEngine);
