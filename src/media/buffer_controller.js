﻿import FactoryMaker from '../core/FactoryMaker';
import Events from '../core/CoreEvents';
import TimeRanges from '../utils/timeRanges';

function BufferController() {
  let context_ = this.context;

  let eventBus_ = context_.eventBus;
  let debug_ = context_.debug;
  let mediaSource_ = null;
  let sourceBuffer_ = {};

  let tracks_ = null;

  let segments_ = null;
  // flag
  let appending_ = false;

  function setup() {
    eventBus_.on(Events.MEDIA_ATTACHING, onMediaAttaching);

    eventBus_.on(Events.BUFFER_CODEC, onBufferCodec);
    eventBus_.on(Events.BUFFER_APPENDING, onBufferAppending);

    //
    eventBus_.on(Events.TEST_MSG, onTestMsg);
  }

  function createMediaSource() {
    debug_.log('BufferController, +createMediaSource');
    //
    var hasWebKit = ('WebKitMediaSource' in window);
    var hasMediaSource = ('MediaSource' in window);

    if (hasMediaSource) {
      mediaSource_ = new MediaSource();
      mediaSource_.addEventListener('sourceopen', onMediaSourceOpen, false);
      mediaSource_.addEventListener('sourceended', onMediaSourceEnded, false);
      mediaSource_.addEventListener('sourceclose', onMediaSourceClose, false);
    } else if (hasWebKit) {
      mediaSource_ = new WebKitMediaSource();
      mediaSource_.addEventListener('webkitsourceopen', onMediaSourceOpen, false);
    }

    debug_.log('BufferController, -createMediaSource');

    return mediaSource_;
  }

  function close() {
    removeBuffer();
    mediaSource_ = null;
  }

  function setDuration(value) {
    if (mediaSource_.duration != value) {
      mediaSource_.duration = value;
    }

    return mediaSource_.duration;
  }

  function signalEndOfStream() {
    debug_.log('+signalEndOfStream');
    mediaSource_.endOfStream();
  }

  function test() {}

  function onMediaSourceOpen() {
    debug_.log('+onMediaSourceOpen');

    // once received, don't listen anymore to sourceopen event
    mediaSource_.removeEventListener('sourceopen', onMediaSourceOpen);
    mediaSource_.removeEventListener('webkitsourceopen', onMediaSourceOpen);

    URL.revokeObjectURL(context_.media.src);
    eventBus_.trigger(Events.MEDIA_ATTACHED, {});
  }

  function onMediaSourceEnded() {
    debug_.log('+onMediaSourceEnded');
  }

  function onMediaSourceClose() {
    debug_.log('+onMediaSourceClose');
  }

  function onMediaAttaching() {
    let mediaSrc = createMediaSource();
    let objURL = window.URL.createObjectURL(mediaSrc);
    context_.media.src = objURL;
  }

  function onBufferCodec(e) {
    tracks_ = e;

    if (tracks_.audio) {
      let mimeType = `${tracks_.audio.container};codecs=${tracks_.audio.codec}`;
      let buffer = mediaSource_.addSourceBuffer(mimeType);
      sourceBuffer_.audio = buffer;

      buffer.addEventListener('updatestart', sourceBuffer_updatestart);
      buffer.addEventListener('update', sourceBuffer_update);
      buffer.addEventListener('updateend', sourceBuffer_updateend);
      buffer.addEventListener('error', sourceBuffer_error);
      buffer.addEventListener('abort', sourceBuffer_abort);
    }
    if (tracks_.video) {
      let mimeType = `${tracks_.video.container};codecs=${tracks_.video.codec}`;
      let buffer = mediaSource_.addSourceBuffer(mimeType);
      sourceBuffer_.video = buffer;

      buffer.addEventListener('updatestart', sourceBuffer_updatestart);
      buffer.addEventListener('update', sourceBuffer_update);
      buffer.addEventListener('updateend', sourceBuffer_updateend);
      buffer.addEventListener('error', sourceBuffer_error);
      buffer.addEventListener('abort', sourceBuffer_abort);
    }
  }

  function doAppending() {
    if (appending_) {
      // logger.log(`sb appending in progress`);
      return;
    }

    if (segments_ && segments_.length) {
      let segment = segments_.shift();
      try {
        let type = segment.type,
          sb = sourceBuffer_[type];
        if (sb) {
          if (!sb.updating) {
            appending_ = true;

            // reset sourceBuffer ended flag before appending segment
            sb.ended = false;
            sb.appendBuffer(segment.data);
          }
        }
      } catch (err) {
        // in case any error occured while appending, put back segment in segments table
        debug_.log(`error while trying to append buffer:${err.message}`);
      }
    }
  }

  function onBufferAppending(data) {
    if (!segments_) {
      segments_ = [data];
    } else {
      segments_.push(data);
    }

    doAppending();
  }

  function onTestMsg() {
    var media = context_.media;
    var a = sourceBuffer_.audio;
    var v = sourceBuffer_.video;
    if (a) {
      debug_.log(`audio buffered: ${TimeRanges.toString(a.buffered)}`);
    }
    if (v) {
      debug_.log(`video buffered: ${TimeRanges.toString(v.buffered)}`);
    }
    debug_.log(`media buffered: ${TimeRanges.toString(media.buffered)}`);
  }

  // Begin source buffer event
  function sourceBuffer_updatestart() {
    //debug_.log('--sourceBuffer_updatestart--');
  }

  function sourceBuffer_update() {
    //debug_.log('--sourceBuffer_update--');
  }

  function sourceBuffer_updateend() {
    debug_.log('+sourceBuffer_updateend');
    appending_ = false;

    let pending = segments_.length;
    if (pending === 0) {
      eventBus_.trigger(Events.BUFFER_APPENDED, { pending });
    } else {
      doAppending();
    }

    updateMediaElementDuration();
  }

  function sourceBuffer_error(e) {
    debug_.log('+sourceBuffer_error', e);
  }

  function sourceBuffer_abort() {
    debug_.log('+sourceBuffer_abort');
  }
  // End source buffer event

  function updateMediaElementDuration() {
    // can't set duration while a buffer is updating
    for (let type in sourceBuffer_) {
      if (sourceBuffer_[type].updating === true) {
        return;
      }
    }
  }

  let instance = {
    createMediaSource: createMediaSource,
    close: close,
    setDuration: setDuration,
    signalEndOfStream: signalEndOfStream,
    test: test
  };
  setup();
  return instance;
};

BufferController.__h5player_factory_name = 'BufferController';
export default FactoryMaker.getSingletonFactory(BufferController);