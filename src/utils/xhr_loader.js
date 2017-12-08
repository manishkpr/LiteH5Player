
// Study Site:
// 1. https://segmentfault.com/a/1190000004322487


var XHRLoader = function (config) {
  this.config_ = config || {
    remainingAttempts: 1,
    retryInterval: 4000
  };

  // for debug
  this.printlog = false;
};

XHRLoader.prototype.loadInternal = function () {

};

XHRLoader.prototype.load = function (request) {
  if (this.printlog) {
    console.log('begin load time: ' + (new Date().getTime())/1000);
  }

  this.request_ = request;
  console.log(this.request_.url + ', remainingAttempts_: ' + this.config_.remainingAttempts);

  this.needFailureReport_ = true;

  this.xhr_ = new XMLHttpRequest;

  if (this.printlog) {
    console.log('--before open--, readyState: ' + this.xhr_.readyState);
  }

  this.xhr_.open('GET', this.request_.url);
  this.xhr_.responseType = 'arraybuffer';
  if (this.request_.rangeEnd) {
    this.xhr_.setRequestHeader('Range','bytes=' + this.request_.rangeStart + '-' + (this.request_.rangeEnd-1));
  }

  this.xhr_.onloadstart = function () {
    console.log('--onloadstart--');
  };

  const onload = function (ev) {
    if (this.printlog) {
      console.log('--onload--, status: ' + this.xhr_.status);
    }

    if (this.printlog) {
      console.debug("response length: " + this.xhr_.response.byteLength);
    }

    if (this.xhr_.status >= 200 && this.xhr_.status <= 299) {
      this.request_.cbSuccess(this.xhr_.response);
      this.needFailureReport_ = false;
    }
  };

  const onloadend = function () {
    if (this.printlog) {
      console.log('--onloadend--, remainingAttempts_: ' + this.config_.remainingAttempts);
      console.log('--------------------------------------------------------------');
    }

    if (this.needFailureReport_) {
      if (this.config_.remainingAttempts > 0) {
        this.config_.remainingAttempts --;

          // BD, test retry counts
          // if (this.config_.remainingAttempts === 0) {
          //   this.request_.url = 'http://localhost/1/tmp/test.txt';
          // }
          // // ED

          if (this.printlog) {
            console.log('begin load timeout: ' + (new Date().getTime())/1000);
          }

          //setTimeout(retryFunc, this.config_.retryInterval);
          setTimeout(this.load.bind(this, this.request_), this.config_.retryInterval);
        }
      }
    };

    this.xhr_.onprogress = function (ev) {
      if (this.printlog) {
        console.log(`--onprogress--, loaded:${ev.loaded}, total:${ev.total}`);
      }
    };

    this.xhr_.ontimeout = function () {
      console.log('--ontimeout--');
    };

    this.xhr_.onabort = function () {
      console.log('--onabort--');
    };

    this.xhr_.onerror = function () {
      console.log('--onerror--');
    };

    this.xhr_.onreadystatechange = function (ev) {
      if (this.printlog) {
        console.log('--onreadystatechange--, readystate: ' + this.readyState);
      }
    };

    this.xhr_.onload = onload.bind(this);
    this.xhr_.onloadend = onloadend.bind(this);

    console.log('--before send--, readyState: ' + this.xhr_.readyState);
    this.xhr_.send();
  };

export default XHRLoader;
