var fs = require("fs");
const assert = require('assert');
import Decrypter from '../../../third_party/hlsjs/src/crypt/decrypter';

function createInitializationVector(segmentNumber) {
  let uint8View = new Uint8Array(16);

  for (let i = 12; i < 16; i++) {
    uint8View[i] = (segmentNumber >> 8 * (15 - i)) & 0xff;
  }

  return uint8View;
}

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

// describe('Decrypter', function() {
//   it('test1', function() {
var keyPath = "D:/xampp/htdocs/2/drm/aes01/oceans.key";
var contentInPath = "D:/xampp/htdocs/2/drm/aes01/oceans_aes-audio=65000-video=571000-1.ts";
var contentOutPath = "D:/xampp/htdocs/2/drm/aes01/oceans_aes-audio=65000-video=571000-1_out.ts";
var iv = createInitializationVector(1);

//
var keyBuffer = fs.readFileSync(keyPath);
var key = toArrayBuffer(keyBuffer);
var content = toArrayBuffer(fs.readFileSync(contentInPath));

console.log('keyBuffer: ', keyBuffer); // true  表示Buffer对象已转为ArrayBuffer
console.log('key: ', key); // true  表示Buffer对象已转为ArrayBuffer
console.log('keyBuffer instanceof ArrayBuffer: ' + keyBuffer instanceof ArrayBuffer); // true  表示Buffer对象已转为ArrayBuffer
console.log('key instanceof ArrayBuffer: ' + key instanceof ArrayBuffer); // true  表示Buffer对象已转为ArrayBuffer
console.log('content: ', content); // true  表示Buffer对象已转为ArrayBuffer
console.log('iv: ', iv);

var config = {
  enableSoftwareAES: true
};
var decrypter = new Decrypter(null, config);
decrypter.decrypt(content, key, iv.buffer, function(decryptedData) {
  console.log('callback: ', decryptedData);

  fs.writeFile(contentOutPath, toBuffer(decryptedData), function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("file writes sucess!!")
    }
  });
});
//   });
// });