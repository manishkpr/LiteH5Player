import CommonEncryption from '../vo/CommonEncryption';
import FactoryMaker from '../../core/FactoryMaker';

const uuid = 'edef8ba9-79d6-4ace-a3c8-27dcd51d21ed';
const systemString = 'com.widevine.alpha';
const schemeIdURI = 'urn:uuid:' + uuid;

function KeySystemWidevine() {

  let instance_;

  function getInitData(cp) {
    return CommonEncryption.parseInitDataFromContentProtection(cp);
  }

  function getRequestHeadersFromMessage( /*message*/ ) {
    return null;
  }

  function getLicenseRequestFromMessage(message) {
    return new Uint8Array(message);
  }

  function getLicenseServerURLFromInitData( /*initData*/ ) {
    return null;
  }

  instance_ = {
    uuid: uuid,
    schemeIdURI: schemeIdURI,
    systemString: systemString,
    getInitData: getInitData,
    getRequestHeadersFromMessage: getRequestHeadersFromMessage,
    getLicenseRequestFromMessage: getLicenseRequestFromMessage,
    getLicenseServerURLFromInitData: getLicenseServerURLFromInitData,
  };

  return instance_;
}

KeySystemWidevine.__h5player_factory_name = 'KeySystemWidevine';
export default FactoryMaker.getSingletonFactory(KeySystemWidevine);