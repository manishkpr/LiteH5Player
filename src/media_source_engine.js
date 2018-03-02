import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';
import SourceBufferWrapper from './SourceBufferWrapper';

function MediaSourceEngine() {
    let eventBus_ = EventBus(oldmtn).getInstance();
    let debug_ = Debug(oldmtn).getInstance();
    let mediaSrc_ = null;
    let activeStream_ = null;
    let aSourceBuffer_ = null;
    let vSourceBuffer_ = null;
    let pdSourceBuffer_ = null;

    debug_.log('MediaSourceEngine, constructor');

    function setup() {
        eventBus_.on(Events.FRAGMENT_DOWNLOADED, onFragmentDownloaded);
        eventBus_.on(Events.FRAGMENT_DOWNLOADED_ENDED, onFragmentDownloadedEnded);
    }

    function open(activeStream) {
        debug_.log('MediaSourceEngine, +open');
        activeStream_ = activeStream;

        if (activeStream_.vRep) {
            vSourceBuffer_ = new SourceBufferWrapper(activeStream_.vRep);
        }
        if (activeStream_.aRep) {
            aSourceBuffer_ = new SourceBufferWrapper(activeStream_.aRep);
        }
        if (activeStream_.pdRep) {
            pdSourceBuffer_ = new SourceBufferWrapper(activeStream_.pdRep);
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
        removeBuffer();
        mediaSrc_ = null;
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

    function appendBuffer(e) {
        if (e.type === 'video') {
            vSourceBuffer_.appendBuffer(e.bytes);
        } else if (e.type === 'audio') {
            aSourceBuffer_.appendBuffer(e.bytes);
        } else if (e.type === 'pd') {
            pdSourceBuffer_.appendBuffer(e.bytes);
        }
    }

    function removeBuffer() {
        if (vSourceBuffer_) {
            vSourceBuffer_.removeBuffer();
        }
        if (aSourceBuffer_) {
            aSourceBuffer_.removeBuffer();
        }
        if (pdSourceBuffer_) {
            pdSourceBuffer_.removeBuffer();
        }

        vSourceBuffer_ = null;
        aSourceBuffer_ = null;
    }

    function onMediaSourceOpen() {
        debug_.log('+onMediaSourceOpen');

        // once received, don't listen anymore to sourceopen event
        mediaSrc_.removeEventListener('sourceopen', onMediaSourceOpen);
        mediaSrc_.removeEventListener('webkitsourceopen', onMediaSourceOpen);
        
        // set media source duration
        if (activeStream_.mediaPresentationDuration) {
            setDuration(activeStream_.mediaPresentationDuration);
        }

        if (vSourceBuffer_) {
            vSourceBuffer_.open(mediaSrc_);
        }
        if (aSourceBuffer_) {
            aSourceBuffer_.open(mediaSrc_);
        }
        if (pdSourceBuffer_) {
            pdSourceBuffer_.open(mediaSrc_);
        }

        eventBus_.trigger(Events.MSE_OPENED, {});
    }

    function onMediaSourceEnded() {
        debug_.log('+onMediaSourceEnded');
    }

    function onMediaSourceClose() {
        debug_.log('+onMediaSourceClose');
    }

    function onFragmentDownloaded(e) {
        appendBuffer(e);
    }

    function onFragmentDownloadedEnded() {
        signalEndOfStream();
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
    setup();
    return instance;
};

export default MediaSourceEngine;
