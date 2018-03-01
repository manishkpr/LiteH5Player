import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';
import TimeRanges from './utils/timeRanges';

function SourceBufferWrapper(rep) {
  let rep_ = rep;
  let media_ = null;
  let mediaSrc_ = null;
  let srcBuffer_ = null;
  let eventBus_ = EventBus(oldmtn).getInstance();
  let debug_ = Debug(oldmtn).getInstance();

  function setup() {
  }

  function open(mediaSource) {
    mediaSrc_ = mediaSource;

    srcBuffer_ = mediaSource.addSourceBuffer(rep_.codecs);

    srcBuffer_.addEventListener('updatestart', sourceBuffer_updatestart);
    srcBuffer_.addEventListener('update', sourceBuffer_update);
    srcBuffer_.addEventListener('updateend', sourceBuffer_updateend);
    srcBuffer_.addEventListener('error', sourceBuffer_error);
    srcBuffer_.addEventListener('abort', sourceBuffer_abort);

    return srcBuffer_;
  }

  function close() {
    try {
      srcBuffer_.removeEventListener('updatestart', sourceBuffer_updatestart);
      srcBuffer_.removeEventListener('update', sourceBuffer_update);
      srcBuffer_.removeEventListener('updateend', sourceBuffer_updateend);
      srcBuffer_.removeEventListener('error', sourceBuffer_error);
      srcBuffer_.removeEventListener('abort', sourceBuffer_abort);

      mediaSrc_.removeSourceBuffer(srcBuffer_);
    } catch (ex) {
      debug_.log(`Caught exception when remove sb event listener`);
    }
  }

  function appendBuffer(buffer) {
    waitForUpdateEnd(buffer, function() {
      if (srcBuffer_) {
        try {
          srcBuffer_.appendBuffer(buffer);
        } catch (err) {
          debug_.log(`error while trying to append buffer:${err.message}`);
        }
      }
    });
  }

  function removeBuffer() {
    debug_.log('+sourceBuffer_remove');

    let bufStart;
    let bufEnd;
    for (let i = 0; i < srcBuffer_.buffered.length; i++) {
      bufStart = srcBuffer_.buffered.start(i);
      bufEnd = srcBuffer_.buffered.end(i);

      srcBuffer_.remove(bufStart, bufEnd);
    }
  }

  function sourceBuffer_updatestart() {
    //debug_.log('--sourceBuffer_updatestart--');
  }

  function sourceBuffer_update() {
    //debug_.log('--sourceBuffer_update--');
  }

  function sourceBuffer_updateend() {
    // debug_.log('--sourceBuffer_updateend--, clientWidth: ' + media_.clientWidth + ', clientHeight: ' + media_.clientHeight);
    // debug_.log('--sourceBuffer_updateend--, width: ' + media_.width + ', height: ' + media_.height);
    // debug_.log('--sourceBuffer_updateend--, videoWidth: ' + media_.videoWidth + ', videoHeight: ' + media_.videoHeight);

    //
    //debug_.log(`main buffered : ${TimeRanges.toString(media_.buffered)}` + ', currentTime: ' + media_.currentTime);

    // BD
    //if (rep_.type === 'audio')
    {
      debug_.log(`Native, ${rep_.type} buffered : ${TimeRanges.toString(srcBuffer_.buffered)}`);
    }
    // ED
    eventBus_.trigger(Events.SB_UPDATE_ENDED, {});
  }

  function sourceBuffer_error(e) {
    debug_.log('+sourceBuffer_error', e);
  }

  function sourceBuffer_abort() {
    debug_.log('+sourceBuffer_abort');
  }

  function waitForUpdateEnd(buffer, callback) {
    if (!srcBuffer_.updating) {
        callback();
        return;
    }

    var updateEndHandler = function () {
        srcBuffer_.removeEventListener('updateend', updateEndHandler, false);
        callback();
    };
    srcBuffer_.addEventListener('updateend', updateEndHandler, false);
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


