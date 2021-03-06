import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/events';
import Debug from '../core/Debug';

import XHRLoader from '../utils/xhr_loader';

function FragmentLoader() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let xhrLoader_ = new XHRLoader();
  
  let request_;
  function setup() {
    eventBus_.on(Events.FRAG_LOADING, onFragLoading);
  }

  function onFragLoading(e) {
    let frag = e.frag;
    request_ = {
      frag: frag,
      url: frag.url,
      rangeStart: frag.byteRangeStartOffset,
      rangeEnd: frag.byteRangeEndOffset
    };
    let callbacks = {
      onSuccess: loadsuccess
    };

    debug_.log(`+onFragLoading, ${request_.url}, [${request_.rangeStart}, ${request_.rangeEnd}], sn:${request_.frag.sn}`);
    xhrLoader_.load(request_, null, callbacks);
  }

  function loadsuccess(payload) {
    let frag = request_.frag;
    frag.data = payload;
    eventBus_.trigger(Events.FRAG_LOADED, { frag });
  }

  let instance_ = {
  };

  setup();
  return instance_;
}

FragmentLoader.__h5player_factory_name = 'FragmentLoader';
export default FactoryMaker.getClassFactory(FragmentLoader);