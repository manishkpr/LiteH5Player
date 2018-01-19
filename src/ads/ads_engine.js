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

var AdsEngine = function(adContainer, videoPlayer, advertising) {
  console.log('--new AdsEngine object--');

  this.eventBus_ = EventBus(oldmtn).getInstance();
  this.debug_ = Debug(oldmtn).getInstance();
  this.adContainer_ = adContainer;
  this.media_ = videoPlayer;
  this.advertising_ = advertising;

  this.isPlayingAd_ = false;
  this.isLinearAd_ = false;
  this.adsManager_ = null;

  if (this.advertising_.vpaidmode) {
    let mode = -1;
    if (this.advertising_.vpaidmode === 'disabled') {
      mode = google.ima.ImaSdkSettings.VpaidMode.DISABLED;
    } else if (this.advertising_.vpaidmode === 'enabled') {
      mode = google.ima.ImaSdkSettings.VpaidMode.ENABLED;
    } else if (this.advertising_.vpaidmode === 'insecure') {
      mode = google.ima.ImaSdkSettings.VpaidMode.INSECURE;
    }
    if (mode !== -1) {
      google.ima.settings.setVpaidMode(mode);
    }
  }

  if (this.advertising_.locale) {
    google.ima.settings.setLocale(this.advertising_.locale);
  }

  this.init();
};

AdsEngine.prototype.init = function() {
  this.adDisplayContainer_ =
      new google.ima.AdDisplayContainer(
          this.adContainer_,
          this.media_,
          this.advertising_.companion ? this.advertising_.companion.div : null);

  this.adsLoader_ = new google.ima.AdsLoader(this.adDisplayContainer_);
  // Mobile Skippable Ads
  // see: https://developers.google.com/interactive-media-ads/docs/sdks/html5/skippable-ads
  this.adsLoader_.getSettings().setDisableCustomPlaybackForIOS10Plus(true);
  this.adsLoader_.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      this.onAdsManagerLoaded,
      false,
      this);
  this.adsLoader_.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      this.onAdError,
      false,
      this);
};

AdsEngine.prototype.initialUserAction = function () {
  // On iOS and Android devices, video playback must begin in a user action.
  // AdDisplayContainer provides a initialize() API to be called at appropriate
  // time.
  // see: https://developers.google.com/interactive-media-ads/docs/sdks/html5/mobile_video
  this.adDisplayContainer_.initialize();
};

AdsEngine.prototype.requestAds = function() {
  this.width_ = this.adContainer_.clientWidth;
  this.height_ = this.adContainer_.clientHeight;
  // var item = getVMAPItem('myAds', this.advertising_.offset, this.advertising_.tag);
  // var ads = '<vmap:VMAP xmlns:vmap="http://www.iab.net/videosuite/vmap" version="1.0">' + item + "</vmap:VMAP>"
  // console.log('ads: ' + ads);

  this.debug_.log('this.advertising_.tag: ' + this.advertising_.tag);
  var adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl = this.advertising_.tag;
  adsRequest.linearAdSlotWidth = this.width_;
  adsRequest.linearAdSlotHeight = this.height_;
  adsRequest.nonLinearAdSlotWidth = this.width_;
  adsRequest.nonLinearAdSlotHeight = this.height_;

  if (this.advertising_.forceNonLinearFullSlot) {
    adsRequest.forceNonLinearFullSlot = this.advertising_.forceNonLinearFullSlot;
  }

  this.adsLoader_.getSettings().setAutoPlayAdBreaks(false);
  this.adsLoader_.requestAds(adsRequest);
};

// AdsEngine public functions
AdsEngine.prototype.startAds = function() {
  this.debug_.log('+AdsEngine.startAds');

  // sometimes, requestAds may be caught an error, so we return here directly.
  if (!this.adsManager_) { return; }

  this.debug_.log('this.width_: ' + this.width_ + ', this.height_: ' + this.height_);
  this.adsManager_.init(this.width_, this.height_, google.ima.ViewMode.NORMAL);
  this.adsManager_.start();

  this.debug_.log('-AdsEngine.startAds');
};

AdsEngine.prototype.isPaused = function () {
  return this.isPaused_;
};

AdsEngine.prototype.isPlayingAd = function () {
  return this.isPlayingAd_;
};

AdsEngine.prototype.isLinearAd = function () {
  return this.isLinearAd_;
};

AdsEngine.prototype.isMuted = function () {
  if (this.adsManager_.getVolume() === 0) {
    return true;
  } else {
    return false;
  }
};

AdsEngine.prototype.mute = function () {
  this.adsManager_.setVolume(0);
};

