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
let Player = function (cfg) {
    this.cfg_ = cfg;
    this.context_ = {};

    this.initUI();
    this.initData();
    this.addEventListeners();
};

Player.prototype.open = function (info) {
    this.streamInfo_ = info;
    this.debug_.log('Player, +open');
    if (0) {
        if (info.audioCodec) {
            this.debug_.log('Player, +open: ' + info.audioCodec);
        }
        if (info.videoCodec) {
            this.debug_.log('Player, +open: ' + info.videoCodec);
        }

        if (info.audioCodec && MediaSource && !MediaSource.isTypeSupported(info.audioCodec)) {
            this.debug_.log('Don\'t support: ' + info.audioCodec);
            return;
        }

        if (info.videoCodec && MediaSource && !MediaSource.isTypeSupported(info.videoCodec)) {
            this.debug_.log('Don\'t support: ' + info.videoCodec);
            return;
        }

        this.mseEngine_.open(this.streamInfo_);

        let objURL = window.URL.createObjectURL(this.mseEngine_.getMediaSource());
        this.mediaEngine_.setSrc(objURL);
        this.drmEngine_.setDrmInfo(this.streamInfo_);
    }

    this.addPD();

    this.debug_.log('Player, -open');
};

Player.prototype.dellAll = function () {
    this.mseEngine_.removeBuffer();
};

Player.prototype.close = function () {
    if (this.mediaEngine_) {
        this.mediaEngine_.reset();
    }

    this.audioIndex_ = 0;
    this.videoIndex_ = 0;
    this.streamInfo_ = null;
};

//////////////////////////////////////////////////////////////
Player.prototype.addA = function () {
    if (this.audioIndex_ >= this.streamInfo_.aContents.length) {
        this.debug_.log('There don\'t have more content to add.');
        return;
    }

    let url = this.streamInfo_.aContents[this.audioIndex_];

    let self = this;
    function cbSuccess(bytes) {
        //this.debug_.log('before my appendBuffer');
        this.mseEngine_.appendBuffer('audio', bytes);

        this.audioIndex_ ++;
        //this.debug_.log('after my appendBuffer');
    }

    let request = {url: url, cbSuccess: cbSuccess.bind(self)};
    this.xhrLoader_.load(request);
};

Player.prototype.addV = function () {
    if (this.videoIndex_ >= this.streamInfo_.vContents.length) {
        this.debug_.log('There don\'t have more content to add.');
        return;
    }

    let url = this.streamInfo_.vContents[this.videoIndex_];

    let self = this;
    function cbSuccess(bytes) {
        //this.debug_.log('before my appendBuffer');
        this.mseEngine_.appendBuffer('video', bytes);
        this.videoIndex_ ++;
        //this.debug_.log('after my appendBuffer');
    }

    let request = { url: url, cbSuccess: cbSuccess.bind(self) };
    this.xhrLoader_.load(request);
};

Player.prototype.addPD = function () {
    this.debug_.log('+addPD, pdContent: ' + this.streamInfo_.pdContent);
    let url = this.streamInfo_.pdContent;

    if (this.adsEngine_) {
        this.adsEngine_.initialUserAction();
    }

    let method = 1;
    if (method === 1) {
        this.cfg_.media.src = this.streamInfo_.pdContent;
        this.cfg_.media.load();
    } else {
        let self = this;
        function cbSuccess(bytes) {
            this.mseEngine_.appendBuffer('video', bytes);
        }

        let request = { url: url, cbSuccess: cbSuccess.bind(self) };
        this.xhrLoader_.load(request);
    }

    this.debug_.log('-addPD');
};

//////////////////////////////////////////////////////////////////////////////////
// 操作API
Player.prototype.currentTime = function () {
    if (!this.mediaEngine_) { return; }
    return this.mediaEngine_.currentTime();
};

Player.prototype.duration = function () {
    if (!this.mediaEngine_) { return; }
    return this.mediaEngine_.duration();
};

Player.prototype.isMuted = function () {
    if (this.adsEngine_ && this.adsEngine_.isPlayingAd()) {
        return this.adsEngine_.isMuted();
    } else {
        if (!this.mediaEngine_) { return; }
        return this.mediaEngine_.isMuted();
    }
};

Player.prototype.isPaused = function () {
    if (this.adsEngine_ && this.adsEngine_.isPlayingAd() && this.adsEngine_.isLinearAd()) {
        return this.adsEngine_.isPaused();
    } else {
        if (!this.mediaEngine_) { return; }
        return this.mediaEngine_.isPaused();
    }
};

