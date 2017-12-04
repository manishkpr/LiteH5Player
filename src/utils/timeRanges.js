/**
 *  TimeRanges to string helper
 */

const TimeRanges = {
  toString : function(r) {
    var log = '', len = r.length;
    for (var i=0; i<len; i++) {
      let beg = r.start(i);
      let end = r.end(i);

      //console.log('start: ' + beg + ', end: ' + end);
      log += '[' + r.start(i) + ',' + r.end(i) + ']';
    }
    return log;
  }
};

module.exports = TimeRanges;
