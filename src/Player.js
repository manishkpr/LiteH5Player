'use strict'

import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';

import UIEngine from './ui/ui_engine';
import MediaSourceEngine from './media_source_engine';
import TextEngine from './text_engine';
import MediaEngine from './media_engine';
import DRMEngine from './drm_engine';
import AdsEngine from './ads/ads_engine';

import TimeRanges from './utils/timeRanges';
import XHRLoader from './utils/xhr_loader';
import CommonUtils from './utils/common_utils';

//////////////////////////////////////////////////////////////////////////////
function Player(cfg) {
    let cfg_ = cfg;
    let context_ = {};

    let uiEngine_;
    let media_;

    let audioIndex_ = 0;
    let videoIndex_ = 0;
    let streamInfo_ = null;

    let eventBus_;
    let debug_;
    let xhrLoader_;
    let mediaEngine_;
    let textEngine_;
    let mseEngine_;
    let drmEngine_;

    // ads part
    let adsEngine_;

    function setup() {
        initComponent();
        initData();
        addEventListeners();
        addResizeListener();
    }

    function open(info) {
        streamInfo_ = info;
        debug_.log('Player, +open');
        if (0) {
            if (info.audioCodec) {
                debug_.log('Player, +open: ' + info.audioCodec);
            }
            if (info.videoCodec) {
                debug_.log('Player, +open: ' + info.videoCodec);
            }

            if (info.audioCodec && MediaSource && !MediaSource.isTypeSupported(info.audioCodec)) {
                debug_.log('Don\'t support: ' + info.audioCodec);
                return;
            }

            if (info.videoCodec && MediaSource && !MediaSource.isTypeSupported(info.videoCodec)) {
                debug_.log('Don\'t support: ' + info.videoCodec);
                return;
            }

            mseEngine_.open(streamInfo_);

            let objURL = window.URL.createObjectURL(mseEngine_.getMediaSource());
            mediaEngine_.setSrc(objURL);
            drmEngine_.setDrmInfo(streamInfo_);
        }

        addPD();

        debug_.log('Player, -open');
    }

    function close() {
        if (adsEngine_) {
            adsEngine_.close();
        }
        if (mediaEngine_) {
            mediaEngine_.close();
        }
        if (mseEngine_) {
            mseEngine_.close();
        }

        audioIndex_ = 0;
        videoIndex_ = 0;
        streamInfo_ = null;
    }

    function dellAll() {
        mseEngine_.removeBuffer();
    }

    //////////////////////////////////////////////////////////////
    function addA() {
        if (audioIndex_ >= streamInfo_.aContents.length) {
            debug_.log('There don\'t have more content to add.');
            return;
        }

        let url = streamInfo_.aContents[audioIndex_];

        let self = this;
        function cbSuccess(bytes) {
            //debug_.log('before my appendBuffer');
            mseEngine_.appendBuffer('audio', bytes);

            audioIndex_++;
            //debug_.log('after my appendBuffer');
        }

        let request = {
            url: url,
            cbSuccess: cbSuccess.bind(self)
        };
        xhrLoader_.load(request);
    }

    function addV() {
        if (videoIndex_ >= streamInfo_.vContents.length) {
            debug_.log('There don\'t have more content to add.');
            return;
        }

        let url = streamInfo_.vContents[videoIndex_];

        let self = this;
        function cbSuccess(bytes) {
            //debug_.log('before my appendBuffer');
            mseEngine_.appendBuffer('video', bytes);
            videoIndex_++;
            //debug_.log('after my appendBuffer');
        }

        let request = {
            url: url,
            cbSuccess: cbSuccess.bind(self)
        };
        xhrLoader_.load(request);
    }

    function addPD() {
        debug_.log('+addPD, pdContent: ' + streamInfo_.pdContent);
        let url = streamInfo_.pdContent;

        let method = 1;
        if (method === 1) {
            media_.src = streamInfo_.pdContent;
        } else {
            let self = this;
            function cbSuccess(bytes) {
                mseEngine_.appendBuffer('video', bytes);
            }

            let request = {
                url: url,
                cbSuccess: cbSuccess.bind(self)
            };
            xhrLoader_.load(request);
        }

        if (adsEngine_) {
            adsEngine_.open();
        }

        debug_.log('-addPD');
    }

    //////////////////////////////////////////////////////////////////////////////////
    // 操作API
    function on(type, listener, scope) {
        eventBus_.on(type, listener, scope);
    }

    function off(type, listener, scope) {
        eventBus_.off(type, listener, scope);
    }

    function play() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            adsEngine_.play();
        } else {
            if (!mediaEngine_) {
                return;
            }
            mediaEngine_.play();
        }
    }

    function pause() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            adsEngine_.pause();
        } else {
            if (!mediaEngine_) { return; }
            mediaEngine_.pause();
        }
    }

    function isPaused() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            return adsEngine_.isPaused();
        } else {
            if (!mediaEngine_) {
                return;
            }
            return mediaEngine_.isPaused();
        }
    }

    function currentTime() {
        if (!mediaEngine_) {
            return;
        }
        return mediaEngine_.currentTime();
    }

    function duration() {
        if (!mediaEngine_) {
            return;
        }
        return mediaEngine_.duration();
    }
    
    function isEnded() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {}
        else {
            if (!mediaEngine_) {
                return;
            }
            mediaEngine_.isEnded();
        }
    }

    function mute() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            adsEngine_.mute();
        } else {
            if (!mediaEngine_) {
                return;
            }
            mediaEngine_.mute();
        }
    }

    function unmute() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            adsEngine_.unmute();
        } else {
            if (!mediaEngine_) {
                return;
            }
            mediaEngine_.unmute();
        }
    }

    function isMuted() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            return adsEngine_.isMuted();
        } else {
            if (!mediaEngine_) {
                return;
            }
            return mediaEngine_.isMuted();
        }
    }

    function seek(secs) {
        media_.currentTime = secs;
    }

    function getWidth() {
        return mediaEngine_.videoWidth();
    }

    function getHeight() {
        return mediaEngine_.videoHeight();
    }

    function resize(width, height) {
        if (adsEngine_) {
            adsEngine_.resize(width, height);
        }
    }

    /////////////////////////////////////////////////////////////////////////////////
    // Events API
    function signalEndOfStream() {
        if (mseEngine_) {
            mseEngine_.signalEndOfStream();
        }
    }

    // Begin - TextEngine
    function addTextTrack() {
        textEngine_.addTextTrack();
    };

    function removeTextTrack() {};

    function setTextTrackHidden() {
        textEngine_.setTextTrackHidden();
    };

    function setCueAlign(align) {
        textEngine_.setCueAlign(align);
    };

    function setCueLine(line) {
        textEngine_.setCueLine(line);
    };

    function setCueLineAlign(lineAlign) {
        textEngine_.setCueLineAlign(lineAlign);
    };
    // End - TextEngine

    /////////////////////////////////////////////////////////////////////////////////
    // private functions
    function initComponent() {
        // ui component
        uiEngine_ = new UIEngine(cfg_);
        media_ = uiEngine_.getVideo();
        if (cfg_.poster) {
            media_.poster = cfg_.poster;
        }

        // enging component
        eventBus_ = EventBus(oldmtn).getInstance();
        debug_ = Debug(oldmtn).getInstance();
        xhrLoader_ = new XHRLoader();
        mediaEngine_ = new MediaEngine(media_);
        textEngine_ = new TextEngine(media_);
        mseEngine_ = new MediaSourceEngine();
        drmEngine_ = new DRMEngine(media_);
        if (cfg_.advertising) {
            let adContainer = uiEngine_.getAdContainer();
            adsEngine_ = new AdsEngine(adContainer, media_, cfg_.advertising);
        }
    }

    function initData() {
        audioIndex_ = 0;
        videoIndex_ = 0;
        streamInfo_ = null;
    }

    function addEventListeners() {
        eventBus_.on(oldmtn.Events.MSE_OPENED, onMSEOpened, {});

        eventBus_.on(oldmtn.Events.MEDIA_DURATION_CHANGED, onMediaDurationChanged, {});
        eventBus_.on(oldmtn.Events.MEDIA_ENDED, onMediaEnded, {});

        eventBus_.on(oldmtn.Events.SB_UPDATE_ENDED, onSbUpdateEnded, {})

        eventBus_.on(oldmtn.Events.AD_COMPLETE, onAdComplete, {});
        eventBus_.on(oldmtn.Events.AD_CONTENT_PAUSE_REQUESTED, onAdContentPauseRequested, {});
        eventBus_.on(oldmtn.Events.AD_CONTENT_RESUME_REQUESTED, onAdContentResumeRequested, {});
        eventBus_.on(oldmtn.Events.AD_STARTED, onAdStarted, {});
    }

    function addResizeListener() {
        // fullscreen listener
        document.addEventListener("fullscreenchange", onFullScreenChange);
        document.addEventListener("mozfullscreenchange", onFullScreenChange);
        document.addEventListener("webkitfullscreenchange", onFullScreenChange);
        document.addEventListener("msfullscreenchange", onFullScreenChange);
    }

    function onFullScreenChange(e) {
        if (adsEngine_) {
            adsEngine_.resize();
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // Begin -- internal events listener functions
    function onMSEOpened() {
        mediaEngine_.revokeSrc();
    }

    function onMediaDurationChanged() {}

    function onMediaEnded() {
        if (adsEngine_) {
            adsEngine_.onMediaEnded();
        }
    }

    function onSbUpdateEnded() {
        // Need to signal end of stream when add pd to mse
        if (adsEngine_) {
            mseEngine_.signalEndOfStream();
        }
    }

    function onAdContentPauseRequested() {
        mediaEngine_.pause();
    }

    function onAdContentResumeRequested() {
        if (!mediaEngine_.isEnded()) {
            mediaEngine_.play();
        }
    }

    function onAdStarted(e) {
        let ad = e.ad;

        let selectionCriteria = new google.ima.CompanionAdSelectionSettings();
        selectionCriteria.resourceType = google.ima.CompanionAdSelectionSettings.ResourceType.STATIC;
        selectionCriteria.creativeType = google.ima.CompanionAdSelectionSettings.CreativeType.IMAGE;
        selectionCriteria.sizeCriteria = google.ima.CompanionAdSelectionSettings.SizeCriteria.IGNORE;

        for (let i = 0; i < cfg_.advertising.companions.length; i++) {
            let companion = cfg_.advertising.companions[i];
            // Get a list of companion ads for an ad slot size and CompanionAdSelectionSettings
            let companionAds = ad.getCompanionAds(companion.width, companion.height, selectionCriteria);
            if (companionAds && companionAds.length > 0) {
                let companionAd = companionAds[0];
                // Get HTML content from the companion ad.
                let content = companionAd.getContent();
                // Write the content to the companion ad slot.
                let div = document.getElementById(companion.id);
                div.innerHTML = content;
            }
        }
    }

    function onAdComplete() {}

    // End -- internal events listener functions

    ///////////////////////////////////////////////////////////////////////////
    //function onTestMsg() {
    function onTestMsg() {
        console.log('+onTestMsg');
    }

    function test() {
        //adsEngine_.initialUserAction();
        adsEngine_.close();
    }

    function test2() {
    }

    function attribute() {
        let media = media_;
        debug_.log(`media.buffered : ${TimeRanges.toString(media.buffered)}`);
        debug_.log(`media.seekable: ${TimeRanges.toString(media.seekable)}`);

        mseEngine_.setDuration(200);

        let a = 2;
        let b = a;
    }

    let instance = {
        open: open,
        close: close,
        addA: addA,
        addV: addV,
        addPD: addPD,
        on: on,
        off: off,
        play: play,
        pause: pause,
        isPaused: isPaused,
        currentTime: currentTime,
        duration: duration,
        isEnded: isEnded,
        mute: mute,
        unmute: unmute,
        isMuted: isMuted,
        seek: seek,
        getWidth: getWidth,
        getHeight: getHeight,
        resize: resize,
        test: test,
        test2: test2
    };
    
    setup();
    
    return instance;
};

export default Player;