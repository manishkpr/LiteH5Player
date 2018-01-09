'use strict'

import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import Events from './core/CoreEvents';

import UIEngine from './ui/ui_engine';
import MediaSourceEngine from './media_source_engine';
import TextEngine from './text_engine';
import MediaEngine from './media_engine';
import DRMEngine from './drm_engine';
import AdsEngine from './ads/ads_engine';

import TimeRanges from './utils/timeRanges';
import XHRLoader from './utils/xhr_loader';

//////////////////////////////////////////////////////////////////////////////
let Player = function (cfg) {
    this.cfg_ = cfg;

    this.initUI();
    this.initData();
    this.addEventListeners();
};

Player.prototype.open = function (info) {
    this.streamInfo_ = info;

    //
    if (info.audioCodec) {
        console.log('Player, +open: ' + info.audioCodec);
    }
    if (info.videoCodec) {
        console.log('Player, +open: ' + info.videoCodec);
    }

    if (info.audioCodec && !MediaSource.isTypeSupported(info.audioCodec)) {
        alert('Don\'t support: ' + info.audioCodec);
        return;
    }

    if (info.videoCodec && !MediaSource.isTypeSupported(info.videoCodec)) {
        alert('Don\'t support: ' + info.videoCodec);
        return;
    }

    this.mseEngine_.init(this.streamInfo_);

    let objURL = window.URL.createObjectURL(this.mseEngine_.getMediaSource());
    this.mediaEngine_.setSrc(objURL);
    //URL.revokeObjectURL(this.cfg_.media.src);

    this.drmEngine_.setDrmInfo(this.streamInfo_);

    //
    this.addPD();
    this.adsEngine_.open(
        this.playerContainer_.clientWidth,
        this.playerContainer_.clientHeight);

    console.log('Player, -open');
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
        console.log('There don\'t have more content to add.');
        return;
    }

    let url = this.streamInfo_.aContents[this.audioIndex_];

    let self = this;
    function cbSuccess(bytes) {
        //console.log('before my appendBuffer');
        this.mseEngine_.appendBuffer('audio', bytes);

        this.audioIndex_ ++;
        //console.log('after my appendBuffer');
    }

    let request = {url: url, cbSuccess: cbSuccess.bind(self)};
    this.xhrLoader_.load(request);
};

Player.prototype.addV = function () {
    if (this.videoIndex_ >= this.streamInfo_.vContents.length) {
        console.log('There don\'t have more content to add.');
        return;
    }

    let url = this.streamInfo_.vContents[this.videoIndex_];

    let self = this;
    function cbSuccess(bytes) {
        //console.log('before my appendBuffer');
        this.mseEngine_.appendBuffer('video', bytes);
        this.videoIndex_ ++;
        //console.log('after my appendBuffer');
    }

    let request = { url: url, cbSuccess: cbSuccess.bind(self) };
    this.xhrLoader_.load(request);
};

Player.prototype.addPD = function () {
    let url = this.streamInfo_.pdContent;

    // // Method1
    // this.cfg_.media.src = this.streamInfo_.pdContent;
    // return;

    // Method2
    let self = this;
    function cbSuccess(bytes) {
        this.mseEngine_.appendBuffer('video', bytes);
    }

    let request = { url: url, cbSuccess: cbSuccess.bind(self) };
    this.xhrLoader_.load(request);
};

//////////////////////////////////////////////////////////////////////////////////
// 操作API
Player.prototype.duration = function () {
    if (!this.mediaEngine_) { return; }
    return this.mediaEngine_.duration();
};

Player.prototype.isPaused = function () {
    if (this.isPlayingAd_) {
        return this.adsEngine_.isPaused();
    } else {
        if (!this.mediaEngine_) { return; }
        return this.mediaEngine_.isPaused();
    }
};

Player.prototype.isEnded = function () {
    if (this.isPlayingAd_) {

    } else {
        if (!this.mediaEngine_) { return; }
        this.mediaEngine_.isEnded();
    }
};

Player.prototype.mute = function() {
    if (!this.mediaEngine_) { return; }
    this.mediaEngine_.mute();
};

Player.prototype.pause = function () {
    if (this.isPlayingAd_) {
        this.adsEngine_.pause();
    } else {
        if (!this.mediaEngine_) { return; }
        this.mediaEngine_.pause();
    }
};

Player.prototype.play = function () {
    if (this.isPlayingAd_) {
        this.adsEngine_.play();
    } else {
        if (!this.mediaEngine_) { return; }
        this.mediaEngine_.play();
    }
};

