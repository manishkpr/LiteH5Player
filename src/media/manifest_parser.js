import FactoryMaker from '../core/FactoryMaker';

import DashParser from '../dash/dash_parser';
import HlsParser from '../hls/hls_parser';
import PDParser from '../pd/pd_parser';

function ManifestParser() {
    let context_ = this.context;
    
    function getParser(url) {
        let parser = null;
        let extension = url.split('.').pop();
        if (extension === 'mpd') {
            parser = DashParser(context_).getInstance();
            parser.type = 'dash';
        } else if (extension === 'm3u8') {
            parser = HlsParser(context_).getInstance();
            parser.type = 'hls';
        } else if (extension === 'mp4') {
            parser = PDParser(context_).getInstance();
            parser.type = 'pd';
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


