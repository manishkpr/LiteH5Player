import FactoryMaker from '../core/FactoryMaker';
import ProtectionKeyController from '../protection/controller/ProtectionKeyController';
import ProtectionModel_21Jan2015 from '../protection/models/ProtectionModel_21Jan2015';
import ProtectionModel_3Feb2014 from '../protection/models/ProtectionModel_3Feb2014';

//
function EMEController() {
  let context_ = this.context;
  let debug_ = context_.debug;
  let events_ = context_.events;
  let eventBus_ = context_.eventBus;

  let protectionModel_ = null;
  let protectionKeyController_ = ProtectionKeyController(context_).getInstance();

  function setup() {
    protectionModel_ = getProtectionModel();
    protectionModel_.attachMedia(context_.media);

    eventBus_.on(events_.BUFFER_CODEC, onBufferCodec);
  }

  function onBufferCodec(data) {
    let tracks = data;

    let audioCodec;
    let videoCodec;
    if (tracks.audio) {
      videoCodec = `${tracks.audio.container};codecs=${tracks.audio.codec}`;
    }
    if (tracks.video) {
      videoCodec = `${tracks.video.container};codecs=${tracks.video.codec}`;
    }

    protectionModel_.setMediaCodec(audioCodec, videoCodec);
  }

  //
  function getProtectionModel() {
    let media = context_.media;
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
    debug_.log('H5Player, request systemString: ' + keySystem.systemString);
    protectionModel_.setKeySystem(keySystem);
    protectionModel_.setDrmInfo(info);
  }

  let instance_ = {
    setDrmInfo: setDrmInfo
  };
  setup();
  return instance_;
};

EMEController.__h5player_factory_name = 'EMEController';
export default FactoryMaker.getSingletonFactory(EMEController);