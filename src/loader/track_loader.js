import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/CoreEvents';
import Debug from '../core/Debug';

import VTTParser from '../utils/VTTParser';
import StringUtils from '../utils/string_utils';

function TrackLoader() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let xhrLoader_ = context_.loader(context_).create();
  let vttParser_ = VTTParser(context_).getInstance();

  let track_;

  function setup() {
    eventBus_.on(Events.TRACK_LOADING, onTrackLoading);
  }

  function onTrackLoading(data) {
    track_ = data.track;

    let request = {
      url: track_.file
    };
    let callbacks = {
      onSuccess: onRequestSuccess
    }
    xhrLoader_.load(request, null, callbacks);
  }

  function onRequestSuccess(buffer) {
    let data = StringUtils.ab2str_v1(buffer);
    let cueData = vttParser_.parse(data);

    eventBus_.trigger(Events.TRACK_LOADED, { cueData: cueData, label: track_.label });
  }

  let instance_ = {
  };

  setup();
  return instance_;
}

TrackLoader.__h5player_factory_name = 'TrackLoader';
export default FactoryMaker.getSingletonFactory(TrackLoader);



