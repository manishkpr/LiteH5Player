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
    let isFragmentProcessing_ = false;
    let manualMode_ = true;

    function setup() {
    }

    function schedule() {
        if (isFragmentProcessing_) {
            startScheduleTimer(500);
            return;
        }

        let fragment = parser_.getNextFragment();
        if (!fragment) {
            eventBus_.trigger(Events.FRAGMENT_DOWNLOADED_ENDED);
            return;
        }

        function cbSuccess(bytes) {
            fragment.bytes = bytes;
            eventBus_.trigger(Events.FRAGMENT_DOWNLOADED, fragment);
            isFragmentProcessing_ = false;

            startScheduleTimer(100);
        }

        let request = {
            url: fragment.url,
            cbSuccess: cbSuccess
        };
        isFragmentProcessing_ = true;
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





