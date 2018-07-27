import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/events';
import Debug from '../core/Debug';

import StringUtils from '../utils/string_utils';
import XHRLoader from '../utils/xhr_loader';

function PlaylistLoader() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let xhrLoader_ = new XHRLoader();
  let request_;

  function setup() {
    eventBus_.on(Events.MANIFEST_LOADING, onManifestLoading);
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
    eventBus_.trigger(Events.MANIFEST_LOADED, { bytes: bytes, url: request_.url });
  }

  let instance_ = {
  };
  setup();
  return instance_;
}

PlaylistLoader.__h5player_factory_name = 'PlaylistLoader';
export default FactoryMaker.getSingletonFactory(PlaylistLoader);
