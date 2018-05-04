import FactoryMaker from '../core/FactoryMaker';
import Events from '../core/CoreEvents';
import EventBus from '../core/EventBus';
import Debug from '../core/Debug';
import { Fragment, TrackInfo, StreamInfo } from '../common/common';

function PDParser() {
    let context_ = this.context;
    
    let eventBus_ = EventBus(context_).getInstance();
    let streamInfo_;
    let flagHasGotFragment = false;

    // flag
    function loadManifest(url) {
        streamInfo_ = new StreamInfo();
        streamInfo_.url = url;
        eventBus_.trigger(Events.MANIFEST_PARSED);
    }

    function getNextFragment() {
        if (!flagHasGotFragment) {
            flagHasGotFragment = true;
            let frag = {};
            frag.type = 'pd';
            frag.url = streamInfo_.url;
            return frag;
        } else {
            return null;
        }
    }

    let instance = {
        loadManifest: loadManifest,
        getNextFragment: getNextFragment
    };
    return instance;
}

PDParser.__h5player_factory_name = 'PDParser';
export default FactoryMaker.getSingletonFactory(PDParser);

