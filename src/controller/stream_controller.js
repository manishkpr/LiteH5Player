import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/CoreEvents';
import Debug from '../core/Debug';

import TimeRanges from '../utils/timeRanges';

import Demuxer from '../../third_party/hlsjs/src/demux/demuxer';
import {
  hlsDefaultConfig
} from '../../third_party/hlsjs/src/config';

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
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let streamInfo_;

  let hls_;
  let demuxer_;

  // flag
  let startLoaded_;
  let manualMode_ = false;
  // state machine
  let state_;

  function setup() {
    state_ = State.IDLE;

    hls_ = eventBus_;
    hls_.config = hlsDefaultConfig;
    //hls_.config.enableWorker = true;

    demuxer_ = new Demuxer(hls_, 'main');

    eventBus_.on(Events.MANIFEST_PARSED, onManifestParsed);
    eventBus_.on(Events.STREAM_UPDATED, onStreamUpdated);

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
  function onManifestParsed() {
  }

  function onStreamUpdated(e) {
    streamInfo_ = e.streamInfo;
    tick();
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
    eventBus_.trigger(Events.BUFFER_CODEC, data.tracks);

    debug_.log('+onFragParsingInitSegment');
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
        eventBus_.trigger(Events.BUFFER_APPENDING, {
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
      //tick();
    }
  }

  // Begin internal functions
  function _checkBuffer() {}

  function _findFragment() {
    let parser = context_.parser;
    let frag = parser.getNextFragment();
    return frag;
  }

  function tick() {
    switch (state_) {
      case State.IDLE:
        {
          let frag = _findFragment();
          if (frag) {
            eventBus_.trigger(Events.FRAG_LOADING, { frag });
            state_ = State.FRAG_LOADING;
          } else {
            eventBus_.trigger(Events.BUFFER_EOS);
          }
        }
        break;
      case State.STOPPED:
        break;
    }

    _checkBuffer();
  }

  function manualSchedule() {
    tick();
  }

  function startLoad() {
    eventBus_.trigger(Events.MANIFEST_LOADING, { url: context_.mediaCfg.url });
  }

  function stopLoad() {
    state_ = State.STOPPED;
  }

  let instance_ = {
    // for debug
    manualSchedule: manualSchedule,
    startLoad: startLoad,
    stopLoad: stopLoad
  };
  setup();
  return instance_;
}

StreamController.__h5player_factory_name = 'StreamController';
export default FactoryMaker.getSingletonFactory(StreamController);