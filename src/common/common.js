export class Fragment {
  constructor() {
    this.type = null; // audio/video/pd
    this.url = null; // https://abc.com/1.m4s

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

export class PeriodInfo {
  constructor() {
    this.url = null; // dash/hls/pd ulr
    this.duration = null; // current stream total duration
    this.tracks = []; // an array of TrackInfo
  }
}