Player.prototype.isEnded = function () {
    if (this.adsEngine_ && this.adsEngine_.isPlayingAd() && this.adsEngine_.isLinearAd()) {

    } else {
        if (!this.mediaEngine_) { return; }
        this.mediaEngine_.isEnded();
    }
};

Player.prototype.mute = function() {
    if (this.adsEngine_ && this.adsEngine_.isPlayingAd()) {
        this.adsEngine_.mute();
    } else {
        if (!this.mediaEngine_) { return; }
        this.mediaEngine_.mute();
    }
};

Player.prototype.pause = function () {
    if (this.adsEngine_ && this.adsEngine_.isPlayingAd() && this.adsEngine_.isLinearAd()) {
        this.adsEngine_.pause();
    } else {
        if (!this.mediaEngine_) { return; }
        this.mediaEngine_.pause();
    }
};

Player.prototype.play = function () {
    if (this.adsEngine_ && this.adsEngine_.isPlayingAd() && this.adsEngine_.isLinearAd()) {
        this.adsEngine_.play();
    } else {
        if (!this.mediaEngine_) { return; }
        this.mediaEngine_.play();
    }
};

Player.prototype.unmute = function() {
    if (this.adsEngine_ && this.adsEngine_.isPlayingAd()) {
        this.adsEngine_.unmute();
    } else {
        if (!this.mediaEngine_) { return; }
        this.mediaEngine_.unmute();
    }
};

/////////////////////////////////////////////////////////////////////////////////
//
Player.prototype.on = function (type, listener, scope) {
    this.eventBus_.on(type, listener, scope);
};

Player.prototype.off = function (type, listener, scope) {
    this.eventBus_.off(type, listener, scope);
};

Player.prototype.cast = function () {
    
};

Player.prototype.signalEndOfStream = function () {
    if (this.mseEngine_) {
        this.mseEngine_.signalEndOfStream();
    }
};

Player.prototype.seek = function (secs) {
    this.cfg_.media.currentTime = secs;
};

// Begin - TextEngine
Player.prototype.addTextTrack = function () {
    this.textEngine_.addTextTrack();
};

Player.prototype.removeTextTrack = function () {
    
};

Player.prototype.setTextTrackHidden = function () {
    this.textEngine_.setTextTrackHidden();
};

Player.prototype.setCueAlign = function (align) {
    this.textEngine_.setCueAlign(align);
};

Player.prototype.setCueLine = function (line) {
    this.textEngine_.setCueLine(line);
};

Player.prototype.setCueLineAlign = function (lineAlign) {
    this.textEngine_.setCueLineAlign(lineAlign);
};
// End - TextEngine

///////////////////////////////////////////////////////////////////////////
//Player.prototype.onTestMsg = function () {
function onTestMsg() {
    console.log('+onTestMsg');
};

Player.prototype.test = function () {
    this.on(oldmtn.Events.TEST_MSG, onTestMsg, this.context_);
    this.eventBus_.trigger(oldmtn.Events.TEST_MSG);
};

Player.prototype.test2 = function () {
    this.off(oldmtn.Events.TEST_MSG, onTestMsg, this.context_);
    this.eventBus_.trigger(oldmtn.Events.TEST_MSG);
};

Player.prototype.attribute = function () {
    let media = this.cfg_.media;
    this.debug_.log(`media.buffered : ${TimeRanges.toString(media.buffered)}`);
    this.debug_.log(`media.seekable: ${TimeRanges.toString(media.seekable)}`);

    this.mseEngine_.setDuration(200);

    let a = 2;
    let b = a;
};

/////////////////////////////////////////////////////////////////////////////////
// private functions
Player.prototype.initUI = function () {
    this.uiEngine_ = new UIEngine(this.cfg_);
    if (this.cfg_.advertising) {
        let elements = this.uiEngine_.getUIElements();

        this.playerContainer_ = elements.playerContainer;
        this.adContainer_ = elements.adContainer;
    }
};

Player.prototype.initData = function () {
    this.audioIndex_ = 0;
    this.videoIndex_ = 0;
    this.streamInfo_ = null;
    this.adsEngine_ = null;
    this.contentInitialized_ = false;
    this.adsLoaded_ = false;

    this.eventBus_ = EventBus(oldmtn).getInstance();
    this.debug_ = Debug(oldmtn).getInstance();
    this.xhrLoader_ = new XHRLoader();
    this.mediaEngine_ = new MediaEngine(this.cfg_.media);
    this.textEngine_ = new TextEngine(this.cfg_.media);
    this.mseEngine_ = new MediaSourceEngine();
    this.drmEngine_ = new DRMEngine(this.cfg_.media);
    if (this.cfg_.advertising) {
        this.adsEngine_ = new AdsEngine(this.adContainer_, this.cfg_.media, this.cfg_.advertising);
    }
};

