import EventBus from '../core/EventBus';
import Events from '../core/CoreEvents';
import Debug from '../core/Debug';

function formatAdsTimeOffset(offset) {
    var hour = parseInt(offset / 3600);
    var min = parseInt(parseInt((offset % 3600)) / 60);
    var sec = parseInt(parseInt((offset % 3600)) % 60);

    return hour.toString() + ':' + min.toString() + ':' + sec.toString() + '.000';
}

function getVMAPItem(breakId, offset, tag) {
    var breakType = 'linear,nonlinear';
    var breakId = breakId;
    var timeOffset = formatAdsTimeOffset(offset);
    var url = tag;

    var item = '<vmap:AdBreak breakType="_type_" breakId="_adbreakname_" timeOffset="_offset_"><vmap:AdSource allowMultipleAds="true" followRedirects="true" id="_adbreakname_-ad-1"><vmap:AdTagURI><![CDATA[_url_]]></vmap:AdTagURI></vmap:AdSource></vmap:AdBreak>'.replace(/_type_/g, breakType).replace(/_adbreakname_/g, breakId).replace(/_offset_/g, timeOffset).replace(/_url_/g, url);
    return item;
}

function AdsEngine(adContainer, videoPlayer, advertising) {
    let eventBus_ = EventBus(oldmtn).getInstance();
    let debug_ = Debug(oldmtn).getInstance();
    let adContainer_ = adContainer;
    let media_ = videoPlayer;
    let advertising_ = advertising;

    // IMA SDK Needs
    let adDisplayContainer_ = null;
    let adsLoader_ = null;
    let adsManager_ = null;

    //
    let cuePoints_ = null;

    //
    let width_;
    let height_;

    // flag
    let isPlayingAd_ = false;
    let isLinearAd_ = false;
    let isPaused_ = false;

    let adsLoaded_ = false;
    let contentInitialized_ = false;

    let countdownTimer_ = null;
    let duration_;
    let position_;

    function setup() {
        if (advertising_.vpaidmode) {
            let mode = -1;
            if (advertising_.vpaidmode === 'disabled') {
                mode = google.ima.ImaSdkSettings.VpaidMode.DISABLED;
            } else if (advertising_.vpaidmode === 'enabled') {
                mode = google.ima.ImaSdkSettings.VpaidMode.ENABLED;
            } else if (advertising_.vpaidmode === 'insecure') {
                mode = google.ima.ImaSdkSettings.VpaidMode.INSECURE;
            }
            if (mode !== -1) {
                google.ima.settings.setVpaidMode(mode);
            }
        }

        if (advertising_.locale) {
            google.ima.settings.setLocale(advertising_.locale);
        }

        adDisplayContainer_ =
            new google.ima.AdDisplayContainer(
                adContainer_,
                media_,
                advertising_.companion ? advertising_.companion.div : null);

        adsLoader_ = new google.ima.AdsLoader(adDisplayContainer_);
        // Mobile Skippable Ads
        // see: https://developers.google.com/interactive-media-ads/docs/sdks/html5/skippable-ads
        adsLoader_.getSettings().setDisableCustomPlaybackForIOS10Plus(true);
        adsLoader_.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            onAdsManagerLoaded,
            false,
            this);
        adsLoader_.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError,
            false,
            this);
    }

    function open() {
        adsLoaded_ = false;
        contentInitialized_ = false;

        eventBus_.on(oldmtn.Events.MEDIA_LOADEDMETADATA, onMediaLoadedMetadata, this);

        initialUserAction();
        requestAds();
    }

    function close() {
        if (countdownTimer_) {
            clearInterval(countdownTimer_);
            countdownTimer_ = null;
        }
        if (adsManager_) {
            adsManager_.destroy();
            adsManager_ = null;
        }
    }

    function initialUserAction() {
        // On iOS and Android devices, video playback must begin in a user action.
        // AdDisplayContainer provides a initialize() API to be called at appropriate
        // time.
        // see: https://developers.google.com/interactive-media-ads/docs/sdks/html5/mobile_video
        adDisplayContainer_.initialize();
    }

    function requestAds() {
        width_ = adContainer_.clientWidth;
        height_ = adContainer_.clientHeight;
        // var item = getVMAPItem('myAds', advertising_.offset, advertising_.tag);
        // var ads = '<vmap:VMAP xmlns:vmap="http://www.iab.net/videosuite/vmap" version="1.0">' + item + "</vmap:VMAP>"
        // console.log('ads: ' + ads);

        debug_.log('advertising_.tag: ' + advertising_.tag);
        var adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = advertising_.tag;
        // Specify the linear and nonlinear slot sizes. This helps the SDK to
        // select the correct creative if multiple are returned.
        adsRequest.linearAdSlotWidth = width_;
        adsRequest.linearAdSlotHeight = height_;
        adsRequest.nonLinearAdSlotWidth = width_;
        adsRequest.nonLinearAdSlotHeight = height_;

        adsRequest.forceNonLinearFullSlot = advertising_.forceNonLinearFullSlot;

        /*
         * In some circumstances you may want to prevent the SDK from playing ad breaks until you're ready for them.
         * In this scenario, you can disable automatic playback of ad breaks in favor of letting the SDK know when you're ready for an ad break to play.
         * With this configuration, once the SDK has loaded an ad break, it will fire an AD_BREAK_READY event.
         * When your player is ready for the ad break to start, you can call adsManager.start():
         */
        adsLoader_.getSettings().setAutoPlayAdBreaks(false);

        adsLoader_.requestAds(adsRequest);
    };

    // AdsEngine public functions
    function startAds() {
        debug_.log('+AdsEngine.startAds');

        // sometimes, requestAds may be caught an error, so we return here directly.
        if (!adsManager_) {
            return;
        }

        debug_.log('width_: ' + width_ + ', height_: ' + height_);
        adsManager_.init(width_, height_, google.ima.ViewMode.NORMAL);
        adsManager_.start();

        debug_.log('-AdsEngine.startAds');
    }

    function isPaused() {
        return isPaused_;
    }

    function isPlayingAd() {
        return isPlayingAd_;
    }

    function isLinearAd() {
        return isLinearAd_;
    }

    function isMuted() {
        if (adsManager_.getVolume() === 0) {
            return true;
        } else {
            return false;
        }
    }

    function mute() {
        adsManager_.setVolume(0);
    }

    function unmute() {
        adsManager_.setVolume(1);
    }

    function getVolume() {
        return adsManager_.getVolume();
    }

    function setVolume(volume) {
        adsManager_.setVolume(volume);
    }

    function play() {
        if (adsManager_) {
            adsManager_.resume();
        }
    }

    function pause() {
        if (adsManager_) {
            adsManager_.pause();
        }
    }

    function resize() {
        if (adsManager_) {
            adsManager_.resize(
                adContainer_.clientWidth,
                adContainer_.clientHeight,
                google.ima.ViewMode.FULLSCREEN);
        }
    }

    ////////////////////////////////////////////////////////////////////////
    function onAdsManagerLoaded(adsManagerLoadedEvent) {
        debug_.log('+onAdsManagerLoaded');

        var adsRenderingSettings = new google.ima.AdsRenderingSettings();
        if (advertising_.enablePreloading) {
            adsRenderingSettings.enablePreloading = advertising_.enablePreloading;
        }
        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

        adsManager_ = adsManagerLoadedEvent.getAdsManager(
                media_, adsRenderingSettings);

        // Attach the pause/resume events.
        // Handle errors.
        adsManager_.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError,
            false,
            this);
        var events = [
            // For non-auto ad breaks, listen for ad break ready
            google.ima.AdEvent.Type.AD_BREAK_READY,
            google.ima.AdEvent.Type.AD_METADATA,
            google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            google.ima.AdEvent.Type.CLICK,
            google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
            google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            google.ima.AdEvent.Type.COMPLETE,
            google.ima.AdEvent.Type.DURATION_CHANGE,
            google.ima.AdEvent.Type.FIRST_QUARTILE,
            google.ima.AdEvent.Type.IMPRESSION,
            google.ima.AdEvent.Type.LINEAR_CHANGED,
            google.ima.AdEvent.Type.LOADED,
            google.ima.AdEvent.Type.MIDPOINT,
            google.ima.AdEvent.Type.PAUSED,
            google.ima.AdEvent.Type.RESUMED,
            google.ima.AdEvent.Type.SKIPPED,
            google.ima.AdEvent.Type.STARTED,
            google.ima.AdEvent.Type.THIRD_QUARTILE,
            google.ima.AdEvent.Type.VOLUME_CHANGED,
            google.ima.AdEvent.Type.VOLUME_MUTED];
        for (var index in events) {
            adsManager_.addEventListener(
                events[index],
                onAdEvent,
                false,
                this);
        }

        adsLoaded_ = true;
        if (contentInitialized_) {
        //if (1) {
            debug_.log('startAds when contentInitialized_');
            startAds();
        }

        debug_.log('-onAdsManagerLoaded');
    }

    function onAdError(adErrorEvent) {
        debug_.log('--onAdEvent--: ' + adErrorEvent.getError().toString());
        let err = adErrorEvent.getError();
        // deserialize, getErrorCode, getInnerError, getMessage, getType, getVastErrorCode, serialize, toString
        console.log('ad err: ', err);

        let errCode = err.getErrorCode();
        let errMsg = err.getMessage();

        if (adsManager_) {
            adsManager_.destroy();
        }
        //application_.resumeAfterAd();
    }

    function onAdEvent(adEvent) {
        debug_.log('+onAdEvent: ' + adEvent.type);
        let ad = adEvent.getAd();

        switch (adEvent.type) {
        case google.ima.AdEvent.Type.AD_BREAK_READY: {
            console.log('adEvent.o.adBreakTime: ' + adEvent.o.adBreakTime);

            let skip = isSkipAdBreak(adEvent.o.adBreakTime);
            // Once we're ready to play ads. To skip this ad break, simply return
            // from this handler without calling adsManager.start().
            if (!skip) {
                adsManager_.start();
            }
            //adsManager_.start();
        } break;
        case google.ima.AdEvent.Type.AD_METADATA: {
                for (let i in adEvent) {
                    console.log('AD_METADATA: ' + i);
                }
                cuePoints_ = adEvent.getAdCuePoints();
                console.log('cue points: ' + cuePoints_.h.join(","));
            }
            break;
        case google.ima.AdEvent.Type.CLICK: {
                //application_.adClicked();
            }
            break;
        case google.ima.AdEvent.Type.COMPLETE: {
                isPlayingAd_ = false;
                if (countdownTimer_) {
                    clearInterval(countdownTimer_);
                    countdownTimer_ = null;
                }
                position_ = duration_;
                eventBus_.trigger(Events.AD_TIMEUPDATE, { duration: duration_, position: position_});
                eventBus_.trigger(Events.AD_COMPLETE);
            }
            break;
        case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED: {
                eventBus_.trigger(Events.AD_CONTENT_PAUSE_REQUESTED);
            }
            break;
        case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED: {
                eventBus_.trigger(Events.AD_CONTENT_RESUME_REQUESTED);
            }
            break;
        case google.ima.AdEvent.Type.DURATION_CHANGE: {
        } break;
        case google.ima.AdEvent.Type.IMPRESSION: {

        } break;
        case google.ima.AdEvent.Type.LINEAR_CHANGED: {

        } break;
        case google.ima.AdEvent.Type.LOADED: {
                if (!ad.isLinear()) {
                    eventBus_.trigger(Events.AD_CONTENT_RESUME_REQUESTED);
                }
            }
            break;
        case google.ima.AdEvent.Type.PAUSED: {
                isPaused_ = true;
            }
            break;
        case google.ima.AdEvent.Type.RESUMED: {
                isPaused_ = false;
            }
            break;
        case google.ima.AdEvent.Type.SKIPPED: {
                // for "skippable ads", if we skip it, we won't receive COMPLETED event, but only receive SKIPPED event.
                isPlayingAd_ = false;
            }
            break;
        case google.ima.AdEvent.Type.STARTED: {
                isPlayingAd_ = true;
                isLinearAd_ = ad.isLinear();

                eventBus_.trigger(Events.AD_STARTED, { ad: ad });
                position_ = 0;
                duration_ = ad.getDuration();
                countdownTimer_ = setInterval(function() {
                    let timeRemaining = adsManager_.getRemainingTime();
                    position_ = duration_ - timeRemaining;
                    // Update UI with timeRemaining
                    eventBus_.trigger(Events.AD_TIMEUPDATE, { duration: duration_, position: position_});
                }, 1000);
                eventBus_.trigger(Events.AD_TIMEUPDATE, { duration: duration_, position: position_});
            }
            break;
        case google.ima.AdEvent.Type.VOLUME_CHANGED: {
            console.log('ad VOLUME_CHANGED: ' + adsManager_.getVolume());
        }
        break;
        case google.ima.AdEvent.Type.VOLUME_MUTED: {
            console.log('ad VOLUME_MUTED: ' + adsManager_.getVolume());
        } break;
        default:
            break;
        }
    }

    function onMediaLoadedMetadata() {
        eventBus_.off(oldmtn.Events.MEDIA_LOADEDMETADATA, onMediaLoadedMetadata, this);
        debug_.log('+onMediaLoadedMetadata' +
            ', contentInitialized_: ' + contentInitialized_ +
            ', adsLoaded_: ' + adsLoaded_);
        contentInitialized_ = true;
        if (adsLoaded_) {
            debug_.log('startAds when adsLoaded_');
            startAds();
        }
        debug_.log('-onMediaLoadedMetadata');
    }

    function onMediaEnded() {
        adsLoader_.contentComplete();
    }

    function isSkipAdBreak(adBreakTime) {
        let skip = false;

        if (media_.seeking) {
            skip = true;
        }

        return skip;
    }

    let instance = {
        open: open,
        close: close,
        isPlayingAd: isPlayingAd,
        isLinearAd: isLinearAd,
        play: play,
        pause: pause,
        isPaused: isPaused,
        mute: mute,
        unmute: unmute,
        isMuted: isMuted,
        getVolume: getVolume,
        setVolume: setVolume,
        resize: resize,
        onMediaEnded: onMediaEnded,
        requestAds: requestAds
    };

    setup();
    return instance;
}

export default AdsEngine;
