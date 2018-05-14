'use strict'

import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';

import XHRLoader from './utils/xhr_loader';
import FetchLoader from './utils/fetch_loader';
import FragmentLoader from './loader/fragment_loader';
import PlaylistLoader from './loader/playlist_loader';

import UIEngine from './ui/ui_engine';
import TextEngine from './text_engine';
import MediaEngine from './media_engine';
import DRMEngine from './drm_engine';
import AdsEngine from './ads/ads_engine';

import ManifestParser from './media/manifest_parser';
import LevelController from './media/level_controller';
import BufferController from './media/buffer_controller';
import StreamController from './media/stream_controller';

import TimeRanges from './utils/timeRanges';
import CommonUtils from './utils/common_utils';

import WebvttThumbnails from './thumbnail/webvtt_thumbnails';

//////////////////////////////////////////////////////////////////////////////
function Player(containerId) {
  let containerId_ = containerId;
  let context_ = oldmtn; //{ flag: 'player' };

  let uiEngine_;
  let media_;

  let eventBus_;
  let debug_;
  let mediaEngine_;
  let textEngine_;
  let mseEngine_;
  let drmEngine_;
  let manifestParser_;
  let parser_;
  let fragmentLoader_;
  let levelController_;
  let scheduleCtrl_;

  // ads part
  let adsEngine_;

  // autoplay reference
  let autoplayAllowed_;
  let autoplayRequiresMuted_;

  // player state machine
  let playerState_; // 'none', 'opening', 'opened'

  // open completed flag
  let flagContentOpenComplete_;
  let flagAdOpenComplete_;
  let flagPlayedOnce_;

  // Promise part
  let openPromise_;
  let openPromiseResolve_;
  let openPromiseReject_;

  function setup() {
    // enging component
    eventBus_ = EventBus(context_).getInstance();
    debug_ = Debug(context_).getInstance();

    // init internal configuration
    context_.loader = XHRLoader;
    context_.fragLoader = FragmentLoader;
    context_.playlistLoader = PlaylistLoader;
    context_.events = Events;
    context_.debug = debug_;
    context_.eventBus = eventBus_;
    //context_.loader = FetchLoader;

    uiEngine_ = UIEngine(context_).getInstance();
    uiEngine_.initUI(containerId_);
    media_ = uiEngine_.getVideo();

    context_.media = media_;
  }

  function init(cfg) {
    context_.cfg = cfg;

    initComponent();
    initData();
    addEventListeners();
    addResizeListener();
  }

  function uninit() {}

  function open(info) {
    debug_.log('Player, +open');
    openPromise_ = new Promise((resolve, reject) => {
      openPromiseResolve_ = resolve;
      openPromiseReject_ = reject;

      if (info.url === '') {
        openPromiseReject_('failed');
        return;
      }

      context_.mediaCfg = info;

      // detech parser type
      parser_ = manifestParser_.getParser(context_.mediaCfg.url);
      eventBus_.trigger(Events.FOUND_PARSER, { parser: parser_ });

      // load webvtt thumbnail
      let vttThumbnail = WebvttThumbnails(context_).getInstance();
      vttThumbnail.open(context_.mediaCfg.thumbnail);

      if (adsEngine_) {
        adsEngine_.requestAds();
      } else {
        flagAdOpenComplete_ = true;
      }
      flagPlayedOnce_ = false;
    });

    playerState_ = 'opening';
    return openPromise_;
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

    context_.mediaCfg = null;
  }

  function dellAll() {
    mseEngine_.removeBuffer();
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
    if (!flagPlayedOnce_) {
      if (adsEngine_) {
        adsEngine_.playAd();
      } else {
        mediaEngine_.play();
      }
      flagPlayedOnce_ = true;
    } else {
      if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
        adsEngine_.play();
      } else {
        mediaEngine_.play();
      }
    }
  }

  function pause() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      adsEngine_.pause();
    } else {
      if (!mediaEngine_) {
        return;
      }
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

  function getPosition() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      return adsEngine_.getPosition();
    } else {
      if (!mediaEngine_) {
        return;
      }
      return mediaEngine_.getPosition();
    }
  }

  function getDuration() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      return adsEngine_.getDuration();
    } else {
      if (!mediaEngine_) {
        return;
      }
      return mediaEngine_.getDuration();
    }
  }

  function getSeekableRange() {
    if (!mediaEngine_) {
      return;
    }
    return mediaEngine_.getSeekableRange();
  }

  function getBufferedRanges() {
    if (!mediaEngine_) {
      return;
    }
    return mediaEngine_.getBufferedRanges();
  }

  function isEnded() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {} else {
      if (!mediaEngine_) {
        return;
      }
      return mediaEngine_.isEnded();
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

  function setVolume(volume) {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      adsEngine_.setVolume(volume);
    } else {
      if (!mediaEngine_) {
        return;
      }
      mediaEngine_.setVolume(volume);
    }
  }

  function getVolume() {
    if (!mediaEngine_) {
      return;
    }

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
    }

    // if (adsEngine_) {
    //     adsEngine_.playAd();
    // } else {

    // }
  }

  function getThumbnail(time) {
    let vttThumbnail = WebvttThumbnails(context_).getInstance();
    return vttThumbnail.getThumbnail(time);
  }

  function isFullscreen() {
    return document.fullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
  }

  function getValidBufferPosition(currentPos) {
    if (adsEngine_ && adsEngine_.isLinearAd() && adsEngine_.isPlayingAd()) {
      return 0;
    } else {
      return mediaEngine_.getValidBufferPosition(currentPos);
    }
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
    mediaEngine_ = MediaEngine(context_).getInstance(media_, context_.cfg);
    textEngine_ = new TextEngine(media_);
    mseEngine_ = BufferController(context_).getInstance();
    drmEngine_ = DRMEngine(context_).getInstance(media_);
    manifestParser_ = ManifestParser(context_).getInstance();
    fragmentLoader_ = FragmentLoader(context_).create();
    levelController_ = LevelController(context_).getInstance();
    scheduleCtrl_ = StreamController(context_).getInstance();

    if (context_.cfg.poster) {
      media_.poster = context_.cfg.poster;
    }
    if (context_.cfg.advertising) {
      let adContainer = uiEngine_.getAdContainer();
      adsEngine_ = AdsEngine(context_).getInstance(adContainer, media_, context_.cfg.advertising);
    }
  }

  function initData() {
    playerState_ = 'none';
    flagContentOpenComplete_ = false;
    flagAdOpenComplete_ = false;
    flagPlayedOnce_ = false;
    context_.mediaCfg = null;
  }

  function addEventListeners() {
    // html5 event
    eventBus_.on(Events.MEDIA_CANPLAY, onMediaCanPlay, {});


    eventBus_.on(Events.PD_DOWNLOADED, onPdDownloaded);

    // ads events
    eventBus_.on(Events.AD_COMPLETE, onAdComplete, {});
    eventBus_.on(Events.AD_CONTENT_PAUSE_REQUESTED, onAdContentPauseRequested, {});
    eventBus_.on(Events.AD_CONTENT_RESUME_REQUESTED, onAdContentResumeRequested, {});
    eventBus_.on(Events.AD_STARTED, onAdStarted, {});
    eventBus_.on(Events.AD_LOADING_COMPLETE, onAdLoadingComplete, {});
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
    eventBus_.trigger(Events.FULLSCREEN_CHANGE);
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Begin -- internal events listener functions
  function onMediaCanPlay() {
    if (playerState_ === 'opening') {
      flagContentOpenComplete_ = true;
      processOpenComplete();
    }
  }

  function onPdDownloaded(frag) {
    mediaEngine_.setSrc(frag.url);
  }

  function onAdContentPauseRequested() {
    mediaEngine_.pause();
  }

  function onAdContentResumeRequested() {
    if (!mediaEngine_.isEnded()) {
      mediaEngine_.play();
    }
  }

  function onAdStarted() {}

  function onAdComplete() {}

  function onAdLoadingComplete() {
    if (playerState_ === 'opening') {
      flagAdOpenComplete_ = true;
      processOpenComplete();
    }
  }
  // End -- internal events listener functions

  function processOpenComplete() {
    if (flagContentOpenComplete_ && flagAdOpenComplete_) {
      //
      if (context_.cfg.autoplay) {
        play();
      }
      //
      openPromiseResolve_('ok');
      playerState_ = 'opened';
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // Title: debug function here
  function manualSchedule() {
    if (!scheduleCtrl_) {
      scheduleCtrl_ = StreamController(context_).getInstance();
    }
    scheduleCtrl_.manualSchedule();
  }

  function test() {
    eventBus_.trigger(Events.TEST_MSG);

    // sample2
    // let fetch1 = FetchLoader(context_).create();

    // function sleep(numberMillis) {
    //     var now = new Date();
    //     var exitTime = now.getTime() + numberMillis;
    //     while (true) {
    //         now = new Date();
    //         if (now.getTime() > exitTime)
    //         return;
    //     }
    // }

    // let request = {
    //     url: 'http://localhost/2/hls/videoonly01/stream0.ts',
    //     cbProgress: function (chunkBytes) {
    //         console.log('cbProgress: ' + chunkBytes);
    //         sleep(5000);  //睡眠5秒
    //     },
    //     cbSuccess: function (totalBytes) {
    //         console.log('totalBytes: ' + totalBytes);
    //     }
    // };

    // fetch1.load(request);
  }

  function test2() {}

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
    uninit: uninit,
    open: open,
    close: close,
    on: on,
    off: off,
    play: play,
    pause: pause,
    isPaused: isPaused,
    getPosition: getPosition,
    setPosition: setPosition,
    getDuration: getDuration,
    getSeekableRange: getSeekableRange,
    getBufferedRanges: getBufferedRanges,
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
    // thumbnail
    getThumbnail: getThumbnail,
    // debug
    manualSchedule: manualSchedule,
    test: test,
    test2: test2
  };

  setup();

  return instance;
};

export default Player;