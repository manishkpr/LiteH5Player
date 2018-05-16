import FactoryMaker from '../core/FactoryMaker';
import TimeRanges from '../utils/timeRanges';

// from 
import Demuxer from '../hls/hlsjs/src/demux/demuxer';
import {
  hlsDefaultConfig
} from '../hls/hlsjs/src/config';

export const State = {
  STOPPED: 'STOPPED',
  IDLE: 'IDLE',
  KEY_LOADING: 'KEY_LOADING',
  FRAG_LOADING: 'FRAG_LOADING',
  FRAG_LOADING_WAITING_RETRY: 'FRAG_LOADING_WAITING_RETRY',
  WAITING_LEVEL: 'WAITING_LEVEL',
  PARSING: 'PARSING',
  PARSED: 'PARSED',
  BUFFER_FLUSHING: 'BUFFER_FLUSHING',
  ENDED: 'ENDED',
  ERROR: 'ERROR'
};

function StreamController() {
  let context_ = this.context;
  let debug_ = context_.debug;
  let events_ = context_.events;
  let eventBus_ = context_.eventBus;

  let parser_;
  let streamInfo_;
  let currentStream_ = -1;

  let hls_;
  let demuxer_;

  // flag
  let manualMode_ = false;
  // state machine
  let state_;

  function setup() {
    state_ = State.IDLE;

    hls_ = eventBus_;
    hls_.config = hlsDefaultConfig;
    //hls_.config.enableWorker = true;

    demuxer_ = new Demuxer(hls_, 'main');

    eventBus_.on(events_.FOUND_PARSER, onFoundParser);
    eventBus_.on(events_.MEDIA_ATTACHED, onMediaAttached);

    eventBus_.on(events_.MANIFEST_PARSED, onManifestParsed);
    eventBus_.on(events_.STREAM_LOADED, onStreamLoaded);

    eventBus_.on(events_.FRAG_LOADED, onFragLoaded);

    eventBus_.on(events_.INIT_PTS_FOUND, onInitPtsFound, {});
    eventBus_.on(events_.FRAG_PARSING_INIT_SEGMENT, onFragParsingInitSegment, {});
    eventBus_.on(events_.FRAG_PARSING_DATA, onFragParsingData, {});
    eventBus_.on(events_.FRAG_PARSED, onFragParsed, {});

    eventBus_.on(events_.BUFFER_APPENDED, onBufferAppended);

    //
    eventBus_.on(events_.TEST_MSG, onTestMsg);
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

    debug_.log(`+onFragLoaded, SN:${frag.sn}, start:${frag.start}, duration:${frag.duration}`);
    if (frag.sn === 'initSegment') {
      frag.data = data;
      state_ = State.IDLE;
      tick();
    } else {
      state_ = State.PARSING;

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
    eventBus_.trigger(events_.BUFFER_CODEC, data.tracks);

    debug_.log('+onFragParsingInitSegment');
    for (let trackName in data.tracks) {
      let track = data.tracks[trackName];
      let initSegment = track.initSegment;
      if (initSegment) {
        eventBus_.trigger(events_.BUFFER_APPENDING, {
          type: trackName,
          content: 'initSegment',
          data: initSegment
        });
      }
    }
  }

  function onFragParsingData(data) {
    // BD
    let cnt = 0;
    if (data.data1) {
      cnt++;
    }
    if (data.data2) {
      cnt++;
    }
    // ED
    debug_.log(`+onFragParsingData, cnt:${cnt}`);
    [data.data1, data.data2].forEach((buffer, index) => {
      if (buffer) {
        debug_.log(`push data, index:${index}`);
        eventBus_.trigger(events_.BUFFER_APPENDING, {
          type: data.type,
          content: 'data',
          data: buffer
        });
      }
    });
  }

  function onFragParsed(data) {
    debug_.log('+onFragParsed');
    state_ = State.PARSED;
  }

  function onBufferAppended(e) {
    let media = context_.media;
    //debug_.log('main buffered: ' + TimeRanges.toString(media.buffered));
    debug_.log(`+onBufferAppended, main buffered: ${TimeRanges.toString(media.buffered)}, duration:${media.duration}`);
    if (state_ === State.PARSED && e.pending === 0) {
      state_ = State.IDLE;
      tick();
    }
  }

  // Begin internal functions
  function _checkBuffer() {}

  function _findFragment() {
    if (currentStream_ === -1) {
      return;
    }

    let frag = parser_.getNextFragment();
    if (frag && frag.type === 'pd') {
      eventBus_.trigger(events_.PD_DOWNLOADED, frag);
      return;
    }

    return frag;
  }

  function tick() {
    switch (state_) {
      case State.IDLE:
        {
          let frag = _findFragment();
          if (frag) {
            eventBus_.trigger(events_.FRAG_LOADING, {
              frag
            });
            state_ = State.FRAG_LOADING;
          } else {
            eventBus_.trigger(events_.BUFFER_EOS);
          }
        }
        break;
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