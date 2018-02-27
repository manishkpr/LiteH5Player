import FactoryMaker from '../core/FactoryMaker';

function PDParser() {
    let activeStream_;
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
        return activeStream_;
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

