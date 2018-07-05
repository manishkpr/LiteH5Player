import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/events';
import Debug from '../core/Debug';

import VTTParser from '../utils/VTTParser';
import StringUtils from '../utils/string_utils';

import { ajax } from '../utils/ajax';

function TrackLoader() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let vttParser_ = VTTParser(context_).getInstance();

  let track_;

  function setup() {
    eventBus_.on(Events.TRACK_LOADING, onTrackLoading);
  }

  function onTrackLoading(data) {
    track_ = data.track;

    function successHandler(xhr) {
      let data = xhr.responseText;
      let cueData = vttParser_.parse(data);

      eventBus_.trigger(Events.TRACK_LOADED, { cueData: cueData, kind: track_.kind, label: track_.label });
    }

    function errorHandler(xhr) {
    }

    track_.xhr = ajax(track_.file, successHandler, errorHandler);
  }

  let instance_ = {
  };

  setup();
  return instance_;
}

TrackLoader.__h5player_factory_name = 'TrackLoader';
export default FactoryMaker.getSingletonFactory(TrackLoader);



