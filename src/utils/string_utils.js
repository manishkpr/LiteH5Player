const StringUtils = {

  // ArrayBuffer转为字符串，参数为ArrayBuffer对象
  ab2str: function(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  // 字符串转为ArrayBuffer对象，参数为字符串
  str2ab: function(str) {
    var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },
  ab2str_v1: function(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  },
  // 字符串转为ArrayBuffer对象，参数为字符串
  str2ab_v1: function(str) {
    var buf = new ArrayBuffer(str.length); // 每个字符占用1个字节
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },
  u8arrToB64: function(u8arr) {
    return btoa(String.fromCharCode.apply(null, u8arr)).
      replace(/\+/g, '-').replace(/\//g, '_').replace(/=*$/, '');
  },
  b64ToU8arr: function(encoded) {
    return new Uint8Array(atob(encoded).split('').map(function(c) {
      return c.charCodeAt(0);
    }));
  }
};

module.exports = StringUtils;