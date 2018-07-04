/**
 * @class
 *
 */
class CoreEvents {
  /**
   * @description Public facing external events to be used when developing a player that implements dash.js.
   */
  constructor() {
    // media element eventsa
    this.MEDIA_CANPLAY = 'mediaCanPlay';
    this.MEDIA_CANPLAY_THROUGH = 'mediaCanPlayThrough';
    this.MEDIA_DURATION_CHANGED = 'mediaDurationChanged';
    this.MEDIA_ENDED = 'mediaEnded';
    this.MEDIA_LOADEDDATA = 'mediaLoadedData';
    this.MEDIA_LOADEDMETADATA = 'mediaLoadedMetadata';
    this.MEDIA_PAUSED = 'mediaPaused';
    this.MEDIA_PLAY = 'mediaPlay';
    this.MEDIA_PLAYING = 'mediaPlaying';
    this.MEDIA_SEEKING = 'mediaSeeking';
    this.MEDIA_SEEKED = 'mediaSeeked';
    this.MEDIA_TIMEUPDATE = 'mediaTimeupdate';
    this.MEDIA_VOLUME_CHANGED = 'mediaVolumeChanged';
    this.MEDIA_WAITING = 'mediaWaiting';

    // ads internal events
    this.AD_ERROR = 'adError';
    this.AD_STARTED = 'adStarted';
    this.AD_COMPLETE = 'adComplete';
    this.AD_PAUSED = 'adPaused';
    this.AD_RESUMED = 'adResumed';
    this.AD_CONTENT_PAUSE_REQUESTED = 'adContentPauseRequested';
    this.AD_CONTENT_RESUME_REQUESTED = 'adContentResumeRequested';
    this.AD_ADS_MANAGER_LOADED = 'adAdsManagerLoaded';
    this.AD_TIMEUPDATE = 'adTimeUpdate';
    this.AD_COMPANIONS = 'adCompanions';
    // ads custom events
    this.AD_LOADING_COMPLETE = 'adLoadingComplete';

    // log event
    this.LOG = 'log';

    // DOM Events
    this.FULLSCREEN_CHANGE = 'fullscreenChange';

    // controller events
    this.STATE_CHANGE = 'stateChange';

    this.FINDING_PARSER = 'findingParser';
    this.FOUND_PARSER = 'foundParser';
    this.STREAM_UPDATED = 'streamUpdated'; // Loaded a stream has a specified bitrate.
    this.THUMBNAIL_LOADING = 'thumbnailLoading';

    // Begin hls.js, for compatible hls.js
    this.MANIFEST_LOADING = 'hlsManifestLoading';
    this.MANIFEST_LOADED = 'hlsManifestLoaded';
    this.MANIFEST_PARSED = 'hlsManifestParsed';
    this.FRAG_LOADING = 'hlsFragLoading';
    this.FRAG_LOADED = 'hlsFragLoaded';
    this.INIT_PTS_FOUND = 'hlsInitPtsFound';
    this.FRAG_PARSING_INIT_SEGMENT = 'hlsFragParsingInitSegment';
    this.FRAG_PARSING_DATA = 'hlsFragParsingData';
    this.FRAG_PARSED = 'hlsFragParsed';
    this.BUFFER_CODEC = 'hlsBufferCodec';
    this.BUFFER_APPENDING = 'hlsBufferAppending';
    this.BUFFER_APPENDED = 'hlsBufferAppended';
    this.BUFFER_EOS = 'hlsBufferEOS';
    this.MEDIA_ATTACHING = 'hlsMediaAttaching';
    this.MEDIA_ATTACHED = 'hlsMediaAttached';
    // End hls.js

    //
    this.TEST_MSG = 'testMsg';
  }
}

let coreEvents = new CoreEvents();
export default coreEvents;
