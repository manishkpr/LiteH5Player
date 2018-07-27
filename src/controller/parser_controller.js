import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/events';
import Debug from '../core/Debug';

import DashParser from '../dash/dash_parser';
import HlsParser from '../hls/hls_parser';
import PDParser from '../pd/pd_parser';

function ParserController() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  function setup() {
    eventBus_.on(Events.FINDING_PARSER, onFindingParser);
  }

  function onFindingParser(data) {
    let url = data.url;

    let parser = getParser(url);
    eventBus_.trigger(Events.FOUND_PARSER, { parser });
  }

  function getParser(url) {
    let parser = null;
    let extension = url.split('.').pop();
    if (extension === 'mpd') {
      parser = DashParser(context_).getInstance();
      parser.type = 'dash';
    } else if (extension === 'm3u8') {
      parser = HlsParser(context_).getInstance();
      parser.type = 'hls';
    } else if (extension === 'mp4') {
      parser = PDParser(context_).getInstance();
      parser.type = 'pd';
    }

    return parser;
  }

  let instance_ = {
  };
  setup();
  return instance_;
}

ParserController.__h5player_factory_name = 'ParserController';
export default FactoryMaker.getSingletonFactory(ParserController);





