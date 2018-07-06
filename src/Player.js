'use strict'

import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';

import XHRLoader from './utils/xhr_loader';
import FetchLoader from './utils/fetch_loader';
import FragmentLoader from './loader/fragment_loader';
import PlaylistLoader from './loader/playlist_loader';

import TextEngine from './text_engine';
import PlaybackController from './controller/playback_controller';
import EMEController from './controller/eme_controller';
import AdsController from './controller/ads_controller';

import ParserController from './controller/parser_controller';
import LevelController from './controller/level_controller';
import BufferController from './controller/buffer_controller';
import StreamController from './controller/stream_controller';
import ThumbnailController from './controller/thumbnail_controller';

import VideoPlayer from './videoplayer';

import TimeRanges from './utils/timeRanges';
import CommonUtils from './utils/common_utils';

// UI
import Preact from 'preact';
import {
  h
} from 'preact';
import UIBasic from './ui/js/ui_basic';

//////////////////////////////////////////////////////////////////////////////
function Player(idContainer) {
  let context_ = oldmtn; //{ flag: 'player' };
  let playerContainer_ = document.getElementById(idContainer);

  // Create internal basic UI elements first.
  let root;
  let uiBasic_ = Preact.render(<UIBasic/>, playerContainer_, root);

  let media_ = document.querySelector('.vop-video');
  let adContainer_ = document.querySelector('.vop-ads-container');

  let eventBus_;
  let debug_;

  let playlistLoader_;

  let textEngine_;
  let bufferController_;
  let emeController_;
  let parserController_;
  let levelController_;
  let streamController_;
  let playbackController_;
  let thumbnailController_;
  let fragmentLoader_;

  // Ads part
  let adsEngine_;

  // Autoplay reference
  let autoplayAllowed_;
  let autoplayRequiresMuted_;

  // player state machine
  let playerState_ = 'idle'; // 'idle', opened', 'playing', ended'

  // open completed flag
  let flagContentOpenComplete_ = false;
  let flagAdOpenComplete_ = false;
  let flagPlayedOnce_ = false;

  function setup() {
    // init internal configuration
    context_.loader = XHRLoader;
    //context_.loader = FetchLoader;

    context_.media = media_;
  }

  function init(cfg) {
    context_.cfg = cfg;

    initComponent();
    addEventListeners();
  }

  function uninit() {}

  function open(mediaCfg) {
    debug_.log('Player, +open');

    // preprocess the mediaCfg
    mediaCfg.drm = mediaCfg.drm || {};

    context_.mediaCfg = mediaCfg;

    emeController_.setDrmInfo(mediaCfg);
    // detect parser type
    eventBus_.trigger(Events.FINDING_PARSER, {
      url: mediaCfg.url
    });

    // load webvtt thumbnail
    if (mediaCfg.thumbnailUrl) {
      eventBus_.trigger(Events.THUMBNAIL_LOADING, {
        url: mediaCfg.thumbnailUrl
      });
    }

    if (adsEngine_) {
      adsEngine_.requestAds();
    } else {
      flagAdOpenComplete_ = true;
    }
    flagPlayedOnce_ = false;
    flagContentOpenComplete_ = false;
  }

  function close() {
    // if (adsEngine_) {
    //   adsEngine_.close();
    // }
    // if (streamController_) {
    //   streamController_.stopLoad();
    // }
    // if (bufferController_) {
    //   bufferController_.close();
    // }
    // if (playbackController_) {
    //   playbackController_.close();
    // }

    // context_.mediaCfg = null;

    updateState('idle');
  }

  function updateState(state) {
    let oldState = playerState_;
    let newState = state;

    playerState_ = newState;
    eventBus_.trigger(Events.STATE_CHANGE, {
      oldState: oldState,
      newState: newState
    });
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
        playbackController_.play();
      }
      flagPlayedOnce_ = true;
    } else {
      if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
        adsEngine_.play();
      } else {
        playbackController_.play();
      }
    }
  }

  function pause() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      adsEngine_.pause();
    } else {
      if (!playbackController_) {
        return;
      }
      playbackController_.pause();
    }
  }

  function isPaused() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      return adsEngine_.isPaused();
    } else {
      if (!playbackController_) {
        return;
      }
      return playbackController_.isPaused();
    }
  }

  function getPosition() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      return adsEngine_.getPosition();
    } else {
      if (!playbackController_) {
        return;
      }
      return playbackController_.getPosition();
    }
  }

  function getDuration() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      return adsEngine_.getDuration();
    } else {
      if (!playbackController_) {
        return;
      }
      return playbackController_.getDuration();
    }
  }

  function getSeekableRange() {
    if (!playbackController_) {
      return;
    }
    return playbackController_.getSeekableRange();
  }

  function getBufferedRanges() {
    if (!playbackController_) {
      return;
    }
    return playbackController_.getBufferedRanges();
  }

  function isEnded() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {} else {
      if (!playbackController_) {
        return;
      }
      return playbackController_.isEnded();
    }
  }

  function mute() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      adsEngine_.mute();
    } else {
      if (!playbackController_) {
        return;
      }
      playbackController_.mute();
    }
  }

  function unmute() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      adsEngine_.unmute();
    } else {
      if (!playbackController_) {
        return;
      }
      playbackController_.unmute();
    }
  }

  function isMuted() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      return adsEngine_.isMuted();
    } else {
      if (!playbackController_) {
        return;
      }
      return playbackController_.isMuted();
    }
  }

  function setVolume(volume) {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      adsEngine_.setVolume(volume);
    } else {
      if (!playbackController_) {
        return;
      }
      playbackController_.setVolume(volume);
    }
  }

  function getVolume() {
    if (adsEngine_ && adsEngine_.isPlayingAd() && adsEngine_.isLinearAd()) {
      return adsEngine_.getVolume();
    } else {
      if (!playbackController_) {
        return;
      }

      return playbackController_.getVolume();
    }
  }

  function setAudioPlaybackSpeed(speed) {
    playbackController_.setAudioPlaybackSpeed(speed);
  }

  function setPosition(time) {
    playbackController_.setPosition(time);
  }

  function getWidth() {
    return playbackController_.videoWidth();
  }

  function getHeight() {
    return playbackController_.videoHeight();
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
    if (thumbnailController_) {
      return thumbnailController_.getThumbnail(time);
    } else {
      return undefined;
    }
  }

  function isAirplaySupported() {
    if (window.WebKitPlaybackTargetAvailabilityEvent) {
      return true;
    }
    return false;
  }

  function showPlaybackTargetPicker() {
    if (isAirplaySupported()) {
      let videoElement = media_;
      videoElement.webkitShowPlaybackTargetPicker();
    }
  }

  function isPipSupported() {
    let videoElement = media_;
    if (videoElement &&
      videoElement.webkitSupportsPresentationMode &&
      typeof videoElement.webkitSetPresentationMode === 'function') {
      return true;
    }
    return false;
  }

  function setPipPresentation(show) {
    if (isPipSupported()) {
      let videoElement = media_;
      if (show && videoElement.webkitPresentationMode === 'inline') {
        videoElement.webkitSetPresentationMode('picture-in-picture');
      } else if (!show &&
        videoElement.webkitPresentationMode === 'picture-in-picture') {
        videoElement.webkitSetPresentationMode('inline');
      }
    }
  }

  function getState() {
    return playerState_;
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
      return playbackController_.getValidBufferPosition(currentPos);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  // private functions
  function initComponent() {
    eventBus_ = EventBus(context_).getInstance();
    debug_ = Debug(context_).getInstance();

    playlistLoader_ = PlaylistLoader(context_).getInstance();
    playbackController_ = PlaybackController(context_).getInstance();
    textEngine_ = TextEngine(context_).getInstance();
    bufferController_ = BufferController(context_).getInstance();
    emeController_ = EMEController(context_).getInstance();
    parserController_ = ParserController(context_).getInstance();
    levelController_ = LevelController(context_).getInstance();
    streamController_ = StreamController(context_).getInstance();
    thumbnailController_ = ThumbnailController(context_).getInstance();

    fragmentLoader_ = FragmentLoader(context_).create();

    if (context_.cfg.poster) {
      media_.poster = context_.cfg.poster;
    }
    if (context_.cfg.advertising) {
      adsEngine_ = AdsController(context_).getInstance(adContainer_, media_, context_.cfg.advertising);
    }
  }

  function addEventListeners() {
    // html5 event
    eventBus_.on(Events.MEDIA_CANPLAY, onMediaCanPlay, {});
    eventBus_.on(Events.MEDIA_ENDED, onMediaEnded, {});
    eventBus_.on(Events.MEDIA_WAITING, onMediaWaiting, {});
    eventBus_.on(Events.MEDIA_PLAYING, onMediaPlaying, {});
    eventBus_.on(Events.MEDIA_PAUSED, onMediaPaused, {});

    // controller events
    eventBus_.on(Events.FOUND_PARSER, onFoundParser);
    eventBus_.on(Events.MEDIA_ATTACHED, onMediaAttached);

    // ads events
    eventBus_.on(Events.AD_CONTENT_PAUSE_REQUESTED, onAdContentPauseRequested, {});
    eventBus_.on(Events.AD_CONTENT_RESUME_REQUESTED, onAdContentResumeRequested, {});
    eventBus_.on(Events.AD_LOADING_COMPLETE, onAdLoadingComplete, {});
    eventBus_.on(Events.AD_PAUSED, onAdPaused, {});
    eventBus_.on(Events.AD_RESUMED, onAdResumed, {});

    // fullscreen listener
    document.addEventListener("fullscreenchange", onFullScreenChange);
    document.addEventListener("mozfullscreenchange", onFullScreenChange);
    document.addEventListener("webkitfullscreenchange", onFullScreenChange);
    document.addEventListener("msfullscreenchange", onFullScreenChange);
    document.addEventListener("MSFullscreenChange", onFullScreenChange);
  }

  function removeEventListeners() {
    // html5 event
    eventBus_.off(Events.MEDIA_CANPLAY, onMediaCanPlay, {});
    eventBus_.off(Events.MEDIA_ENDED, onMediaEnded, {});
    eventBus_.off(Events.MEDIA_WAITING, onMediaWaiting, {});
    eventBus_.off(Events.MEDIA_PLAYING, onMediaPlaying, {});
    eventBus_.off(Events.MEDIA_PAUSED, onMediaPaused, {});

    // controller events
    eventBus_.off(Events.FOUND_PARSER, onFoundParser);
    eventBus_.off(Events.MEDIA_ATTACHED, onMediaAttached);

    // ads events
    eventBus_.off(Events.AD_CONTENT_PAUSE_REQUESTED, onAdContentPauseRequested, {});
    eventBus_.off(Events.AD_CONTENT_RESUME_REQUESTED, onAdContentResumeRequested, {});
    eventBus_.off(Events.AD_LOADING_COMPLETE, onAdLoadingComplete, {});
    eventBus_.off(Events.AD_PAUSED, onAdPaused, {});
    eventBus_.off(Events.AD_RESUMED, onAdResumed, {});

    document.removeEventListener("fullscreenchange", onFullScreenChange);
    document.removeEventListener("mozfullscreenchange", onFullScreenChange);
    document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
    document.removeEventListener("msfullscreenchange", onFullScreenChange);
    document.removeEventListener("MSFullscreenChange", onFullScreenChange);
  }

  function onFullScreenChange() {
    // we should not rely on clientWidth or clientHeight to set ad metrics when fullscreen change event triggered.
    eventBus_.trigger(Events.FULLSCREEN_CHANGE);
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Begin -- internal events listener functions
  function onMediaCanPlay() {
    if (!flagContentOpenComplete_) {
      flagContentOpenComplete_ = true;
      processOpenComplete();
    }
  }

  function onMediaEnded() {
    updateState('ended');
  }

  function onMediaWaiting() {}

  function onMediaPlaying() {
    updateState('playing');
  }

  function onMediaPaused() {
    updateState('paused');
  }

  function onFoundParser(data) {
    let parser = data.parser;

    context_.parser = parser;
    switch (parser.type) {
      case 'dash':
      case 'hls':
        eventBus_.trigger(Events.MEDIA_ATTACHING, {
          media: media_
        });
        break;
      case 'pd':
        let vPlayer = VideoPlayer(context_).getInstance();
        vPlayer.setSrc(context_.mediaCfg.url);
        break;
      default:
        break;
    }
  }

  function onMediaAttached() {
    streamController_.startLoad();
  }

  function onAdContentPauseRequested() {
    playbackController_.pause();
  }

  function onAdContentResumeRequested() {
    if (!playbackController_.isEnded()) {
      playbackController_.play();
    }
  }

  function onAdLoadingComplete() {
    flagAdOpenComplete_ = true;
    processOpenComplete();
  }

  function onAdPaused() {
    updateState('paused');
  }

  function onAdResumed() {
    updateState('playing');
  }
  // End -- internal events listener functions

  function processOpenComplete() {
    if (flagContentOpenComplete_ && flagAdOpenComplete_) {
      // Emit event to outer.
      updateState('opened');

      if (context_.cfg.autoplay) {
        play();
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // Title: debug function here
  function manualSchedule() {
    streamController_.manualSchedule();
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

    bufferController_.setDuration(200);

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
    setAudioPlaybackSpeed: setAudioPlaybackSpeed,
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
    // pip(Safari only)
    setPipPresentation: setPipPresentation,
    // airplay(Safari only)
    showPlaybackTargetPicker: showPlaybackTargetPicker,
    // State Machine
    getState: getState,
    // debug
    manualSchedule: manualSchedule,
    test: test,
    test2: test2
  };

  setup();

  return instance;
};

export default Player;