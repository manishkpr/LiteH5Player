



let DemuxerWorker = function (self) {


    self.addEventListener('message', function (ev) {
      let data = ev.data;
      switch (data.cmd) {
        case 'demux':
        {
          console.log('data.data: ' + data.data);
        } break;
      }
    });
};

export default DemuxerWorker;

