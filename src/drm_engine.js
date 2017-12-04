import FactoryMaker from './core/FactoryMaker';
import EventBus from './core/EventBus';

import ProtectionKeyController from './protection/controller/ProtectionKeyController';
import ProtectionModel_21Jan2015 from './protection/models/ProtectionModel_21Jan2015';
import ProtectionModel_3Feb2014 from './protection/models/ProtectionModel_3Feb2014';

//
var DRMEngine = function (media) {
    this.media_ = media;
    this.protectionModel_ = null;

    this.protectionKeyController_ = ProtectionKeyController(this).getInstance();

    this.protectionModel_ = this.getProtectionModel(this.media_);
    this.protectionModel_.attachMedia(this.media_);
};

DRMEngine.prototype.getProtectionModel = function (media) {
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
};

DRMEngine.prototype.setDrmInfo = function (info) {
    if (!info.drm || !info.drm.type) { return; }

    let keySystem = this.protectionKeyController_.getKeySystemBySystemString(info.drm.type);
    console.log('H5Player, request systemString: ' + keySystem.systemString);
    this.protectionModel_.setKeySystem(keySystem);
    this.protectionModel_.setDrmInfo(info);
};

export default DRMEngine;
