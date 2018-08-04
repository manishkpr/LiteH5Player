// MIT License

// Copyright (c) oldmtn(huangh0604@gmail.com). All right reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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

