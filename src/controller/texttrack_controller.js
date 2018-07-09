import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/CoreEvents';
import Debug from '../core/Debug';

import VTTParser from '../utils/VTTParser';
import StringUtils from '../utils/string_utils';

function TextTrackController() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let xhrLoader_ = context_.loader(context_).create();
  let vttParser_ = VTTParser(context_).getInstance();

  let vttUrl_;
  let textTracks_;

  function setup() {
    eventBus_.on(Events.TEXTTRACK_LOADING, onTextTrackLoading);
  }

  function onTextTrackLoading(data) {
    let url = data.url;

    vttUrl_ = url;
    let request = {
      url: vttUrl_
    };
    let callbacks = {
      onSuccess: onRequestSuccess
    }
    xhrLoader_.load(request, null, callbacks);
  }

  function onRequestSuccess(buffer) {
    let data = StringUtils.ab2str_v1(buffer);
    textTracks_ = vttParser_.parse(data);

    eventBus_.trigger(Events.TEXTTRACK_LOADED, { track: textTracks_ });
  }

  let instance_ = {
  };

  setup();
  return instance_;
}

TextTrackController.__h5player_factory_name = 'TextTrackController';
export default FactoryMaker.getSingletonFactory(TextTrackController);



