import FactoryMaker from '../core/FactoryMaker';
import BoxParser from './BoxParser';
import ceaParserManager from './ceaParserManager.js';

var context = window;
var boxParser = BoxParser(context).getInstance();

function extractCeaData(data) {
  /* Insert [time, data] pairs in order into array. */
  var insertInOrder = function (arr, time, data) {
    var len = arr.length;
    if (len > 0) {
      if (time >= arr[len - 1][0]) {
        arr.push([time, data]);
      } else {
        for (var pos = len - 1; pos >= 0; pos--) {
          if (time < arr[pos][0]) {
            arr.splice(pos, 0, [time, data]);
            break;
          }
        }
      }
    } else {
      arr.push([time, data]);
    }
  };

  var saveCCData = function (arr, time, data) {
    if ((0 === data.length) || ('undefined' === data[0]) || ('undefined' === data[1])) {
      return;
    }
    var bFound = false;
    for (var i = 0; i < arr.length; i ++) {
      if (arr[i][0] == data[0]) {
        arr[i].push([time, data[1]]);
        bFound = true;
        break;
      }
    }
    if (!bFound) {
      arr.push([data[0],[time, data[1]]]);
    }
  };

  var isoFile = boxParser.parse(data);
  var moof = isoFile.getBox('moof');
  var tfdt = isoFile.getBox('tfdt');
  var tfhd = isoFile.getBox('tfhd'); //Can have a base_data_offset and other default values
  //log("tfhd: " + tfhd);
  //var saio = isoFile.getBox('saio'); // Offset possibly
  //var saiz = isoFile.getBox('saiz'); // Possible sizes
  var truns = isoFile.getBoxes('trun'); //
  var trun = null;

  if (truns.length === 0) {
    return null;
  }
  trun = truns[0];
  if (truns.length > 1) {
    log('Warning: Too many truns');
  }
  var baseOffset = moof.offset + trun.data_offset;
  //Doublecheck that trun.offset == moof.size + 8
  var sampleCount = trun.sample_count;
  var startPos = baseOffset;
  var baseSampleTime = tfdt.baseMediaDecodeTime;
  var raw = new DataView(data);
  var allCcData = { 'StartTime': null, 'EndTime': null, fields: [] };
  var allCeaNalus = [];
  var accDuration = 0;
  for (var i = 0; i < sampleCount; i++) {
    var sample = trun.samples[i];

    var test = 'Index: ' + i.toString() + ', BaseSampleTime: ' + baseSampleTime;
    if (accDuration == 0) {
      test += (', ActualDuration: ' + accDuration + ' (Error, actual duration cannot be 0)');
    } else {
      test += (', ActualDuration: ' + accDuration);
    }
    if (sample.sample_duration === undefined) {
      if (tfhd.default_sample_duration === undefined) {
        sample.sample_duration = 0;
      } else {
        sample.sample_duration = tfhd.default_sample_duration;
      }
      test += ', Duration: ' + sample.sample_duration;
    } else {
      test += (', Duration: ' + sample.sample_duration);
    }
    if (sample.sample_size === undefined) {
      sample.sample_size = tfhd.default_sample_size;
    }

    if (sample.sample_composition_time_offset === undefined) {
      test += ', CompositionTime: 0';
      sample.sample_composition_time_offset = 0;
    } else {
      test += (', CompositionTime: ' + sample.sample_composition_time_offset);
    }

    var sampleTime = baseSampleTime + accDuration + sample.sample_composition_time_offset;
    test += (', SampleTime: ' + sampleTime);

    var cea608Ranges = ceaParserManager.findCeaNalus(raw, startPos, sample.sample_size);
    if (0 < cea608Ranges.length) {
      insertInOrder(allCeaNalus, sampleTime, cea608Ranges);
    }

    accDuration += sample.sample_duration;
    startPos += sample.sample_size;
  }

  for (var i = 0; i < allCeaNalus.length; i ++) {
    if ('undefined' === allCeaNalus[i][0] || 'undefined' === allCeaNalus[i][1]) {
      continue;
    }
    for (var j = 0; j < allCeaNalus[i][1].length; j++) {
      //console.debug('[extractCeaData] i:' + i + ', j:' + j );
      var ccData = ceaParserManager.extractCeaDataFromRange(raw, allCeaNalus[i][1][j]);
      for (var k = 0; k < ccData.length; k++) {
        if (ccData[k].length > 0) {
          saveCCData(allCcData.fields, allCeaNalus[i][0], ccData[k]);
        }
      }
    }
  }

  var endSampleTime = baseSampleTime + accDuration;
  allCcData.startTime = baseSampleTime;
  allCcData.endTime = endSampleTime;
  return allCcData;
}

var ccParsers = new Map();

function createCcParser(type) {
    var makeCueAdderForIndex = function (self, type) {
      function newCue(startTime, endTime, captionScreen) {
        var text = captionScreen.getDisplayText();
        console.log(type + ': startTime: ' + startTime + ', endTime: ' + endTime + ', ' + text);
      }
      return newCue;
    };
    let handler = makeCueAdderForIndex(this, type);
    return new ceaParserManager.ceaParserManager(type, {'newCue': handler}, null);
  }

function mytest2(bytes) {
  // init parsers
  ccParsers.set('608_1', createCcParser('608_1'));
  ccParsers.set('608_2', createCcParser('608_2'));
  ccParsers.set('608_3', createCcParser('608_3'));
  ccParsers.set('608_4', createCcParser('608_4'));
  ccParsers.set('708_1', createCcParser('708_1'));
  ccParsers.set('708_2', createCcParser('708_2'));
  ccParsers.set('708_3', createCcParser('708_3'));
  ccParsers.set('708_4', createCcParser('708_4'));
  ccParsers.set('708_5', createCcParser('708_5'));
  ccParsers.set('708_6', createCcParser('708_6'));
  
  var embeddedTimescale = 90000;
  
  var allCcData = extractCeaData(bytes);
  for (let i = 0; i < allCcData.fields.length; i ++) {
    var ccData = allCcData.fields[i];

    let type = ccData[0];
    let parser = ccParsers.get(type);

    for (let j = 1; j < ccData.length; j++) {
      let a1 = ccData[j][0];
      let a2 = ccData[j][1];
      parser.addData(ccData[j][0] / embeddedTimescale, ccData[j][1]);
    }
  }
}

export function test_cea608() {
  console.log('--------test_cea608--------');

  var xhttp = new XMLHttpRequest();
  xhttp.responseType = 'arraybuffer';

  xhttp.onload = function () {
    if (this.status == 200) {
      mytest2(this.response);
    }
  };

  xhttp.open("GET", "http://localhost/2/mydash/subtitles/608_0/V300_with_cc1_and_cc3/1.m4s", true);
  xhttp.send();
}












