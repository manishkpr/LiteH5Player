import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';

import ProtectionKeyController from './protection/controller/ProtectionKeyController';
import ProtectionModel_21Jan2015 from './protection/models/ProtectionModel_21Jan2015';
import ProtectionModel_3Feb2014 from './protection/models/ProtectionModel_3Feb2014';

//
function DRMEngine(media) {
  let context_ = this.context;

  let media_ = media;
  let protectionModel_ = null;

  let protectionKeyController_ = ProtectionKeyController(context_).getInstance();

  protectionModel_ = getProtectionModel(media_);
  protectionModel_.attachMedia(media_);

  function getProtectionModel(media) {
    if (media.onencrypted !== undefined &&
      media.mediaKeys !== undefined &&
      navigator.requestMediaKeySystemAccess !== undefined &&
      typeof navigator.requestMediaKeySystemAccess === 'function') {
      console.log('User Agent support ProtectionModel_21Jan2015');
      return new ProtectionModel_21Jan2015();
    } else {
      console.log('User Agent support ProtectionModel_3Feb2014');
      return new ProtectionModel_3Feb2014();
    }
  }

  function setDrmInfo(info) {
    if (!info.drm || !info.drm.type) {
      return;
    }

    let keySystem = protectionKeyController_.getKeySystemBySystemString(info.drm.type);
    console.log('H5Player, request systemString: ' + keySystem.systemString);
    protectionModel_.setKeySystem(keySystem);
    protectionModel_.setDrmInfo(info);
  }

  let instance_ = {
    setDrmInfo: setDrmInfo
  };

  return instance_;
};

DRMEngine.__h5player_factory_name = 'DRMEngine';
export default FactoryMaker.getSingletonFactory(DRMEngine);