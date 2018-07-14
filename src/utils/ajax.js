// Define xhr_loader internal structure FYI.

// XHR ReadyState
// 0 UNSENT (未打开)  open()方法还未被调用.
// 1 OPENED  (未发送) open()方法已经被调用.
// 2 HEADERS_RECEIVED (已获取响应头) send()方法已经被调用, 响应头和响应状态已经返回.
// 3 LOADING (正在下载响应体) 响应体下载中; responseText中已经获取了部分数据.
// 4 DONE (请求完成) 整个请求过程已经完毕.

const XHR_READYSTATE_UNSENT = 0;
const XHR_READYSTATE_OPENED = 1;
const XHR_READYSTATE_HEADERS_RECEIVED = 2;
const XHR_READYSTATE_LOADING = 3;
const XHR_READYSTATE_DONE = 4;

// HTTP Error Code
// 200 OK

let xhr = null;

function printlog(log) {
  console.log(log);
}

function _readyStateChangeHandler(options) {
  return function(e) {
    const xhr = e.currentTarget || options.xhr;
    if (xhr.readyState === XHR_READYSTATE_DONE) {
      if (xhr.status === 200) {
        options.oncomplete(xhr);
      }
    }
  };
}

function _requestError(options) {
  return function(e) {
    const xhr = e.currentTarget || options.xhr;
    options.onerror(xhr);
  };
}

export function ajax(url, completeCallback, errorCallback) {
  printlog('begin load time: ' + (new Date().getTime()) / 1000);

  // save input parameters
  const options = {
    xhr: null,
    url: url,
    oncomplete: completeCallback,
    onerror: errorCallback
  };

  printlog('ajax: ' + options.url);

  // init reference variables
  xhr = options.xhr = new XMLHttpRequest;

  printlog('--before open--, readyState: ' + xhr.readyState);
  xhr.open('GET', options.url);

  xhr.onreadystatechange = _readyStateChangeHandler(options);
  xhr.onerror = _requestError(options);

  printlog('--before send--, readyState: ' + xhr.readyState);
  xhr.send();

  return xhr;
};