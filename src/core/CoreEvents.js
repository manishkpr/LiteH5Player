/**
 * @class
 *
 */
class CoreEvents {

    /**
     * @description Public facing external events to be used when developing a player that implements dash.js.
     */
    constructor () {
        // mse events
        this.MSE_OPENED = 'mseOpened';

        // source buffer events
        this.SB_UPDATE_ENDED = 'sbUpdateEnded';

        // media element eventsa
        this.MEDIA_DURATION_CHANGED = 'mediaDurationChanged';
        this.MEDIA_ENDED = 'mediaEnded';
        this.MEDIA_PAUSED = 'mediaPaused';
        this.MEDIA_PLAYING = 'mediaPlaying';
        this.MEDIA_SEEKING = 'mediaSeeking';
        this.MEDIA_SEEKED = 'mediaSeeked';
        this.MEDIA_TIMEUPDATE = 'mediaTimeupdate';
        this.MEDIA_WAITING = 'mediaWaiting';

        // ads internal events
        this.AD_STARTED = 'adStarted';
        this.AD_COMPLETE = 'adComplete';
        this.AD_CONTENT_PAUSE_REQUESTED = 'adContentPauseRequested';
        this.AD_CONTENT_RESUME_REQUESTED = 'adContentResumeRequested';

        // log event
        this.LOG = 'log';
    }
}

let coreEvents = new CoreEvents();
export default coreEvents;
