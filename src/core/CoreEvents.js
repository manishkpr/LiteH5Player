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

        // media element events
        this.MEDIA_PLAYING = 'mediaPlaying';
        this.MEDIA_SEEKING = 'mediaSeeking';
        this.MEDIA_SEEKED = 'mediaSeeked';
        this.MEDIA_WAITING = 'mediaWaiting';
    }
}

let coreEvents = new CoreEvents();
export default coreEvents;
