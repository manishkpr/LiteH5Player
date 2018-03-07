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

import ManifestParser from './media/manifest_parser';
import ScheduleController from './media/schedule_controller';

import TimeRanges from './utils/timeRanges';
import XHRLoader from './utils/xhr_loader';
import CommonUtils from './utils/common_utils';

//////////////////////////////////////////////////////////////////////////////
function Player(containerId) {
    let containerId_ = containerId;
    let cfg_;
    let context_ = {};

    let uiEngine_;
    let media_;

    let audioHeaderAdded_ = false;
    let audioIndex_ = 0;
    let videoHeaderAdded_ = false;
    let videoIndex_ = 0;
    let streamInfo_ = null;

    let eventBus_;
    let debug_;
    let xhrLoader_;
    let mediaEngine_;
    let textEngine_;
    let mseEngine_;
    let drmEngine_;
    let manifestParser_;
    let parser_;

    let scheduleCtrl_;

    // ads part
    let adsEngine_;

    // autoplay reference
    let autoplayAllowed_;
    let autoplayRequiresMuted_;

    function setup() {
        uiEngine_ = UIEngine(oldmtn).getInstance();
        uiEngine_.initUI(containerId_);
        media_ = uiEngine_.getVideo();
    }

    function init(cfg) {
        cfg_ = cfg;

        initComponent();
        initData();
        addEventListeners();
        addResizeListener();
    }

    function open(info) {
        streamInfo_ = info;
        debug_.log('Player, +open');

        // fetch dash content
        if (streamInfo_.url) {
            parser_ = manifestParser_.getParser(streamInfo_.url);
            streamInfo_.activeStream = parser_.loadManifest(streamInfo_.url);
        }
        
        // BD, use .src for PD
        // if it is pd, so we don't need to create mediasource
        if (streamInfo_.activeStream.pdRep) {
            addPD();
            return;
        }
        // ED

        //
        if (!window.MediaSource) {
            debug_.log('Don\'t support MediaSource in this platform');
            return;
        }

        if (streamInfo_.activeStream.aRep) {
            if (streamInfo_.activeStream.aRep.codecs) {
                debug_.log('Player, +open: ' + streamInfo_.activeStream.aRep.codecs);
            }

            if (streamInfo_.activeStream.aRep.codecs &&
                window.MediaSource &&
                !window.MediaSource.isTypeSupported(streamInfo_.activeStream.aRep.codecs)) {
                debug_.log('Don\'t support: ' + streamInfo_.activeStream.aRep.codecs);
                return;
            }
        }

        if (streamInfo_.activeStream.vRep) {
            if (streamInfo_.activeStream.vRep.codecs) {
                debug_.log('Player, +open: ' + streamInfo_.activeStream.vRep.codecs);
            }

            if (streamInfo_.activeStream.vRep.codecs &&
                window.MediaSource &&
                !window.MediaSource.isTypeSupported(streamInfo_.activeStream.vRep.codecs)) {
                debug_.log('Don\'t support: ' + streamInfo_.activeStream.vRep.codecs);
                return;
            }
        }

        if (streamInfo_.activeStream.pdRep) {
            if (streamInfo_.activeStream.pdRep.codecs) {
                debug_.log('Player, +open: ' + streamInfo_.activeStream.pdRep.codecs);
            }

            if (streamInfo_.activeStream.pdRep.codecs &&
                window.MediaSource &&
                !window.MediaSource.isTypeSupported(streamInfo_.activeStream.pdRep.codecs)) {
                debug_.log('Don\'t support: ' + streamInfo_.activeStream.pdRep.codecs);
                return;
            }
        }

        mseEngine_.open(streamInfo_.activeStream);

        let objURL = window.URL.createObjectURL(mseEngine_.getMediaSource());
        mediaEngine_.setSrc(objURL);
        drmEngine_.setDrmInfo(streamInfo_);

        if (adsEngine_) {
            adsEngine_.requestAds();
        }

        debug_.log('Player, -open');
    }

    function close() {
        if (scheduleCtrl_) {
            scheduleCtrl_.stop();
        }
        if (adsEngine_) {
            adsEngine_.close();
        }
        if (mseEngine_) {
            mseEngine_.close();
        }
        if (mediaEngine_) {
            mediaEngine_.close();
        }

        audioIndex_ = 0;
        videoIndex_ = 0;
        streamInfo_ = null;
    }

    function dellAll() {
        mseEngine_.removeBuffer();
    }

    function addA() {
        if (audioIndex_ >= streamInfo_.activeStream.aRep.media.length) {
            debug_.log('There don\'t have more content to add.');
            return;
        }

        let url = null;
        if (audioHeaderAdded_ === false) {
            url = streamInfo_.activeStream.aRep.initialization;
        } else {
            url = streamInfo_.activeStream.aRep.media[audioIndex_];
        }

        let self = this;
        function cbSuccess(bytes) {
            mseEngine_.appendBuffer({type: streamInfo_.activeStream.aRep.type, buffer: bytes});

            if (audioHeaderAdded_) {
                audioIndex_++;
            } else {
                audioHeaderAdded_ = true;
            }
        }

        let request = {
            url: url,
            cbSuccess: cbSuccess.bind(self)
        };
        xhrLoader_.load(request);
    }

    function addV() {
        if (videoIndex_ >= streamInfo_.activeStream.vRep.media.length) {
            debug_.log('There don\'t have more content to add.');
            return;
        }

        let url = null;
        if (videoHeaderAdded_ === false) {
            url = streamInfo_.activeStream.vRep.initialization;
        } else {
            url = streamInfo_.activeStream.vRep.media[videoIndex_];
        }

        let self = this;
        function cbSuccess(bytes) {
            mseEngine_.appendBuffer({type: streamInfo_.activeStream.vRep.type, buffer: bytes});

            if (videoHeaderAdded_) {
                videoIndex_++;
            } else {
                videoHeaderAdded_ = true;
            }
        }

        let request = {
            url: url,
            cbSuccess: cbSuccess.bind(self)
        };
        xhrLoader_.load(request);
    }

    function addPD() {
        debug_.log('+addPD, pdContent: ' + streamInfo_.activeStream.pdRep);
        let url = streamInfo_.activeStream.pdRep.media;

        media_.src = url;
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
            if (!mediaEngine_) { return; }
            return mediaEngine_.isPaused();
        }
    }

    function getPosition() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            return adsEngine_.getPosition();
        } else {
            if (!mediaEngine_) { return; }
            return mediaEngine_.getPosition();
        }
    }

    function getDuration() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            return adsEngine_.getDuration();
        } else {
            if (!mediaEngine_) { return; }
            return mediaEngine_.getDuration();
        }
    }
    
    function isEnded() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {

        }
        else {
            if (!mediaEngine_) { return; }
            return mediaEngine_.isEnded();
        }
    }

    function mute() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            adsEngine_.mute();
        } else {
            if (!mediaEngine_) { return; }
            mediaEngine_.mute();
        }
    }

    function unmute() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            adsEngine_.unmute();
        } else {
            if (!mediaEngine_) { return; }
            mediaEngine_.unmute();
        }
    }

    function isMuted() {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            return adsEngine_.isMuted();
        } else {
            if (!mediaEngine_) { return; }
            return mediaEngine_.isMuted();
        }
    }

    function setVolume(volume) {
        if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
            adsEngine_.setVolume(volume);
        } else {
            if (!mediaEngine_) { return; }
            mediaEngine_.setVolume(volume);
        }
    }

    function getVolume() {
        if (!mediaEngine_) { return; }

        return mediaEngine_.getVolume();
    }

    function setPosition(time) {
        mediaEngine_.setPosition(time);
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

    function playAd() {
        if (adsEngine_) {
            adsEngine_.playAd();
        } else {

        }
    }

    function isFullscreen() {
        return document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreen ||
        document.webkitIsFullScreen;
    }

    function getValidBufferPosition(currentPos) {
        return mediaEngine_.getValidBufferPosition(currentPos);
    }

    /////////////////////////////////////////////////////////////////////////////////
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
        // enging component
        eventBus_ = EventBus(oldmtn).getInstance();
        debug_ = Debug(oldmtn).getInstance();
        xhrLoader_ = XHRLoader(oldmtn).getInstance();
        mediaEngine_ = MediaEngine(oldmtn).getInstance(media_, cfg_);
        textEngine_ = new TextEngine(media_);
        mseEngine_ = new MediaSourceEngine();
        drmEngine_ = new DRMEngine(media_);
        manifestParser_ = ManifestParser(oldmtn).getInstance();

        if (cfg_.poster) {
            media_.poster = cfg_.poster;
        }
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
        document.addEventListener("MSFullscreenChange", onFullScreenChange);
    }

    function onFullScreenChange() {
        // we should not rely on clientWidth or clientHeight to set ad metrics when fullscreen change event triggered.
        eventBus_.trigger(oldmtn.Events.FULLSCREEN_CHANGE);
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // Begin -- internal events listener functions
    function onMSEOpened() {
        mediaEngine_.revokeSrc();

        // Detecting autoplay success or failure
        //mediaEngine_.detectAutoplay();

        //
        scheduleCtrl_ = ScheduleController(oldmtn).getInstance();
        scheduleCtrl_.start(parser_);
    }

    function onAdContentPauseRequested() {
        mediaEngine_.pause();
    }

    function onAdContentResumeRequested() {
        if (!mediaEngine_.isEnded()) {
            mediaEngine_.play();
        }
    }

    function onAdStarted() {
    }

    function onAdComplete() {}
    // End -- internal events listener functions

    ///////////////////////////////////////////////////////////////////////////
    // Title: debug function here
    function manualSchedule() {
        scheduleCtrl_ = ScheduleController(oldmtn).getInstance();
        scheduleCtrl_.manualSchedule();
    }

    function test() {
        let media = media_;

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
        init: init,
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
        getPosition: getPosition,
        setPosition: setPosition,
        getDuration: getDuration,
        isEnded: isEnded,
        mute: mute,
        unmute: unmute,
        isMuted: isMuted,
        setVolume: setVolume,
        getVolume: getVolume,
        // Resize
        getWidth: getWidth,
        getHeight: getHeight,
        resize: resize,
        isFullscreen: isFullscreen,
        // buffer
        getValidBufferPosition: getValidBufferPosition,
        // Ads
        playAd: playAd,
        // debug
        manualSchedule: manualSchedule,
        test: test,
        test2: test2
    };
    
    setup();
    
    return instance;
};

export default Player;


