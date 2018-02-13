

var CommonUtils = {};

/**
 * return IE,IE6,IE7,IE8,IE9,Chrome,Firefox,Opera,WebKit,Safari,Others
 */
CommonUtils.getBrowserInfo = function () {
    var sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    var s;
    if (s = ua.match(/edge\/([\d.]+)/)) {
        sys.edge = s[1];
    } else if (s = ua.match(/rv:([\d.]+)\) like gecko/)) {
        sys.ie = s[1];
    } else if (s = ua.match(/msie ([\d.]+)/)) {
        sys.ie = s[1];
    } else if (s = ua.match(/firefox\/([\d.]+)/)) {
        sys.firefox = s[1];
    } else if (s = ua.match(/chrome\/([\d.]+)/)) {
        sys.chrome = s[1];
    } else if (s = ua.match(/opera.([\d.]+)/)) {
        sys.opera = s[1];
    } else if (s = ua.match(/version\/([\d.]+).*safari/)) {
        sys.safari = s[1];
    }

    if (sys.edge) return { browser : "Edge", version : sys.edge };
    if (sys.ie) return { browser : "IE", version : sys.ie };
    if (sys.firefox) return { browser : "Firefox", version : sys.firefox };
    if (sys.chrome) return { browser : "Chrome", version : sys.chrome };
    if (sys.opera) return { browser : "Opera", version : sys.opera };
    if (sys.safari) return { browser : "Safari", version : sys.safari };

    return { browser : "", version : "0" };
};

CommonUtils.isSafari = function () {
    if (CommonUtils.getBrowserInfo().browser === 'Safari') {
        return true;
    } else {
        return false;
    }
};

CommonUtils.isFirefox = function () {
    if (CommonUtils.getBrowserInfo().browser === 'Firefox') {
        return true;
    } else {
        return false;
    }
};

CommonUtils.isChrome = function () {
    if (CommonUtils.getBrowserInfo().browser === 'Chrome') {
        return true;
    } else {
        return false;
    }
};

CommonUtils.isChromecast = function () {
    if (window.cast && window.cast.__platform__) {
        return true;
    } else {
        return false;
    }
};

CommonUtils.isEdge = function () {
    var userAgent = navigator.userAgent;
    var isEdge = userAgent.indexOf("Edge") > -1;
    return isEdge;
};

CommonUtils.isIE = function () {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
    } else {
        return false;
    }
};

CommonUtils.getOSVersion = function () {
    var os,
    osVersion;

    // system
    var nAgt = navigator.userAgent;
    var nVer = navigator.appVersion;

    os = 'unknown';
    osVersion = 'unknown';
    var clientStrings = [
    {s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/},
    {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
    {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
    {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
    {s: 'Windows Vista', r: /Windows NT 6.0/},
    {s: 'Windows Server 2003', r: /Windows NT 5.2/},
    {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
    {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
    {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
    {s: 'Windows 98', r: /(Windows 98|Win98)/},
    {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
    {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
    {s: 'Windows CE', r: /Windows CE/},
    {s: 'Windows 3.11', r: /Win16/},
    {s: 'Android', r: /Android/},
    {s: 'Open BSD', r: /OpenBSD/},
    {s: 'Sun OS', r: /SunOS/},
    {s: 'Linux', r: /(Linux|X11)/},
    {s: 'iOS', r: /(iPhone|iPad|iPod)/},
    {s: 'Mac OS X', r: /Mac OS X/},
    {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
    {s: 'QNX', r: /QNX/},
    {s: 'UNIX', r: /UNIX/},
    {s: 'BeOS', r: /BeOS/},
    {s: 'OS/2', r: /OS\/2/},
    {s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
    ];
    for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
        }
    }

    if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
    }

    switch (os) {
    case 'Mac OS X':
        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
        break;

    case 'Android':
        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
        break;

    case 'iOS':
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
        break;
    }

    console.log('nAgt: ' + nAgt);
    console.log('nVer: ' + nVer);
    console.log('os: ' + os);
    console.log('osVersion: ' + osVersion);

    var pattern = 'Linux';
    var ua = 'Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.17 Safari/537.36 CrKey/1.28.100555';
    var arrOSV = RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua);
    var osv = arrOSV[0];
    var patternLen = pattern.length;
    console.log('pattern length: ' + patternLen);
    osv.indexOf(pattern);

    var out = osv.slice(patternLen + 1);
    console.log('out: ' + out);

    let a = 2;
    let b = a;
};

CommonUtils.isMobilePlatform = function () {
    return (navigator.userAgent.match(/(iPod|iPhone|iPad)/) ||
        navigator.userAgent.toLowerCase().indexOf('android') > -1);
};

/////////////////////////////////////////////////////////////
CommonUtils.init = function () {
    // Add startsWith prototype method to String object
    if (!String.prototype.startsWith) {
        // Add prototype methods for Number object
        if (!Number.isInteger) {
            Number.isInteger = function (num) {
                return (num ^ 0) === num;
            };
        }

        // Add prototype methods for String object
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function (searchString, position) {
                position = position || 0;
                return this.indexOf(searchString, position) === position;
            };
        }
    }
};

//////////////////////////////////////////////
CommonUtils.getFormatTime = function () {
    let message = '';
    let d = null;

    d = new Date();
    message += '[' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
    ('0' + d.getDate()).slice(-2) + ' ' +
    ('0' + d.getHours()).slice(-2) + ':' +
    ('0' + d.getMinutes()).slice(-2) + ':' +
    ('0' + d.getSeconds()).slice(-2) + '.' +
    ('0' + d.getMilliseconds()).slice(-3) + ']';

    return message;
};

CommonUtils.timeToString = function (value) {
    function formatTimeUnit(time) {
        return time < 10 ? '0' + time.toString() : time.toString();
    }

    value = Math.max(value, 0);
    var h = Math.floor(value / 3600);
    var m = Math.floor((value % 3600) / 60);
    var s = Math.floor((value % 3600) % 60);
    return (h === 0 ? '' : formatTimeUnit(h) + ':') + formatTimeUnit(m) + ':' + formatTimeUnit(s);
};

//
CommonUtils.test1 = function (aa) {
    CommonUtils.init();

    var s1 = "aaabbcder";
    var ret = s1.startsWith('aaa', 0);
    var ret2 = s1.startsWith('abc', 0);
    console.log('startsWith ret: ' + ret);
    console.log('startsWith ret2: ' + ret2);

    var b1 = Number.isInteger(123);
    var b2 = Number.isInteger(123.123);
    var b3 = Number.isInteger(undefined);
    console.log('b1: ' + b1);
    console.log('b2: ' + b2);
    console.log('b3: ' + b3);
};

export default CommonUtils;
