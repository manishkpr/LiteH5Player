var CastUtils = function() {};

////////////////////////////////////////////////////////////////////////
// Begin CastUtils
CastUtils.GENERIC_MESSAGE_NAMESPACE = 'urn:x-cast:com.google.cast.media';
CastUtils.OLDMTN_MESSAGE_NAMESPACE = 'urn:x-cast:com.google.oldmtn.cast';

CastUtils.simulateTimeRanges_ = function(obj) {
  return {
    length: obj.length,
    // NOTE: a more complete simulation would throw when |i| was out of range,
    // but for simplicity we will assume a well-behaved application that uses
    // length instead of catch to stop iterating.
    start: function(i) {
      return obj.start[i];
    },
    end: function(i) {
      return obj.end[i];
    }
  };
};

CastUtils.serialize = function(thing) {
  return JSON.stringify(thing);
};

CastUtils.deserialize = function(str) {
  return JSON.parse(str, function(key, value) {
    if (value == 'NaN') {
      return NaN;
    } else if (value == '-Infinity') {
      return -Infinity;
    } else if (value == 'Infinity') {
      return Infinity;
    } else if (value && typeof value == 'object' &&
      value['__type__'] == 'TimeRanges') {
      // TimeRanges objects have been unpacked and sent as plain data.
      // Simulate the original TimeRanges object.
      return CastUtils.simulateTimeRanges_(value);
    }
    return value;
  });
};

// End CastUtils
///////////////////////////////////////////////////////////////////////////////////////////////////

export default CastUtils;