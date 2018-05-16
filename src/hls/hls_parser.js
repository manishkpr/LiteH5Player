import FactoryMaker from '../core/FactoryMaker';
import StringUtils from '../utils/string_utils';

import {
  Fragment,
  TrackInfo,
  StreamInfo
} from '../common/common';

import M3U8Parser from './hlsjs/src/loader/m3u8-parser';
import Demuxer from './hlsjs/src/demux/demuxer';
import {
  hlsDefaultConfig
} from './hlsjs/src/config';

function HlsParser() {
  let context_ = this.context;
  let debug_ = context_.debug
  let events_ = context_.events;
  let eventBus_ = context_.eventBus;

  let manifestUrl_;
  let streamInfo_;

  // hls
  let currentSN_;
  let fragCurrent_;

  function setup() {
    eventBus_.on(events_.MANIFEST_LOADED, onManifestLoaded);
  }

  function onManifestLoaded(data) {
    let content = StringUtils.ab2str_v1(data.bytes);
    debug_.log('content: ' + content);

    currentSN_ = 0;

    let track = new TrackInfo();
    track.type = 'stream';
    track.levelDetails = M3U8Parser.parseLevelPlaylist(content, manifestUrl_, 0, 'main');

    streamInfo_ = new StreamInfo();
    streamInfo_.duration = track.levelDetails.totalduration;
    streamInfo_.tracks.push(track);

    eventBus_.trigger(events_.MANIFEST_PARSED, streamInfo_);
  }

  function loadManifest(url) {
    manifestUrl_ = url;
    eventBus_.trigger(events_.MANIFEST_LOADING, { url: manifestUrl_ });
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
    loadManifest: loadManifest,
    getNextFragment: getNextFragment
  };
  setup();
  return instance_;
}

HlsParser.__h5player_factory_name = 'HlsParser';
export default FactoryMaker.getSingletonFactory(HlsParser);