export class Fragment {
    constructor() {
        this.type = null; // audio/video/pd
        this.url = null; // https://abc.com/1.m4s
        this.content = null; // 'initSegment'/'data'

        this.byteRangeStart = null;
        this.byteRangeEnd = null;
    }
}

export class TrackInfo {
  constructor() {
    this.type = null; // audio/video/stream(ts)
    this.rep = null; // dash only
  }
}

export class StreamInfo {
  constructor() {
    this.url = null; // dash/hls/pd ulr
    this.duration = null; // current stream total duration
    this.tracks = []; // an array of TrackInfo
  }
}





