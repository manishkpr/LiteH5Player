import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';
import Events from './core/CoreEvents';
import Debug from './core/Debug';
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
  this.eventBus_ = EventBus(oldmtn).getInstance();
  this.debug_ = Debug(oldmtn).getInstance();
  this.addEventListeners();
};

// Begin -- public functions
MediaEngine.prototype.currentTime = function () {
  return this.media_.currentTime;
};

MediaEngine.prototype.duration = function () {
  return this.media_.duration;
};

MediaEngine.prototype.seeking = function () {
  return this.media_.seeking;
};

MediaEngine.prototype.isEnded = function () {
  return this.media_.ended;
};

MediaEngine.prototype.isMuted = function () {
  return this.media_.muted;
};

MediaEngine.prototype.isPaused = function () {
  return this.media_.paused;
};

MediaEngine.prototype.mute = function () {
  this.media_.muted = true;
};

MediaEngine.prototype.play = function () {
  this.media_.play();
};

MediaEngine.prototype.pause = function () {
  this.media_.pause();
};

MediaEngine.prototype.unmute = function () {
  this.media_.muted = false;
};

MediaEngine.prototype.videoWidth = function () {
  return this.media_.videoWidth;
};

MediaEngine.prototype.videoHeight = function () {
  return this.media_.videoHeight;
};

// End -- public functions

// Begin - private function
MediaEngine.prototype.onMediaCanplay = function () {
  //The canplay event occurs when the browser can start playing the specified audio/video (when it has buffered enough to begin).
  this.debug_.log('+onMediaCanplay');
};

MediaEngine.prototype.onMediaCanplayThrough = function () {
  this.debug_.log('+onMediaCanplayThrough');
};

MediaEngine.prototype.onMediaDurationChanged = function () {
  this.debug_.log('+onMediaDurationChanged' +
    ', currentTime: ' + this.media_.currentTime +
    ', duration: ' + this.media_.duration);
  this.eventBus_.trigger(Events.MEDIA_DURATION_CHANGED);
};

MediaEngine.prototype.onMediaEnded = function () {
  this.eventBus_.trigger(Events.MEDIA_ENDED);
};

MediaEngine.prototype.onMediaLoadedData = function () {
  this.debug_.log('+onMediaLoadedData' +
    ', width: ' + this.media_.videoWidth +
    ', height: ' + this.media_.videoHeight +
    ', duration: ' + this.media_.duration);
};

MediaEngine.prototype.onMediaLoadedMetadata = function () {
  this.debug_.log('+onMediaMetadata' +
    ', width: ' + this.media_.videoWidth +
    ', height: ' + this.media_.videoHeight +
    ', duration: ' + this.media_.duration);
  this.eventBus_.trigger(Events.MEDIA_LOADEDMETADATA);
};

MediaEngine.prototype.onMediaLoadStart = function () {
  this.debug_.log('+onMediaLoadStart');
};

MediaEngine.prototype.onMediaPaused = function () {
  this.debug_.log('+onMediaPaused');
  this.eventBus_.trigger(Events.MEDIA_PAUSED);
};

MediaEngine.prototype.onMediaPlay = function () {
  this.debug_.log('+onMediaPlay');
};

MediaEngine.prototype.onMediaPlaying = function () {
  this.debug_.log('+onMediaPlaying');
  this.eventBus_.trigger(Events.MEDIA_PLAYING);
};

MediaEngine.prototype.onMediaProgress = function () {
  this.debug_.log('+onMediaProgress');
};

MediaEngine.prototype.onMediaReadyState = function (e) {
  this.debug_.log('+onMediaReadyState');
};

MediaEngine.prototype.onMediaSeeking = function () {
  this.eventBus_.trigger(Events.MEDIA_SEEKING);
};

MediaEngine.prototype.onMediaSeeked = function () {
  this.eventBus_.trigger(Events.MEDIA_SEEKED);
};

MediaEngine.prototype.onMediaTimeUpdated = function (e) {
  this.eventBus_.trigger(Events.MEDIA_TIMEUPDATE);
  //this.debug_.log(`main buffered : ${TimeRanges.toString(media.buffered)}` + ', currentTime: ' + media.currentTime);
};

