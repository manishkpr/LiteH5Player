import FactoryMaker from '../core/FactoryMaker';
import Demuxer from './demux/demuxer';

function HlsParser() {

    let demuxer_;

    function loadManifest(url) {
        init();
    }

    function init() {
        demuxer_ = new Demuxer();
    }

    let instance_ = {
        loadManifest: loadManifest
    };
    return instance_;
}

HlsParser.__h5player_factory_name = 'HlsParser';
export default FactoryMaker.getSingletonFactory(HlsParser);
