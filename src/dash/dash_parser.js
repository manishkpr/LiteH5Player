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

function DashParser() {
    let context_ = this.context;

    let debug_ = Debug(context_).getInstance();
    let eventBus_ = EventBus(context_).getInstance();
    let xhrLoader_ = XHRLoader(context_).getInstance();
    // parser reference variable
    let matchers_;
    let converter_;

    // Begin dash manifest info
    let mediaPresentationDuration_;
    let activeStream_;
    // End dash manifest info

    let manifestUrl_;

    // flag
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
    }

    function getRepresentation(manifest) {
        function getSegmentDuration(segmentTemplate) {
            let duration = segmentTemplate.duration;
            if (segmentTemplate.timescale) {
                duration = segmentTemplate.duration / segmentTemplate.timescale;
            }

            return duration;
        }

        let period = manifest.Period_asArray[0];
        let adaptationSet = period.AdaptationSet_asArray[0];
        let representation = adaptationSet.Representation_asArray[0];
        let segmentTemplate = adaptationSet.SegmentTemplate;

        //
        mediaPresentationDuration_ = manifest.mediaPresentationDuration;

        representation.type = 'video';
        representation.codecs = 'video/mp4; ' + 'codecs=\"' + representation.codecs + '\"';
        representation.duration = manifest.mediaPresentationDuration;
        representation.segmentTemplate = segmentTemplate;
        representation.segmentCnt = mediaPresentationDuration_ / getSegmentDuration(segmentTemplate);

        vSegmentNumber_ = parseInt(segmentTemplate.startNumber);
// For reference
// Representation
// bandwidth:3134488
// codecs:"avc1.64001f"
// frameRate:30
// height:576
// id:"bbb_30fps_1024x576_2500k"
// sar:"1:1"
// scanType:"progressive"
// width:1024

// SegmentTemplate
// duration:120
// initialization:"$RepresentationID$/$RepresentationID$_0.m4v"
// media:"$RepresentationID$/$RepresentationID$_$Number$.m4v"
// startNumber:1
// timescale:30
        activeStream_ = {
            aRep: null,
            vRep: representation
        };

        eventBus_.trigger(Events.MANIFEST_PARSED, activeStream_);
    }

    function audio_only_case01() {
        let aRep = null;

        // construct dash audio
        let aContents = [];
        for (let i = 1; i <= 15; i++) {
            let content = 'http://10.2.68.64/2/dash/features/av_nonmuxed/A48/' + i.toString() + '.m4s';
            aContents.push(content);
        }

        aRep = {
            type: 'audio',
            codecs: 'audio/mp4; codecs="mp4a.40.2"',
            initialization: 'http://10.2.68.64/2/dash/features/av_nonmuxed/A48/init.mp4',
            media: aContents
        };

        activeStream_ = {
            aRep: aRep,
            vRep: null
        };

        return activeStream_;
    }

    function video_only_case01() {
        let vRep = null;
        let vContents = [];
        for (let i = 1; i <= 15; i++) {
            let content = 'http://10.2.68.64/2/dash/features/av_nonmuxed/V300_with_cc1_and_cc3/' + i.toString() + '.m4s';
            vContents.push(content);
        }
        vRep = {
            type: 'video',
            codecs: 'video/mp4; codecs="avc1.64001e"',
            initialization: 'http://10.2.68.64/2/dash/features/av_nonmuxed/V300_with_cc1_and_cc3/init.mp4',
            media: vContents
        };

        activeStream_ = {
            aRep: null,
            vRep: vRep
        };

        return activeStream_;
    }

    function case01() {
        let aRep = null;
        let vRep = null;

        // construct dash audio
        let aContents = [];
        for (let i = 1; i <= 15; i++) {
            let content = 'http://10.2.68.64/2/dash/features/av_nonmuxed/A48/' + i.toString() + '.m4s';
            aContents.push(content);
        }

        aRep = {
            type: 'audio',
            codecs: 'audio/mp4; codecs="mp4a.40.2"',
            initialization: 'http://10.2.68.64/2/dash/features/av_nonmuxed/A48/init.mp4',
            media: aContents
        };

        // construct dash video
        let vContents = [];
        for (let i = 1; i <= 15; i++) {
            let content = 'http://10.2.68.64/2/dash/features/av_nonmuxed/V300_with_cc1_and_cc3/' + i.toString() + '.m4s';
            vContents.push(content);
        }
        vRep = {
            type: 'video',
            codecs: 'video/mp4; codecs="avc1.64001e"',
            initialization: 'http://10.2.68.64/2/dash/features/av_nonmuxed/V300_with_cc1_and_cc3/init.mp4',
            media: vContents
        };

        activeStream_ = {
            aRep: aRep,
            vRep: vRep
        };

        return activeStream_;
    }

    function case02() {
        // the video contains audio
        let aRep = null;
        let vRep = null;
        let vContents = [];
        for (let i = 1; i <= 6; i++) {
            let content = 'http://10.2.68.64/2/pd/fmp4/microsoft_sample/segment_file' + i.toString() + '.m4s';
            vContents.push(content);
        }
        vRep = {
            type: 'video',
            codecs: 'video/mp4; codecs="mp4a.40.2, avc1.64001e"',
            initialization: 'http://10.2.68.64/2/pd/fmp4/microsoft_sample/segment_fileinit.mp4',
            media: vContents
        };

        activeStream_ = {
            vRep: vRep,
            aRep: null,
            mediaPresentationDuration: 176
        };

        return activeStream_;
    }

    function case03() {
        let aRep = null;
        let vRep = null;

        let cnt = 20;
        
        // construct dash audio
        let aContents = [];
        for (let i = 0; i <= cnt; i++) {
            let content = 'http://10.2.68.64/2/dash/undoc/test2_main_index/Audio1/' + i.toString() + '.m4s';
            aContents.push(content);
        }

        aRep = {
            type: 'audio',
            codecs: 'audio/mp4; codecs="mp4a.40.29"',
            initialization: 'http://10.2.68.64/2/dash/undoc/test2_main_index/Audio1/Header.m4s',
            media: aContents
        };

        // construct dash video
        let vContents = [];
        for (let i = 0; i <= cnt; i++) {
            let content = 'http://10.2.68.64/2/dash/undoc/test2_main_index/Video1/' + i.toString() + '.m4s';
            vContents.push(content);
        }
        vRep = {
            type: 'video',
            codecs: 'video/mp4; codecs="avc1.4D4029"',
            initialization: 'http://10.2.68.64/2/dash/undoc/test2_main_index/Video1/Header.m4s',
            media: vContents
        };

        activeStream_ = {
            aRep: aRep,
            vRep: vRep,
            mediaPresentationDuration: 290 // manifest max duration
        };

        return activeStream_;
    }

    function live01() {
        let vRep = null;
        let vContents = [];
        for (let i = 484; i <= 503; i++) {
            let content = 'http://10.2.68.64/2/live/01/760507' + i.toString() + '.m4s';
            vContents.push(content);
        }
        vRep = {
            type: 'video',
            codecs: 'video/mp4; codecs="avc1.64001e"',
            initialization: 'http://10.2.68.64/2/live/01/init.mp4',
            media: vContents
        };

        activeStream_ = {
            aRep: null,
            vRep: vRep,
            mediaPresentationDuration: 1521014975
        };

        return activeStream_;
    }

    function loadManifest(url) {
        manifestUrl_ = url;

        videoHeaderAdded_ = false;
        vSegmentNumber_ = 0;
        audioHeaderAdded_ = false;
        audioIndex_ = 0;

        // new
        function cbSuccess(bytes) {
            let content = StringUtils.ab2str_v1(bytes);
            debug_.log('content: ' + content);

            let manifest = converter_.xml_str2json(content);
            getRepresentation(manifest);
        }

        let request = {
            url: manifestUrl_, // 'http://localhost/2/dash/common/h5-test.mpd'
            cbSuccess: cbSuccess
        };

        xhrLoader_.load(request);

        return;

        // old
        if (url.indexOf('audio_only_case01') !== -1) {
            return audio_only_case01();
        } else if (url.indexOf('video_only_case01') !== -1) {
            return video_only_case01();
        } else if (url.indexOf('case01') !== -1) {
            return case01();
        } else if (url.indexOf('case02') !== -1) {
            return case02();
        } else if (url.indexOf('case03') !== -1) {
            return case03();
        }
        // live samples
        else if (url.indexOf('live01') !== -1) {
            return live01();
        }
    }

    function getFragmentInitialization(rep) {
        let initialization = replaceIDForTemplate(rep.segmentTemplate.initialization, rep.id);

        let url = require('url');
        return url.resolve(manifestUrl_, initialization);
    }

    function getFragmentMedia(rep, number) {
        let media = replaceTokenForTemplate(rep.segmentTemplate.media, 'Number', number);
        media = replaceIDForTemplate(media, rep.id);

        let url = require('url');
        return url.resolve(manifestUrl_, media);
    }

    function getNextFragment() {
        let ret = {};

        if (activeStream_.vRep && activeStream_.aRep) {
            do {
                // init segments
                if (videoHeaderAdded_ === false) {
                    ret.type = activeStream_.vRep.type;
                    ret.url = getFragmentInitialization(activeStream_.vRep);
                    videoHeaderAdded_ = true;
                    break;
                }
                if (audioHeaderAdded_ === false) {
                    ret.type = activeStream_.aRep.type;
                    ret.url = getFragmentInitialization(activeStream_.aRep);
                    audioHeaderAdded_ = true;
                    break;
                }

                // BD
                if (vSegmentNumber_ < 1) {
                    ret.type = activeStream_.vRep.type;
                    ret.url = getFragmentMedia(activeStream_.vRep, vSegmentNumber_);
                    vSegmentNumber_++;
                    break;
                }
                // ED

                // media segments
                if (vSegmentNumber_ >= activeStream_.vRep.media.length ||
                    audioIndex_ >= activeStream_.aRep.media.length) {
                    ret = null;
                } else {
                    if (vSegmentNumber_ > audioIndex_) {
                        if (audioIndex_ < activeStream_.aRep.segmentCnt) {
                            ret.type = activeStream_.aRep.type;
                            ret.url = getFragmentMedia(activeStream_.aRep, audioIndex_);
                            audioIndex_++;
                        }
                    } else {
                        if (vSegmentNumber_ < activeStream_.vRep.segmentCnt) {
                            ret.type = activeStream_.vRep.type;
                            ret.url = getFragmentMedia(activeStream_.vRep, vSegmentNumber_);
                            vSegmentNumber_++;
                        }
                    }
                }
            } while (false);
        } else {
            if (activeStream_.vRep) {
                ret.type = activeStream_.vRep.type;

                if (videoHeaderAdded_ === false) {
                    ret.url = getFragmentInitialization(activeStream_.vRep);
                    videoHeaderAdded_ = true;
                } else {
                    if (vSegmentNumber_ < activeStream_.vRep.segmentCnt) {
                        ret.url = getFragmentMedia(activeStream_.vRep, vSegmentNumber_);
                        vSegmentNumber_++;
                    } else {
                        ret = null;
                    }
                }
            } else if (activeStream_.aRep) {
                ret.type = activeStream_.aRep.type;

                if (audioHeaderAdded_ === false) {
                    ret.url = getFragmentInitialization(activeStream_.aRep);
                    audioHeaderAdded_ = true;
                } else {
                    if (audioIndex_ < activeStream_.aRep.segmentCnt) {
                        ret.url = getFragmentMedia(activeStream_.aRep, audioIndex_);
                        audioIndex_++;
                    } else {
                        ret = null;
                    }
                }
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
