import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/events';
import Debug from '../core/Debug';

function LevelController() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let streamInfo_;

  function setup() {
    eventBus_.on(Events.MANIFEST_PARSED, onManifestParsed);
  }

  function onManifestParsed(streamInfo) {
    streamInfo_ = streamInfo;

    eventBus_.trigger(Events.STREAM_UPDATED, {streamInfo: streamInfo_});
  }

  let instance_ = {
  };
  setup();
  return instance_;
}

LevelController.__h5player_factory_name = 'LevelController';
export default FactoryMaker.getSingletonFactory(LevelController);

