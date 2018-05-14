////////////////////////////////////////
// Tools
function ArrayBufferToString(arr) {
    var str = '';
    var view = new Uint16Array(arr);
    for (var i = 0; i < view.length; i++) {
        var m1 = arr[i];
        str += m1;
    }
    return str;
}

// ArrayBuffer转为字符串，参数为ArrayBuffer对象
function ab2str(buf) {
   return String.fromCharCode.apply(null, new Uint16Array(buf));
}

// 字符串转为ArrayBuffer对象，参数为字符串
function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
         bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

////////////////////////////////////////
// main
var worker01 = null;

function onWorkerMsg(msg) {
    //console.log('incoming message from worker, msg:', msg);
    switch (msg.data.cmd) {
        case 'cb01':
        {
            //sendMainArrBuff(msg.data.aBuf)
            console.log('main recv from worker01 using method2: ' + ab2str(msg.data.aBuf));
        }
        break;
        default:
        {
            console.log(msg.data);
        }
    }
}

function createWorker()
{
    if (!worker01) {
        worker01 = new Worker('./app/worker01.js');
        worker01.addEventListener('message', onWorkerMsg);
    } else {
        console.log('worker01 is existed');
    }
}

function destroyWorker() {
    if (worker01) {
        worker01.postMessage('close');
        worker01 = null;
    }
}

/////////////////////////////////////////////////////////////////////
// operate
function onPostMsgToWorker()
{
    // 1
    // var arrBuf = new ArrayBuffer(10);
    // arrBuf[0] = '0';
    // arrBuf[1] = '1';
    // arrBuf[2] = '2';
    // arrBuf[3] = '3';
    // arrBuf[4] = '4';
    // arrBuf[5] = '5';
    // arrBuf[6] = '6';
    // arrBuf[7] = '7';
    // arrBuf[8] = '8';
    // arrBuf[9] = '9';
    var arrBuf = str2ab("0123456789");
    console.debug('main post msg to worker: ' + ab2str(arrBuf));
    worker01.postMessage({ cmd: 'msg01', arrBuf }, [arrBuf]);

    // 2
    // var uInt8Array = new Uint8Array(new ArrayBuffer(10));
    // for (var i = 0; i < uInt8Array.length; ++i) {
    //     uInt8Array[i] = i * 2; // [0, 2, 4, 6, 8,...]
    // }

    // console.log('uInt8Array.toString() = ' + uInt8Array.toString());
    // console.log('uInt8Array.byteLength = ' + uInt8Array.byteLength);
    // worker01.postMessage(uInt8Array);
}


/*
function class01() {
    let instance;

    let aaa = 123;
    instance = {
        aaa: aaa
    };

    return instance;
}

var objClass01 = new class01();
console.debug('objClass01: ' + objClass01.aaa);
var arrBuf = new ArrayBuffer(10);
arrBuf[0] = '0';
arrBuf[1] = '1';
arrBuf[2] = '2';
arrBuf[3] = '3';
arrBuf[4] = '4';
arrBuf[5] = '5';
arrBuf[6] = '6';
arrBuf[7] = '7';
arrBuf[8] = '8';
arrBuf[9] = '9';


function test1() {
    let msg01 = 'msg01';
    console.log('main send to worker01: ' + msg01);
            //worker01.postMessage(msg01);
            worker01.postMessage({ cmd: 'cls01', obj: arrBuf }, [arrBuf]);
            console.debug('main got message: ' + ArrayBufferToString(arrBuf));

            // Method1
            //worker01.onmessage = function (e) {
            //    console.log('main recv from worker01: ' + e.data);
            //}

            // Method2
            function onWorker01Msg(e) {
                console.log('main recv from worker01 using method2: ' + e.data);
            }
            worker01.addEventListener('message', onWorker01Msg);
        }

    }
    */


