import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import TimeRanges from './utils/timeRanges';
import Events from './core/CoreEvents';

function SourceBufferWrapper(rep) {
  let rep_ = rep;
  let media_ = null;
  let mediaSrc_ = null;
  let buffer_ = null;
  let eventBus_ = EventBus(oldmtn).getInstance();

  function setup() {
  }

  function open(mediaSource) {
    mediaSrc_ = mediaSource;

    buffer_ = mediaSource.addSourceBuffer(rep_.codecs);

    buffer_.addEventListener('updatestart', sourceBuffer_updatestart);
    buffer_.addEventListener('update', sourceBuffer_update);
    buffer_.addEventListener('updateend', sourceBuffer_updateend);
    buffer_.addEventListener('error', sourceBuffer_error);
    buffer_.addEventListener('abort', sourceBuffer_abort);

    return buffer_;
  }

  function close() {
    try {
      buffer_.removeEventListener('updatestart', sourceBuffer_updatestart);
      buffer_.removeEventListener('update', sourceBuffer_update);
      buffer_.removeEventListener('updateend', sourceBuffer_updateend);
      buffer_.removeEventListener('error', sourceBuffer_error);
      buffer_.removeEventListener('abort', sourceBuffer_abort);

      mediaSrc_.removeSourceBuffer(buffer_);
    } catch (ex) {
      console.log(`Caught exception when remove sb event listener`);
    }
  }

  function appendBuffer(bytes) {
    if (buffer_) {
      try {
        buffer_.appendBuffer(bytes);
      } catch (err) {
        console.log(`error while trying to append buffer:${err.message}`);
      }
    }
  }

  function removeBuffer() {
    console.log('--sourceBuffer_remove--');

    let bufStart;
    let bufEnd;
    for (let i = 0; i < buffer_.buffered.length; i++) {
      bufStart = buffer_.buffered.start(i);
      bufEnd = buffer_.buffered.end(i);

      buffer_.remove(bufStart, bufEnd);
    }
  }

  function sourceBuffer_updatestart() {
    let a = this;
    console.log('--sourceBuffer_updatestart--');
  }

  function sourceBuffer_update() {
    let a = this;
    console.log('--sourceBuffer_update--');
  }

  function sourceBuffer_updateend() {
    let a = this;

    // console.log('--sourceBuffer_updateend--, clientWidth: ' + media_.clientWidth + ', clientHeight: ' + media_.clientHeight);
    // console.log('--sourceBuffer_updateend--, width: ' + media_.width + ', height: ' + media_.height);
    // console.log('--sourceBuffer_updateend--, videoWidth: ' + media_.videoWidth + ', videoHeight: ' + media_.videoHeight);

    //
    //console.log(`main buffered : ${TimeRanges.toString(media_.buffered)}` + ', currentTime: ' + media_.currentTime);

    eventBus_.trigger(Events.SB_UPDATE_ENDED, {});
  }

  function sourceBuffer_error(e) {
    let a = this;

    console.log('--sourceBuffer_error--', e);
  }

  function sourceBuffer_abort() {
    let a = this;
    console.log('--sourceBuffer_abort--');
  }

  let instance = {
    open: open,
    close: close,
    appendBuffer: appendBuffer,
    removeBuffer: removeBuffer
  };
  setup();
  return instance;
};

export default SourceBufferWrapper;


