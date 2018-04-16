import FactoryMaker from '../core/FactoryMaker';
import Events from '../core/CoreEvents';
import EventBus from '../core/EventBus';
import Debug from '../core/Debug';
import XHRLoader from '../utils/xhr_loader';
import X2JS from '../externals/xml2json';
import StringUtils from '../utils/string_utils';
import {
    replaceIDForTemplate,
    replaceTokenForTemplate
} from './utils/SegmentsUtils';
import StringMatcher from './parser/matchers/StringMatcher';
import DurationMatcher from './parser/matchers/DurationMatcher';
import DateTimeMatcher from './parser/matchers/DateTimeMatcher';
import NumericMatcher from './parser/matchers/NumericMatcher';

import { Fragment, TrackInfo, StreamInfo } from '../common/common';

function DashParser() {
    let context_ = this.context;

    let debug_ = Debug(context_).getInstance();
    let eventBus_ = EventBus(context_).getInstance();
    let xhrLoader_ = XHRLoader(context_).create();
    // parser reference variable
    let matchers_;
    let converter_;

    // Begin dash manifest info
    let streamInfo_;
    let aRep_;
    // End dash manifest info

    let manifestUrl_;

    // flag
    let fragCurrent_;
    let videoHeaderAdded_ = false;
    let vSegmentNumber_ = 0;

    let audioHeaderAdded_ = false;
    let audioIndex_ = 0;

    function setup() {
        matchers_ = [
            new DurationMatcher(),
            new DateTimeMatcher(),
            new NumericMatcher(),
            new StringMatcher()   // last in list to take precedence over NumericMatcher
        ];

        converter_ = new X2JS({
            escapeMode:         false,
            attributePrefix:    '',
            arrayAccessForm:    'property',
            emptyNodeForm:      'object',
            stripWhitespaces:   false,
            enableToStringFunc: false,
            ignoreRoot:         true,
            matchers:           matchers_
        });

        //
        eventBus_.on(Events.FRAGMENT_DOWNLOADED, onFragmentDownloaded);
    }

    function getRepresentation(manifest) {
        function getSegmentDuration(segmentTemplate) {
            let duration = segmentTemplate.duration;
            if (segmentTemplate.timescale) {
                duration = segmentTemplate.duration / segmentTemplate.timescale;
            }

            return duration;
        }
        //
        let mediaPresentationDuration = manifest.mediaPresentationDuration;

        // push video track to stream(support video only now)
        let track = new TrackInfo();
        track.type = 'video';

        let period = manifest.Period_asArray[0];
        let adaptationSet = period.AdaptationSet_asArray[0];
        track.rep = adaptationSet.Representation_asArray[0];

        let segmentTemplate = adaptationSet.SegmentTemplate;
        track.segmentTemplate = adaptationSet.SegmentTemplate;
        let cnt = mediaPresentationDuration / getSegmentDuration(segmentTemplate);
        let remainder = mediaPresentationDuration % getSegmentDuration(segmentTemplate);
        track.segmentCnt = cnt + (remainder > 0 ? 1 : 0);

        vSegmentNumber_ = parseInt(segmentTemplate.startNumber);

        streamInfo_ = new StreamInfo();
        streamInfo_.duration = mediaPresentationDuration;
        streamInfo_.tracks.push(track);
    }

    function loadManifest(url) {
        manifestUrl_ = url;

        videoHeaderAdded_ = false;
        vSegmentNumber_ = 0;
        audioHeaderAdded_ = false;
        audioIndex_ = 0;

        function cbSuccess(bytes) {
            let content = StringUtils.ab2str_v1(bytes);
            debug_.log('content: ' + content);

            let manifest = converter_.xml_str2json(content);
            getRepresentation(manifest);

            eventBus_.trigger(Events.MANIFEST_PARSED);

            eventBus_.trigger(Events.STREAM_LOADED, streamInfo_);
        }

        let request = {
            url: manifestUrl_,
            cbSuccess: cbSuccess
        };

        xhrLoader_.load(request);
    }

    function getFragmentInitialization(track) {
        let initialization = replaceIDForTemplate(track.segmentTemplate.initialization, track.rep.id);

        let url = require('url');
        return url.resolve(manifestUrl_, initialization);
    }

    function getFragmentMedia(track, number) {
        let media = replaceTokenForTemplate(track.segmentTemplate.media, 'Number', number);
        media = replaceIDForTemplate(media, track.rep.id);

        let url = require('url');
        return url.resolve(manifestUrl_, media);
    }

    function getNextFragment() {
        fragCurrent_ = new Fragment();

        for (let i = 0; i < streamInfo_.tracks.length; i ++) {
            let trackInfo = streamInfo_.tracks[i];
            if (trackInfo.type === 'video') {
                fragCurrent_.type = trackInfo.type;

                if (videoHeaderAdded_ === false) {
                    fragCurrent_.url = getFragmentInitialization(trackInfo);
                    fragCurrent_.content = 'initSegment';
                    videoHeaderAdded_ = true;
                } else {
                    if (vSegmentNumber_ < trackInfo.segmentCnt) {
                        fragCurrent_.url = getFragmentMedia(trackInfo, vSegmentNumber_);
                        fragCurrent_.content = 'data';
                        vSegmentNumber_++;
                    } else {
                        fragCurrent_ = null;
                    }
                }

                break;
            }
        }

        return fragCurrent_;
    }

    function onFragmentDownloaded(e) {
        if (e.content === 'initSegment') {
            let track = findTrackInfo('video');
            //
            let tracks = {};
            tracks.video = {};
            tracks.video.container = 'video/mp4';
            tracks.video.codec = track.rep.codecs;
            eventBus_.trigger(Events.BUFFER_CODEC, tracks);
            //
            eventBus_.trigger(Events.BUFFER_APPENDING, {type: e.type, content: e.content, data: e.data});
        } else if (e.content === 'data') {
            eventBus_.trigger(Events.BUFFER_APPENDING, {type: e.type, content: e.content, data: e.data});
        }
    }

    function findTrackInfo(type) {
        let ret = null;
        for (let i = 0; i < streamInfo_.tracks.length; i ++) {
            let track = streamInfo_.tracks[i];
            if (track.type === type) {
                ret = track;
                break;
            }
        }

        return ret;
    }

    let instance_ = {
        loadManifest: loadManifest,
        getNextFragment: getNextFragment
    };
    setup();
    return instance_;
}

DashParser.__h5player_factory_name = 'DashParser';
export default FactoryMaker.getSingletonFactory(DashParser);
