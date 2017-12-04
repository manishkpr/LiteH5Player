'use strict'

import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import Events from './core/CoreEvents';

import MediaSourceEngine from './media_source_engine';
import TextEngine from './text_engine';
import MediaEngine from './media_engine';
import DRMEngine from './drm_engine';

import TimeRanges from './utils/timeRanges';

import XHRLoader from './utils/xhr_loader';

//////////////////////////////////////////////////////////////////////////////
var Player = function (media) {
    this.media_ = media;
    this.eventBus_ = EventBus(micromtn).getInstance();

    this.audioIndex_ = 0;
    this.videoIndex_ = 0;
    this.streamInfo_ = null;

    this.xhrLoader_ = new XHRLoader();
    this.mediaEngine_ = new MediaEngine(this.media_);
    this.textEngine_ = new TextEngine(this.media_);
    this.mseEngine_ = new MediaSourceEngine();
    this.drmEngine_ = new DRMEngine(this.media_);
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
    //URL.revokeObjectURL(this.media_.src);

    this.drmEngine_.setDrmInfo(this.streamInfo_);

    console.log('Player, -open');
};

Player.prototype.addA = function () {
    if (this.audioIndex_ >= this.streamInfo_.aContents.length) {
        console.log('There don\'t have more content to add.');
        return;
    }

    let url = this.streamInfo_.aContents[this.audioIndex_];

    var self = this;
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

    var self = this;
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
    // this.media_.src = this.streamInfo_.pdContent;

    // Method2
    var self = this;
    function cbSuccess(bytes) {
        this.mseEngine_.appendBuffer('video', bytes);
    }

    let request = { url: url, cbSuccess: cbSuccess.bind(self) };
    this.xhrLoader_.load(request);
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
    this.media_.currentTime = secs;
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
    let media = this.media_;
    console.log(`media.buffered : ${TimeRanges.toString(media.buffered)}`);

    console.log(`media.seekable: ${TimeRanges.toString(media.seekable)}`);

    this.mseEngine_.setDuration(200);

    let a = 2;
    let b = a;
};

export default Player;




