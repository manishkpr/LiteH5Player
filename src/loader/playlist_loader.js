import FactoryMaker from '../core/FactoryMaker';
import StringUtils from '../utils/string_utils';

function PlaylistLoader() {
  let context_ = this.context;
  let debug_ = context_.debug
  let events_ = context_.events;
  let eventBus_ = context_.eventBus;
  let xhrLoader_ = new context_.loader(context_).create();
  let request_;

  function setup() {
    eventBus_.on(events_.MANIFEST_LOADING, onManifestLoading);
  }

  function onManifestLoading(data) {
    request_ = {
      url: data.url
    };
    let callbacks = {
      onSuccess: loadsuccess
    };

    xhrLoader_.load(request_, null, callbacks);
  }

  function loadsuccess(bytes) {
    eventBus_.trigger(events_.MANIFEST_LOADED, { bytes: bytes, url: request_.url });
  }

  let instance_ = {

  };
  setup();
  return instance_;
}

PlaylistLoader.__h5player_factory_name = 'PlaylistLoader';
export default FactoryMaker.getSingletonFactory(PlaylistLoader);
