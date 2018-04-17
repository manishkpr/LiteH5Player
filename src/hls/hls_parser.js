import FactoryMaker from '../core/FactoryMaker';
import Events from '../core/CoreEvents';
import EventBus from '../core/EventBus';
import Debug from '../core/Debug';
import XHRLoader from '../utils/xhr_loader';
import StringUtils from '../utils/string_utils';

import {Fragment, TrackInfo, StreamInfo} from '../common/common';

import M3U8Parser from './hlsjs/src/loader/m3u8-parser';
import Demuxer from './hlsjs/src/demux/demuxer';
import { hlsDefaultConfig } from './hlsjs/src/config';

function HlsParser() {
    let context_ = this.context;

    let debug_ = Debug(context_).getInstance();
    let eventBus_ = EventBus(context_).getInstance();
    let xhrLoader_ = XHRLoader(context_).create();

    let manifestUrl_;
    let streamInfo_;

    // hls
    let hls_;
    let demuxer_;
    let currentSN_;
    let fragCurrent_;

    function setup() {
        eventBus_.on(Events.FRAGMENT_DOWNLOADED, onFragmentDownloaded);

        eventBus_.on(Events.HLS_INIT_PTS_FOUND, onHlsInitPtsFound, {});
        eventBus_.on(Events.HLS_FRAG_PARSING_INIT_SEGMENT, onHlsFragParsingInitSegment, {});
        eventBus_.on(Events.HLS_FRAG_PARSING_DATA, onHlsParsingData, {});
    }

    function onFragmentDownloaded(e) {
        demuxer_.push(e.data, undefined, undefined, undefined, e.frag, streamInfo_.duration, true, undefined);
    }

    function onHlsInitPtsFound(e) {
        let a = 2;
        let b = a;
    }

    function onHlsFragParsingInitSegment(e) {
        eventBus_.trigger(Events.BUFFER_CODEC, e.tracks);

        for (let trackName in e.tracks) {
            let track = e.tracks[trackName];
            let initSegment = track.initSegment;
            if (initSegment) {
                eventBus_.trigger(Events.BUFFER_APPENDING, {type: trackName, content: 'initSegment', data: initSegment});
            }
        }
    }

    function onHlsParsingData(e) {
        eventBus_.trigger(Events.BUFFER_APPENDING, {type: e.type, content: 'data', data: e.data1});
        eventBus_.trigger(Events.BUFFER_APPENDING, {type: e.type, content: 'data', data: e.data2});
    }

    function loadManifest(url) {
        function cbSuccess(bytes) {
            let content = StringUtils.ab2str_v1(bytes);
            debug_.log('content: ' + content);

            currentSN_ = 0;

            let track = new TrackInfo();
            track.type = 'stream';
            track.levelDetails = M3U8Parser.parseLevelPlaylist(content, manifestUrl_, 0, 'main');
            
            streamInfo_ = new StreamInfo();
            streamInfo_.duration = track.levelDetails.totalduration;
            streamInfo_.tracks.push(track);

            //
            hls_ = eventBus_;
            hls_.config = hlsDefaultConfig;
            demuxer_ = new Demuxer(hls_, 'main');

            eventBus_.trigger(Events.MANIFEST_PARSED);
            eventBus_.trigger(Events.STREAM_LOADED, streamInfo_);
        }

        manifestUrl_ = url;
        let request = {
            url: manifestUrl_,
            cbSuccess: cbSuccess
        };

        xhrLoader_.load(request);
    }

    function getNextFragment() {
        fragCurrent_ = new Fragment();

        for (let i = 0; i < streamInfo_.tracks.length; i ++) {
            let trackInfo = streamInfo_.tracks[i];
            if (trackInfo.type === 'stream') {
                if (currentSN_ === trackInfo.levelDetails.fragments.length) {
                    fragCurrent_ = null;
                } else {
                    let frag = trackInfo.levelDetails.fragments[currentSN_];
                    currentSN_ ++;
                    fragCurrent_.type = 'stream';
                    fragCurrent_.url = frag.url;
                    fragCurrent_.content = 'tsContent';
                    fragCurrent_.frag = frag;
                    fragCurrent_.byteRangeStartOffset = frag.byteRangeStartOffset;
                    fragCurrent_.byteRangeEndOffset = frag.byteRangeEndOffset;
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
