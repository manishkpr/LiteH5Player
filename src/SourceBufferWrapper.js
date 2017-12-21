import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import TimeRanges from './utils/timeRanges';
import Events from './core/CoreEvents';

var SourceBufferWrapper = function (mimeType) {
  this.mimeType_ = mimeType;
  this.media_ = null;
  this.mediaSrc_ = null;
  this.buffer_ = null;

  this.eventBus_ = EventBus(oldmtn).getInstance();
};

SourceBufferWrapper.prototype.init = function (mediaSource) {
  this.mediaSrc_ = mediaSource;

  this.buffer_ = mediaSource.addSourceBuffer(this.mimeType_);

  this.buffer_.addEventListener('updatestart', this.sourceBuffer_updatestart.bind(this));
  this.buffer_.addEventListener('update', this.sourceBuffer_update.bind(this));
  this.buffer_.addEventListener('updateend', this.sourceBuffer_updateend.bind(this));
  this.buffer_.addEventListener('error', this.sourceBuffer_error.bind(this));
  this.buffer_.addEventListener('abort', this.sourceBuffer_abort.bind(this));

  return this.buffer_;
};

SourceBufferWrapper.prototype.close = function () {
  try {
    this.buffer_.removeEventListener('updatestart', this.sourceBuffer_updatestart.bind(this));
    this.buffer_.removeEventListener('update', this.sourceBuffer_update.bind(this));
    this.buffer_.removeEventListener('updateend', this.sourceBuffer_updateend.bind(this));
    this.buffer_.removeEventListener('error', this.sourceBuffer_error.bind(this));
    this.buffer_.removeEventListener('abort', this.sourceBuffer_abort.bind(this));

    this.mediaSrc_.removeSourceBuffer(this.buffer_);
  } catch (ex) {
    console.log(`Caught exception when remove sb event listener`);
  }
};

SourceBufferWrapper.prototype.appendBuffer = function (bytes) {
  if (this.buffer_) {
    try {
      this.buffer_.appendBuffer(bytes);
    } catch (err) {
      console.log(`error while trying to append buffer:${err.message}`);
    }
  }
};

SourceBufferWrapper.prototype.removeBuffer = function () {
  console.log('--sourceBuffer_remove--');

  let bufStart;
  let bufEnd;
  for (let i = 0; i < this.buffer_.buffered.length; i++) {
    bufStart = this.buffer_.buffered.start(i);
    bufEnd = this.buffer_.buffered.end(i);

    this.buffer_.remove(bufStart, bufEnd);
  }
};

SourceBufferWrapper.prototype.sourceBuffer_updatestart = function () {
  let a = this;
  console.log('--sourceBuffer_updatestart--');
};

SourceBufferWrapper.prototype.sourceBuffer_update = function () {
  let a = this;
  console.log('--sourceBuffer_update--');
};

SourceBufferWrapper.prototype.sourceBuffer_updateend = function () {
  let a = this;

  // console.log('--sourceBuffer_updateend--, clientWidth: ' + media_.clientWidth + ', clientHeight: ' + media_.clientHeight);
  // console.log('--sourceBuffer_updateend--, width: ' + media_.width + ', height: ' + media_.height);
  // console.log('--sourceBuffer_updateend--, videoWidth: ' + media_.videoWidth + ', videoHeight: ' + media_.videoHeight);

  //
  //console.log(`main buffered : ${TimeRanges.toString(media_.buffered)}` + ', currentTime: ' + media_.currentTime);

  this.eventBus_.trigger(Events.SB_UPDATE_ENDED, {});
};

SourceBufferWrapper.prototype.sourceBuffer_error = function (e) {
  let a = this;

  console.log('--sourceBuffer_error--', e);
};

SourceBufferWrapper.prototype.sourceBuffer_abort = function () {
  let a = this;

  console.log('--sourceBuffer_abort--');
};

export default SourceBufferWrapper;


