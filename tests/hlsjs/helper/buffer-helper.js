const assert = require('assert');
import BufferHelper from '../../../src/hls/hlsjs/src/helper/buffer-helper';

function createMockBuffer (buffered) {
  return {
    start: i => (buffered.length > i) ? buffered[i].startPTS : null,
    end: i => (buffered.length > i) ? buffered[i].endPTS : null,
    length: buffered.length
  };
}

describe('BufferHelper', function () {
  // Begin oldmtn added
  describe('bufferInfo', () => {
    it('should return found buffer info when maxHoleDuration is 0', function () {
      const media = {
      get buffered () {
        return createMockBuffer([
            {startPTS: 0, endPTS: 40},
            {startPTS: 232, endPTS: 270},
            {startPTS: 372, endPTS: 420},
            {startPTS: 510, endPTS: 560},
          ]);
        }
      };
      const maxHoleDuration = 0;
      var vActual = BufferHelper.bufferInfo(media, 523, maxHoleDuration);
      var vExpect = {
        len: 37,
        start: 510,
        end: 560,
        nextStart: undefined
      };

      assert.deepEqual(vActual, vExpect);
    });
  });
  // End oldmtn added
});



