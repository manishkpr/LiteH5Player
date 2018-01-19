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
    console.log('--new AdsEngine object--');

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
    let width_;
    let height_;

    // flag
    let isPlayingAd_ = false;
    let isLinearAd_ = false;
    let isPaused_ = false;

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
    }

    function init() {
        eventBus_.on(oldmtn.Events.MEDIA_LOADEDMETADATA, onMediaLoadedMetadata, this);

        //
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

        initialUserAction();
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
        adsRequest.linearAdSlotWidth = width_;
        adsRequest.linearAdSlotHeight = height_;
        adsRequest.nonLinearAdSlotWidth = width_;
        adsRequest.nonLinearAdSlotHeight = height_;

        if (advertising_.forceNonLinearFullSlot) {
            adsRequest.forceNonLinearFullSlot = advertising_.forceNonLinearFullSlot;
        }

        //adsLoader_.getSettings().setAutoPlayAdBreaks(false);
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
        var events = [google.ima.AdEvent.Type.AD_BREAK_READY,
            google.ima.AdEvent.Type.AD_METADATA,
            google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            google.ima.AdEvent.Type.CLICK,
            google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
            google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            google.ima.AdEvent.Type.COMPLETE,
            google.ima.AdEvent.Type.DURATION_CHANGE,
            google.ima.AdEvent.Type.FIRST_QUARTILE,
            google.ima.AdEvent.Type.LOADED,
            google.ima.AdEvent.Type.MIDPOINT,
            google.ima.AdEvent.Type.PAUSED,
            google.ima.AdEvent.Type.RESUMED,
            google.ima.AdEvent.Type.SKIPPED,
            google.ima.AdEvent.Type.STARTED,
            google.ima.AdEvent.Type.THIRD_QUARTILE,
            google.ima.AdEvent.Type.VOLUME_CHANGED];
        for (var index in events) {
            adsManager_.addEventListener(
                events[index],
                onAdEvent,
                false,
                this);
        }

        startAds();

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
        debug_.log('--onAdEvent--: ' + adEvent.type);

        let ad = adEvent.getAd();

        switch (adEvent.type) {
        case google.ima.AdEvent.Type.AD_BREAK_READY: {}
            break;
        case google.ima.AdEvent.Type.AD_METADATA: {
                var cuePts = adEvent.getAdCuePoints();
                console.log('cue points: ' + cuePts.h.join(","));
            }
            break;
        case google.ima.AdEvent.Type.CLICK: {
                //application_.adClicked();
            }
            break;
        case google.ima.AdEvent.Type.COMPLETE: {
                isPlayingAd_ = false;
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
        case google.ima.AdEvent.Type.DURATION_CHANGE: {}
            break;
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
                debug_.log('--google.ima.AdEvent.Type.SKIPPED--');
                // for "skippable ads", if we skip it, we won't receive COMPLETED event, but only receive SKIPPED event.
                isPlayingAd_ = false;
            }
            break;
        case google.ima.AdEvent.Type.STARTED: {
                debug_.log('--google.ima.AdEvent.Type.STARTED--');
                isPlayingAd_ = true;
                isLinearAd_ = ad.isLinear();

                eventBus_.trigger(Events.AD_STARTED, {
                    ad: ad
                });
            }
            break;
        case google.ima.AdEvent.Type.VOLUME_CHANGED: {
                console.log('ad volume: ' + adsManager_.getVolume());
            }
            break;
        }
    }

    function onMediaLoadedMetadata() {
        eventBus_.off(oldmtn.Events.MEDIA_LOADEDMETADATA, onMediaLoadedMetadata, this);
        debug_.log('+onMediaLoadedMetadata');
        requestAds();
        debug_.log('-onMediaLoadedMetadata');
    }

    function onMediaEnded() {
        adsLoader_.contentComplete();
    }

    let instance = {
        init: init,
        isPlayingAd: isPlayingAd,
        isLinearAd: isLinearAd,
        play: play,
        pause: pause,
        isPaused: isPaused,
        mute: mute,
        unmute: unmute,
        isMuted: isMuted,
        resize: resize,
        onMediaEnded: onMediaEnded,
        requestAds: requestAds
    }
    setup();
    return instance;
}

export default AdsEngine;
