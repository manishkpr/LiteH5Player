import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';
import SourceBufferWrapper from './SourceBufferWrapper';

var MediaSourceEngine = function () {
  this.eventBus_ = EventBus(oldmtn).getInstance();
  this.debug_ = Debug(oldmtn).getInstance();
  this.mediaSrc_ = null;
  this.streamInfo_ = null;
  this.sourceBuffers_ = {};

  this.debug_.log('MediaSourceEngine, constructor');
};

MediaSourceEngine.prototype.open = function (streamInfo) {
    this.debug_.log('MediaSourceEngine, +open');

    this.streamInfo_ = streamInfo;

    if (this.streamInfo_.audioCodec) {
      this.sourceBuffers_['audio'] = new SourceBufferWrapper(this.streamInfo_.audioCodec);
    }
    if (this.streamInfo_.videoCodec) {
      this.sourceBuffers_['video'] = new SourceBufferWrapper(this.streamInfo_.videoCodec);
    }

    //
    var hasWebKit = ('WebKitMediaSource' in window);
    var hasMediaSource = ('MediaSource' in window);

    if (hasMediaSource) {
      this.mediaSrc_ = new MediaSource();
      this.mediaSrc_.addEventListener('sourceopen', this.onMediaSourceOpen.bind(this), false);
      this.mediaSrc_.addEventListener('sourceended', this.onMediaSourceEnded.bind(this), false);
      this.mediaSrc_.addEventListener('sourceclose', this.onMediaSourceClose.bind(this), false);
    } else if (hasWebKit) {
      this.mediaSrc_ = new WebKitMediaSource();
      this.mediaSrc_.addEventListener('webkitsourceopen', this.onMediaSourceOpen.bind(this), false);
    }

    this.debug_.log('MediaSourceEngine, -open');
};

MediaSourceEngine.prototype.onMediaSourceOpen = function () {
  this.debug_.log('+MediaSourceOpen');

  this.mediaSrc_.removeEventListener('sourceopen', this.onMediaSourceOpen.bind(this));
  this.mediaSrc_.removeEventListener('webkitsourceopen', this.onMediaSourceOpen.bind(this));

  if (this.sourceBuffers_['audio']) {
    this.sourceBuffers_['audio'].init(this.mediaSrc_);
  }

  if (this.sourceBuffers_['video']) {
    this.sourceBuffers_['video'].init(this.mediaSrc_);
  }

  this.eventBus_.trigger(Events.MSE_OPENED, {});
};

MediaSourceEngine.prototype.onMediaSourceEnded = function () {

};

MediaSourceEngine.prototype.onMediaSourceClose = function () {

};

MediaSourceEngine.prototype.setDuration = function (value) {
  if (this.mediaSrc_.duration != value) {
    this.mediaSrc_.duration = value;
  }

  return this.mediaSrc_.duration;
};

MediaSourceEngine.prototype.signalEndOfStream = function () {
  this.mediaSrc_.endOfStream();
};

MediaSourceEngine.prototype.getMediaSource = function () {
  return this.mediaSrc_;
};

MediaSourceEngine.prototype.appendBuffer = function (contentType, buffer) {
  this.sourceBuffers_[contentType].appendBuffer(buffer);
};

MediaSourceEngine.prototype.removeBuffer = function () {
  if (this.sourceBuffers_['audio']) {
    this.sourceBuffers_['audio'].removeBuffer();
  }
  if (this.sourceBuffers_['video']) {
    this.sourceBuffers_['video'].removeBuffer();
  }

  this.sourceBuffers_['audio'] = null;
  this.sourceBuffers_['video'] = null;
};

MediaSourceEngine.prototype.close = function () {
  if (this.sourceBuffers_['audio']) {
    this.sourceBuffers_['audio'].removeBuffer();
  }
  if (this.sourceBuffers_['video']) {
    this.sourceBuffers_['video'].removeBuffer();
  }

  this.sourceBuffers_ = {};
  this.mediaSrc_ = null;
  this.streamInfo_ = null;
};

export default MediaSourceEngine;




