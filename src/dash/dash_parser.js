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
    let xhrLoader_ = XHRLoader(context_).create();
    // parser reference variable
    let matchers_;
    let converter_;

    // Begin dash manifest info
    let mediaPresentationDuration_;
    let vRep_;
    let aRep_;
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
        vRep_ = adaptationSet.Representation_asArray[0];
        let segmentTemplate = adaptationSet.SegmentTemplate;

        //
        mediaPresentationDuration_ = manifest.mediaPresentationDuration;

        vRep_.type = 'video';
        vRep_.codecs = 'video/mp4; ' + 'codecs=\"' + vRep_.codecs + '\"';
        vRep_.duration = manifest.mediaPresentationDuration;
        vRep_.segmentTemplate = segmentTemplate;
        let cnt = mediaPresentationDuration_ / getSegmentDuration(segmentTemplate);
        let remainder = mediaPresentationDuration_ % getSegmentDuration(segmentTemplate);
        vRep_.segmentCnt = cnt + (remainder > 0 ? 1 : 0);

        vSegmentNumber_ = parseInt(segmentTemplate.startNumber);
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

            eventBus_.trigger(Events.MANIFEST_PARSED, {aRep: null, vRep: vRep_});
        }

        let request = {
            url: manifestUrl_,
            cbSuccess: cbSuccess
        };

        xhrLoader_.load(request);
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

        if (vRep_ && aRep_) {
            do {
                // init segments
                if (videoHeaderAdded_ === false) {
                    ret.type = vRep_.type;
                    ret.url = getFragmentInitialization(vRep_);
                    videoHeaderAdded_ = true;
                    break;
                }
                if (audioHeaderAdded_ === false) {
                    ret.type = aRep_.type;
                    ret.url = getFragmentInitialization(aRep_);
                    audioHeaderAdded_ = true;
                    break;
                }

                // media segments
                if (vSegmentNumber_ >= vRep_.media.length ||
                    audioIndex_ >= aRep_.media.length) {
                    ret = null;
                } else {
                    if (vSegmentNumber_ > audioIndex_) {
                        if (audioIndex_ < aRep_.segmentCnt) {
                            ret.type = aRep_.type;
                            ret.url = getFragmentMedia(aRep_, audioIndex_);
                            audioIndex_++;
                        }
                    } else {
                        if (vSegmentNumber_ < vRep_.segmentCnt) {
                            ret.type = vRep_.type;
                            ret.url = getFragmentMedia(vRep_, vSegmentNumber_);
                            vSegmentNumber_++;
                        }
                    }
                }
            } while (false);
        } else {
            if (vRep_) {
                ret.type = vRep_.type;

                if (videoHeaderAdded_ === false) {
                    ret.url = getFragmentInitialization(vRep_);
                    videoHeaderAdded_ = true;
                } else {
                    if (vSegmentNumber_ < vRep_.segmentCnt) {
                        ret.url = getFragmentMedia(vRep_, vSegmentNumber_);
                        vSegmentNumber_++;
                    } else {
                        ret = null;
                    }
                }
            } else if (aRep_) {
                ret.type = aRep_.type;

                if (audioHeaderAdded_ === false) {
                    ret.url = getFragmentInitialization(aRep_);
                    audioHeaderAdded_ = true;
                } else {
                    if (audioIndex_ < aRep_.segmentCnt) {
                        ret.url = getFragmentMedia(aRep_, audioIndex_);
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
