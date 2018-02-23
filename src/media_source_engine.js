import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';
import SourceBufferWrapper from './SourceBufferWrapper';

function MediaSourceEngine() {
    let eventBus_ = EventBus(oldmtn).getInstance();
    let debug_ = Debug(oldmtn).getInstance();
    let mediaSrc_ = null;
    let rep_ = null;
    let aSourceBuffer = null;
    let vSourceBuffer = null;

    debug_.log('MediaSourceEngine, constructor');

    function open(rep) {
        debug_.log('MediaSourceEngine, +open');

        rep_ = rep;

        if (rep_) {
            vSourceBuffer = new SourceBufferWrapper(rep_);
        }

        //
        var hasWebKit = ('WebKitMediaSource' in window);
        var hasMediaSource = ('MediaSource' in window);

        if (hasMediaSource) {
            mediaSrc_ = new MediaSource();
            mediaSrc_.addEventListener('sourceopen', onMediaSourceOpen, false);
            mediaSrc_.addEventListener('sourceended', onMediaSourceEnded, false);
            mediaSrc_.addEventListener('sourceclose', onMediaSourceClose, false);
        } else if (hasWebKit) {
            mediaSrc_ = new WebKitMediaSource();
            mediaSrc_.addEventListener('webkitsourceopen', onMediaSourceOpen, false);
        }

        debug_.log('MediaSourceEngine, -open');
    }

    function close() {
        if (vSourceBuffer) {
            vSourceBuffer.removeBuffer();
        }
        mediaSrc_ = null;
        rep_ = null;
    }

    function setDuration(value) {
        if (mediaSrc_.duration != value) {
            mediaSrc_.duration = value;
        }

        return mediaSrc_.duration;
    }

    function signalEndOfStream() {
        debug_.log('+signalEndOfStream');
        mediaSrc_.endOfStream();
    }

    function getMediaSource() {
        return mediaSrc_;
    }

    function appendBuffer(contentType, buffer) {
        if (contentType === 'video') {
            vSourceBuffer.appendBuffer(buffer);
        } else if (contentType === 'audio') {
            aSourceBuffer.appendBuffer(buffer);
        }
    }

    function removeBuffer() {
        if (vSourceBuffer) {
            vSourceBuffer.removeBuffer();
        }

        vSourceBuffer = null;
    }

    function onMediaSourceOpen() {
        debug_.log('+onMediaSourceOpen');

        // once received, don't listen anymore to sourceopen event
        mediaSrc_.removeEventListener('sourceopen', onMediaSourceOpen);
        mediaSrc_.removeEventListener('webkitsourceopen', onMediaSourceOpen);

        if (vSourceBuffer) {
            vSourceBuffer.open(mediaSrc_);
        }

        eventBus_.trigger(Events.MSE_OPENED, {});
    }

    function onMediaSourceEnded() {
        debug_.log('+onMediaSourceEnded');
    }

    function onMediaSourceClose() {
        debug_.log('+onMediaSourceClose');
    }

    let instance = {
        open: open,
        close: close,
        setDuration: setDuration,
        signalEndOfStream: signalEndOfStream,
        getMediaSource: getMediaSource,
        appendBuffer: appendBuffer,
        removeBuffer: removeBuffer
    };

    return instance;
};

export default MediaSourceEngine;
