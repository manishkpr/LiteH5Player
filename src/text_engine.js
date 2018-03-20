import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';

import commonUtil from './utils/common_utils';

function TextEngine()
{
 let instance;
 let media;
  
 function setup() {
   media = null;
 }

 function setMedia(param_media) {
   media = param_media;
 }

function clearCurrentCues(track) {
 if (track && track.cues) {
   while (track.cues.length > 0) {
     track.removeCue(track.cues[0]);
   }
 }
}

 function addTextTrack() {
   // method1
   let textTrack = media.addTextTrack('subtitles', 'English', 'eng');
   textTrack.mode = 'showing';
   //// method2
   //let textTrack = document.createElement('track');
   //textTrack.kind = 'subtitle';
   //textTrack.label = 'English';
   //textTrack.srclang = 'eng';
   //media.appendChild(textTrack);

   //textTrack = media.textTracks[0];
   //textTrack.mode = 'showing';

   // BD
   console.log('begin add first cue');
   let cue = new Cue(10, 15, 'This is a placeholder text');
   textTrack.addCue(cue);
   console.log('after add first cue');

   clearCurrentCues(textTrack);
    
   console.log('begin add second cue');
   let cue1 = new Cue(0, 12, 'This is a placeholder text1');
   textTrack.addCue(cue1);
   console.log('after add second cue');

   let a=2;
   let b=a;
   // ED

   return;

   //
   // let cue = new Cue(0, 100, 'This is a placeholder text');
   // textTrack.addCue(cue);

   //for (let i = 0; i <= 10; i ++) {
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

 function setTextTrackHidden() {
   const inUseTracks = media ? media.textTracks : [];
   for(let i = 0; i < inUseTracks.length; i ++) {
     let track = inUseTracks[i];
     // Track mode was defined by html textTrack element.
     track.mode = 'hidden';
   }
 }

 function setCueAlign(align) {
   let textTrack = media.textTracks[0];

   for (let i=0; i < textTrack.cues.length; i ++) {
     let cue = textTrack.cues[i];
     cue.align = align;
   }
 }

 function setCueLine(line) {
   let textTrack = media.textTracks[0];

   for (let i=0; i < textTrack.cues.length; i ++) {
     let cue = textTrack.cues[i];
     cue.line = line;
   }
 }

 function setCueLineAlign(lineAlign) {
    
 }

 instance = {
   setMedia: setMedia,
   addTextTrack: addTextTrack,
   setTextTrackHidden: setTextTrackHidden,
   setCueAlign: setCueAlign,
   setCueLine: setCueLine,
   setCueLineAlign: setCueLineAlign,
 };

 setup();

 return instance;
}


TextEngine.__h5player_factory_name = 'TextEngine';
export default FactoryMaker.getSingletonFactory(TextEngine);
