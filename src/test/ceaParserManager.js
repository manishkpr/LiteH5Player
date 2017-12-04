//import cea608parser from 'cea608-parser';
//import cea708parser from 'cea708-parser';
//import cea608parser from 'E:/xampp/htdocs/dash.js/externals/cea608-parser';
//import cea608parser from './cea608-parser';
var cea608Parser = require('./cea608-parser');
var cea708Parser = require('./cea708-parser');
//var cea708Parser = require('./cea708-parser - v1');
(function (exports) {

    // if(typeof cc_Type === "undefined") {
    //     var cc_Type = {
    //         CEA_NO708AND608: 0x00,
    //         CEA_608: 0x02,
    //         CEA_708: 0x04,
    //         CEA_708AND608: 0x06
    //     };
    // }
    //
    // if(typeof caption_Type === "undefined") {
    //     var caption_Type = {
    //         VO_CAPTION_TYPE_EIA608: 0,
    //         VO_CAPTION_TYPE_EIA708: 1,
    //         VO_CAPTION_TYPE_DEFAULT_608: 2,
    //         VO_CAPTION_TYPE_DEFAULT_708: 3,
    //         VO_CAPTION_TYPE_ARIB: 4
    //     };
    // }
    var CEA_NO708AND608 = 0x00,
        CEA_608 = 0x02,
        CEA_708 = 0x04,
        CEA_708AND608 = 0x06,

        VO_CAPTION_TYPE_EIA608 = 0,
        VO_CAPTION_TYPE_EIA708 = 1,
        VO_CAPTION_TYPE_DEFAULT_608 = 2,
        VO_CAPTION_TYPE_DEFAULT_708 = 3;
        //VO_CAPTION_TYPE_ARIB = 4;

    var INVALID_608CC_VALUE = 0x80;
       // MAX_FIELD_NUM = 2;

    var logger = {
        verboseFilter : {'DATA' : 3, 'DEBUG' : 3, 'INFO' : 2, 'WARNING' : 2, 'TEXT' : 1, 'ERROR' : 0},
        time : null,
        verboseLevel : 0, // Only write errors
        setTime : function(newTime) {
            this.time = newTime;
        },
        log : function(severity, msg) {
            var minLevel = this.verboseFilter[severity];
            if (this.verboseLevel >= minLevel) {
                console.log(this.time + " [" + severity + "] " + msg);
            }
        },
        setLogLevel: function (level) {
            this.verboseLevel = level;
        }
    };

    //var numArrayToHexArray = function(numArray) {
    //    var hexArray = [];
    //    for (var j = 0; j < numArray.length; j++) {
    //        hexArray.push(numArray[j].toString(16));
    //    }
    //    return hexArray;
    //};

    var ccParserType = CEA_NO708AND608,
        allCCType = CEA_NO708AND608;


    var ceaParserManager =  function(trackID, out1, out2) {
        this.trackID = trackID;
        this.outputs = [out1, out2];
        this.ceaParserType = VO_CAPTION_TYPE_EIA608;
        this.ceaParser = null;
    };

    ceaParserManager.prototype = {
        reset:function () {
            this.ceaParserType = VO_CAPTION_TYPE_EIA608;
            this.ceaParser.reset();
        },

        getHandler: function () {
            return this.ceaParser.getHandler();
        },

        setHandler: function (newHandler) {
            this.ceaParser.setHandler(newHandler);
        },

        setCeaParserType: function (type) {
            if(this.ceaParserType != type){
                this.ceaParserType = type;
            }
            //console.log("INFO", "setCeaParserType" + " this.ceaParserType:" + this.ceaParserType +
            //" ccParserType:" + type);
        },

        CreateCeaParser:function (trackID, out1, out2) {
            if ('608_1' == trackID) {
                this.ceaParser= new cea608Parser.Cea608Parser(0, out1, out2);
                if (!this.ceaParser){
                    return false;
                }
                //disable output the log message except the error message
                cea608Parser.logger.setLogLevel(0);
            } else if ('608_3' == trackID){
                this.ceaParser = new cea608Parser.Cea608Parser(1, out1, out2);
                if (!this.ceaParser){
                    return false;
                }
               // cea608Parser.logger.setLogLevel(3);
            } else {
                this.ceaParser = new cea708Parser.Cea708parser(out1);
                if (!this.ceaParser){
                    return false;
                }
                //disable output the log message except the error message
                cea708Parser.logger.setLogLevel(0);
            }
            return true;
        },

        addData:function (t, byteList) {
            //console.log("ceaParserManager addData trackID:" + this.trackID +
            //    ",byte:" + numArrayToHexArray(byteList).join(","));

            if (!this.ceaParser) {
                this.CreateCeaParser(this.trackID, this.outputs[0], this.outputs[1]);
            }
            if (this.ceaParser) {
                this.ceaParser.addData(t, byteList);
            }
        },

        cueSplitAtTime : function(t){
            if (this.ceaParser) {
                this.ceaParser.cueSplitAtTime(t);
            }
        }
    };

    /**
     * Find ranges corresponding to SEA CEA-608 NALUS in sizeprepended NALU array.
     * @param {raw} dataView of binary data
     * @param {startPos} start position in raw
     * @param {size} total size of data in raw to consider
     * @returns
     */
    var findCeaNalus = function (raw, startPos, size) {
        var nalSize = 0,
            cursor = startPos,
            nalType = 0,
            cea608NaluRanges = [],
            // Check SEI data according to ANSI-SCTE 128
            isCEA608SEI = function (payloadType, payloadSize, raw, pos) {
                if (payloadType !== 4 || payloadSize < 8) {
                    return null;
                }
                var countryCode = raw.getUint8(pos);
                var providerCode = raw.getUint16(pos + 1);
                var userIdentifier = raw.getUint32(pos + 3);
                var userDataTypeCode = raw.getUint8(pos + 7);
                return countryCode == 0xB5 && providerCode == 0x31 && userIdentifier == 0x47413934 && userDataTypeCode == 0x3;
            };
        while (cursor < startPos + size) {
            nalSize = raw.getUint32(cursor);
            nalType = raw.getUint8(cursor + 4) & 0x1F;
            //console.log(time + "  NAL " + nalType);
            if (nalType === 6) {
                // SEI NAL Unit. The NAL header is the first byte
                //console.log("SEI NALU of size " + nalSize + " cursor:" + cursor);
                var pos = cursor + 5;
                var payloadType = -1;
                while (pos < cursor + 4 + nalSize - 1) { // The last byte should be rbsp_trailing_bits
                    payloadType = 0;
                    var b = 0xFF;
                    while (b === 0xFF) {
                        b = raw.getUint8(pos);
                        payloadType += b;
                        pos++;
                    }
                    var payloadSize = 0;
                    b = 0xFF;
                    while (b === 0xFF) {
                        b = raw.getUint8(pos);
                        payloadSize += b;
                        pos++;
                    }
                    if (isCEA608SEI(payloadType, payloadSize, raw, pos)) {
                        //console.log("CEA608 SEI " + time + " " + payloadSize);
                        // console.log("[findCeaNalus] pos:%d, payloadsize:%d, nalType:%d, nalSize:%d, cursor:%d",
                        //     pos, payloadSize, nalType, nalSize, cursor);
                        // console.log(" nal data:" + raw.getUint8(cursor).toString(16), raw.getUint8(cursor + 1).toString(16),
                        //     raw.getUint8(cursor + 2).toString(16),raw.getUint8(cursor + 3).toString(16),
                        // raw.getUint8(cursor + 4).toString(16));
                        //remove the 8 byte userDataTypeCode
                        cea608NaluRanges.push([(pos + 8), (payloadSize - 8)]);
                    }
                    pos += payloadSize;
                }
            }
            cursor += nalSize + 4;
        }
        return cea608NaluRanges;
    };

    var packetData = [];
    var packetParser = new cea708Parser.Cea708PacketParser();
    var extractCeaDataFromRange = function(raw, cea608Range) {
        var pos = cea608Range[0];
        var fieldData = [[], [], [], [], [], [], [], []],
            isValid608Data = function(valid, data1, data2, ccType) {
                if (0 === valid) {
                    return false;
                }
                if((0 !== ccType) && (1 !== ccType)){
                    return false;
                }
                if (((INVALID_608CC_VALUE == data1) && (INVALID_608CC_VALUE == data2)) ||
                    ((0x0 === data1) && (0x0 === data2)) ||
                    ((data1 & 0x7f) + (data2 & 0x7f) === 0)) {
                    return false;
                }
                return true;
            },

            isValid708Data = function(valid, data1, data2, ccType) {
                if (0 === valid) {
                    return false;
                }
                if((2 !== ccType) && (3 !== ccType)){
                    return false;
                }
                if ((0x0 === data1) && (0x0 === data2)) {
                    return false;
                }
                return true;
            },
            whatCCDataTypeHave = function (type, ccType, ccValid, data1, data2) {
                if(isValid608Data(ccValid, data1, data2, ccType)){
                    return (type | CEA_608);
                }

                if(isValid708Data(ccValid, data1, data2, ccType)) {
                    return (type | CEA_708);
                }

                return type;
            },
            setParserType = function(type) {
                //console.log("setParserType type:%d", type);
                var b608Valid = false,
                    b708Valid = false;
                switch (type) {
                    case CEA_NO708AND608: {
                        b608Valid = false;
                        b708Valid = false;
                        break;
                    }
                    case CEA_708: {
                        b708Valid = true;
                        break;
                    }
                    case CEA_608: {
                        b608Valid = true;
                        break;
                    }
                    case CEA_708AND608: {
                        b608Valid = true;
                        b708Valid = true;
                        break;
                    }
                    default: {
                        b608Valid = false;
                        b708Valid = false;
                        break;
                    }
                }

                if (!b608Valid && !b708Valid) {
                    return false;
                }
                if (ccParserType == VO_CAPTION_TYPE_EIA608) {
                    if (b708Valid) {
                        ccParserType = VO_CAPTION_TYPE_EIA708;
                    }
                }
                else if (ccParserType == VO_CAPTION_TYPE_EIA708) {
                    if (!b708Valid && b608Valid) {
                        ccParserType = VO_CAPTION_TYPE_EIA608;
                    }
                }
                else if (ccParserType == VO_CAPTION_TYPE_DEFAULT_608) {
                    if (b608Valid) {
                        ccParserType = VO_CAPTION_TYPE_EIA608;
                    }
                    else
                        ccParserType = VO_CAPTION_TYPE_EIA708;
                }
                else if (ccParserType == VO_CAPTION_TYPE_DEFAULT_708) {
                    if (b708Valid) {
                        ccParserType = VO_CAPTION_TYPE_EIA708;
                    }
                    else
                        ccParserType = VO_CAPTION_TYPE_EIA608;
                }

                return true;
            },
            CheckCCDataType = function(type) {
                if (allCCType != type) {
                    if (CEA_708AND608 != allCCType) {
                        allCCType = allCCType | type;
                    }
                }
                //console.log("[CheckCCDataType] allCCType:%d, type:%d", allCCType, type);
                setParserType(allCCType);
            },
            reset = function () {
                packetData = [];
            },

         is708End = function (len, ccType, ccValid) {
            if ((len > 0) &&((ccType === 3 && ccValid === 1) || ccValid === 0)){
                return true;
            }
            return false;
        },

            get708CCData = function () {
                //console.log("[get708CCData] len:" + packetData.length + ", packetData:" + numArrayToHexArray(packetData));
                var dataSize = packetParser.extractCea708DataFromPacket(packetData);
                if(dataSize){
                    for(var serviceNO = 1; serviceNO < packetParser.serviceBlock.serData.length; serviceNO ++){
                        if(packetParser.serviceBlock.serData[serviceNO].serData.length){
                            fieldData[serviceNO + 1] = fieldData[serviceNO + 1].concat(packetParser.serviceBlock.serData[serviceNO].serData);
                            // console.log("[get708CCData] ccData:" + numArrayToHexArray(fieldData[serviceNO + 1]) +
                            //     ", len:" + fieldData[serviceNO + 1].length + ", serviceNO:" + serviceNO);
                        }
                    }
                }
            },
            restructCCData = function (srcData) {
                var arr = [];
                for (var i = 0; i < srcData.length; i ++) {
                    if (0 < srcData[i].length) {
                        if (0 === i) {
                            arr.push(["608_1", srcData[i]]);
                        } else if (1 == i) {
                            arr.push(["608_3", srcData[i]]);
                        } else {
                            arr.push(["708_" + (i - 1).toString(), srcData[i]]);
                        }
                    }
                }
                return arr;
            };
        //pos += 8; // Skip the identifier up to userDataTypeCode
        var ccCount = raw.getUint8(pos) & 0x1f;
        pos += 2; // Advance 1 and skip reserved byte
        var type = 0;
        for (var i = 0; i < ccCount; i++) {
            var byte = raw.getUint8(pos);
            var ccValid = (byte & 0x4) >> 2;
            var ccType = byte & 0x3;

            pos++;
            var ccData1 = raw.getUint8(pos); // Keep parity bit
            pos++;
            var ccData2 = raw.getUint8(pos); // Keep parity bit
            pos++;
            //console.log(" [extractCeaDataFromRange]count:%d, ccType:%d, i:%d,valid:%d", ccCount, ccType, i, ccValid);
            //console.log("[extractCeaDataFromRange] data1:" + ccData1.toString(16) + " data2:" + ccData2.toString(16));
           var typeTmp = whatCCDataTypeHave(type, ccType, ccValid, ccData1, ccData2);
            type = typeTmp;
            if (isValid608Data(ccValid, ccData1, ccData2, ccType)) { //Check validity and non-empty data
                if (ccType === 0) {
                    fieldData[0].push(ccData1);
                    fieldData[0].push(ccData2);
                } else if (ccType === 1) {
                    fieldData[1].push(ccData1);
                    fieldData[1].push(ccData2);
                }
            } else if ( ccType === 2 || ccType === 3) {
                if (is708End(packetData.length, ccType, ccValid)){
                    get708CCData();
                    reset();
                    i --;
                    pos -= 3;
                }else if (isValid708Data(ccValid, ccData1, ccData2, ccType)){
                    packetData.push(ccData1);
                    packetData.push(ccData2);
                }
            }
        }
        CheckCCDataType(type);
        var ccData = restructCCData(fieldData);
        return ccData;

    };

    exports.logger = logger;
    exports.ceaParserManager = ceaParserManager;
    exports.findCeaNalus = findCeaNalus;
    exports.extractCeaDataFromRange = extractCeaDataFromRange;

}(typeof exports === 'undefined'? this.ceaParserManager = {}: exports));