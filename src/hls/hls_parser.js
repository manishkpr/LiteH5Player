import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/CoreEvents';
import Debug from '../core/Debug';

import StringUtils from '../utils/string_utils';

import {
  Fragment,
  TrackInfo,
  PeriodInfo
} from '../common/common';

import M3U8Parser from '../../third_party/hlsjs/src/loader/m3u8-parser';

function HlsParser() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let streamInfo_;

  // hls
  let currentSN_;
  let fragCurrent_;

  function setup() {
    eventBus_.on(Events.MANIFEST_LOADED, onManifestLoaded);
  }

  // event callbacks
  function onManifestLoaded(data) {
    let content = StringUtils.ab2str_v1(data.bytes);
    let url = data.url;
    debug_.log('content: ' + content);

    currentSN_ = 0;

    let track = new TrackInfo();
    track.type = 'stream';
    track.levelDetails = M3U8Parser.parseLevelPlaylist(content, url, 0, 'main');

    streamInfo_ = new PeriodInfo();
    streamInfo_.duration = track.levelDetails.totalduration;
    streamInfo_.tracks.push(track);

    eventBus_.trigger(Events.MANIFEST_PARSED, streamInfo_);
  }

  // public functions
  function getType() {
    return 'hls';
  }

  function getNextFragment() {
    for (let i = 0; i < streamInfo_.tracks.length; i++) {
      let trackInfo = streamInfo_.tracks[i];
      if (trackInfo.type === 'stream') {
        // get initSegment first
        if (trackInfo.levelDetails.initSegment && !trackInfo.levelDetails.initSegment.data) {
          fragCurrent_ = trackInfo.levelDetails.initSegment;
        } else {
          if (currentSN_ === trackInfo.levelDetails.fragments.length) {
            fragCurrent_ = null;
          } else {
            fragCurrent_ = trackInfo.levelDetails.fragments[currentSN_];
            currentSN_++;
          }
        }
        break;
      }
    }

    return fragCurrent_;
  }

  let instance_ = {
    getType: getType,
    getNextFragment: getNextFragment
  };
  setup();
  return instance_;
}

HlsParser.__h5player_factory_name = 'HlsParser';
export default FactoryMaker.getSingletonFactory(HlsParser);