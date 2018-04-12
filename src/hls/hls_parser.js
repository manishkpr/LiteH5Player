import FactoryMaker from '../core/FactoryMaker';
import Events from '../core/CoreEvents';
import EventBus from '../core/EventBus';
import Debug from '../core/Debug';
import XHRLoader from '../utils/xhr_loader';
import StringUtils from '../utils/string_utils';

import M3U8Parser from './loader/m3u8-parser';
import Demuxer from './demux/demuxer';
import { hlsDefaultConfig } from './config';

function HlsParser() {
    let context_ = this.context;
    let debug_ = Debug(context_).getInstance();
    let eventBus_ = EventBus(context_).getInstance();
    let xhrLoader_ = XHRLoader(context_).create();
    
    let manifestUrl_;
    let mediaPresentationDuration_;
    let vRep_;
    let activeStream_;

    // hls
    let hls_;
    let demuxer_;
    let currentSN_;
    let fragCurrent_;
    let levelDetails_;

    function setup() {
        eventBus_.on(Events.HLS_INIT_PTS_FOUND, onHlsInitPtsFound, {});
        eventBus_.on(Events.HLS_FRAG_PARSING_INIT_SEGMENT, onHlsFragParsingInitSegment, {});
        eventBus_.on(Events.HLS_FRAG_PARSING_DATA, onHlsParsingData, {});
    }

    function onHlsInitPtsFound(e) {
        let a = 2;
        let b = a;
    }

    function onHlsFragParsingInitSegment(e) {
        //vRep_.codecs = 'video/mp4; ' + 'codecs=\"' + vRep_.codecs + '\"';
        // vRep_.type = 'video';
        // vRep_.codecs = 'video/mp4; ' + 'codecs=\"' + e.tracks.video.codec + '\"';
        //eventBus_.trigger(Events.MANIFEST_PARSED, { aRep: null, vRep: });


        let a = 2;
        let b = a;
    }

    function onHlsParsingData(e) {
        let a = 2;
        let b = a;
    }

    function loadManifest(url) {
        function cbSuccess(bytes) {
            let content = StringUtils.ab2str_v1(bytes);
            debug_.log('content: ' + content);

            currentSN_ = 0;
            levelDetails_ = M3U8Parser.parseLevelPlaylist(content, manifestUrl_, 0, 'main');

            mediaPresentationDuration_ = levelDetails_.duration;

            hls_ = eventBus_;
            hls_.config = hlsDefaultConfig;
            demuxer_ = new Demuxer(hls_, 'main');
        }

        manifestUrl_ = url;
        let request = {
            url: manifestUrl_,
            cbSuccess: cbSuccess
        };

        xhrLoader_.load(request);
    }

    function getNextFragment() {
        fragCurrent_ = levelDetails_.fragments[currentSN_];
        currentSN_ ++;
        function cbSuccess(bytes) {
            demuxer_.push(bytes, undefined, undefined, undefined, fragCurrent_, levelDetails_.duration, true, undefined);

            let a = 2;
            let b = a;
            // push(data.payload, initSegmentData, audioCodec, currentLevel.videoCodec, fragCurrent, duration, accurateTimeOffset, undefined);
            // push(data, initSegment, audioCodec, videoCodec, frag, duration, accurateTimeOffset, defaultInitPTS) {
        }

        let request = {
            url: fragCurrent_.url,
            cbSuccess: cbSuccess
        };
        
        printLog('request url: ' + request.url);
        xhrLoader_.load(request);
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
