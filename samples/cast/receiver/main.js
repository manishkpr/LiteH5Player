const LOG_DEBUG = undefined;
const LOG_INFO = 1;
const LOG_WARN = 2;
const LOG_ERROR = 3;

function printLogUI(msg) {
  var v = document.getElementById('idLog');
  v.innerHTML = (v.innerHTML + '<br/>' + msg);
}

function printLog(msg, level) {
  if (!level || level === LOG_DEBUG) {
    console.log('UI: ' + msg);
  }
  if (level === LOG_INFO) {
    console.log('UI: ' + msg);
  }
  printLogUI(msg);
}

function initUI() {
}

function initData() {
  console.log('+initData');
  var receiver = new oldmtn.CastReceiver('player-container');

  receiver.start();
}

window.onload = function() {
  console.log('+onload');
  //initUI();
  initData();
};
