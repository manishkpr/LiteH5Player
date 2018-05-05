import FactoryMaker from '../core/FactoryMaker';
import Events from '../core/CoreEvents';
import EventBus from '../core/EventBus';
import Debug from '../core/Debug';
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

  let debug_ = Debug(context_).getInstance();
  let eventBus_ = EventBus(context_).getInstance();
  let xhrLoader_ = context_.loader(context_).create();

  let manifestUrl_;
  let streamInfo_;

  // hls
  let currentSN_;
  let fragCurrent_;

  function setup() {
  }

  function loadManifest(url) {
    function onSuccess(bytes) {
      let content = StringUtils.ab2str_v1(bytes);
      debug_.log('content: ' + content);

      currentSN_ = 0;

      let track = new TrackInfo();
      track.type = 'stream';
      track.levelDetails = M3U8Parser.parseLevelPlaylist(content, manifestUrl_, 0, 'main');

      streamInfo_ = new StreamInfo();
      streamInfo_.duration = track.levelDetails.totalduration;
      streamInfo_.tracks.push(track);

      eventBus_.trigger(Events.MANIFEST_PARSED);
      eventBus_.trigger(Events.STREAM_LOADED, streamInfo_);
    }

    manifestUrl_ = url;
    let request = {
      url: manifestUrl_
    };
    let callbacks = {
      onSuccess: onSuccess
    };

    xhrLoader_.load(request, null, callbacks);
  }

  function getNextFragment() {
    fragCurrent_ = new Fragment();
    fragCurrent_.type = 'stream';

    for (let i = 0; i < streamInfo_.tracks.length; i++) {
      let trackInfo = streamInfo_.tracks[i];
      if (trackInfo.type === 'stream') {
        // get initSegment first
        if (trackInfo.levelDetails.initSegment && !trackInfo.levelDetails.initSegment.data) {
          let frag = trackInfo.levelDetails.initSegment;
          fragCurrent_.url = frag.url;
          fragCurrent_.frag = trackInfo.levelDetails.initSegment;
        } else {
          if (currentSN_ === trackInfo.levelDetails.fragments.length) {
            fragCurrent_ = null;
          } else {
            let frag = trackInfo.levelDetails.fragments[currentSN_];
            currentSN_++;
            fragCurrent_.url = frag.url;
            fragCurrent_.frag = frag;
            fragCurrent_.byteRangeStartOffset = frag.byteRangeStartOffset;
            fragCurrent_.byteRangeEndOffset = frag.byteRangeEndOffset;
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