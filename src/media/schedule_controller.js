import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/CoreEvents';

// from 
import Demuxer from '../hls/hlsjs/src/demux/demuxer';
import {
  hlsDefaultConfig
} from '../hls/hlsjs/src/config';

function ScheduleController() {
  let context_ = this.context;

  let parser_;
  let eventBus_ = EventBus(context_).getInstance();

  let streamInfo_;

  let hls_;
  let demuxer_;

  // flag
  let manualMode_ = false;

  function setup() {
    hls_ = eventBus_;
    hls_.config = hlsDefaultConfig;
    demuxer_ = new Demuxer(hls_, 'main');

    eventBus_.on(Events.STREAM_LOADED, onStreamLoaded);

    eventBus_.on(Events.INIT_PTS_FOUND, onInitPtsFound, {});
    eventBus_.on(Events.FRAG_PARSING_INIT_SEGMENT, onFragParsingInitSegment, {});
    eventBus_.on(Events.FRAG_PARSING_DATA, onParsingData, {});
    eventBus_.on(Events.FRAG_LOADED, onFragLoaded);

    eventBus_.on(Events.BUFFER_APPENDED, onBufferAppended);

    eventBus_.on(Events.SB_UPDATE_ENDED, onSbUpdateEnded);
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

  //
  function onStreamLoaded(streamInfo) {
    streamInfo_ = streamInfo;
  }

  function onSbUpdateEnded() {}

  function onInitPtsFound(e) {
    let a = 2;
    let b = a;
  }

  function onFragParsingInitSegment(e) {
    eventBus_.trigger(Events.BUFFER_CODEC, e.tracks);

    for (let trackName in e.tracks) {
      let track = e.tracks[trackName];
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

  function onParsingData(data) {
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

  function onFragLoaded(e) {
    let frag = e.frag;
    let data = frag.data;
    if (frag.sn === 'initSegment') {
      frag.data = data;
      tick();
    } else {
      let details = getLevelDetails();
      let initSegmentData = details.initSegment ? details.initSegment.data : [];
      demuxer_.push(data, initSegmentData, undefined, undefined, frag, streamInfo_.duration, true, undefined);
    }
  }

  function onBufferAppended(e) {
    if (e.pending === 0) {
      tick();
    }
  }

  function tick() {
    let frag = parser_.getNextFragment();
    if (frag && frag.type === 'pd') {
      eventBus_.trigger(Events.PD_DOWNLOADED, frag);
      return;
    }

    if (frag) {
      eventBus_.trigger(Events.FRAG_LOADING, {
        frag
      });
    } else {
      eventBus_.trigger(Events.FRAGMENT_DOWNLOADED_ENDED);
    }
  }

  function start(parser) {
    parser_ = parser;

    tick();
  }

  function stop() {
  }

  function manualSchedule() {
    tick();
  }

  let instance = {
    start: start,
    stop: stop,

    // for debug
    manualSchedule: manualSchedule
  };
  setup();
  return instance;
}

ScheduleController.__h5player_factory_name = 'ScheduleController';
export default FactoryMaker.getSingletonFactory(ScheduleController);