Player.prototype.addEventListeners = function () {
    function onFullscreenChange(e) {
        this.debug_.log('onFullscreenChange');
        if (this.adsEngine_) {
            this.adsEngine_.resize();
        }
    }
    document.addEventListener("fullscreenchange", onFullscreenChange.bind(this));
    document.addEventListener("mozfullscreenchange", onFullscreenChange.bind(this));
    document.addEventListener("webkitfullscreenchange", onFullscreenChange.bind(this));
    document.addEventListener("msfullscreenchange", onFullscreenChange.bind(this));

    this.on(oldmtn.Events.MSE_OPENED, this.onMSEOpened.bind(this), {});

    this.on(oldmtn.Events.MEDIA_DURATION_CHANGED, this.onMediaDurationChanged.bind(this), {});
    this.on(oldmtn.Events.MEDIA_ENDED, this.onMediaEnded.bind(this), {});
    this.on(oldmtn.Events.MEDIA_LOADEDMETADATA, this.onMediaLoadedMetadata.bind(this), {});

    this.on(oldmtn.Events.SB_UPDATE_ENDED, this.onSbUpdateEnded.bind(this), {})

    this.on(oldmtn.Events.AD_COMPLETE, this.onAdComplete.bind(this), {});
    this.on(oldmtn.Events.AD_CONTENT_PAUSE_REQUESTED, this.onAdContentPauseRequested.bind(this), {});
    this.on(oldmtn.Events.AD_CONTENT_RESUME_REQUESTED, this.onAdContentResumeRequested.bind(this), {});
    this.on(oldmtn.Events.AD_STARTED, this.onAdStarted.bind(this), {});
    this.on(oldmtn.Events.AD_ADS_MANAGER_LOADED, this.onAdAdsManagerLoaded.bind(this), {});
    
};

//////////////////////////////////////////////////////////////////////////////////////////
// Begin -- internal events listener functions
Player.prototype.onMSEOpened = function () {
    this.mediaEngine_.revokeSrc();
};

Player.prototype.onMediaDurationChanged = function () {
    
};

Player.prototype.onMediaEnded = function () {
    if (this.adsEngine_) {
        this.adsEngine_.onMediaEnded();
    }
};

Player.prototype.onMediaLoadedMetadata = function () {
    this.debug_.log('+onMediaLoadedMetadata');
    this.off(oldmtn.Events.MEDIA_LOADEDMETADATA, this.onMediaLoadedMetadata.bind(this), {});
    this.adsEngine_.requestAds();

    // this.contentInitialized_ = true;
    // if (this.adsLoaded_) {
    //     if (this.adsEngine_) {
    //         this.adsEngine_.requestAds();
    //     }
    // }
};

Player.prototype.onSbUpdateEnded = function () {
    // Need to signal end of stream when add pd to mse
    if (this.adsEngine_) {
        this.mseEngine_.signalEndOfStream();
    }
};

Player.prototype.onAdContentPauseRequested = function () {
    this.mediaEngine_.pause();
};

Player.prototype.onAdContentResumeRequested = function () {
    if (!this.mediaEngine_.isEnded()) {
        this.mediaEngine_.play();
    }
};

Player.prototype.onAdStarted = function (e) {
    let ad = e.ad;

    let selectionCriteria = new google.ima.CompanionAdSelectionSettings();
    selectionCriteria.resourceType = google.ima.CompanionAdSelectionSettings.ResourceType.STATIC;
    selectionCriteria.creativeType = google.ima.CompanionAdSelectionSettings.CreativeType.IMAGE;
    selectionCriteria.sizeCriteria = google.ima.CompanionAdSelectionSettings.SizeCriteria.IGNORE;

    for (let i = 0; i < this.cfg_.advertising.companions.length; i ++) {
        let companion = this.cfg_.advertising.companions[i];
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
};

Player.prototype.onAdAdsManagerLoaded = function () {
    this.adsEngine_.startAds();

    // this.adsLoaded_ = true;
    // if (this.contentInitialized_) {
    //     if (this.adsEngine_) {
            
    //     }
    // }
};

Player.prototype.onAdComplete = function () {
};

// End -- internal events listener functions

export default Player;




