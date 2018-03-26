

import DemuxerWorker from './demuxer-worker';

class Demuxer {
  constructor (hls, id) {
    this.hls = hls;
    this.id = id;

    let w;
    let work = require('webworkify');
    w = this.w = work(DemuxerWorker);

    this.onwmsg = this.onWorkerMessage.bind(this);
    w.addEventListener('message', this.onwmsg);

  }

  destroy() {
  }

  push (data) {
    const w = this.w;
    w.postMessage({ cmd: 'demux', data });
  }

  onWorkerMessage (ev) {
    let data = ev.data,
    hls = this.hls;
    switch (data.event) {
      case 'init': {
      } break;
      default:
      break;
    }
  }
}


export default Demuxer;




