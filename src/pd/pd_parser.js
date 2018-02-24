import FactoryMaker from '../core/FactoryMaker';

function PDParser() {
    function loadManifest(url) {
        let vRep = {
            type: 'pd',
            media: url
        };

        return {aRep: null, vRep: vRep};
    }

    let instance = {
        loadManifest: loadManifest
    };
    return instance;
}

PDParser.__h5player_factory_name = 'PDParser';
export default FactoryMaker.getSingletonFactory(PDParser);

