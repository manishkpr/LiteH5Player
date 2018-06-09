import FactoryMaker from '../core/FactoryMaker';
import Events from '../core/CoreEvents';
import EventBus from '../core/EventBus';
import Debug from '../core/Debug';

import StringUtils from '../utils/string_utils';

// Begin from Dashjs
import X2JS from './dashjs/externals/xml2json';
import {
  replaceIDForTemplate,
  replaceTokenForTemplate
} from './dashjs/src/dash/utils/SegmentsUtils';

import StringMatcher from './dashjs/src/dash/parser/matchers/StringMatcher';
import DurationMatcher from './dashjs/src/dash/parser/matchers/DurationMatcher';
import DateTimeMatcher from './dashjs/src/dash/parser/matchers/DateTimeMatcher';
import NumericMatcher from './dashjs/src/dash/parser/matchers/NumericMatcher';
// End from Dashjs

import {
  Fragment,
  TrackInfo,
  StreamInfo
} from '../common/common';

function DashParser() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let xhrLoader_ = context_.loader(context_).create();
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
  let aSegmentNumber_ = 0;

  let flagCurrSegmentType;

  function setup() {
    matchers_ = [
      new DurationMatcher(),
      new DateTimeMatcher(),
      new NumericMatcher(),
      new StringMatcher() // last in list to take precedence over NumericMatcher
    ];

    converter_ = new X2JS({
      escapeMode: false,
      attributePrefix: '',
      arrayAccessForm: 'property',
      emptyNodeForm: 'object',
      stripWhitespaces: false,
      enableToStringFunc: false,
      ignoreRoot: true,
      matchers: matchers_
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
    //
    let mediaPresentationDuration = manifest.mediaPresentationDuration;

    streamInfo_ = new StreamInfo();
    streamInfo_.duration = mediaPresentationDuration;

    let period = manifest.Period_asArray[0];
    for (let i = 0; i < period.AdaptationSet_asArray.length; i++) {
      let adaptationSet = period.AdaptationSet_asArray[i];
      let segmentTemplate = adaptationSet.SegmentTemplate;
      let representation = adaptationSet.Representation;

      let cnt = mediaPresentationDuration / getSegmentDuration(segmentTemplate);
      let remainder = mediaPresentationDuration % getSegmentDuration(segmentTemplate);

      let track = new TrackInfo();
      track.rep = adaptationSet.Representation;
      track.segmentTemplate = adaptationSet.SegmentTemplate;
      track.segmentCnt = parseInt(cnt) + (remainder > 0 ? 1 : 0);
      track.endNumber = track.segmentCnt + segmentTemplate.startNumber;
      //
      if (representation.mimeType.indexOf('video') !== -1) {
        track.type = 'video';
        vSegmentNumber_ = parseInt(segmentTemplate.startNumber);
      } else {
        track.type = 'audio';
        aSegmentNumber_ = parseInt(segmentTemplate.startNumber);
      }

      debug_.log(`${track.type} segment, start number:${segmentTemplate.startNumber}, cnt:${track.segmentCnt}`);

      streamInfo_.tracks.push(track);
    }

    flagCurrSegmentType = 'video';
  }

  function loadManifest(url) {
    manifestUrl_ = url;

    videoHeaderAdded_ = false;
    vSegmentNumber_ = 0;
    audioHeaderAdded_ = false;
    aSegmentNumber_ = 0;

    function onSuccess(bytes) {
      let content = StringUtils.ab2str_v1(bytes);
      debug_.log('content: ' + content);

      let manifest = converter_.xml_str2json(content);
      getRepresentation(manifest);

      eventBus_.trigger(Events.MANIFEST_PARSED);

      eventBus_.trigger(Events.STREAM_UPDATED, streamInfo_);

      // trigger buffer codec;
      let tracks = {};
      let vTrack = findTrackInfo('video');
      if (vTrack) {
        tracks.video = {};
        tracks.video.container = 'video/mp4';
        tracks.video.codec = vTrack.rep.codecs;
      }
      let aTrack = findTrackInfo('audio');
      if (aTrack) {
        tracks.audio = {};
        tracks.audio.container = 'audio/mp4';
        tracks.audio.codec = aTrack.rep.codecs;
      }

      eventBus_.trigger(Events.BUFFER_CODEC, tracks);
    }

    let request = {
      url: manifestUrl_
    };
    let callbacks = {
      onSuccess: onSuccess
    }

    xhrLoader_.load(request, null, callbacks);
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

  function getAudioFragment() {
    let frag = null;
    let audioTrack = findTrackInfo('audio');
    if (audioTrack) {
      if (audioHeaderAdded_ === false) {
        frag = new Fragment();
        frag.type = 'audio';
        frag.url = getFragmentInitialization(audioTrack);
        frag.content = 'initSegment';
        audioHeaderAdded_ = true;
      } else {
        if (aSegmentNumber_ < audioTrack.endNumber) {
          frag = new Fragment();
          frag.type = 'audio';
          frag.url = getFragmentMedia(audioTrack, aSegmentNumber_);
          frag.content = 'data';
          aSegmentNumber_++;
        } else {
          frag = null;
        }
      }
    }
    return frag;
  }

  function getVideoFragment() {
    let frag = null;
    let videoTrack = findTrackInfo('video');

    if (videoTrack) {
      if (videoHeaderAdded_ === false) {
        frag = new Fragment();
        frag.type = 'video';
        frag.url = getFragmentInitialization(videoTrack);
        frag.content = 'initSegment';
        videoHeaderAdded_ = true;
      } else {
        if (vSegmentNumber_ < videoTrack.endNumber) {
          frag = new Fragment();
          frag.type = 'video';
          frag.url = getFragmentMedia(videoTrack, vSegmentNumber_);
          frag.content = 'data';
          vSegmentNumber_++;
        } else {
          frag = null;
        }
      }
    }
    return frag;
  }

  function getNextFragment() {
    fragCurrent_ = null;
    do {
      if (flagCurrSegmentType === 'video') {
        fragCurrent_ = getVideoFragment();
        if (fragCurrent_) {
          flagCurrSegmentType = 'audio';
        } else {
          fragCurrent_ = getAudioFragment();
        }
      } else if (flagCurrSegmentType === 'audio') {
        fragCurrent_ = getAudioFragment();
        if (fragCurrent_) {
          flagCurrSegmentType = 'video';
        } else {
          fragCurrent_ = getVideoFragment();
        }
      }
    } while (false);

    return fragCurrent_;
  }

  function onFragmentDownloaded(e) {
    eventBus_.trigger(Events.BUFFER_APPENDING, {
      type: e.type,
      content: e.content,
      data: e.data
    });
  }

  function findTrackInfo(type) {
    let ret = null;
    for (let i = 0; i < streamInfo_.tracks.length; i++) {
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

