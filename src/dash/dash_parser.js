import FactoryMaker from '../core/FactoryMaker';
import XHRLoader from '../utils/xhr_loader';



function DashParser() {
    let instance;

    function loadManifest(url) {
        // construct pd
        let aContents = [];
        for (let i = 1; i <= 180; i ++) {
            let content = 'http://10.2.68.64/2/mydash/features/av_nonmuxed/A48/' + i.toString() + '.m4s';
            aContents.push(content);
        }

        let aRepresentation = {
            type: 'audio',
            codecs: 'audio/mp4; codecs="mp4a.40.2"',
            initialization: 'http://10.2.68.64/2/mydash/features/av_nonmuxed/A48/init.mp4',
            media: aContents
        };

        // construct dash
        let vContents = [];
        for (let i = 1; i <= 180; i ++) {
            let content = 'http://10.2.68.64/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/' + i.toString() + '.m4s';
            vContents.push(content);
        }

        let vRepresentation = {
            type: 'video',
            codecs: 'video/mp4; codecs="avc1.64001e"',
            initialization: 'http://10.2.68.64/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/init.mp4',
            media: vContents
        };

        return {aRep: aRepresentation, vRep: vRepresentation};
    }

    instance = {
        loadManifest: loadManifest
    };
    return instance;
}

DashParser.__h5player_factory_name = 'DashParser';
export default FactoryMaker.getSingletonFactory(DashParser);