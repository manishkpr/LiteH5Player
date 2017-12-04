'use strict'

import FactoryMaker from './core/FactoryMaker.js';
import EventBus from './core/EventBus';

import VTTParser from './test/VTTParser.js';
import TTMLParser from './test/TTMLParser.js';

import { test_cea608 } from './test/testcc';
import Decrypter from './crypt/decrypter';

import commonUtil from './utils/common_utils'

import XHRLoader from './utils/xhr_loader';

import saveAs from './Utils/FileSaver.js';
var mySaveAs = saveAs;

var context = window;


//////////////////////////////////////////////////////////////////////////////
function Test() {
  let context_ = this.context;
  let instance;
  let xhrLoader;

  function setup() {
    xhrLoader = XHRLoader(context_).create();
  }

  function on1001Completed() {
    console.debug('--on1001Completed--');
  }

  function on1001Completed2() {
    console.debug('--on1001Completed2--');
  }

  function testEvent() {
    const eventBus = EventBus(context).getInstance();

    eventBus.on(1001, on1001Completed, instance);
    eventBus.on(1001, on1001Completed2, instance);

    eventBus.trigger(1001, {});
    eventBus.off(1001, on1001Completed, instance);
    eventBus.off(1001, on1001Completed2, instance);
  }

  function testForEach() {
    var arr01 = [];
    arr01.push('aaa');
    arr01.push('bbbb');
    arr01.push('c');
    arr01.push('dd');
          
    arr01.forEach((ele) => {
      console.debug(ele);
    });
  }

  function test1() {
    console.log('begin test1--');
    //commonUtil.test1('2131313');
    commonUtil.test1();
    console.log('end test1--');
  }

  function test_readfile() {
        
  }

  function test_vtt() {
    console.debug('test_vtt was called here.');

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.status == 200) {
                
        var parser = VTTParser(context).getInstance();
        var captionArray = parser.parse(this.responseText);
        for (let i=0; i < captionArray.length; i ++) {
          console.debug('[' + captionArray[i].start + ',' + captionArray[i].end + '] ' + captionArray[i].data);
        }
      }
    };

    xhr.open("GET", "http://localhost/tmp/fileSequence0.webvtt", true);
    xhr.send();
  }


  function test_ttml() {
    console.debug('test_ttml was called here.');

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.status == 200) {
        var parser = TTMLParser(context).getInstance();
        parser.parse(this.responseText);
      }
    };

    xhr.open("GET", "http://localhost/tmp/sub_eng_short.xml", true);
    xhr.send();
  }

  var index = 0;
  function test_aes128() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';

    xhr.onload = function () {
      if (this.status == 200) {

        // 
        var data = this.response;

        var decrypter = new Decrypter({enableSoftwareAES: true});
        var key = [0xF5, 0x71, 0xBF, 0xEC, 0xFD, 0x1A, 0xB9, 0xAD, 0xB0, 0x5C, 0xE6, 0xFA, 0x03, 0x0E, 0xFD, 0x81];
        var key_u8 = new Uint8Array(key);
        var key_buffer = key_u8.buffer;
        var iv =  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
        var iv_u8 = new Uint8Array(iv);
        var iv_buffer = iv_u8.buffer;
        
        decrypter.decrypt(data, key_buffer, iv_buffer, function (decryptedData) {
          //var endTime;
          //try {
          //  endTime = performance.now();
          //} catch(error) {
          //  endTime = Date.now();
          //}
          //localthis.observer.trigger(Event.FRAG_DECRYPTED, { stats: { tstart: startTime, tdecrypt: endTime } });
          //localthis.pushDecrypted(new Uint8Array(decryptedData), decryptdata, new Uint8Array(initSegment), audioCodec, videoCodec, timeOffset, discontinuity, trackSwitch, contiguous, duration, accurateTimeOffset,defaultInitPTS);

          // save ts to local
          var blob = new Blob([new Uint8Array(decryptedData)], {type: 'application/octet-stream'});
          var fileName = index.toString() + '.ts';
          mySaveAs.saveAs(blob, fileName);
          index ++;
        });
      }
    };

    xhr.open("GET", "http://localhost/2/myhls/drm/aes/oceans_aes-audio=65000-video=571000-1.ts", true);
    xhr.send();
  }

  function test_xhrloader() {
    let content = {url: 'http://10.2.68.51/7/hls/v10/gear/gear1/main.ts', rangeStart: 0, rangeEnd: 326744};

    function onSuccess(bytes) {
      console.log('test_xhrloader, onSuccess, bytes: ' + bytes.byteLength);
    }

    xhrLoader.load(content, onSuccess);
  }

  instance = {
    test1: test1,
    test_readfile: test_readfile,
    test_vtt: test_vtt,
    test_cea608: test_cea608,
    test_aes128: test_aes128,
    test_xhrloader: test_xhrloader
  };

  setup();
  return instance;
}

Test.__h5player_factory_name = 'Test';
let factory = FactoryMaker.getClassFactory(Test);
export default factory;