MediaEngine.prototype.onMediaVolumeChanged = function () {
  this.debug_.log('+onMediaVolumeChanged');
};

MediaEngine.prototype.onMediaWaiting = function () {
  this.debug_.log('+onMediaWaiting');
  this.eventBus_.trigger(Events.MEDIA_WAITING);
};
// End

// public function
MediaEngine.prototype.addEventListeners = function () {
  this.media_.addEventListener('canplay', this.onMediaCanplay.bind(this));
  this.media_.addEventListener('canplaythrough', this.onMediaCanplayThrough.bind(this));
  this.media_.addEventListener('durationchange', this.onMediaDurationChanged.bind(this));
  this.media_.addEventListener('ended', this.onMediaEnded.bind(this));
  this.media_.addEventListener('loadeddata', this.onMediaLoadedData.bind(this));
  this.media_.addEventListener('loadedmetadata', this.onMediaLoadedMetadata.bind(this));
  this.media_.addEventListener('loadstart', this.onMediaLoadStart.bind(this));
  this.media_.addEventListener('pause', this.onMediaPaused.bind(this));
  this.media_.addEventListener('play', this.onMediaPlay.bind(this));
  this.media_.addEventListener('playing', this.onMediaPlaying.bind(this));
  this.media_.addEventListener('progress', this.onMediaProgress.bind(this));
  this.media_.addEventListener('readyState', this.onMediaReadyState.bind(this));
  this.media_.addEventListener('seeking', this.onMediaSeeking.bind(this));
  this.media_.addEventListener('seeked', this.onMediaSeeked.bind(this));
  this.media_.addEventListener('timeupdate', this.onMediaTimeUpdated.bind(this));
  this.media_.addEventListener('volumechange', this.onMediaVolumeChanged.bind(this));
  this.media_.addEventListener('waiting', this.onMediaWaiting.bind(this));
};

MediaEngine.prototype.removeEventsListeners = function () {
  this.media_.removeEventListener('canplay', this.onMediaCanplay.bind(this));
  this.media_.removeEventListener('durationchange', this.onMediaDurationChanged.bind(this));
  this.media_.removeEventListener('ended', this.onMediaEnded.bind(this));
  this.media_.removeEventListener('loadeddata', this.onMediaLoadedData.bind(this));
  this.media_.removeEventListener('loadedmetadata', this.onMediaMetadata.bind(this));
  this.media_.removeEventListener('loadstart', this.onMediaLoadStart.bind(this));
  this.media_.removeEventListener('pause', this.onMediaPaused.bind(this));
  this.media_.removeEventListener('play', this.onMediaPlay.bind(this));
  this.media_.removeEventListener('playing', this.onMediaPlaying.bind(this));
  this.media_.removeEventListener('progress', this.onMediaProgress.bind(this));
  this.media_.removeEventListener('readyState', this.onMediaReadyState.bind(this));
  this.media_.removeEventListener('seeking', this.onMediaSeeking.bind(this));
  this.media_.removeEventListener('seeked', this.onMediaSeeked.bind(this));
  this.media_.removeEventListener('timeupdate', this.onMediaTimeUpdated.bind(this));
  this.media_.removeEventListener('volumechange', this.onMediaVolumeChanged.bind(this));
  this.media_.removeEventListener('waiting', this.onMediaWaiting.bind(this));
};

MediaEngine.prototype.setSrc = function (objURL) {
  this.media_.src = objURL;
};

MediaEngine.prototype.getSrc = function () {
  return this.media_.src;
};

MediaEngine.prototype.revokeSrc = function() {
  URL.revokeObjectURL(this.media_.src);
};

MediaEngine.prototype.close = function () {
  // Detach properly the MediaSource from the HTMLMediaElement as
  // suggested in https://github.com/w3c/media-source/issues/53
  if (this.media_) {
    this.media_.removeAttribute('src');
    this.media_.load();
  }
};

export default MediaEngine;

