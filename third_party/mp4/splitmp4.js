import { ajax } from '../../src/utils/ajax';
import util from './utils';

// let mvhd = util.findBox(moov, 'mvhd');
// let traks = util.findBox(moov, 'trak');

let url_moov = 'http://localhost/2/pd/mp4/big_buck_bunny/mov_bbb_moov.box';

function SplitMP4() {
  function test1() {
    console.log('+test1, here');

    function successHandler(xhr) {
      let data = xhr.response;

      let a = 2;
      let b = a;
    }

    function errorHandler(xhr) {
    }

    let args = {
      responseType: 'arraybuffer'
    }
    ajax(url_moov, successHandler, errorHandler, args);
  }

  let instance = {
    test1: test1
  };
  return instance;
};

export default SplitMP4;