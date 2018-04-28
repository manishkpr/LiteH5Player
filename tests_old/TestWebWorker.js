'use strict'

import FactoryMaker from '../src/core/FactoryMaker.js';
import TypeConverter from '../src/utils/TypeConverter.js';

function TestWebWorker() {
    let instance;
    let workerInstance;
    let tmpValue;
    function test1() {
        console.log('begin test1--');
    
        console.log('end test1--');
    }

    function onWorkerMsg(msg) {
        //console.log('incoming message from worker, msg:', msg);
        switch (msg.data.cmd) {
            case 'cb01':
            {
                //sendMainArrBuff(msg.data.aBuf)
                console.log('main, recv cb01, flag: ' + msg.data.flag);
            } break;
            case 'cb02':
            {
                console.log('main, recv cb02, flag: ' + msg.data.flag);
            } break;
            case 'reqMsg03':
            {
                console.log('main, post msg03');
                postmsg3();
                //workerInstance.postMessage({ cmd: 'msg03'});
            } break;
            default:
            {
                console.log(msg.data);
            }
        }
    }

    function createWorker() {
        if (!workerInstance) {
            workerInstance = new Worker('../test/worker01.js');
            workerInstance.addEventListener('message', onWorkerMsg);
        } else {
            console.log('workerInstance is existed');
        }
    }

    function destroyWorker() {
        if (workerInstance) {
            workerInstance.postMessage('close');
            workerInstance = null;
        }
    }

    function postmsg01() {
        let arrBuf = TypeConverter.str2ab("1111111111");
        console.debug('main, post msg01 to worker: ' + TypeConverter.ab2str(arrBuf));

        tmpValue = 1;
        workerInstance.postMessage({ cmd: 'msg01', arrBuf }, [arrBuf]);
    }

    function postmsg02() {
        let arrBuf = TypeConverter.str2ab("222222222222");
        console.debug('main, post msg02 to worker: ' + TypeConverter.ab2str(arrBuf));

        tmpValue = 2;
        workerInstance.postMessage({ cmd: 'msg02', arrBuf }, [arrBuf]);
    }

    function postmsg03() {
        console.debug('main, post msg03');

        tmpValue = 3;
        workerInstance.postMessage({ cmd: 'msg03'});
    }

    function setup() {
        instance = {
            test1: test1,
            createWorker: createWorker,
            destroyWorker: destroyWorker,
            postmsg01: postmsg01,
            postmsg02: postmsg02
        };

        workerInstance = null;

        tmpValue = -1;
    }

    setup();

    return instance;
}

TestWebWorker.__h5player_factory_name = 'TestWebWorker';
let factory = FactoryMaker.getClassFactory(TestWebWorker);
export default factory;







