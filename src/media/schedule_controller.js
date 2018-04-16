import FactoryMaker from '../core/FactoryMaker';
import XHRLoader from '../utils/xhr_loader';
import EventBus from '../core/EventBus';
import Events from '../core/CoreEvents';

function ScheduleController() {
    let context_ = this.context;

    let parser_;
    let scheduleTimeout_;
    let xhrLoader_ = XHRLoader(context_).create();
    let eventBus_ = EventBus(context_).getInstance();

    // flag
    let manualMode_ = false;

    function setup() {
        eventBus_.on(Events.SB_UPDATE_ENDED, onSbUpdateEnded);
    }

    function onSbUpdateEnded() {
        schedule();
    }

    function schedule() {
        let frag = parser_.getNextFragment();
        if (!frag) {
            eventBus_.trigger(Events.FRAGMENT_DOWNLOADED_ENDED);
            return;
        }

        function cbSuccess(buffer) {
            frag.data = buffer;
            eventBus_.trigger(Events.FRAGMENT_DOWNLOADED, frag);
        }

        let request = {
            url: frag.url,
            rangeStart: frag.byteRangeStartOffset,
            rangeEnd: frag.byteRangeEndOffset,
            cbSuccess: cbSuccess
        };

        // log
        printLog('request url: ' + request.url);
        xhrLoader_.load(request);
    }

    function startScheduleTimer(value) {
        if (manualMode_) {
            return;
        }

        if (scheduleTimeout_) {
            clearTimeout(scheduleTimeout_);
            scheduleTimeout_ = null;
        }
        scheduleTimeout_ = setTimeout(schedule, value);
    }

    function start(parser) {
        parser_ = parser;
        startScheduleTimer(0);
    }

    function stop() {
        if (scheduleTimeout_) {
            clearTimeout(scheduleTimeout_);
            scheduleTimeout_ = null;
        }
    }

    function manualSchedule() {
        schedule();
    }

    let instance = {
        start: start,
        stop: stop,

        // for debug
        manualSchedule: manualSchedule
    };
    setup();
    return instance;
}


ScheduleController.__h5player_factory_name = 'ScheduleController';
export default FactoryMaker.getSingletonFactory(ScheduleController);





