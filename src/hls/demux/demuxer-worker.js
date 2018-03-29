



let DemuxerWorker = function (self) {


  let forwardMessage = function (ev, data) {
    self.postMessage({ event: ev, data: data });
  };

  self.addEventListener('message', function (ev) {
    let data = ev.data;
    switch (data.cmd) {
      case 'init': {
          console.log('worker recv: init');
          // signal end of worker init
          forwardMessage('init', null);
        } break;
        case 'demux': {
          console.log('data.data: ' + data.data);
        } break;
      }
    });
};

export default DemuxerWorker;

