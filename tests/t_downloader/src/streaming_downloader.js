import StringUtils from '../../../src/utils/string_utils';
import XHRLoader from '../../../src/utils/xhr_loader';
import M3U8Parser from '../../../third_party/hlsjs/src/loader/m3u8-parser';
import FileSaver from './FileSaver';

function StreamingDownloader() {
  let context_ = {};

  let xhrLoader_ = XHRLoader(context_).create();

  let hlsUrl_;
  let fragmentCnt_;
  let levelDetails_;
  let flagInitSegmentDownloaded_;
  let currentSN_;
  let currentFrag_;

  function downloadHls(url, cnt) {
    flagInitSegmentDownloaded_ = false;
    currentSN_ = 0;
    hlsUrl_ = url;
    fragmentCnt_ = cnt || 15;

    let request = {
      url: hlsUrl_,
      responseType: 'text'
    };
    let callbacks = {
      onSuccess: loadHlsSuccess
    };

    xhrLoader_.load(request, null, callbacks);
  }

  function loadHlsSuccess(content) {
    // save fragment
    var blob = new Blob([content], {
      type: "text/plain"
    });
    FileSaver.saveAs(blob, 'playlist.m3u8');

    //
    levelDetails_ = M3U8Parser.parseLevelPlaylist(content, hlsUrl_, 0, 'main');

    //
    currentFrag_ = getNextFragment();
    if (currentFrag_) {
      downloadFragment();
    }
  }

  function getNextFragment() {
    let frag;
    if (levelDetails_.initSegment && !flagInitSegmentDownloaded_) {
      frag = levelDetails_.initSegment;
      flagInitSegmentDownloaded_ = true;
    } else if (currentSN_ !== levelDetails_.fragments.length) {
      // only download first 15 fragments
      if (currentSN_ < fragmentCnt_) {
        frag = levelDetails_.fragments[currentSN_];
        currentSN_++;
      }
    }

    return frag;
  }

  function downloadFragment() {
    if (currentFrag_) {
      let request = {
        url: currentFrag_.url
      };
      let callbacks = {
        onSuccess: loadHlsFragmentSuccess
      };

      xhrLoader_.load(request, null, callbacks);
    }
  }

  function loadHlsFragmentSuccess(arrBuffer) {
    // save fragment
    var blob = new Blob([arrBuffer], {
      type: "application/octet-stream"
    });
    FileSaver.saveAs(blob, currentFrag_.relurl);

    // try to download next fragment
    currentFrag_ = getNextFragment();
    if (currentFrag_) {
      downloadFragment();
    }
  }

  let instance_ = {
    downloadHls: downloadHls
  };
  return instance_;
}

export default StreamingDownloader;