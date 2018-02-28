
import FactoryMaker from '../core/FactoryMaker';


function XHRLoader(config)
{
  let config_ = config || {
    remainingAttempts: 0,
    retryInterval: 4000
  };

  let request_ = null;
  let xhr_ = null;
  let needFailureReport_ = false;

  // for debug
  let enableLog_ = false;

  function loadInternal() {

  }

  function load(request) {
    printlog('begin load time: ' + (new Date().getTime())/1000);

    request_ = request;
    printlog(request_.url + ', remainingAttempts_: ' + config_.remainingAttempts);

    needFailureReport_ = true;

    xhr_ = new XMLHttpRequest;

    printlog('--before open--, readyState: ' + xhr_.readyState);

    xhr_.open('GET', request_.url);
    xhr_.responseType = 'arraybuffer';
    if (request_.rangeEnd) {
      xhr_.setRequestHeader('Range','bytes=' + request_.rangeStart + '-' + (request_.rangeEnd-1));
    }

    xhr_.onloadstart = function() {
      printlog('--onloadstart--');
    };

    const onload = function(ev) {
      printlog(`--onload--, status:${xhr_.status}, length: ${xhr_.response.byteLength}, readyState:${xhr_.readyState}`);

      if (xhr_.status >= 200 && xhr_.status <= 299) {
        request_.cbSuccess(xhr_.response);
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

    xhr_.onerror = function () {
      printlog('--onerror--, readystate: ' + xhr_.readyState);
    };

    xhr_.onreadystatechange = function (ev) {
      printlog('--onreadystatechange--, readystate: ' + xhr_.readyState);
    };

    xhr_.onload = onload.bind(this);
    xhr_.onloadend = onloadend.bind(this);

    printlog('--before send--, readyState: ' + xhr_.readyState);
    xhr_.send();
  };

  function printlog(log) {
    if (enableLog_) {
      console.log(log);
    }
  }

  let instance = {
    load: load
  };

  return instance;
}

XHRLoader.__h5player_factory_name = 'XHRLoader';
export default FactoryMaker.getSingletonFactory(XHRLoader);


