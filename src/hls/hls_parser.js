import FactoryMaker from '../core/FactoryMaker';


function HlsParser () {

  let instance = {};
  return instance;
}

HlsParser.__h5player_factory_name = 'HlsParser';
export default FactoryMaker.getSingletonFactory(HlsParser);
