import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import TimeRanges from './utils/timeRanges';


/* During the loading process of an audio/video, the following events occur, in this order:
loadstart
durationchange
loadedmetadata
loadeddata
progress
canplay
canplaythrough
*/

var MediaEngine = function (media) {
  this.media_ = media;
  this.eventBus_ = EventBus(micromtn).getInstance();
  this.addEventListeners();
};

// Begin -- public functions
MediaEngine.prototype.play = function () {
  this.media_.play();
};

MediaEngine.prototype.pause = function () {
  this.media_.pause();
};

MediaEngine.prototype.isPaused = function () {
  return this.media_.paused;
};
// End -- public functions

// Begin - private function 
MediaEngine.prototype.onMediaCanplay = function () {
  //The canplay event occurs when the browser can start playing the specified audio/video (when it has buffered enough to begin).
  console.log('--onMediaCanplay--');
};

MediaEngine.prototype.onMediaEnded = function () {
  console.log('--onMediaEnded--');
};

MediaEngine.prototype.onMediaLoadedMetadata = function () {
  console.log('--onMediaMetadata--, width: ' + this.media_.width + ', height: ' + this.media_.height);
};

MediaEngine.prototype.onMediaPaused = function () {
  console.log('--onMediaPaused--');
};

MediaEngine.prototype.onMediaPlaying = function () {
  //console.log('--onMediaPlaying--');
  this.eventBus_.trigger(Events.MEDIA_PLAYING);
};

MediaEngine.prototype.onMediaReadyState = function (e) {
  console.log('--onMediaReadyState--', e);
};

MediaEngine.prototype.onMediaSeeking = function () {
  this.eventBus_.trigger(Events.MEDIA_SEEKING);
};

MediaEngine.prototype.onMediaSeeked = function () {
  this.eventBus_.trigger(Events.MEDIA_SEEKED);
};

MediaEngine.prototype.onMediaTimeUpdated = function (e) {
  //console.log(`main buffered : ${TimeRanges.toString(media.buffered)}` + ', currentTime: ' + media.currentTime);
};

MediaEngine.prototype.onMediaWaiting = function () {
  console.log('--onMediaWaiting--');
  this.eventBus_.trigger(Events.MEDIA_WAITING);
};
// End

// public function
MediaEngine.prototype.addEventListeners = function () {
  this.media_.addEventListener('canplay', this.onMediaCanplay.bind(this));
  this.media_.addEventListener('ended', this.onMediaEnded.bind(this));
  this.media_.addEventListener('loadedmetadata', this.onMediaLoadedMetadata.bind(this));
  this.media_.addEventListener('pause', this.onMediaPaused.bind(this));
  this.media_.addEventListener('playing', this.onMediaPlaying.bind(this));
  this.media_.addEventListener('readyState', this.onMediaReadyState.bind(this));
  this.media_.addEventListener('seeking', this.onMediaSeeking.bind(this));
  this.media_.addEventListener('seeked', this.onMediaSeeked.bind(this));
  this.media_.addEventListener('timeupdate', this.onMediaTimeUpdated.bind(this));
  this.media_.addEventListener('waiting', this.onMediaWaiting.bind(this));
};

MediaEngine.prototype.removeEventsListeners = function () {
  this.media_.removeEventListener('canplay', this.onMediaCanplay.bind(this));
  this.media_.removeEventListener('ended', this.onMediaEnded.bind(this));
  this.media_.removeEventListener('loadedmetadata', this.onMediaMetadata.bind(this));
  this.media_.removeEventListener('pause', this.onMediaPaused.bind(this));
  this.media_.removeEventListener('playing', this.onMediaPlaying.bind(this));
  this.media_.removeEventListener('readyState', this.onMediaReadyState.bind(this));
  this.media_.removeEventListener('seeking', this.onMediaSeeking.bind(this));
  this.media_.removeEventListener('seeked', this.onMediaSeeked.bind(this));
  this.media_.removeEventListener('timeupdate', this.onMediaTimeUpdated.bind(this));
  this.media_.removeEventListener('waiting', this.onMediaWaiting.bind(this));
};

MediaEngine.prototype.setSrc = function (objURL) {
  this.media_.src = objURL;
};

MediaEngine.prototype.getSrc = function () {
  return this.media_.src;
};

MediaEngine.prototype.reset = function () {
  // Detach properly the MediaSource from the HTMLMediaElement as
  // suggested in https://github.com/w3c/media-source/issues/53.
  if (this.media_) {
    this.media_.removeAttribute('src');
    this.media_.load();
  }
};

export default MediaEngine;

