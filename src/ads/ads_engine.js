import EventBus from '../core/EventBus';
import Events from '../core/CoreEvents';

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

var AdsEngine = function(adContainer, videoPlayer, adCfg) {
  console.log('--new AdsEngine object--');

  this.eventBus_ = EventBus(oldmtn).getInstance();

  this.adContainer_ = adContainer;
  this.media_ = videoPlayer;
  this.adCfg_ = adCfg;

  //
  this.adsManager_ = null;
  this.adDisplayContainer_ =
      new google.ima.AdDisplayContainer(
          this.adContainer_,
          this.media_,
          null);

  this.adsLoader_ = new google.ima.AdsLoader(this.adDisplayContainer_);
  this.adsLoader_.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      this.onAdsManagerLoaded_,
      false,
      this);
  this.adsLoader_.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      this.onAdError_,
      false,
      this);

  // On iOS and Android devices, video playback must begin in a user action.
  // AdDisplayContainer provides a initialize() API to be called at appropriate
  // time.
  this.adDisplayContainer_.initialize();
};

AdsEngine.prototype.open = function(width, height) {
  console.log('--AdsEngine.open--');

  this.width = width;
  this.height = height;
  // var item = getVMAPItem('myAds', this.advertising_.offset, this.advertising_.tag);
  // var ads = '<vmap:VMAP xmlns:vmap="http://www.iab.net/videosuite/vmap" version="1.0">' + item + "</vmap:VMAP>"
  // console.log('ads: ' + ads);

  var adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl = this.adCfg_.tag;
  adsRequest.linearAdSlotWidth = this.width;
  adsRequest.linearAdSlotHeight = this.height;
  adsRequest.nonLinearAdSlotWidth = this.width;
  adsRequest.nonLinearAdSlotHeight = this.height;

  adsRequest.forceNonLinearFullSlot = true;

  this.adsLoader_.requestAds(adsRequest);
};

AdsEngine.prototype.onAdsManagerLoaded_ = function(adsManagerLoadedEvent) {
  console.log('--onAdsManagerLoaded--');

  var adsRenderingSettings = new google.ima.AdsRenderingSettings();
  adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

  this.adsManager_ = adsManagerLoadedEvent.getAdsManager(
      this.media_, adsRenderingSettings);
  this.startAdsManager_(this.adsManager_);
};

AdsEngine.prototype.onAdError_ = function(adErrorEvent) {
  console.log('--onAdEvent_--: ' + adErrorEvent.getError().toString());

  if (this.adsManager_) {
    this.adsManager_.destroy();
  }
  //this.application_.resumeAfterAd();
};


AdsEngine.prototype.startAdsManager_ = function(adsManager) {
  console.log('--startAdsManager_--');

  // Attach the pause/resume events.
  // Handle errors.
  adsManager.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      this.onAdError_,
      false,
      this);
  var events = [google.ima.AdEvent.Type.AD_METADATA,
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
                google.ima.AdEvent.Type.STARTED,
                google.ima.AdEvent.Type.THIRD_QUARTILE];
  for (var index in events) {
    adsManager.addEventListener(
        events[index],
        this.onAdEvent_,
        false,
        this);
  }

  adsManager.init(
    this.width,
    this.height,
    google.ima.ViewMode.NORMAL);

  adsManager.start();
};


AdsEngine.prototype.onAdEvent_ = function(adEvent) {
  console.log('--onAdEvent_--: ' + adEvent.type);

  switch (adEvent.type) {
    case google.ima.AdEvent.Type.AD_METADATA: {
      var cuePts = adEvent.getAdCuePoints();
      console.log('cue points: ' + cuePts.h.join(","));
    } break;
    case google.ima.AdEvent.Type.CLICK: {
      //this.application_.adClicked();
    } break;
    case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED: {
      //this.application_.onContentPauseRequested_();
      this.eventBus_.trigger(Events.ADS_CONTENT_PAUSE_REQUESTED);
    } break;
    case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED: {
      //this.application_.onContentResumeRequested_();
      this.eventBus_.trigger(Events.ADS_CONTENT_RESUME_REQUESTED);
    } break;
    case google.ima.AdEvent.Type.DURATION_CHANGE: {
    } break;
    case google.ima.AdEvent.Type.LOADED: {
      var ad = adEvent.getAd();
      if (!ad.isLinear()) {
        //this.application_.onContentResumeRequested_();
        this.eventBus_.trigger(Events.ADS_CONTENT_RESUME_REQUESTED);
      }
    } break;
    case google.ima.AdEvent.Type.STARTED: {
      var ad = adEvent.getAd();
      //this.application_.adStarted(ad);
    } break;
  }
};

export default AdsEngine;
