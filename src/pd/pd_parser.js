import FactoryMaker from '../core/FactoryMaker';
import Events from '../core/events';
import EventBus from '../core/EventBus';
import Debug from '../core/Debug';

import {
  Fragment,
  TrackInfo,
  PeriodInfo
} from '../common/common';

function PDParser() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let streamInfo_;
  let flagGotFragment = false;

  function getType() {
    return 'pd';
  }

  function loadManifest(url) {
    streamInfo_ = new PeriodInfo();
    streamInfo_.url = url;
    eventBus_.trigger(Events.MANIFEST_PARSED);
  }

  function getNextFragment() {
    if (!flagGotFragment) {
      flagGotFragment = true;
      let frag = {};
      frag.type = 'pd';
      frag.url = streamInfo_.url;
      return frag;
    } else {
      return null;
    }
  }

  let instance = {
    getType: getType,
    loadManifest: loadManifest,
    getNextFragment: getNextFragment
  };
  return instance;
}

PDParser.__h5player_factory_name = 'PDParser';
export default FactoryMaker.getSingletonFactory(PDParser);