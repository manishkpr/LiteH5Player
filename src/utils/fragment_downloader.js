var FragmentDownloader = {};

FragmentDownloader.saveInitSegment = function(data, type) {
  this.index = 0;

  var blob = new Blob([data], {
    type: 'application/octet-stream'
  });
  var fileName = type + '_' + this.index.toString() + '_' + 'init.mp4';
  oldmtn.FileSaver.saveAs(blob, fileName);
};

FragmentDownloader.saveSegment = function(data1, data2, type) {
  this.index++;

  if (data1) {
    var blob1 = new Blob([data1], {
      type: 'application/octet-stream'
    });
    var fileName1 = type + '_' + this.index.toString() + '_' + 'data1.mp4';
    oldmtn.FileSaver.saveAs(blob1, fileName1);
  }

  if (data2) {
    var blob2 = new Blob([data2], {
      type: 'application/octet-stream'
    });
    var fileName2 = type + '_' + this.index.toString() + '_' + 'data2.mp4';
    oldmtn.FileSaver.saveAs(blob2, fileName2);
  }
};

export default FragmentDownloader;