
import FactoryMaker from '../core/FactoryMaker';


function XHRLoader(config)
{
  let config_ = config || {
    remainingAttempts: 1,
    retryInterval: 4000
  };

  let request_ = null;
  let xhr_ = null;
  let needFailureReport_ = false;

  // for debug
  let printlog = false;

  function loadInternal() {

  }

  function load(request) {
    if (printlog) {
      console.log('begin load time: ' + (new Date().getTime())/1000);
    }

    request_ = request;
    console.log(request_.url + ', remainingAttempts_: ' + config_.remainingAttempts);

    needFailureReport_ = true;

    xhr_ = new XMLHttpRequest;

    if (printlog) {
      console.log('--before open--, readyState: ' + xhr_.readyState);
    }

    xhr_.open('GET', request_.url);
    xhr_.responseType = 'arraybuffer';
    if (request_.rangeEnd) {
      xhr_.setRequestHeader('Range','bytes=' + request_.rangeStart + '-' + (request_.rangeEnd-1));
    }

    xhr_.onloadstart = function() {
      console.log('--onloadstart--');
    };

    const onload = function(ev) {
      if (printlog) {
        console.log('--onload--, status: ' + xhr_.status);
      }

      if (printlog) {
        console.debug("response length: " + xhr_.response.byteLength);
      }

      if (xhr_.status >= 200 && xhr_.status <= 299) {
        request_.cbSuccess(xhr_.response);
        needFailureReport_ = false;
      };
    }

    const onloadend = function () {
      if (printlog) {
        console.log('--onloadend--, remainingAttempts_: ' + config_.remainingAttempts);
        console.log('--------------------------------------------------------------');
      }

      if (needFailureReport_) {
        if (config_.remainingAttempts > 0) {
          config_.remainingAttempts --;

          // BD, test retry counts
          // if (config_.remainingAttempts === 0) {
          //   request_.url = 'http://localhost/1/tmp/test.txt';
          // }
          // // ED

          if (printlog) {
            console.log('begin load timeout: ' + (new Date().getTime())/1000);
          }

          //setTimeout(retryFunc, config_.retryInterval);
          setTimeout(load.bind(this, request_), config_.retryInterval);
        }
      }
    };

    xhr_.onprogress = function (ev) {
      if (printlog) {
        console.log(`--onprogress--, loaded:${ev.loaded}, total:${ev.total}`);
      }
    };

    xhr_.ontimeout = function () {
      console.log('--ontimeout--');
    };

    xhr_.onabort = function () {
      console.log('--onabort--');
    };

    xhr_.onerror = function () {
      console.log('--onerror--');
    };

    xhr_.onreadystatechange = function (ev) {
      if (printlog) {
        console.log('--onreadystatechange--, readystate: ' + readyState);
      }
    };

    xhr_.onload = onload.bind(this);
    xhr_.onloadend = onloadend.bind(this);

    console.log('--before send--, readyState: ' + xhr_.readyState);
    xhr_.send();
  };

  let instance = {
    load: load
  };

  return instance;
}

XHRLoader.__h5player_factory_name = 'XHRLoader';
export default FactoryMaker.getSingletonFactory(XHRLoader);


