import FactoryMaker from '../core/FactoryMaker';

import DashParser from '../dash/dash_parser';
import HlsParser from '../hls/hls_parser';
import PDParser from '../pd/pd_parser';

function ManifestParser() {
    
    function getParser(url) {
        let parser = null;
        let extension = url.split('.').pop();
        if (extension === 'mpd') {
            parser = DashParser(oldmtn).getInstance();
        } else if (extension === 'm3u8') {
            parser = HlsParser(oldmtn).getInstance();
        } else if (extension === 'mp4') {
            parser = PDParser(oldmtn).getInstance();
        }

        return parser;
    }

    let instance = {
        getParser: getParser
    };
    return instance;
}

ManifestParser.__h5player_factory_name = 'ManifestParser';
export default FactoryMaker.getSingletonFactory(ManifestParser);


