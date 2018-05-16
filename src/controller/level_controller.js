import FactoryMaker from '../core/FactoryMaker';

function LevelController() {
  let context_ = this.context;
  let events_ = context_.events;
  let eventBus_ = context_.eventBus;
  let debug_ = context_.debug;

  let streamInfo_;

  function setup() {
    eventBus_.on(events_.MANIFEST_PARSED, onManifestParsed);
  }

  function onManifestParsed(streamInfo) {
    streamInfo_ = streamInfo;

    eventBus_.trigger(events_.STREAM_LOADED);
  }












  let instance_ = {

  };
  setup();
  return instance_;
}

LevelController.__h5player_factory_name = 'LevelController';
export default FactoryMaker.getSingletonFactory(LevelController);