
(function(exports) {
    "use strict";

    var C0_SET_START_CODE_CEA_708 = 0x0;
    var C0_SET_END_CODE_CEA_708 = 0x1F;
    var C0_SET_EXT_CODE_CEA_708 = 0x10;
    var  C0_SET_P10_CODE_CEA_708 = 0x18;
    var C1_SET_START_CODE_CEA_708 = 0x80;
    var C1_SET_Mid_CODE_CEA_708 = 0x8F;
    var C1_SET_END_CODE_CEA_708 = 0x9F;

    var G0_G2_SET_START_CODE_CEA_708 = 0x20;
    var G0_G2_SET_END_CODE_CEA_708 = 0x7F;

    var G1_G3_SET_START_CODE_CEA_708 = 0xA0;
    //var G1_G3_SET_END_CODE_CEA_708 = 0xFF;
    var ASCII_SPACE_CHAR = " ";

    var CC_DF0 = 0x98,
        CC_DF7 = 0x9F,

        CC_CW0 = 0x80,
        CC_CW7 = 0x87,

        CC_CLW = 0x88,
        CC_DSW = 0x89,
        CC_HDW = 0x8A,
        CC_TGW = 0x8B,
        CC_DLW = 0x8C,
        CC_DLY = 0x8D,
        CC_DLC = 0x8E,
        CC_RET = 0x8F,
        CC_SPA = 0x90,
        CC_SPC = 0x91,
        CC_SPL = 0x92,
        CC_SWA = 0x97;

    var NR_ROWS = 15,
        NR_COLS = 32,
        CC_WINDOWS = 8;

    var CC708RGB_TIMESCALE = 85,  ///<255/3
        COUNT_G2G3_CHARACTER = 0x1B,
        CC_MAX_SERVICE_BLOCK_SIZE = 0x3F,
        CC_MAX_SERVICE_NUM = 6;

    if(typeof print_scrollDirection === 'undefined'){
        var print_sDirection  ={
            LEFT_TO_RIGHT: 0,
            RIGHT_TO_LEFT: 1,
            TOP_TO_BOTTOM: 2,
            BOTTOM_TO_TOP: 3
        };
    }

    var ExtendedG2G3CodeMap =
        [
            [0x20,0x20],
            [0x21,0x20],
            [0x25,0x2026],///<Ellipsis
            [0x2A,0x0160], ///<
            [0x2C,0x0152],
            [0x30,0x2588], ///<solid block
            [0x31,0x2018],
            [0x32,0x2019],
            [0x33,0x201C],
            [0x34,0x201D],
            [0x35,0x2022],
            [0x39,0x2122],
            [0x3A,0x0161],
            [0x3C,0x0153],
            [0x3D,0x2120],
            [0x3F,0x0178],
            [0x76,0x215B],
            [0x77,0x215C],
            [0x78,0x215D],
            [0x79,0x215E],
            [0x7A,0x2014],
            [0x7B,0x2309],
            [0x7C,0x230A],
            [0x7D,0x2014],
            [0x7E,0x230B],
            [0x7F,0x2308],
            [0xA0,0x201D]
        ];

    var PresetWinAttri =
        [
            [0x00,0x00,0x0C,0x00],
            [0xC0,0x00,0x0C,0x00],
            [0x00,0x00,0x0E,0x00],
            [0x00,0x00,0x4C,0x00],
            [0xC0,0x00,0x4C,0x00],
            [0x00,0x00,0x4E,0x00],
            [0x00,0x00,0x24,0x00]
        ];

    var PresetPenAttri =
        [
            [0x05,0x00],
            [0x05,0x01],
            [0x05,0x02],
            [0x05,0x03],
            [0x05,0x04],
            [0x05,0x1B],
            [0x05,0x1C]
        ];


    var PresetPenColor =
        [
            [0x2A,0x00,0x00],
            [0x2A,0x00,0x00],
            [0x2A,0x00,0x00],
            [0x2A,0x00,0x00],
            [0x2A,0x00,0x00],
            [0x2A,0x30,0x00],
            [0x2A,0x30,0x00]
        ];

    var R1B7 = function(d) {
        return d >> 7;
    };
    var R1B6 = function(d) {
        return (d >> 6) & 0x01;
    };
    var R1B5 = function (d) {
        return (d >> 5) & 0x01;
    };
    var R1B4 = function (d) {
        return (d >> 4) & 0x01;
    };
    var R1B3 = function (d) {
        return (d >> 3) & 0x01;
    };
    // var R1B2 = function (d) {
    //     return (d >> 2) & 0x01;
    // };
    // var R1B1 = function (d) {
    //     return (d >> 1) & 0x01;
    // };
    //
    // //
    // var R1B0 = function (d) {
    //     return d & 0x01;
    // };
    var R2B7 = function(d) {
        return (d >> 6);
    };
    // var R2B6 = function(d) {
    //     return ((d >> 5) & 0x03);
    // };
    var R2B5 = function(d) {
        return ((d >> 4) & 0x03);
    };
    // var R2B4 = function(d){
    //     return ((d >> 3) & 0x03);
    // };
    var R2B3 = function(d) {
        return ((d >> 2) & 0x03);
    };
    // var  R2B2 = function(d) {
    //     return ((d >> 1) & 0x03);
    // };
    var R2B1 = function(d) {
        return (d & 0x03);
    };

    //
    var R3B7 = function(d) {
        return (d >> 5);
    };
    // var R3B6 = function(d) {
    //     return ((d >> 4) & 0x07);
    // };
    var R3B5 = function(d) {
        return ((d >> 3) & 0x07);
    };
    // var R3B4 = function(d) {
    //     return ((d >> 2) & 0x07);
    // };
    // var R3B3 = function(d) {
    //     return ((d >> 1) & 0x07);
    // };
    var R3B2 = function(d){
        return (d & 0x07);
    };

    //
    var R4B7 = function(d) {
        return (d >> 4);
    };
    // var R4B6 = function(d) {
    //     return ((d >> 3) & 0x0f);
    // };
    // var R4B5 = function(d) {
    //     return ((d >> 2) & 0x0f);
    // };
    // var R4B4 = function(d) {
    //     return ((d >> 1) & 0x0f);
    // };
    var R4B3 = function(d) {
        return (d & 0x0f);
    };

    //
    // var R5B7 = function(d) {
    //     return (d >> 3);
    // };
    // var R5B6 = function(d) {
    //     return ((d >> 2) & 0x1f);
    // };
    // var R5B5 = function(d) {
    //     return ((d >> 1) & 0x1f);
    // };
    var R5B4 = function(d) {
        return (d & 0x1f);
    };

    //
    // var R6B7 = function(d) {
    //     return (d >> 2);
    // };
    // var R6B6 = function(d) {
    //     return ((d >> 1) & 0x3f);
    // };
    var R6B5 = function(d) {
        return (d & 0x3f);
    };

    //
    // var R7B7 = function(d) {
    //     return (d >> 1);
    // };
    var R7B6 = function(d) {
        return (d & 0x7f);
    };

    /**
     * Simple logger class to be able to write with time-stamps and filter on level.
     */
    var logger = {
        verboseFilter : {'DATA' : 3, 'DEBUG' : 4, 'INFO' : 2, 'WARNING' : 2, 'TEXT' : 1, 'ERROR' : 0},
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

    var numArrayToHexArray = function(numArray) {
        var hexArray = [];
        for (var j = 0; j < numArray.length; j++) {
            hexArray.push(numArray[j].toString(16));
        }
        return hexArray;
    };

    var isAttriValid = function (value, attri) {
        return value.hasOwnProperty(attri);
    };

    var updateAttribute = function(attris, newValue, oldValue) {
        for (var i = 0 ; i < attris.length; i++) {
            var style = attris[i];
            if (isAttriValid(newValue, style)) {
                oldValue[style] = newValue[style];
            }
        }
        return oldValue;
    };

    var TranslateRowNoToPos = function(nRowNo, bSafeArea){
        bSafeArea = typeof(bSafeArea) == 'undefined' ? true : bSafeArea;
        if (nRowNo > NR_ROWS)
        {
            logger.log("ClosedCaption Error:Error nRowNo");
            return 0;
        }
        var Pos = nRowNo * 5;

        if (bSafeArea)
        {
            return Pos + 10;
        }
        return Pos;
    };

    var TranslatePosToRowNo = function(nPos, bSafeArea){
        bSafeArea = typeof(bSafeArea) == 'undefined' ? true : bSafeArea;
        var nRowNo = 0;
        if (bSafeArea)
        {
            nPos -= 10;
        }
        if (nPos === 0)
        {
            return nRowNo;
        }

        nRowNo = (nPos/5);
        return nRowNo;
    };

    var TranslateColNoToPos = function(nColumnNo, bSafeArea){
        bSafeArea =  typeof(bSafeArea) == 'undefined' ? true : bSafeArea;
        if (nColumnNo > 33)  //to match isColumnNo is 32,and right col is 32+1;task 19956
        {
            logger.log("ClosedCaption Error:Error nColumnNo");
            return 0;
        }
        var Pos = parseInt((nColumnNo * 25)/10);

        if (bSafeArea)
        {
            return Pos + 10;
        }
        return Pos;
    };

    // var TranslatePosToColNo = function(nPos, bSafeArea){
    //     bSafeArea = typeof(bSafeArea) == 'undefined' ? true : bSafeArea;
    //     var nColNo = 0;
    //     if (bSafeArea)
    //     {
    //         nPos -= 10;
    //     }
    //     if (nPos === 0)
    //     {
    //         return 0;
    //     }
    //
    //     nColNo = parseInt(nPos*10/25) + ((parseInt((nPos*10) % 25) === 0) ? 0 : 1);
    //     return nColNo;
    // };

    var setRectPos = function (rect, nMinRow, nMaxRow, nMinCol, nMaxCol, bSafeArea) {
        bSafeArea = typeof(bSafeArea) == 'undefined' ? true : bSafeArea;

        if(nMinRow < NR_ROWS){
            rect.Top = TranslateRowNoToPos(nMinRow, bSafeArea);
        }
        if(nMaxRow < NR_ROWS){
            rect.Bottom = TranslateRowNoToPos((nMaxRow + 1), bSafeArea);
        }

        if(nMinCol < NR_COLS){
            rect.Left = TranslateColNoToPos(nMinCol, bSafeArea);
        }
        if(nMaxCol < NR_COLS){
            rect.Right = TranslateColNoToPos((nMaxCol + 1), bSafeArea);
        }
        return rect;
    };



    var Color = function (red, green, blue, trans) {
        this.Red = red || 0xFF;
        this.Green = green || 0xFF;
        this.Blue = blue || 0xFF;
        this.Trans = trans || 0xFF;
    };

    Color.prototype = {
        reset: function () {
            //white
            this.Red = 0xFF;
            this.Green = 0xFF;
            this.Blue = 0xFF;
            this.Trans = 0xFF;
        },

        isDefault: function () {
            return (this.Red === 0xFF) && (this.Green === 0xFF) && (this.Blue === 0xFF) && (this.Trans === 0xFF);
        },

        setColor: function (newColor) {
            if(!newColor){
                return false;
            }
           // logger.log("DEBUG", "Color:" + "R:" + newColor.Red + " G:" + newColor.Green + " B:" + newColor.Blue);
            var attris = ["Red", "Green", "Blue", "Trans"];
            updateAttribute(attris, newColor, this);
            return true;
        },
        equals: function (other) {
            return ( (this.Red === other.Red) &&
            (this.Green === other.Green) &&
            (this.Blue === other.Blue) &&
            (this.Trans === other.Trans));
        }
    };

    var  RectDisplayEffect = function (effectType, effectDirection, effectSpeed) {
        this.EffectType = effectType;                    ///<Refer to VOEFFECTTYPE
        this.EffectDirection = effectDirection;               ///<Refer to VOEFFECTDIRECTION
        this.EffectSpeed = effectSpeed;                   ///<second
    };

    RectDisplayEffect.prototype = {
        reset: function () {
            this.EffectType = 0;
            this.EffectDirection = 0;
            this.EffectSpeed = 0;
        },

        setRectDisplayEffect: function(newRectDisplayEffect){
            if(!newRectDisplayEffect){
                return;
            }
            var attris  = ["EffectType", "EffectDirection", "EffectSpeed"];
            updateAttribute(attris, newRectDisplayEffect, this);
        },

        isDefault: function () {
            return (0 === this.EffectType) && (0 === this.EffectDirection) && (0 === this.EffectSpeed);
        }
    };

    var RectPos = function (top, left, bottom, right) {
        this.Top = top || 0xFFFFFFFF;       ///<0xFFFFFFFF indicates the default value
        this.Left =left || 0xFFFFFFFF;      ///<0xFFFFFFFF indicates the default value
        this.Bottom = bottom || 0xFFFFFFFF;    ///<0xFFFFFFFF indicates the default value
        this.Right = right || 0xFFFFFFFF;
    };

    RectPos.prototype = {
        reset: function () {
            this.Top = 0xFFFFFFFF;
            this.Left = 0xFFFFFFFF;
            this.Bottom = 0xFFFFFFFF;
            this.Right = 0xFFFFFFFF;
        },

        copy: function (newRect) {
            this.Top = newRect.Top;
            this.Left = newRect.Left;
            this.Bottom = newRect.Bottom;
            this.Right = newRect.Right;
        },

        setRect: function (newRect) {
            if(!newRect){
                return;
            }

            var attris = ["Top", "Left", "Bottom", "Right"];
            updateAttribute(attris, newRect, this);

            logger.log("DEBUG", "[setRect]" + ", T:" + this.Top + "，L：" + this.Left +
                ", B:" + this.Bottom + ", R:" + this.Right);
        },

        isDefault: function () {
            return ((this.Top === 0xFFFFFFFF) && (this.Left === 0xFFFFFFFF) &&
            (this.Bottom === 0xFFFFFFFF) && (this.Right === 0xFFFFFFFF));
        }
    };

    var RectInfo = function (bt, ZOrder) {
        this.RectBorderType = bt;   ///<Refer to VORECTBORDERTYPE
        this.RectZOrder = ZOrder;
        this.Rect = new RectPos();
        this.RectBorderColor = new Color();
        this.RectFillColor = new Color();
        this.RectDisplayEffect = new RectDisplayEffect();
    };

    RectInfo.prototype = {
        reset: function () {
            this.RectBorderType = 0;
            this.RectZOrder = 0;
            this.Rect.reset();
            this.RectBorderColor.reset();
            this.RectFillColor.reset();
            this.RectDisplayEffect.reset();
        },

        setRectInfo: function (newRectInfo) {
            if(!newRectInfo){
                return;
            }

            if(isAttriValid(newRectInfo, "RectBorderType")){
                this.RectBorderType = newRectInfo.RectBorderType;
            }
            if(isAttriValid(newRectInfo, "RectZOrder")){
                this.RectZOrder = newRectInfo.RectZOrder;
            }

            if(isAttriValid(newRectInfo, "Rect")){
                this.Rect.setRect(newRectInfo.Rect);
            }
            if(isAttriValid(newRectInfo, "RectBorderColor")){
                this.RectBorderColor.setColor(newRectInfo.RectBorderColor);
            }
            if(isAttriValid(newRectInfo, "RectFillColor")){
                this.RectFillColor.setColor(newRectInfo.RectFillColor);
            }
            if(isAttriValid(newRectInfo, "RectDisplayEffect")){
                this.RectDisplayEffect.setRectDisplayEffect(newRectInfo.RectDisplayEffect);
            }
        },
        isDefault: function () {
            return (0 === this.RectBorderType) && (0 === this.RectZOrder) && this.Rect.isDefault() &&
                this.RectBorderColor.isDefault() && this.RectFillColor.isDefault() &&
                this.RectDisplayEffect.isDefault();
        }

    };

    var FontEffectInfo = function ( Italic, Underline, EdgeType, TxtTag, Offset) {
        this.Italic = Italic || false;
        this.Underline = Underline || false;
        this.EdgeType = EdgeType;
        this.TextTag = TxtTag;
        this.Offset = Offset;
        this.EdgeColor = new Color();
    };

    FontEffectInfo.prototype = {
        reset: function () {
            this.Italic = false;
            this.Underline = false;
            this.EdgeType = 0;
            this.TextTag = 0;
            this.Offset = 0;
            this.EdgeColor.reset();
        },

        isDefault : function() {
            return (this.EdgeColor.isDefault() && !this.Underline && !this.Italic &&
            this.EdgeType === 0 && this.TextTag === 0 && this.Offset === 0);
        },

        setFontEffectInfo: function (NewFontEffectInfo) {
            if(!NewFontEffectInfo){
                return false;
            }
            //logger.log("DEBUG", "[FontEffectInfo: setFontEffectInfo]");
            var attris = ["Italic", "Underline", "EdgeType", "TxtTag", "Offset"];
            updateAttribute(attris, NewFontEffectInfo, this);
            if(isAttriValid(NewFontEffectInfo, "EdgeColor")){
                this.EdgeColor.setColor(NewFontEffectInfo.EdgeColor);
            }
            return true;
        },

        equals: function (other) {
            return ( (this.Italic === other.Italic) &&
            (this.Underline === other.Underline) &&
            (this.EdgeType === other.EdgeType) &&
            (this.TextTag === other.TextTag) &&
            (this.Offset === other.Offset) &&
            this.EdgeColor.equals(other));
        }
    };

    var FontInfo = function (FontSize, FontStyle) {
        this.FontSize = FontSize || 0;
        this.FontStyle = FontStyle || 0;
        this.FontColor = new Color();
    };

    FontInfo.prototype = {
        reset: function () {
            this.FontSize = 0;
            this.FontStyle = 0;
            this.FontColor.reset();
        },

        isDefault : function() {
            return (this.FontColor.isDefault() && this.FontSize === 0 && this.FontStyle === 0);
        },

        setFontInfo: function (NewFontInfo) {
            if(!NewFontInfo){
                return false;
            }
            // logger.log("DEBUG", "[FontInfo: setFontInfo]" + " fontsize:" + NewFontInfo.FonSize +
            //     " fontstyle:" + NewFontInfo.FontStyle);
            if(isAttriValid(NewFontInfo, "FontSize")){
                this.FontSize = NewFontInfo.FontSize;
            }
            if(isAttriValid(NewFontInfo, "FontStyle")){
                this.FontStyle = NewFontInfo.FontStyle;
            }
            if(isAttriValid(NewFontInfo, "FontColor")){
                this.FontColor.setColor(NewFontInfo.FontColor);
            }
            return true;
        },

        equals: function (other) {
            return ((this.FontSize === other.FontSize) &&
            (this.FontStyle === other.FontStyle) &&
            this.FontColor.equals(other.FontColor));
        }
    };

    var CharInfo = function(fontInfo, fontEffectInfo){
        this.FontInfo = new FontInfo(fontInfo);
        this.FontEffectInfo = new FontEffectInfo(fontEffectInfo);
    };

    CharInfo.prototype = {
        reset: function(){
            this.FontInfo.reset();
            this.FontEffectInfo.reset();
        },

        isDefault: function(){
            return this.FontInfo.isDefault() && this.FontEffectInfo.isDefault();
        },

        setCharInfo: function(newCharInfo){
            if(!newCharInfo){
                return;
            }
           // logger.log("DEBUG", "[CharInfo: setCharInfo]");
            if(isAttriValid(newCharInfo, "FontInfo")){
                this.FontInfo.setFontInfo(newCharInfo.FontInfo);
            }
            if(isAttriValid(newCharInfo, "FontEffectInfo")){
                this.FontEffectInfo.setFontEffectInfo(newCharInfo.FontEffectInfo);
            }
        },

        equals: function (other) {
            return this.FontInfo.equals(other.FontInfo) && this.FontEffectInfo.equals(other.FontEffectInfo);
        }
    };

    /**
     * Unicode character with styling and background.
     * @constructor
     */
    var StyledUnicodeChar = function(uchar, charInfo) {
        this.uchar = uchar || ASCII_SPACE_CHAR; // unicode character
        this.CharInfo = new CharInfo(charInfo);
    };

    StyledUnicodeChar.prototype = {

        reset: function() {
            this.uchar = ASCII_SPACE_CHAR;
            this.CharInfo.reset();
        },

        setChar: function(uchar, newCharInfo) {
            this.uchar = uchar;
            this.CharInfo.setCharInfo(newCharInfo);
        },

        setCharInfo: function (newCharInfo) {
            this.CharInfo.setCharInfo(newCharInfo);
        },

        getCharInfo: function () {
            return this.CharInfo;
        },

        equals: function(other) {
            return this.uchar === other.uchar && this.CharInfo.equals(other.CharInfo);
        },

        // copy: function(newChar) {
        //     this.uchar = newChar.uchar;
        //     this.CharInfo.UpdateCharInfo(newChar.CharInfo);
        // },

        isEmpty : function() {
            return this.uchar === ASCII_SPACE_CHAR && this.CharInfo.isDefault();
        }
    };

    var textDes = function (hj, vj, pd) {
        this.dataBox = new RectInfo();
        this.hj = hj || 0;
        this.vj = vj || 0;
        this.pd = pd || 0;
    };

    textDes.prototype = {
        reset: function () {
            this.dataBox.reset();
            this.hj = 0;
            this.vj = 0;
            this.pd = 0;
        },
        setTextDes: function (newTextDes) {
            if(!newTextDes){
                return false;
            }
            if(isAttriValid(newTextDes, "dataBox")){
                this.dataBox.setRectInfo(newTextDes.dataBox);
            }

            var attris = ["hj", "vj", "pd"];
            updateAttribute(attris, newTextDes, this);

            return true;
        },

        isDefault: function () {
            return this.dataBox.isDefault() && (0 === this.hj) && (0 === this.vj) && ( 0 === this.pd);
        }
    };

    var Cea708PenColor = function () {
        this.fo = 0;
        this.fr = 0;
        this.fg = 0;
        this.fb = 0;

        this.bo = 0;
        this.br = 0;
        this.bg = 0;
        this.bb = 0;

        this.er = 0;
        this.eg = 0;
        this.eb = 0;
    };
    Cea708PenColor.prototype = {
        load: function (Arr, Size) {
            if(3 > Size){
                logger.log("ERROR", "708ClosedCaption Error:PenColor less para");
                return 0;
            }
            this.fo = R2B7(Arr[0]);
            this.fr = R2B5(Arr[0]);
            this.fg = R2B3(Arr[0]);
            this.fb = R2B1(Arr[0]);

            this.bo = R2B7(Arr[1]);
            this.br = R2B5(Arr[1]);
            this.bg = R2B3(Arr[1]);
            this.bb = R2B1(Arr[1]);

            this.er = R2B5(Arr[2]);
            this.eg = R2B3(Arr[2]);
            this.eb = R2B1(Arr[2]);
            return 3;
        }

    };

    var Cea708PenAttri = function () {
        this.tt = 0;
        this.o = 0;
        this.s = 0;
        this.i = 0;
        this.u = 0;
        this.et = 0;
        this.fs = 0;
    };

    Cea708PenAttri.prototype = {
        load: function (Arr, Size) {
            if (2 > Size){
                console.log("ERROR", "708 ClosedCaption Error:PenAttri less para");
                return 0;
            }
            this.tt = R4B7(Arr[0]);
            this.o = R2B3(Arr[0]);
            this.s = R2B1(Arr[0]);

            this.i = R1B7(Arr[1]);
            this.u = R1B6(Arr[1]);
            this.et = R3B5(Arr[1]);
            this.fs = R3B2(Arr[1]);
            return 2;
        }

    };

    var Cea708WinAttri = function () {
        this.fo = 0;
        this.fr = 0;
        this.fg = 0;
        this.fb = 0;

        this.bt0 = 0;
        this.br = 0;
        this.bg = 0;
        this.bb = 0;

        this.bt2 = 0;
        this.ww = 0;
        this.pd = 0;
        this.sd = 0;
        this.j = 0;

        this.es = 0;
        this.ed = 0;
        this.de = 0;
    };

    Cea708WinAttri.prototype = {

        load: function (Arr, Size) {
            if(4 > Size){
                logger.log("ERROR", "708 ClosedCaption Error:WindAttri less para");
                return 0;
            }

            this.fo = R2B7(Arr[0]);
            this.fr = R2B5(Arr[0]);
            this.fg = R2B3(Arr[0]);
            this.fb = R2B1(Arr[0]);

            this.bt0 = R2B7(Arr[1]);
            this.br = R2B5(Arr[1]);
            this.bg = R2B3(Arr[1]);
            this.bb = R2B1(Arr[1]);

            this.bt2 = R1B7(Arr[2]);
            this.ww = R1B6(Arr[2]);
            this.pd = R2B5(Arr[2]);
            this.sd = R2B3(Arr[2]);
            this.j = R2B1(Arr[2]);

            this.es = R4B7(Arr[3]);
            this.ed = R2B3(Arr[3]);
            this.de = R2B1(Arr[3]);
            return 4;
        }
    };


    var lineInfo = function (columnCnt) {
        this.columnCnt = columnCnt || NR_COLS;
        this.pos = 0;
        this.text = [];
        for (var i = 0 ; i < this.columnCnt ; i++) {
            this.text.push(new StyledUnicodeChar());
        }
        this.textDes = new textDes();
    };
    lineInfo.prototype = {
        reset: function () {
            this.pos = 0;
            for (var i = 0 ; i < this.columnCnt ; i++) {
                this.text[i].reset();
            }
            this.textDes.reset();
        },
        isEmpty : function() {
            var empty = true;
            for (var i = 0 ; i < this.columnCnt; i ++) {
                if (!(this.text[i].isEmpty())) {
                    empty = false;
                    break;
                }
            }
            return empty;
        },

        setTextDes: function (newTextDes) {
            this.textDes.setTextDes(newTextDes);
        },

        getTextDes: function () {
            return this.textDes;
        },

        insertTextInfo:function (byte, strInfo) {
            if((this.pos + byte.length) > this.columnCnt ){
                return false;
            }

            var char = String.fromCharCode(byte);
            if (this.pos >= this.columnCnt) {
                logger.log("ERROR", "Cannot insert " + byte.toString(16) +
                    " (" + char + ") at position " + this.pos + ". Skipping it!");
                return false;
            }
            //console.log("textInfo len:%d, pos:%d", this.text.length, this.pos);

            this.text[this.pos].setChar(char, strInfo);
            //console.log("textInfo char:" + this.textInfo[this.pos].char + ", ori char:" + char);
            this.moveCursor(1);

            return true;
        },

        moveAbsCursor: function (absPos) {
            var relPos = absPos - this.pos;
            this.moveCursor(relPos);
        },

        moveCursor : function(relPos, bDel) {
            bDel = typeof (bDel) === 'undefined' ? false : bDel;
            var newPos = this.pos + relPos;
            if(newPos > this.columnCnt){
                return 1;
            }
            if(0 === relPos){
                return 0;
            }

            if (relPos > 1) {
                for (var i = this.pos+1; i < newPos+1 ; i++) {
                    this.text[i].setChar(ASCII_SPACE_CHAR, this.text[this.pos].getCharInfo());
                }
            }
            this.setCursor(newPos);
        },

        /**
         *  Set the cursor to a valid column.
         */
        setCursor : function(absPos) {
            if (this.pos !== absPos) {
                this.pos = absPos;
            }
            if (this.pos < 0) {
                logger.log("ERROR", "Negative cursor position " + this.pos);
                this.pos = 0;
            } else if (this.pos > this.columnCnt) {
                logger.log("ERROR", "Too large cursor position " + this.pos);
                this.pos = this.columnCnt;
            }
        },

        getCursor: function () {
            return this.pos;
        },


        clearFromPos: function(startPos) {
            var i;
            for (i = startPos ; i < this.columnCnt ; i++) {
                this.text[i].uchar = ASCII_SPACE_CHAR;
                this.text[i].CharInfo.reset();
            }
        },

        clear: function() {
            this.clearFromPos(0);
            this.pos = 0;
        },
        getTextString: function() {
            var chars = [];
            var empty = true;
            if(0 === this.pos){
                return "";
            }
            for (var i = 0; i < this.columnCnt; i++) {
                var char = ' ';
                if(this.text[i]){
                    char = this.text[i].uchar;
                }
                if (char !== " ") {
                    empty = false;
                }
                chars.push(char);
            }
            if (empty) {
                return "";
            } else {
                return chars.join("");
            }
        },


        isEqual: function (other, pos) {
            return (this.textInfos[pos].char == other.textInfos[pos].char) &&
                (this.textInfos[pos].stringInfo == other.textInfos[pos].stringInfo);
        },

        equals: function(other) {
            var equal = true;
            for (var i = 0 ; i < this.columnCnt; i ++) {
                if (!this.isEqual(other, i)) {
                    equal = false;
                    break;
                }
            }
            return equal;
        }
    };

    var textDescriptor = function (wrap, sd) {
        this.wrap = wrap || 0;
        this.sd = sd || 0;
    };

    textDescriptor.prototype = {
        reset: function () {
            this.wrap = 0;
            this.sd = 0;
        },

        setTextDescriptor: function (newTextDes) {
            var attris = ["wrap", "sd"];
            updateAttribute(attris, newTextDes, this);
        }
    };

    var Cea708Window = function (WindID, rowCnt, columnCnt) {
        this.WindID = -1;
        this.visible = false;
        this.rl = 0;
        this.cl = 0;
        this.priority = 0;
        this.rp = 0;
        this.av = 0;
        this.ah = 0;
        this.ap = 0;
        this.rc = 0;
        this.cc = 0;
        this.ws = 0;
        this.ps = 0;
        this.penColor = new Cea708PenColor();
        this.penAttri = new Cea708PenAttri();
        this.windAttri = new Cea708WinAttri();
        this.update = false;

        this.bAdjustRowFlag = false;
        this.currRow = -1;
        this.rowCnt = rowCnt || NR_ROWS;
        this.columnCnt = columnCnt || NR_COLS;

        this.rectInfo = new RectInfo();
        this.textDisplayInfo = new textDescriptor();
        this.curCharInfo = new CharInfo();
        this.rowTextInfos = [];
        for (var i = 0 ; i <  this.rowCnt; i++) {
            this.rowTextInfos.push(new lineInfo(this.columnCnt)); // Note that we use zero-based numbering (0-14)
        }

    };

    Cea708Window.prototype = {

        reset: function(){
            this.WindID = -1;
            this.visible = false;
            this.update = false;

            this.bAdjustRowFlag = false;
            this.currRow = -1;
            this.textDisplayInfo.reset();
            this.resetTextInfo();

        },
        resetTextInfo: function (bCLW) {
            bCLW = typeof (bCLW) === 'undefined' ? false : bCLW;
            for(var i =0; i < this.rowTextInfos.length; i ++){
                this.rowTextInfos[i].reset();
            }
            this.curCharInfo.reset();
            if(!bCLW){
                this.rectInfo.reset();
                this.rectInfo.RectBorderColor.Trans = 0;
                this.rectInfo.RectFillColor.Trans = 0;
            }
        },

        setCurrRow: function (row) {
            if(!this.isRowValid(row)){
                return false;
            }
            logger.log("DEBUG", "[Cea708Window] " + "[setCurrRow] " + row);
            this.currRow = row;
            return true;
        },

        getCurrRow: function () {
            logger.log("DEBUG", "[Cea708Window] " + "[getCurrRow] " + this.currRow);
            return this.currRow;
        },

        isRowValid: function (row) {
            if ((0 > row) || (this.rowCnt <= row)){
                return false;
            }
            return true;
        },

        setRectInfo: function (newRectInfo) {
           if(!newRectInfo){
               return;
           }
            console.log("[setRectInfo] windID:%d", this.WindID);
           this.rectInfo.setRectInfo(newRectInfo);
        },

        getRectInfo:function () {
            console.log("[getRectInfo] windID:%d", this.WindID);
            return this.rectInfo;
        },

        setRowDes: function (rowDes) {
            for (var i = 0 ; i < this.rowCnt ; i++) {
                this.rowTextInfos[i].setTextDes(rowDes);
            }
        },

        setTextDisplayInfo: function (newTextDisplayInfo) {
            if(!newTextDisplayInfo){
                return;
            }
            this.textDisplayInfo.setTextDescriptor(newTextDisplayInfo);
        },

        setCharInfo: function (newCharInfo) {
            if(!newCharInfo){
                return;
            }
            this.curCharInfo.setCharInfo(newCharInfo);
        },

        insertChars: function(chars) {
            if(!this.isRowValid(this.currRow)){
                return false;
            }
            var rowInfo = this.rowTextInfos[this.currRow];
            logger.log("DEBUG", "[window:insertChar] row:" + this.currRow );
            for(var i = 0; i <chars.length; i ++){
                rowInfo.insertTextInfo(chars[i], this.curCharInfo);
            }

            this.UpdateWindInfo(true);

            logger.log("DEBUG", "[cea708window: insertChars] chars:" + this.getDisplayText(true));

            // if(this.update){
            //     logger.log("TEXT", "DISPLAYED: " + this.getDisplayText(true));
            //     this.outputDataUpdate();
            // }
            return true;
        },

        UpdateWindInfo: function(bForce){
            bForce = typeof(bForce) == 'undefined' ? false : bForce;
            if(this.visible || bForce){
                this.update = true;
            }
        },

        cc_BS: function () {
            logger.log("708 Info: BS");

            if (this.isRowValid(this.currRow))
            {
                var pos = this.rowTextInfos[this.currRow].pos;
                if (pos > 0)
                {
                    this.rowTextInfos[this.currRow].moveCursor(-1);
                }
            }
        },

        cc_CR: function() { // Carriage Return
            logger.log("708 CR - Carriage Return");
            // this.writeScreen.rollUp();
            // this.outputDataUpdate();
            if(!this.isRowValid(this.currRow)){
                return;
            }

            var winTopNo = TranslatePosToRowNo(this.rectInfo.Rect.Top);
            var winBottomNo = TranslatePosToRowNo(this.rectInfo.Rect.Bottom) - 1;
            // console.log("[708 CR - Carriage Return] CR, WinTop:%d, WinBottom:%d, CurRow:%d",
            //     winTopNo, winBottomNo, this.currRow);

            if (winBottomNo >= (this.getCurrRow() + 1)){
                this.parseCRNonRollup();
            }
            else{
                this.parseCRRollup(winTopNo);
            }
        },

        cc_HCR: function () { //HCR
            logger.log("708 HCR");
           if(this.isRowValid(this.currRow)){
               this.rowTextInfos[this.currRow].moveAbsCursor(0);
           }
            //this.outputDataUpdate();
        },

        parseCRNonRollup: function(){
            //console.log("[ParseCRNonRollup] pd:%d, sd:%d", this.windAttri.pd, this.windAttri.sd);
            switch (this.windAttri.pd){
                case print_sDirection.LEFT_TO_RIGHT: {
                    if (print_sDirection.BOTTOM_TO_TOP == this.windAttri.sd){
                        this.setCurrRow(this.getCurrRow() + 1);
                    }
                    else if (print_sDirection.TOP_TO_BOTTOM == this.windAttri.sd)
                    {
                        this.setCurrRow(this.getCurrRow() - 1);
                    }
                    //console.log("row:%d, info:%p", this.currRow, this.rowTextInfos[this.currRow]);
                    this.rowTextInfos[this.currRow].moveAbsCursor(0);
                    break;
                }
                case print_sDirection.RIGHT_TO_LEFT:{
                    if (print_sDirection.BOTTOM_TO_TOP == this.windAttri.sd){
                        this.setCurrRow(this.getCurrRow() + 1);
                    }
                    else if (print_sDirection.TOP_TO_BOTTOM == this.windAttri.sd){
                        this.setCurrRow(this.getCurrRow() - 1);
                    }
                    this.rowTextInfos[this.getCurrRow()].moveAbsCursor(TranslateColNoToPos(this.rectInfo.Rect.Right - 1));
                    break;
                }
                case print_sDirection.TOP_TO_BOTTOM: {
                    if (print_sDirection.LEFT_TO_RIGHT == this.windAttri.sd)
                    {
                        this.rowTextInfos[this.currRow].moveCursor(-1);
                    }
                    else if (print_sDirection.RIGHT_TO_LEFT == this.windAttri.sd)
                    {
                        this.rowTextInfos[this.currRow].moveCursor(1);
                    }
                    this.setCurrRow(this.rectInfo.Rect.Top);
                    break;
                }
                case print_sDirection.BOTTOM_TO_TOP: {
                    if (print_sDirection.LEFT_TO_RIGHT == this.windAttri.sd)
                    {
                        this.rowTextInfos[this.currRow].moveCursor(-1);
                    }
                    else if (print_sDirection.RIGHT_TO_LEFT == this.windAttri.sd)
                    {
                        this.rowTextInfos[this.currRow].moveCursor(1);
                    }
                    this.setCurrRow(this.rectInfo.Rect.Bottom - 1);
                    break;
                }
                default:
                    break;
            }
        },

       parseCRRollup: function(winTopNo){
            winTopNo += 1;
            if (this.isRowValid(this.currRow)){
                if (this.bAdjustRowFlag){
                    this.adjustRowWhenNoSPLCmd(this.getCurrRow());
                }
                else{
                    while (winTopNo <= this.getCurrRow()){
                        this.copyChar(winTopNo, winTopNo - 1);
                        winTopNo++;
                    }
                }
            }
        },

        adjustRowWhenNoSPLCmd: function(CurRowNo){
            var nWinMaxRow = TranslatePosToRowNo(this.rectInfo.Rect.Bottom) - 1;
           // console.log("[adjustRowWhenNoSPLCmd] Flag:%d, CurRowNo:%d, nWinMaxRow:%d", this.bAdjustRowFlag, CurRowNo, nWinMaxRow);

            if ((CurRowNo >= nWinMaxRow) || (3 <= CurRowNo)){
                this.setCurrRow(0);
                for (var i = 0;  i <= CurRowNo;  i++){
                    if(this.rowTextInfos[i]) {
                       this.rowTextInfos[i].moveAbsCursor(0);
                    }
                }
            }
            else{
                this.setCurrRow(CurRowNo + 1);
                if(this.rowTextInfos[this.currRow]) {
                    this.rowTextInfos[this.currRow].moveAbsCursor(0);
                }
            }
        },

        copyChar: function(srcRow, desRow){
            // console.log("[CopyChar] srcRow:%d, desRow:%d, m_RowCnt:%d, Charcnt:%d",
            //     srcRow, desRow, this.rowCnt, this.rowTextInfos[srcRow].pos);
            if (srcRow >= this.rowCnt || desRow >= this.rowCnt || !this.rowTextInfos[srcRow].pos){
                return;
            }

            this.rowTextInfos[desRow].textInfos = this.rowTextInfos[srcRow].textInfos;
            this.rowTextInfos[desRow].pos = this.rowTextInfos[srcRow].pos;
            this.rowTextInfos[srcRow].pos = 0;
        },

        setAdjustRowFlag: function (bAdjustFlag) {
            this.bAdjustRowFlag = bAdjustFlag;
        },

        /**
         * Get all non-empty rows with as unicode text.
         */
        getDisplayText : function(asOneRow) {
            asOneRow = asOneRow || false;
            var displayText = [];
            var text = "";
            var rowNr = -1;
            for (var i = 0 ; i < this.rowCnt ; i++) {
                var rowText = this.rowTextInfos[i].getTextString();
                if (rowText) {
                    rowNr = i;
                    if (asOneRow) {
                        displayText.push("Row " + rowNr + ': "' + rowText + '"');
                    } else {
                        displayText.push(rowText.trim());
                    }
                }
            }
            if (displayText.length > 0) {
                if (asOneRow) {
                    text = "[" + displayText.join("|") + "]";
                } else {
                    text = displayText.join("\n");
                }
            }
            return text;
        },

        SetWindowRectInfo: function(nAnchorID, bRelPos, nAnchorVer, nAnchorHor, nRowCnt, nColCnt){
            var nMinRow = 0,nMaxRow = 0,nMinCol = 0,nMaxCol = 0;
            if(bRelPos){
                nMinRow = parseInt(nAnchorVer*NR_ROWS/100);
                nMinCol = parseInt(nAnchorHor*NR_COLS/100);
            }
            else {
                nMinRow = parseInt(nAnchorVer/5);
                nMinCol = parseInt(nAnchorHor/5);
            }

            if(1 === parseInt(nAnchorID/3)){
                if(nMinRow >= parseInt(nRowCnt/2)){
                    nMinRow = nMinRow - parseInt(nRowCnt/2);
                }
            }
            else if(2 === parseInt(nAnchorID/3)){
                if(nMinRow >= (nRowCnt - 1)){
                    nMinRow = nMinRow - (nRowCnt - 1);
                }
            }

            if (parseInt(nAnchorID%3) == 1)
            {
                if (nMinCol >= parseInt(nColCnt/2))
                {
                    nMinCol = nMinCol - parseInt(nColCnt/2);
                }
            }
            else if (parseInt(nAnchorID%3) == 2)
            {
                if (nMinCol >= (nColCnt - 1))
                {
                    nMinCol = nMinCol - (nColCnt - 1);
                }
            }

            nMaxRow = nMinRow + (nRowCnt - 1);
            nMaxCol = nMinCol + (nColCnt - 1);

            nMinRow = nMinRow > (NR_ROWS - 1) ? (NR_ROWS - 1) : nMinRow;
            nMaxRow = nMaxRow > (NR_ROWS - 1) ? (NR_ROWS - 1) : nMaxRow;

            nMinCol = nMinCol > (NR_COLS - 1) ? (NR_COLS - 1) : nMinCol;
            nMaxCol = nMaxCol > (NR_COLS - 1) ? (NR_COLS - 1) : nMaxCol;

            var rect = new RectPos();
            if(!rect){
                return;
            }
            setRectPos(rect, nMinRow, nMaxRow, nMinCol, nMaxCol);
            var rectInfo = {Rect: rect};
            this.setRectInfo(rectInfo);
        },

        MapColor2RGB:function( uRed, uGreen, uBlue){
            if (uRed > 3 || uGreen > 3 || uBlue > 3)
            {
                return null;
            }
            var voRGBValue = new Color();
            voRGBValue.Red = uRed*CC708RGB_TIMESCALE;
            voRGBValue.Green = uGreen*CC708RGB_TIMESCALE;
            voRGBValue.Blue = uBlue*CC708RGB_TIMESCALE;
            return voRGBValue;
        },

        SetWindowAttri: function(WinAttri, Arr, Size){
            var ret = WinAttri.load(Arr, Size);
            var rowDes = {hj:parseInt(WinAttri.j%3), pd:WinAttri.pd};
            this.setRowDes(rowDes);

            var rectBorderColor = this.MapColor2RGB(this.windAttri.br, this.windAttri.bg, this.windAttri.bb);
            rectBorderColor.Trans = 0;
            var rectFillColor = this.MapColor2RGB(this.windAttri.fr, this.windAttri.fg, this.windAttri.fb);
            rectFillColor.Trans = 0;
            switch (this.windAttri.fo){
                case 0:
                case 1:
                    rectFillColor.Trans = 0xFF;///<100%
                    break;
                case 2:
                    rectFillColor.Trans = 0xBF;///<75%
                    break;
                case 3:
                    rectFillColor.Trans = 0x0;///<0%
                    break;
                default:
                    break;
            }

            var rectInfo = {RectBorderType: (this.windAttri.bt2 << 3 | this.windAttri.bt0),
                RectBorderColor: rectBorderColor, RectFillColor: rectFillColor,
                RectDisplayEffect:{EffectType: this.windAttri.de, EffectSpeed: this.windAttri.es,
                    EffectDirection: this.windAttri.ed}};

            this.setRectInfo(rectInfo);
            this.setTextDisplayInfo({wrap: this.windAttri.ww, sd: this.windAttri.sd});
            this.UpdateWindInfo();
            return ret;
        },

        SetPenAtti: function (PenAttri, Arr, Size) {
            var ret = PenAttri.load(Arr, Size);
            var fontEffectInfo = {Italic: this.penAttri.i, Underline: this.penAttri.u,
                EdgeType: this.penAttri.et, TextTag: this.penAttri.tt,
                offSet: this.penAttri.o};
            var fontInfo = {FontSize: this.penAttri.s, FontStyle: this.penAttri.fs};
            var charInfo = {FontInfo: fontInfo, FontEffectInfo: fontEffectInfo};
            this.setCharInfo(charInfo);

            this.UpdateWindInfo();
            //this.outputDataUpdate();
            logger.log("DEBUG", "[wind: SetPenAtti]");
            return ret;
        },

        SetPenColor: function (PenColor, Arr, Size) {
            var ret = PenColor.load(Arr, Size);

           var fontColor = this.MapColor2RGB(this.penColor.fr, this.penColor.fb, this.penColor.fg);
            if (0 === this.penColor.fo|| 1 === this.penColor.fo)
            {
                fontColor.Trans = 0xFF;
            }
            else if(2 === this.penColor.fo)
            {
                fontColor.Trans = 0xBF;
            }
            else{
                fontColor.Trans  = 0x0;
            }
            var edgeColor =  this.MapColor2RGB(this.penColor.er, this.penColor.eg, this.penColor.eb);
            edgeColor.Trans = fontColor.Trans;
            var charInfo = {FontInfo:{FontColor: fontColor}, FontEffectInfo:{EdgeColor: edgeColor}};
            this.setCharInfo(charInfo);

            var rectFillColor = this.MapColor2RGB(this.penColor.br, this.penColor.bg, this.penColor.bb);
            if (this.penColor.bo === 0 || this.penColor.bo === 1){
                rectFillColor.Trans = 0xFF;
            }
            else if(this.penColor.bo === 2){
                rectFillColor.Trans = 0xBF;
            }
            else{
                rectFillColor.Trans = 0x0;
            }
            var txtDes = new textDes();
            txtDes.dataBox.RectFillColor = rectFillColor;
            //this.setRowDes(txtDes);
            this.setRowDes({dataBox:{RectFillColor: rectFillColor}});

            this.UpdateWindInfo();
            //this.outputDataUpdate();
            logger.log("DEBUG", "[wind: SetPenColor]");
            return ret;
        },

        load: function (Arr, Size) {
            if (7 > Size)
            {
                logger.log("ERROR", "ClosedCaption Error:DFCommandPara less para");
                return Size;
            }
            this.WindID = R3B2(Arr[0]);
            this.setVisible(R1B5(Arr[1]));
            logger.log("DEBUG", "[wind: load] windID:" + this.WindID, ", visible:" + R1B5(Arr[1]));
            this.rl = R1B4(Arr[1]);
            this.cl = R1B3(Arr[1]);
            this.priority = R3B2(Arr[1]);
            //priority handle???

            this.rp = R1B7(Arr[2]);
            this.av = R7B6(Arr[2]);
            this.ah = Arr[3];
            this.ap = R4B7(Arr[4]);
            this.rc = R4B3(Arr[4]);
            this.rc += 1;

            this.cc = R6B5(Arr[5]);
            this.cc += 1;

            this.SetWindowRectInfo(this.ap,this.rp,this.av,this.ah,this.rc,this.cc);
            this.ws = R3B5(Arr[6]);
            if(!this.ws){
                this.ws = 1;
            }
            this.ps = R3B2(Arr[6]);
            if(!this.ps){
                this.ps = 1;
            }

            if(this.ws){
                this.SetWindowAttri(this.windAttri, PresetWinAttri[this.ws - 1], 4);
            }

            if(this.ps){
                this.SetPenAtti(this.penAttri, PresetPenAttri[this.ps - 1], 2);
                this.SetPenColor(this.penColor, PresetPenColor[this.ps - 1], 3);
            }

            var currRectInfo = this.getRectInfo();
            var winMinRow = TranslatePosToRowNo(currRectInfo.Rect.Top, true);
            var winMaxRow = TranslatePosToRowNo(currRectInfo.Rect.Bottom, true) - 1;
            var currRow = this.getCurrRow();
            //console.log("load currRow:%d, minRow:%d, maxRow:%d", currRow, winMinRow, winMaxRow);
            if(this.isRowValid(currRow) && (currRow < winMinRow || currRow > winMaxRow)){
                var row = 0;
                while (row < winMinRow){
                    this.rowTextInfos[currRow].clear();
                    row ++;
                }
                row = winMaxRow + 1;
                while(row < this.rowCnt){
                    this.rowTextInfos[currRow].clear();
                    row ++;
                }

                this.setCurrRow(winMinRow);
                if(3 === this.windAttri.sd){
                    this.setCurrRow(winMaxRow);
                }
            }
            //this.outputDataUpdate();
            return 7;
        },

        setVisible: function (bVisible) {
            logger.log("DEBUG", "[setVisible]" + "this.visible:" + this.visible + ", bVisible:" + bVisible);
            if (bVisible !== this.visible){
                this.UpdateWindInfo(true);
                this.visible = bVisible;
            }
        },

        isEmpty : function() {
            var empty = true;
            for (var i = 0 ; i < this.rowCnt ; i++) {
                if(!this.rowTextInfos[i]){
                    continue;
                }
                if (!this.rowTextInfos[i].isEmpty()) {
                    empty = false;
                    break;
                }
            }
            return empty;
        },

        equals : function(other) {
            var equal = true;
            for (var i = 0 ; i < this.rowCnt ; i++) {
                if (!this.rowTextInfos[i].equals(other.rowTextInfos[i])) {
                    equal = false;
                    break;
                }
            }
            return equal;
        },

        getSubtitleData: function () {
            var subtitleDate = [];
            var textInfo = [];
            var row = TranslatePosToRowNo(this.getRectInfo().Rect.Top);
            var maxRow = TranslatePosToRowNo(this.getRectInfo().Rect.Bottom) - 1;
            maxRow = (maxRow <= (this.rowCnt - 1)) ? maxRow : (this.rowCnt - 1);
            row = (row <= maxRow) ? row : 0;

            while (row <= maxRow){
                if(!this.rowTextInfos[row].pos){
                    row ++;
                    continue;
                }

                textInfo.push(this.rowTextInfos[row]);
                row ++;
            }

            subtitleDate.push({
                rectInfo: this.rectInfo,
                TextRowInfo:textInfo,
                TextDisplayInfo: this.TextDisplayInfo
            });
            return subtitleDate;
        }
    };

    var captionScreen = function (arr) {
        this.captionArray = arr || null;
        this.is708cc = true;
    };

    captionScreen.prototype = {
        reset: function () {
            for(var i = 0; i < this.captionArray.length; i ++){
                this.captionArray[i].reset();
            }
        },

        getDisplayText : function(asOneRow) {
            asOneRow = asOneRow || false;
            var displayText = [];
            var text = "";
            var winNr = -1;
            if(!this.captionArray){
                return text;
            }
            for (var i = 0 ; i < this.captionArray.length ; i++) {
                if(!this.captionArray[i]){
                    continue;
                }
                var winText = this.captionArray[i].getDisplayText(asOneRow);
                if (winText) {
                    winNr = this.captionArray[i].WindID;
                    if (asOneRow) {
                        displayText.push("Window " + winNr + ': "' + winText + '"');
                    } else {
                        displayText.push(winText.trim());
                    }
                }
            }
            if (displayText.length > 0) {
                if (asOneRow) {
                    text = "[" + displayText.join("|") + "]";
                } else {
                    text = displayText.join("\n");
                }
            }
            return text;
        },
        isEmpty: function () {
            var empty = true;
            if(this.captionArray){
                for(var i = 0; i < this.captionArray.length; i++){
                    if(this.captionArray[i]){
                        if(!this.captionArray[i].isEmpty()){
                            empty = false;
                            break;
                        }
                    }
                }
            }
            return empty;
        }
    };

    var outputData_Null = new Cea708Window();
    outputData_Null.reset();
    var rectInfo = {'Rect':{'Top':0, 'Left':0, 'Bottom':14, 'Right':31}};
    outputData_Null.setRectInfo(rectInfo);
    outputData_Null.rectInfo.RectBorderColor.Trans = 0;
    outputData_Null.rectInfo.RectFillColor.Trans = 0;
    var Cea708parser = function (out) {
        this.windows = [];
        this.outputFilter = out;
        for(var i = 0; i < CC_WINDOWS; i ++){
            this.windows.push(new Cea708Window(i));
        }
        this.CurrWindID = -1;
        this.bClearScreen = false;
        this.cueStartTime = null; // Keeps track of where a cue started.
        this.captionScreen = null;
        this.startTime = null;
        this.lastTime = null;
        this.dataCounters = {'padding' : 0, 'char' : 0, 'cmd' : 0, 'other' : 0};
    };

    Cea708parser.prototype = {
        reset: function () {
            this.CurrWindID = -1;
            this.bClearScreen = false;
            this.cueStartTime = null;
            for (var i = 0; i < this.windows.length; i ++){
                if(this.windows[i]){
                    this.windows[i].reset();
                }
            }
        },

        getHandler: function() {
            return this.outputFilter;
        },

        setHandler: function(newHandler) {
            this.outputFilter = newHandler;
        },

        outputDataUpdate: function () {
            this.captionScreen = new captionScreen(this.setOutputScreen());
            console.log("captionText:" + this.captionScreen.getDisplayText(true));

  
            var t = logger.time;
            if (t === null) {
                logger.log("ERROR", "[outputDataUpdate]" + "t is null." +
                    ", logger time:" + logger.time);
                return;
            }

            if (this.outputFilter) {
                if (this.outputFilter.updateData) {
                    this.outputFilter.updateData(t, this.captionScreen);
                }
                if (this.cueStartTime === null && !this.captionScreen.isEmpty()) { // Start of a new cue
                    this.cueStartTime = t;
                } else {
                    if (this.outputFilter.newCue) {
                        logger.log("DEBUG", "[outputDataUpdate]" +  ", startime:" + this.cueStartTime + ", time:" + t);
                        this.outputFilter.newCue(this.cueStartTime, t, this.captionScreen);
                    }
                    this.cueStartTime = this.captionScreen.isEmpty() ? null : t;

                }
            }
        },

        cueSplitAtTime: function(t) {
            logger.log("DEBUG","cueSplitAtTime: " + t);
            if (this.outputFilter) {
                if (this.outputFilter.newCue) {
                    this.outputFilter.newCue(this.cueStartTime, t, this.captionScreen);
                }
                this.cueStartTime = t;
            }
        },

        setOutputScreen:function () {
            var captionArray = null;//[];
            var bUpdate = false;
            var i = 0;
            for(i = 0; i < this.windows.length; i ++){
                if(!this.windows[i]){
                    continue;
                }
                logger.log("DEBUG", "[setOutputScreen]" + "windID:" + this.windows[i].WindID +
                ", update:" + this.windows[i].update + ", visible:" + this.windows[i].visible);
                if(-1 != this.windows[i].WindID && this.windows[i].update){
                    bUpdate = true;
                    break;
                }
            }
            if(this.bClearScreen){
                this.bClearScreen = false;
                captionArray = outputData_Null;
            }
            else if(bUpdate){
                captionArray = this.getWindowsInfo();
            }
            else {
                captionArray = [null];
            }

            for(i = 0; i < this.windows.length; i ++){
                if(this.windows[i] && this.windows[i].update){
                    this.windows[i].update = false;
                }
            }
            return captionArray;
        },

        getWindInfo: function () {
            var captionArray = [];
            var empty = true;
            for(var i = 0; i < this.windows.length; i ++){
                if(!this.windows[i] || (-1 === this.windows[i].WindID)){
                    continue;
                }
                if(!this.windows[i].visible){
                    continue;
                }
                if(this.windows[i].isEmpty()){
                   continue;
                }
                empty = false;
                var subtitleData = this.windows[i].getSubtitleData();
                if(subtitleData.length){
                    captionArray.push(subtitleData);
                    logger.log("DEBUG", "[getWindInfo]" + "wind:" + this.windows[i].WindID +
                    ", Text:" + this.windows[i].getDisplayText(true));
                }
            }
            if(empty){
                captionArray.push(outputData_Null);
            }
            return captionArray;
        },

        getWindowsInfo: function () {
            var captionArray = [];
            var empty = true;
            for(var i = 0; i < this.windows.length; i ++){
                if(!this.windows[i] || (-1 === this.windows[i].WindID)){
                    continue;
                }
                if(!this.windows[i].visible){
                    continue;
                }
                if(this.windows[i].isEmpty()){
                    continue;
                }
                empty = false;
                // var subtitleData = this.windows[i].getSubtitleData();
                 if(ASCII_SPACE_CHAR != this.windows[i].getDisplayText(true)){
                    captionArray.push(this.windows[i]);
                //var text = captionArray[0].getDisplayText(true);
                    logger.log("DEBUG", "[getWindInfo]" + "wind:" + this.windows[i].WindID +
                        ", Text:" + this.windows[i].getDisplayText(true));
                }
            }
            // if(empty){
            //     captionArray.push(outputData_Null);
            // }
            return captionArray;
        },

        FindWindByID: function (windID) {
            if(0 > windID || 7 < windID){
                return null;
            }
            if(windID === this.windows[windID].WindID){
                return this.windows[windID];
            }
        },

        addData: function(t, byteList) {
            this.lastTime = t;
            logger.setTime(t);

            var i = 0;
            console.log("[ Cea708Parser:addData]:" + "time: " + t);
            // for(var j = 0; j < byteList.length; j ++){
            //     console.log("%d(%s)",  byteList[j], byteList[j].toString(16));
            // }
            while (i < byteList.length) {
                var bExtCode = false;
                if(C0_SET_EXT_CODE_CEA_708 === byteList[i]){
                    bExtCode = true;
                    i += 1;
                }
                if (0 === byteList[i]) {
                    this.dataCounters.padding += 1;
                    i += 1;
                    continue;
                }
                // else {
                //     //logger.log("DATA", "[" + numArrayToHexArray([byteList[i], byteList[i+1]]) +"] -> (" + numArrayToHexArray([a, b]) + ")");
                // }

                if ((G0_G2_SET_START_CODE_CEA_708 <= byteList[i] && G0_G2_SET_END_CODE_CEA_708 >= byteList[i]) ||
                    (G1_G3_SET_START_CODE_CEA_708 <= byteList[i]) ){
                    this.parseStandardChar(byteList[i], 1, bExtCode);
                    this.dataCounters.char += 1;
                    i += 1;
                }else if((C0_SET_START_CODE_CEA_708 <= byteList[i] && C0_SET_END_CODE_CEA_708 >= byteList[i]) ||
                    (C1_SET_START_CODE_CEA_708 <= byteList[i] && C1_SET_END_CODE_CEA_708 >= byteList[i])){
                    var Tmpchar = byteList.slice(i);
                    var DataSize = this.parseNonStandardChar(Tmpchar, (byteList.length - i), bExtCode);
                    i += DataSize;
                    this.dataCounters.cmd += DataSize;
                }else {
                    this.dataCounters.other += 1;
                   // console.log("Couldn't parse cleaned data[%d]:%d", i, byteList[i]);
                    //logger.log("WARNING", "Couldn't parse cleaned data " + byteList[i]);
                    // logger.log("WARNING", "Couldn't parse cleaned data " +
                    //     " orig: " + numArrayToHexArray([byteList[i], byteList[i+1]]));
                    i += 1;
                }
            }
            this.outputDataUpdate();
        },

        parseNonStandardChar: function (Arr, size, ExtCode) {
            logger.log("INFO", "[parseNonStandardChar] byte:" + Arr[0].toString(16) +"(" + Arr[0] + ")" +
                ", size:" + size + ", ExtCode:" + ExtCode);
            var ret = 0;
            if(C0_SET_START_CODE_CEA_708 <= Arr[0] && C0_SET_END_CODE_CEA_708 >= Arr[0]){
                if (ExtCode){
                    return Arr[0]/8 + 1;
                }else {
                    ret = this.parseC0Code(Arr, size);
                }
            }else if(C1_SET_START_CODE_CEA_708 <= Arr[0] && C1_SET_END_CODE_CEA_708 >= Arr[0]){
                if (ExtCode){
                    if (C1_SET_Mid_CODE_CEA_708 >= Arr[0]){
                        return(Arr[0] - C1_SET_START_CODE_CEA_708)/8 + 5;
                    }else{
                        if(2 > size){
                            logger.log("ERROR", "ClosedCaption Error:ParserC1 EXT Code size <2:%d",size);
                            return size;
                        }else {
                            return (Arr[1]&0x1F) + 2;
                        }
                    }
                }else {
                    ret = this.parseC1Code(Arr, size);
                }
            }
            //this.outputDataUpdate();
            return ret;
        },

        parseC0Code: function (Arr, size) {
            var ret = 1;
            if (C0_SET_EXT_CODE_CEA_708 <= Arr[0] && C0_SET_P10_CODE_CEA_708 > Arr[0]){
                ret = 2;
            }else if(C0_SET_P10_CODE_CEA_708 <= Arr[0] && C0_SET_END_CODE_CEA_708 >= Arr[0]){
                ret = 3;
            }else if(size < ret){
                logger.log("ERROR","ClosedCaption Error:ParserC0Code cbInputData < ret:%d:%d",size, ret);
                return size;
            }

            if(0 <= this.CurrWindID && 7 >= this.CurrWindID){
                var CurrWind = this.FindWindByID(this.CurrWindID);
                if(!CurrWind){
                    return ret;
                }

                CurrWind.UpdateWindInfo(false);

                switch (Arr[0]){
                    case 0x3:{ //ETX
                        break;
                    }
                    case 0x8:{ //BS
                        CurrWind.cc_BS();
                        break;
                    }
                    case 0xC:{
                        CurrWind.resetTextInfo(true);
                        var currRectInfo = CurrWind.getRectInfo();
                        var windowTopNo = TranslatePosToRowNo(currRectInfo.Rect.Top, true);
                        CurrWind.setCurrRow(windowTopNo);
                        break;
                    }
                    case  0xD:{ //CR
                        CurrWind.cc_CR();
                        break;
                    }
                    case 0xE:{//HCR
                        CurrWind.cc_HCR();
                        break;
                    }
                    case 0x10:{
                        logger.log("DEBUG", "ClosedCaption Error:EXT1 should not exist here");
                        break;
                    }
                    case 0x18:{
                        logger.log("DEBUG", "ClosedCaption Error:not supported P16");
                        break;
                    }
                    default:
                        break;
                }
            }

            return ret;
        },

        parseC1Code:function (Arr, size) {
            var ret = 0;
            if (CC_DF0 <= Arr[0] && CC_DF7 >= Arr[0]){
                this.CurrWindID = Arr[0] - CC_DF0;
                var CurrWind = this.windows[this.CurrWindID];
                if(!CurrWind){
                    return ret;
                }
                CurrWind.reset();
                ret = CurrWind.load(Arr, size);
            }
            else if(CC_CW0 <=Arr[0] && CC_CW7 >= Arr[0]){
                this.CurrWindID = Arr[0] - CC_CW0;
                ret = 1;
            }
            else{
                switch (Arr[0]){
                    case CC_CLW:{
                        ret =  this.parseCLWCode(Arr, size);
                    }
                        break;
                    case CC_DSW:{
                        ret = this.parseDSWCode(Arr, size);
                    }
                        break;
                    case CC_HDW:{
                        ret = this.parseHDWCode(Arr, size);
                    }
                        break;
                    case CC_TGW:{
                        ret = this.parseTGWCode(Arr, size);
                    }
                        break;
                    case CC_DLW:{
                        ret = this.parseDLWCode(Arr, size);
                    }
                        break;
                    case CC_DLY:{
                        ret = 2;
                    }
                        break;
                    case CC_DLC:{
                        ret = 1;
                    }
                        break;
                    case CC_RET:{
                        logger.log("DEBUG", "[CC_RET] CurrWindID:" + this.CurrWindID);
                        var wind = this.FindWindByID(this.CurrWindID);
                        if(wind){
                            wind.reset();
                        }

                        ret = 1;
                    }
                        break;
                    case CC_SPA:{
                        ret = this.parseSPACode(Arr, size);
                    }
                        break;
                    case CC_SPC:{
                        ret = this.parseSPCCode(Arr, size);
                    }
                        break;
                    case CC_SPL:{
                        ret = this.parseSPLCode(Arr, size);
                    }
                        break;
                    case CC_SWA:{
                        ret = this.parseSWACode(Arr, size);
                    }
                        break;
                    default:{ ///<0x93~0x96
                        ret = 1;
                    }
                        break;
                }
            }
            return ret;
        },

        parseCLWCode: function (Arr, size) {
            var dwWinID = 0, bitValue = 1;
            if (2 > size){
                logger.log("ERROR", "ClosedCaption Error:CLW less para");
                return size;
            }
            while (8 > dwWinID){
                if ((Arr[1] & bitValue)){
                    var wind= this.FindWindByID(dwWinID);
                    if (!wind){
                        return 2;
                    }
                    wind.resetTextInfo(true);
                    wind.UpdateWindInfo();
                    var currRectInfo = wind.getRectInfo();
                    var windowTopNo = TranslatePosToRowNo(currRectInfo.Rect.Top, true);
                    wind.setCurrRow(windowTopNo);
                }
                bitValue *= 2;
                dwWinID++;
            }
            return 2;
        },

        parseDSWCode: function (Arr, size) {
            if (2 > size)
            {
                logger.log("ERROR","ClosedCaption Error:DSW less para");
                return size;
            }
            var dwWinID = 0, bitValue = 1;
            while (8 > dwWinID){
                if ((Arr[1] & bitValue)){
                    var CurWin = this.FindWindByID(dwWinID);
                    if (CurWin){
                        CurWin.setVisible(true);
                    }
                }
                bitValue *= 2;
                dwWinID++;
            }
            return 2;
        },

        parseHDWCode: function (Arr, size) {
            if (2 > size){
                logger.log("ERROR", "ClosedCaption Error:HDW less para");
                return size;
            }
            var dwWinID = 0, bitValue = 1;
            while (8 > dwWinID){
                if ((Arr[1] & bitValue)){
                    var CurWin = this.FindWindByID(dwWinID);
                    if (CurWin){
                        CurWin.setVisible(false);
                    }
                }
                bitValue *= 2;
                dwWinID ++;
            }
            return 2;
        },

        parseTGWCode: function (Arr, size) {
            if (2 > size)
            {
                logger.log("ERROR", "ClosedCaption Error:TGW less para");
                return size;
            }
            var dwWinID = 0, bitValue = 1;
            while (8 > dwWinID){
                if ((Arr[1] & bitValue)){
                    var CurWin = this.FindWindByID(dwWinID);
                    if (CurWin){
                        CurWin.setVisible((CurWin.visible  + 1)%2);
                    }
                }
                bitValue *= 2;
                dwWinID ++;
            }
            return 2;
        },

        parseDLWCode: function (Arr, size) {
            if (2 > size){
                logger.log("ERROR", "ClosedCaption Error:DLW less para");
                return size;
            }
            var dwWinID = 0, bitValue = 1;
            while (8 > dwWinID)
            {
                if ((Arr[1] & bitValue))
                {
                    if (dwWinID == this.CurrWindID)
                    {
                        this.windows[this.CurrWindID].reset();
                        this.CurrWindID = -1;
                        this.bClearScreen = true;
                    }
                }
                bitValue *= 2;
                dwWinID ++;
            }
            return 2;
        },

        parseSPACode: function (Arr, size) {
            if (3 > size)
            {
                logger.log("ERROR", "ClosedCaption Error:SPA less para");
                return size;
            }

           var CurWin = this.FindWindByID(this.CurrWindID);
            if (CurWin)
            {
                var newArr = Arr.slice(1);
                CurWin.SetPenAtti(CurWin.penAttri, newArr, (size - 1));
            }
            return 3;
        },

        parseSPCCode: function (Arr, size) {
            if (4 > size)
            {
                logger.log("ERROR", "ClosedCaption Error:SPC less para");
                return size;
            }

           var curWin = this.FindWindByID(this.CurrWindID);
            if (curWin)
            {
                var newArr = Arr.slice(1);
                curWin.SetPenColor(curWin.penColor, newArr, (size - 1));
            }
            return 4;
        },

        parseSPLCode: function (Arr, size) {
            if (2 > size)
            {
                logger.log("ERROR", "ClosedCaption Error:SPL less para");
                return size;
            }

            var curWind = this.FindWindByID(this.CurrWindID);
            if (!curWind)
            {
                return size > 2 ? 3 : 2;
            }

            var nWindowTopNo = TranslatePosToRowNo(curWind.getRectInfo().Rect.Top);
            var nCurRelRow = R4B3(Arr[1]);
            curWind.setCurrRow(nWindowTopNo + nCurRelRow);
            var colNo = 0;
            if (2 < size)
                colNo = R6B5(Arr[2]);

            var curRow = curWind.getCurrRow();
            if (curWind.isRowValid(curRow)){
                if (curWind.rowTextInfos[curRow].pos > 0){
                    curWind.rowTextInfos[curRow].moveAbsCursor(colNo);
                }
                else{
                   curWind.rowTextInfos[curRow].setCursor(colNo);
                }
            }
            curWind.UpdateWindInfo(false);
            return (size > 2) ? 3 : 2;
        },

        parseSWACode: function (Arr, size) {
            if (5 > size){
                logger.log("ERROR", "ClosedCaption Error:SWA less para");
                return size;
            }
            var curWind = this.FindWindByID(this.CurrWindID);
            if (curWind)
            {
                var newArr = Arr.slice(1);
                curWind.SetWindowAttri(curWind.windAttri, newArr, (size - 1));
            }
            return 5;
        },

        parseStandardChar: function (char, size, ExtCode) {
            logger.log("INFO", "[parseStandardChar] byte:" + char.toString(16) +"(" + char + ")" + ", size:" + size +
            ", ExtCode:" + ExtCode + ", curWindID:" + this.CurrWindID);
            var nUniCode = char,
                charCodes = null;
           if (ExtCode){
                var nSpeCharCnt = 0;
                for (;nSpeCharCnt < COUNT_G2G3_CHARACTER;nSpeCharCnt++){
                    if(nUniCode == ExtendedG2G3CodeMap[nSpeCharCnt][0]){
                        nUniCode = ExtendedG2G3CodeMap[nSpeCharCnt][1];
                        break;
                    }
                }
                if (COUNT_G2G3_CHARACTER == nSpeCharCnt){
                    nUniCode = 0x5F;
                }
            }
            else if (nUniCode == 0x7F){
                nUniCode = 0x266A;
            }
            charCodes = [nUniCode];
            if(charCodes){
                var hexCodes = numArrayToHexArray(charCodes);
                logger.log("DEBUG", "708 Char codes =  " + hexCodes.join(",") );

                if (this.CurrWindID >=0) {
                    var wind = this.FindWindByID(this.CurrWindID);
                    if(wind){
                        if(-1 === wind.getCurrRow()){
                            var rectInfo = wind.getRectInfo();
                            if(rectInfo){
                                var windTop = TranslatePosToRowNo(rectInfo.Rect.Top);
                                wind.setCurrRow(windTop);
                                wind.setAdjustRowFlag(true);
                            }
                        }
                        wind.insertChars(charCodes);
                        //this.outputDataUpdate();
                    }
                } else {
                    logger.log("WARNING", "No window found yet.");
                }
                return true;
            }

            return false;
        }
    };


    var serviceData = function () {
        this.serData = [];
        this.serDataSize = 0;
    };
    serviceData.prototype = {
        reset: function () {
            this.serDataSize = 0;
            this.serData = [];
        },
        saveSerDate: function (data) {
            this.serData = this.serData.concat(data);
        }
    };

    var Cea708ServiceBlock = function () {
        this.allserDataSize = 0;
        this.serData = [];
        for (var i = 1; i <= CC_MAX_SERVICE_NUM; i ++){
            this.serData[i] = new serviceData();
        }
    };

    Cea708ServiceBlock.prototype = {
        reset: function () {
            for (var i = 1; i < this.serData.length; i ++){
                this.serData[i].reset();
            }
            this.allserDataSize = 0;
        },

        extractCea708DataFromService: function (serviceData, len) {
            this.reset();
            var tmpSize = len;
            var tmpDataIndex = 0;
            while (tmpSize > 0)
            {
                var serviceNo = R3B7(serviceData[tmpDataIndex]);
                var blockSize = R5B4(serviceData[tmpDataIndex]);
                tmpSize --;
                tmpDataIndex ++;
                if ( 0 === serviceNo)
                {
                    if (0 !== blockSize)
                    {
                        logger.log("ERROR", "[extractCea708DataFromService] Error:serviceNo is 0,but blockSize is not 0");
                    }
                    return  this.allserDataSize;///<once NULL service block,there are no more service block need to be processed
                }
                if (7 == serviceNo && 0 < blockSize)
                {
                    serviceNo = R6B5(serviceData[tmpDataIndex]);
                    tmpSize --;
                    tmpDataIndex ++;
                }

                if (blockSize > (len - tmpDataIndex))
                {
                    blockSize = len - tmpDataIndex;
                    logger.log("DEBUG", "[extractCea708DataFromService] ServiceBlock Packet size bigger than nBlockSize");
                }
                if (this.allserDataSize + blockSize > CC_MAX_SERVICE_BLOCK_SIZE)
                {
                    logger.log("DEBUG", "[extractCea708DataFromService] ServiceBlock Packet Out of Memory");
                    blockSize = 63 - this.allserDataSize;
                }
                var tmpBuffer = serviceData.slice(tmpDataIndex, blockSize + tmpDataIndex);
                if(this.serData[serviceNo]){
                    this.serData[serviceNo].saveSerDate(tmpBuffer);
                    this.serData[serviceNo].serDataSize += blockSize;
                    this.allserDataSize += blockSize;
                }

                tmpDataIndex += blockSize;
                tmpSize -= blockSize;
            }
            return this.allserDataSize;
        }
    };

    var Cea708PacketParser = function(){
        this.seqNo = -1;
        this.packetSize = 0;
        this.serviceBlock = new Cea708ServiceBlock();
        this.lastSeqNo = -1;
        this.serNoSetting = 1;
    };

    Cea708PacketParser.prototype = {
      reset: function () {
          this.seqNo = -1;
          this.packetSize = 0;
          this.serviceBlok.reset();
          this.lastSeqNo = -1;
          this.serNoSetting = 1;
      },

      extractCea708DataFromPacket: function(ccData){
          this.seqNo = R2B7(ccData[0]);
          if (this.lastSeqNo != -1 && this.seqNo != (this.lastSeqNo + 1)%4)
          {
              logger.log("DEBUG", "[extractCea708DataFromPacket] Error:DTVCCCaption Packet lost." +
              " lastSeqNo: " + this.lastSeqNo + " SeqNo: " + this.seqNo);///<we should add packet lost handle
          }
          this.lastSeqNo = this.seqNo;
          this.packetSize = R6B5(ccData[0]);
          if (!this.packetSize)
          {
              this.packetSize = 128;
          }
          else
          {
              this.packetSize = this.packetSize*2 - 1;
          }
          if (this.packetSize > ccData.length - 1)
          {
              this.packetSize = ccData.length - 1;
              logger.log("DEBUG", "[extractCea708DataFromPacket] Error:DTVCCCaption Packet size bigger than nPacketSize");
          }
          var tmpData = ccData.slice(1);
          return this.serviceBlock.extractCea708DataFromService(tmpData, this.packetSize);
      }
    };


    exports.logger = logger;
    exports.Cea708parser = Cea708parser;
    exports.Cea708PacketParser = Cea708PacketParser;
    exports.setRectPos = setRectPos;
    exports.RectPos = RectPos;
}(typeof exports === 'undefined' ? this.cea708parser = {} : exports));