AdsEngine.prototype.unmute = function () {
  this.adsManager_.setVolume(1);
};

AdsEngine.prototype.play = function () {
  if (this.adsManager_) {
    this.adsManager_.resume();
  }
};

AdsEngine.prototype.pause = function () {
  if (this.adsManager_) {
    this.adsManager_.pause();
  }
};

AdsEngine.prototype.resize = function() {
  if (this.adsManager_) {
    this.adsManager_.resize(
      this.adContainer_.clientWidth,
      this.adContainer_.clientHeight,
      google.ima.ViewMode.FULLSCREEN);
  }
};

////////////////////////////////////////////////////////////////////////
AdsEngine.prototype.onAdsManagerLoaded = function(adsManagerLoadedEvent) {
  this.debug_.log('+onAdsManagerLoaded');

  var adsRenderingSettings = new google.ima.AdsRenderingSettings();
  if (this.advertising_.enablePreloading) {
    adsRenderingSettings.enablePreloading = this.advertising_.enablePreloading;
  }
  adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

  this.adsManager_ = adsManagerLoadedEvent.getAdsManager(
      this.media_, adsRenderingSettings);
  
    // Attach the pause/resume events.
  // Handle errors.
  this.adsManager_.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      this.onAdError,
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
    this.adsManager_.addEventListener(
        events[index],
        this.onAdEvent,
        false,
        this);
  }

  this.eventBus_.trigger(Events.AD_ADS_MANAGER_LOADED);

  this.debug_.log('-onAdsManagerLoaded');
};

AdsEngine.prototype.onAdError = function(adErrorEvent) {
  this.debug_.log('--onAdEvent--: ' + adErrorEvent.getError().toString());
  let err = adErrorEvent.getError();
  // deserialize, getErrorCode, getInnerError, getMessage, getType, getVastErrorCode, serialize, toString
  console.log('ad err: ', err);

  let errCode = err.getErrorCode();
  let errMsg = err.getMessage();

  if (this.adsManager_) {
    this.adsManager_.destroy();
  }
  //this.application_.resumeAfterAd();
};

AdsEngine.prototype.onAdEvent = function(adEvent) {
  this.debug_.log('--onAdEvent--: ' + adEvent.type);

  let ad = adEvent.getAd();

  switch (adEvent.type) {
    case google.ima.AdEvent.Type.AD_BREAK_READY: {
    } break;
    case google.ima.AdEvent.Type.AD_METADATA: {
      var cuePts = adEvent.getAdCuePoints();
      console.log('cue points: ' + cuePts.h.join(","));
    } break;
    case google.ima.AdEvent.Type.CLICK: {
      //this.application_.adClicked();
    } break;
    case google.ima.AdEvent.Type.COMPLETE: {
      this.isPlayingAd_ = false;
      this.eventBus_.trigger(Events.AD_COMPLETE);
    } break;
    case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED: {
      this.eventBus_.trigger(Events.AD_CONTENT_PAUSE_REQUESTED);
    } break;
    case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED: {
      this.eventBus_.trigger(Events.AD_CONTENT_RESUME_REQUESTED);
    } break;
    case google.ima.AdEvent.Type.DURATION_CHANGE: {
    } break;
    case google.ima.AdEvent.Type.LOADED: {
      if (!ad.isLinear()) {
        this.eventBus_.trigger(Events.AD_CONTENT_RESUME_REQUESTED);
      }
    } break;
    case google.ima.AdEvent.Type.PAUSED: {
      this.isPaused_ = true;
    } break;
    case google.ima.AdEvent.Type.RESUMED: {
      this.isPaused_ = false;
    } break;
    case google.ima.AdEvent.Type.SKIPPED: {
      this.debug_.log('--google.ima.AdEvent.Type.SKIPPED--');
      // for "skippable ads", if we skip it, we won't receive COMPLETED event, but only receive SKIPPED event.
      this.isPlayingAd_ = false;
    } break;
    case google.ima.AdEvent.Type.STARTED: {
      this.debug_.log('--google.ima.AdEvent.Type.STARTED--');
      this.isPlayingAd_ = true;
      this.isLinearAd_ = ad.isLinear();

      this.eventBus_.trigger(Events.AD_STARTED, {ad: ad});
    } break;
    case google.ima.AdEvent.Type.VOLUME_CHANGED: {
      console.log('ad volume: ' + this.adsManager_.getVolume());
    } break;
  }
};

AdsEngine.prototype.onMediaEnded = function () {
  this.adsLoader_.contentComplete();
};

export default AdsEngine;
