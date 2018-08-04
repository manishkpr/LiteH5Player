export default class Level {
  constructor (baseurl) {
    this.type = null;       // value of #EXT-X-PLAYLIST-TYPE, could be VOD or LIVE(e.g. #EXT-X-PLAYLIST-TYPE:VOD)
    this.version = null;    // value of #EXT-X-VERSION(e.g. #EXT-X-VERSION:4)
    this.url = baseurl;
    this.fragments = [];
    this.live = true;       // If manifest has #EXT-X-ENDLIST, then this.live is false.
    this.startSN = 0;

    //
    this.averagetargetduration; //
    this.endSN; // The end sequence number of current level.
    this.startTimeOffset; // 
    this.targetduration; // value of #EXT-X-TARGETDURATION, (e.g. #EXT-X-TARGETDURATION:11)
    this.totalduration; // sum of all fragments' duration

  }
};

