import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/events';
import Debug from '../core/Debug';

import commonUtil from '../utils/common_utils';

// 20180705
// 
let Cue = window.WebKitDataCue || window.VTTCue || window.TextTrackCue;

function TextTrackController() {
  let context_ = this.context;

  let media_ = context_.media;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let currTrackId_ = '';
  let textTracks_ = [];

  function setup() {
    eventBus_.on(Events.TRACK_LOADED, onTextTrackLoaded);
  }

  function onTextTrackLoaded(e) {
    let cueData = e.cueData;
    let kind = e.kind;
    let label = e.label;
    var textTrack = media_.addTextTrack(kind, label, label);
    textTrack.mode = 'hidden';
    let trackId = (media_.textTracks.length - 1).toString();

    for (let i = 0; i < cueData.length; i++) {
      let item = cueData[i];
      let data = {
        trackId: trackId,
        start: item.start,
        end: item.end,
        text: item.data,
      }

      let cue = createCue(data);
      textTrack.addCue(cue);
    }

    let track = {
      id: trackId,
      lang: e.label,
      label: e.label
    };
    textTracks_.push(track);

    // set default
    if (currTrackId_ === '') {
      if (trackId === '0') {
        currTrackId_ = trackId;
        textTrack.mode = 'showing';
      }
    }

    // Trigger text track found event.
    eventBus_.trigger(Events.TRACK_ADDED, { track: track, currTrackId: currTrackId_ });
  }

  function createCue(data) {
    function findTrackById(id) {
      let ret;
      for (let i = 0; i < media_.textTracks.length; i ++) {
        let track = media_.textTracks[i];
        if (id === i.toString()) {
          ret = track;
        }
      }
      return ret;
    }

    let cue = new Cue(data.start, data.end, '');
    cue.data = data;
    // FIXME: Need to hide ttml render if you want to hide a texttrack while a cue is showing.
    // IDEA: Create a series of div for each text track.
    cue.onenter = function() {
      let track = findTrackById(cue.data.trackId);

      if (track.mode === 'showing') {
        let data = this.data;
        console.log(`onenter, [${data.start}, ${data.end}] = ${data.text}`);
        eventBus_.trigger(Events.CUE_START, {cue: data});
      }
    };
    cue.onexit = function() {
      let track = findTrackById(cue.data.trackId);
      if (track.mode === 'showing') {
        let data = this.data;
        console.log(`onexit, [${data.start}, ${data.end}] = ${data.text}`);
        eventBus_.trigger(Events.CUE_END, {cue: data});
      }
    };

    return cue;
  }

  function addTextTrack() {
    // method1
    // textTrack_ = media_.addTextTrack('subtitles', 'English', 'eng');
    // textTrack_.mode = 'showing';
    // for (let i = 0; i < 60; i++) {
    //   let data = {
    //     start: i,
    //     end: i + 1,
    //     text: 'current time: ' + i.toString()
    //   }
    //   let cue = createCue(data);
    //   textTrack_.addCue(cue);
    // }

    //// method2
    //let textTrack = document.createElement('track');
    //textTrack.kind = 'subtitle';
    //textTrack.label = 'English';
    //textTrack.srclang = 'eng';
    //media.appendChild(textTrack);

    //textTrack = media.textTracks[0];
    //textTrack.mode = 'showing';

    // // BD
    // console.log('begin add first cue');
    // let cue = new Cue(10, 15, 'This is a placeholder text');
    // textTrack.addCue(cue);
    // console.log('after add first cue');

    // clearCurrentCues(textTrack);

    // console.log('begin add second cue');
    // let cue1 = new Cue(0, 12, 'This is a placeholder text1');
    // textTrack.addCue(cue1);
    // console.log('after add second cue');

    // let a = 2;
    // let b = a;
    // ED

    return;

    //
    // let cue = new Cue(0, 100, 'This is a placeholder text');
    // textTrack.addCue(cue);

    // for (let i = 0; i <= 10; i ++) {
    //  let cue = new Cue(i, i+1, 'current time: ' + i.toString());

    //// test1
    //let n = 5;
    //if (i % n == 0) {
    //  cue.align = "start"; 
    //} else if (i % n == 1) {
    //  cue.align = "center";
    //} else if (i % n == 2) {
    //  cue.align = "end";
    //} else if (i % n == 3) {
    //  cue.align = "left";
    //} else if (i % n == 4) {
    //  cue.align = "right";
    //}

    // test2, text在哪一行
    //cue.lineAlign = "start";
    //cue.line = i;

    // test3
    //cue.positionAlign = "start";
    //cue.position = i*10;

    // chrome
    //cue.align = "start";
    //cue.line = 0;
    //cue.lineAlign = "start";
    //cue.position = "auto";
    //cue.size = 100;
    //cue.snapToLines = false;

    // firefox47
    //cue.align = "start";
    //cue.line = 0;
    //cue.lineAlign = "start";
    //cue.position = 10;
    //cue.positionAlign = "end";
    //cue.size = 100;
    //cue.snapToLines = false;

    // firefox53
    //cue.position = 'auto';
    //cue.positionAlign = 'center';

    //  textTrack.addCue(cue);
    //}
  }

  /**
   * @description Retuns undefined if current don't select any text track.
   */
  function getCurrentSubtitleTrack() {
    let currTrack;
    for (let i = 0; i < textTracks_.length; i ++) {
      let track = textTracks_[i];
      if (track.id === currTrackId_) {
        currTrack = track;
      }
    }
    return currTrack;
  }

  function selectSubtitleTrack(id) {
    for (let i = 0; i < media_.textTracks.length; i ++) {
      let track = media_.textTracks[i];
      if (i.toString() === id) {
        track.mode = 'showing';
      } else {
        track.mode = 'hidden';
      }
    }

    currTrackId_ = id;
  }

  let instance = {
    getCurrentSubtitleTrack: getCurrentSubtitleTrack,
    selectSubtitleTrack: selectSubtitleTrack
  };

  setup();

  return instance;
}

TextTrackController.__h5player_factory_name = 'TextTrackController';
export default FactoryMaker.getSingletonFactory(TextTrackController);





