// Define xhr_loader internal structure FYI.

class XHRLoaderRequest {
  constructor() {
    this.url = null;
    this.rangeStart = null;
    this.rangeEnd = null;
    this.cbSuccess = null;
  }
}

class XHRLoaderConfig {
  constructor() {
    this.remainingAttempts = 0;
    this.retryInterval = 4000;
  }
}

class XHRLoaderCallback {
  constructor() {

  }
}

function XHRLoader() {
  let request_ = null;
  let config_ = null;
  let callbacks_ = null;

  let xhr_ = null;
  let needFailureReport_ = false;

  function load(request, config, callbacks) {
    printlog('begin load time: ' + (new Date().getTime())/1000);
    // save input parameters
    request_ = request;
    config_ = config || {
      remainingAttempts: 0,
      retryInterval: 4000
    };
    callbacks_ = callbacks;

    printlog(request_.url + ', remainingAttempts_: ' + config_.remainingAttempts);

    // init reference variables
    needFailureReport_ = true;
    xhr_ = new XMLHttpRequest;

    printlog('--before open--, readyState: ' + xhr_.readyState);
    xhr_.open('GET', request_.url);
    if (request_.rangeEnd) {
      xhr_.setRequestHeader('Range', 'bytes=' + request_.rangeStart + '-' + (request_.rangeEnd - 1));
    }

    xhr_.onloadstart = function() {
      printlog('--onloadstart--');
    };

    const onload = function(ev) {
      //printlog(`--onload--, status:${xhr_.status}, length: ${xhr_.response.byteLength}, readyState:${xhr_.readyState}`);
      printlog(`--onload--, status:${xhr_.status}, readyState:${xhr_.readyState}`);

      if (xhr_.status >= 200 && xhr_.status <= 299) {
        callbacks_.onSuccess(xhr_.response);
        needFailureReport_ = false;
      };
    }

    const onloadend = function () {
      printlog('--onloadend--, remainingAttempts_: ' + config_.remainingAttempts + ', readystate: ' + xhr_.readyState);
      printlog('--------------------------------------------------------------');

      if (needFailureReport_) {
        if (config_.remainingAttempts > 0) {
          config_.remainingAttempts --;

          // BD, test retry counts
          // if (config_.remainingAttempts === 0) {
          //   request_.url = 'http://localhost/1/tmp/test.txt';
          // }
          // // ED

          printlog('begin load timeout: ' + (new Date().getTime())/1000);

          //setTimeout(retryFunc, config_.retryInterval);
          setTimeout(load.bind(this, request_), config_.retryInterval);
        }
      }
    };

    xhr_.onprogress = function (ev) {
      printlog(`--onprogress--, loaded:${ev.loaded}, total:${ev.total}, readyState:${xhr_.readyState}`);
    };

    xhr_.ontimeout = function () {
      printlog('--ontimeout--, readystate: ' + xhr_.readyState);
    };

    xhr_.onabort = function () {
      printlog('--onabort--, readystate: ' + xhr_.readyState);
    };

    xhr_.onerror = function (e) {
      printlog('--onerror--, readystate: ' + xhr_.readyState);
    };

    xhr_.onreadystatechange = function (ev) {
      printlog('--onreadystatechange--, readystate: ' + xhr_.readyState);
    };

    xhr_.onload = onload.bind(this);
    xhr_.onloadend = onloadend.bind(this);

    xhr_.responseType = request.responseType || 'arraybuffer';
    printlog('--before send--, readyState: ' + xhr_.readyState);
    xhr_.send();
  }

  function printlog(log) {
    console.log(log);
  }

  let instance = {
    load: load
  };

  return instance;
}

export default XHRLoader;


