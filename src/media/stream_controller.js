import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/CoreEvents';
import Debug from '../core/Debug';
import TimeRanges from '../utils/timeRanges';

// from 
import Demuxer from '../hls/hlsjs/src/demux/demuxer';
import {
  hlsDefaultConfig
} from '../hls/hlsjs/src/config';

function StreamController() {
  let context_ = this.context;
  let debug_ = Debug(context_).getInstance();
  let eventBus_ = EventBus(context_).getInstance();

  let parser_;
  let streamInfo_;
  let currentStream_ = -1;

  let hls_;
  let demuxer_;

  // flag
  let manualMode_ = false;

  function setup() {
    hls_ = eventBus_;
    hls_.config = hlsDefaultConfig;
    demuxer_ = new Demuxer(hls_, 'main');

    eventBus_.on(Events.FOUND_PARSER, onFoundParser);
    eventBus_.on(Events.MEDIA_ATTACHED, onMediaAttached);

    eventBus_.on(Events.MANIFEST_PARSED, onManifestParsed);
    eventBus_.on(Events.STREAM_LOADED, onStreamLoaded);

    eventBus_.on(Events.FRAG_LOADED, onFragLoaded);

    eventBus_.on(Events.INIT_PTS_FOUND, onInitPtsFound, {});
    eventBus_.on(Events.FRAG_PARSING_INIT_SEGMENT, onFragParsingInitSegment, {});
    eventBus_.on(Events.FRAG_PARSING_DATA, onFragParsingData, {});
    eventBus_.on(Events.FRAG_PARSED, onFragParsed, {});

    eventBus_.on(Events.BUFFER_APPENDED, onBufferAppended);

    //
    eventBus_.on(Events.TEST_MSG, onTestMsg);
  }

  // tool functions
  function getLevelDetails() {
    let details = null;
    for (let i = 0; i < streamInfo_.tracks.length; i++) {
      let trackInfo = streamInfo_.tracks[i];
      if (trackInfo.type === 'stream') {
        details = trackInfo.levelDetails;
        break;
      }
    }

    return details;
  }

  // Begin events functions
  function onFoundParser(data) {
    parser_ = data.parser;
  }

  function onMediaAttached() {
    parser_.loadManifest(context_.mediaCfg.url);
  }

  function onManifestParsed(streamInfo) {
    streamInfo_ = streamInfo;
    tick();
  }

  function onStreamLoaded() {
    currentStream_ = 0;
  }

  function onTestMsg() {
    tick();
  }

  function onFragLoaded(e) {
    let frag = e.frag;
    let data = frag.data;

    // BD
    debug_.log('onFragLoaded, start: ' + frag.start + ', duration: ' + frag.duration);
    // ED

    if (frag.sn === 'initSegment') {
      frag.data = data;
      tick();
    } else {
      let details = getLevelDetails();
      let initSegmentData = details.initSegment ? details.initSegment.data : [];
      demuxer_.push(data, initSegmentData, undefined, undefined, frag, streamInfo_.duration, true, undefined);
    }
  }

  function onInitPtsFound(data) {
    let a = 2;
    let b = a;
  }

  function onFragParsingInitSegment(data) {
    eventBus_.trigger(Events.BUFFER_CODEC, data.tracks);

    for (let trackName in data.tracks) {
      let track = data.tracks[trackName];
      let initSegment = track.initSegment;
      if (initSegment) {
        eventBus_.trigger(Events.BUFFER_APPENDING, {
          type: trackName,
          content: 'initSegment',
          data: initSegment
        });
      }
    }
  }

  function onFragParsingData(data) {
    [data.data1, data.data2].forEach(buffer => {
      if (buffer) {
        eventBus_.trigger(Events.BUFFER_APPENDING, {
          type: data.type,
          content: 'data',
          data: buffer
        });
      }
    });
  }

  function onFragParsed(data) {

  }

  function onBufferAppended(e) {
    let media = context_.media;
    //debug_.log('main buffered: ' + TimeRanges.toString(media.buffered));
    debug_.log(`main buffered: ${TimeRanges.toString(media.buffered)}, duration:${media.duration}`);
    if (e.pending === 0) {
      tick();
    }
  }

  // Begin internal functions
  function _checkBuffer() {

  }

  function _findFragment() {
    if (currentStream_ === -1) {
      return;
    }

    let frag = parser_.getNextFragment();
    if (frag && frag.type === 'pd') {
      eventBus_.trigger(Events.PD_DOWNLOADED, frag);
      return;
    }

    return frag;
  }

  function tick() {
    let frag = _findFragment();
    
    if (frag) {
      eventBus_.trigger(Events.FRAG_LOADING, {
        frag
      });
    } else {
      eventBus_.trigger(Events.BUFFER_EOS);
    }

    _checkBuffer();
  }

  function manualSchedule() {
    tick();
  }

  let instance = {
    // for debug
    manualSchedule: manualSchedule
  };
  setup();
  return instance;
}

StreamController.__h5player_factory_name = 'StreamController';
export default FactoryMaker.getSingletonFactory(StreamController);