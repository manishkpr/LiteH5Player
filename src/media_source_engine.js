import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';
import SourceBufferWrapper from './SourceBufferWrapper';

function MediaSourceEngine() {
    let eventBus_ = EventBus(oldmtn).getInstance();
    let debug_ = Debug(oldmtn).getInstance();
    let mediaSrc_ = null;
    let streamInfo_ = null;
    let sourceBuffers_ = {};

    debug_.log('MediaSourceEngine, constructor');

    function open(streamInfo) {
        debug_.log('MediaSourceEngine, +open');

        streamInfo_ = streamInfo;

        if (streamInfo_.audioCodec) {
            sourceBuffers_['audio'] = new SourceBufferWrapper(streamInfo_.audioCodec);
        }
        if (streamInfo_.videoCodec) {
            sourceBuffers_['video'] = new SourceBufferWrapper(streamInfo_.videoCodec);
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
        if (sourceBuffers_['audio']) {
            sourceBuffers_['audio'].removeBuffer();
        }
        if (sourceBuffers_['video']) {
            sourceBuffers_['video'].removeBuffer();
        }

        sourceBuffers_ = {};
        mediaSrc_ = null;
        streamInfo_ = null;
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
        sourceBuffers_[contentType].appendBuffer(buffer);
    }

    function removeBuffer() {
        if (sourceBuffers_['audio']) {
            sourceBuffers_['audio'].removeBuffer();
        }
        if (sourceBuffers_['video']) {
            sourceBuffers_['video'].removeBuffer();
        }

        sourceBuffers_['audio'] = null;
        sourceBuffers_['video'] = null;
    }

    function onMediaSourceOpen() {
        debug_.log('+onMediaSourceOpen');

        // once received, don't listen anymore to sourceopen event
        mediaSrc_.removeEventListener('sourceopen', onMediaSourceOpen);
        mediaSrc_.removeEventListener('webkitsourceopen', onMediaSourceOpen);

        if (sourceBuffers_['audio']) {
            sourceBuffers_['audio'].open(mediaSrc_);
        }

        if (sourceBuffers_['video']) {
            sourceBuffers_['video'].open(mediaSrc_);
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
