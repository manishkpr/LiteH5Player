import FactoryMaker from '../core/FactoryMaker';

function FragmentLoader() {
  let context_ = this.context;
  let debug_ = context_.debug;
  let events_ = context_.events;
  let eventBus_ = context_.eventBus;
  let xhrLoader_ = context_.loader(context_).create();
  
  let request_;
  function setup() {
    eventBus_.on(events_.FRAG_LOADING, onFragLoading);
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
    eventBus_.trigger(events_.FRAG_LOADED, { frag });
  }

  let instance_ = {
  };

  setup();
  return instance_;
}

FragmentLoader.__h5player_factory_name = 'FragmentLoader';
export default FactoryMaker.getClassFactory(FragmentLoader);