import FactoryMaker from '../core/FactoryMaker';
import Demuxer from './demux/demuxer';

import { hlsDefaultConfig } from './config';

function HlsParser() {
    let hls_;
    let demuxer_;

    function loadManifest(url) {
        init();
    }

    function init() {
        hls_ = {};
        hls_.config = hlsDefaultConfig;
        demuxer_ = new Demuxer(hls_, 'main');
    }

    let instance_ = {
        loadManifest: loadManifest
    };
    return instance_;
}

HlsParser.__h5player_factory_name = 'HlsParser';
export default FactoryMaker.getSingletonFactory(HlsParser);
