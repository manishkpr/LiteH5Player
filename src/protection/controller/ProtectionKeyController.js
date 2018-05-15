import FactoryMaker from '../../core/FactoryMaker';

import KeySystemClearKey from './../drm/KeySystemClearKey';
import KeySystemWidevine from './../drm/KeySystemWidevine';
import KeySystemPlayReady from './../drm/KeySystemPlayReady';
import KeySystemCCPlayReady from './../drm/KeySystemCCPlayReady';

function ProtectionKeyController() {
  let context_ = this.context;

  let instance_;
  let keySystems_;

  function initialize() {
    keySystems_ = [];

    var keySystem;

    // ClearKey
    keySystem = KeySystemClearKey(context_).getInstance();
    keySystems_.push(keySystem);

    // PlayReady
    keySystem = KeySystemPlayReady(context_).getInstance();
    keySystems_.push(keySystem);

    // Widevine
    keySystem = KeySystemWidevine(context_).getInstance();
    keySystems_.push(keySystem);

    // Chromecast PlayReady
    keySystem = KeySystemCCPlayReady(context_).getInstance();
    keySystems_.push(keySystem);
  }

  function getKeySystems() {
    return keySystems;
  }

  function getKeySystemBySystemString(systemString) {
    if (window.cast && window.cast.__platform__) {
      if (systemString === 'com.microsoft.playready') {
        systemString = 'com.chromecast.playready';
      }
    }

    for (var i = 0; i < keySystems_.length; i++) {
      if (keySystems_[i].systemString === systemString) {
        return keySystems_[i];
      }
    }
    return null;
  }

  instance_ = {
    getKeySystems: getKeySystems,
    getKeySystemBySystemString: getKeySystemBySystemString
  };

  initialize();
  return instance_;
}

ProtectionKeyController.__h5player_factory_name = 'ProtectionKeyController';
export default FactoryMaker.getSingletonFactory(ProtectionKeyController);