Player.prototype.currentTime = function () {
    if (!this.mediaEngine_) { return; }
    return this.mediaEngine_.currentTime();
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

Player.prototype.test = function () {
    //this.mseEngine_.signalEndOfStream();

    //this.mseEngine_.setDuration(12);
    //console.log(`main buffered : ${TimeRanges.toString(media.buffered)}` + ', currentTime: ' + media.currentTime);

    //
    function sum_v2(x, y) {
        function recur(a, b) {
        if (b > 0) {
            return recur(a + 1, b - 1);
          } else {
            return a;
          }
        }
        // 尾递归即在程序尾部调用自身，注意这里没有其他的运算
        return recur(x, y);
    }

    console.log('sum_v2(1,100000) = ' + sum_v2(1,100000));
};

Player.prototype.test2 = function () {
    
};

Player.prototype.attribute = function () {
    let media = this.cfg_.media;
    console.log(`media.buffered : ${TimeRanges.toString(media.buffered)}`);

    console.log(`media.seekable: ${TimeRanges.toString(media.seekable)}`);

    this.mseEngine_.setDuration(200);

    let a = 2;
    let b = a;
};

/////////////////////////////////////////////////////////////////////////////////
// private functions
Player.prototype.initUI = function () {
    this.uiEngine_ = new UIEngine(this.cfg_.playerContainer);
    this.uiEngine_.initUIStyle();
    let elements = this.uiEngine_.initUIElement();

    this.playerContainer_ = elements.playerContainer;
    this.adContainer_ = elements.adContainer;
};

Player.prototype.initData = function () {
    this.audioIndex_ = 0;
    this.videoIndex_ = 0;
    this.streamInfo_ = null;
    this.isPlayingAd_ = false;

    this.eventBus_ = EventBus(oldmtn).getInstance();
    this.xhrLoader_ = new XHRLoader();
    this.mediaEngine_ = new MediaEngine(this.cfg_.media);
    this.textEngine_ = new TextEngine(this.cfg_.media);
    this.mseEngine_ = new MediaSourceEngine();
    this.drmEngine_ = new DRMEngine(this.cfg_.media);
    this.adsEngine_ = new AdsEngine(this.adContainer_, this.cfg_.media, this.cfg_.advertising);

    let a=2;
    let b=a;
};

Player.prototype.addEventListeners = function () {
    this.on(oldmtn.Events.MEDIA_DURATION_CHANGED, this.onMediaDurationChanged.bind(this), {});
    this.on(oldmtn.Events.MEDIA_ENDED, this.onMediaEnded.bind(this), {});

    this.on(oldmtn.Events.SB_UPDATE_ENDED, this.onSbUpdateEnded.bind(this), {})

    this.on(oldmtn.Events.AD_COMPLETE, this.onAdComplete.bind(this), {});
    this.on(oldmtn.Events.AD_CONTENT_PAUSE_REQUESTED, this.onAdContentPauseRequested.bind(this), {});
    this.on(oldmtn.Events.AD_CONTENT_RESUME_REQUESTED, this.onAdContentResumeRequested.bind(this), {});
    this.on(oldmtn.Events.AD_STARTED, this.onAdStarted.bind(this), {});
    
    //player.on(oldmtn.Events.MSE_OPENED, onMSEOpened, {});
};

//////////////////////////////////////////////////////////////////////////////////////////
// Begin -- internal events listener functions
Player.prototype.onMediaDurationChanged = function () {
    
};

Player.prototype.onMediaEnded = function () {
    this.adsEngine_.onMediaEnded();
};

Player.prototype.onSbUpdateEnded = function () {
    // Need to signal end of stream when add pd to mse
    if (this.streamInfo_.pdContent && this.streamInfo_.pdContent !== '') {
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
    this.isPlayingAd_ = true;

    let ad = e.ad;
    let selectionCriteria = new google.ima.CompanionAdSelectionSettings();
    selectionCriteria.resourceType = google.ima.CompanionAdSelectionSettings.ResourceType.STATIC;
    selectionCriteria.creativeType = google.ima.CompanionAdSelectionSettings.CreativeType.IMAGE;
    selectionCriteria.sizeCriteria = google.ima.CompanionAdSelectionSettings.SizeCriteria.IGNORE;

    for (let i = 0; i < this.cfg_.advertising.companions.length; i ++) {
        let companion = this.cfg_.advertising.companions[i];
        // Get a list of companion ads for an ad slot size and CompanionAdSelectionSettings
        let companionAds = ad.getCompanionAds(companion.width, companion.height, selectionCriteria);
        if (companionAds) {
            let companionAd = companionAds[0];
            // Get HTML content from the companion ad.
            let content = companionAd.getContent();
            // Write the content to the companion ad slot.
            let div = document.getElementById(companion.id);
            div.innerHTML = content;
        }
    }
};

Player.prototype.onAdComplete = function () {
    this.isPlayingAd_ = false;
};

// End -- internal events listener functions

export default Player;




