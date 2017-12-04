'use strict'
// worker01.js

const TypeConverter = {

    // ArrayBuffer转为字符串，参数为ArrayBuffer对象
    ab2str: function(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    },

    // 字符串转为ArrayBuffer对象，参数为字符串
    str2ab: function(str) {
        var buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
        var bufView = new Uint16Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
};

/////////////////////////////////////////////////////////////////////

function sendWorkerArrBuff(aBuf) {
    self.postMessage({cmd:'cb01', aBuf:aBuf}, [aBuf]);
}
var g_flag01 = 3;
function onTimeout01() {
    if (g_flag01 !== 0) {
        console.log('worker, in timeout function. g_flag01: ' + g_flag01);
        self.postMessage({cmd:'cb01', flag: g_flag01});

        g_flag01 --;
    }
}

var g_flag02 = 3;
function onTimeout02() {
    if (g_flag02 !== 0) {
        console.log('worker, in timeout function. g_flag02: ' + g_flag02);
        self.postMessage({cmd:'cb02', flag: g_flag02});

        g_flag02 --;
        setTimeout(onTimeout02, 1000);
    }
}

function fabonacci(n) {
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }
    return fabonacci(n - 1) + fabonacci(n - 2);
}

function test_msg01() {
    console.log('begin of test_msg01(), t: ' + Date.parse(new Date()));

    self.postMessage({cmd:'reqMsg03'});

    fabonacci(40);

    console.log('end of test_msg01(), t: ' + Date.parse(new Date()));
}

function test_msg02() {
    console.log('begin of test_msg02(), t: ' + Date.parse(new Date()));

    self.postMessage({cmd:'reqMsg03'});

    fabonacci(40);

    console.log('end of test_msg02(), t: ' + Date.parse(new Date()));
}

function test_msg03() {
    console.log('begin of test_msg03(), t: ' + Date.parse(new Date()));
}

self.onmessage = function (e) {
    switch(e.data.cmd)
    {
        case 'msg01': {
            console.debug('worker, recv msg01: ' + TypeConverter.ab2str(e.data.arrBuf));

            //sendWorkerArrBuff(e.data.aBuf);
            // g_flag01 = 3;
            // onTimeout01();
            test_msg01();
        } break;
        case 'msg02': {
            console.debug('worker, recv msg02: ' + TypeConverter.ab2str(e.data.arrBuf));

            //sendWorkerArrBuff(e.data.aBuf);
            // g_flag02 = 3;
            // onTimeout02();
            test_msg02();
        } break;
        case 'msg03':
        {
            console.debug('worker, recv msg03');
            //test_msg03();
        } break;
        default:
        break;
    }

  // var uInt8Array = e.data;
  // postMessage("Inside worker.js: uInt8Array.toString() = " + uInt8Array.toString());
  // postMessage("Inside worker.js: uInt8Array.byteLength = " + uInt8Array.byteLength);


    // 
    //if (e.data === 'close') {
    //    console.log('worker01 recv close msg, and it will close itself now.')
    //    self.close();
    //    return;
    //}

    //console.log('worker01 recv from main: ' + e.data);

    //let msg2 = 'haha, i am from worker01.js';
    //console.log('worker01 send to main: ' + msg2)
    //postMessage(msg2);
}







