import FactoryMaker from '../core/FactoryMaker';
import Events from '../core/CoreEvents';
import EventBus from '../core/EventBus';
import Debug from '../core/Debug';
import XHRLoader from '../utils/xhr_loader';

function PDParser() {
    let context_ = this.context;
    
    let activeStream_;
    let eventBus_ = EventBus(context_).getInstance();

    // flag
    let pdDownloaded_;
    function loadManifest(url) {
        pdDownloaded_ = false;

        let pdRep = {
            type: 'pd',
            codecs: 'video/mp4; codecs="mp4a.40.2"',
            media: url
        };

        // pd - pure video
        // let pdRep = {
        //     type: 'pd',
        //     codecs: 'video/mp4; codecs="mp4a.40.2, avc1.4D401e"',
        //     media: url
        // };

        activeStream_ = {
            pdRep: pdRep
        };

        eventBus_.trigger(Events.MANIFEST_PARSED, activeStream_);
    }

    function getNextFragment() {
        let ret = null;
        if (!pdDownloaded_) {
            ret = { type: activeStream_.pdRep.type, url: activeStream_.pdRep.media };
            pdDownloaded_ = true;
        }

        return ret;
    }

    let instance = {
        loadManifest: loadManifest,
        getNextFragment: getNextFragment
    };
    return instance;
}

PDParser.__h5player_factory_name = 'PDParser';
export default FactoryMaker.getSingletonFactory(PDParser);

