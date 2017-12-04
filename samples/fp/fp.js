

function stringToArray(string) {
    var buffer = new ArrayBuffer(string.length * 2); // 2 bytes for each char
    var array = new Uint16Array(buffer);
    for (var i = 0, strLen = string.length; i < strLen; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array;
}

function arrayToString(array) {
    var uint16array = new Uint16Array(array.buffer);
    return String.fromCharCode.apply(null, uint16array);
}


/////////////////////////////////////////////////////////////////


var MediaEngine = function (media) {
  this.media_ = media;
  this.addEventListeners();
};

// Begin - private function
MediaEngine.prototype.onMediaCanPlay = function () {
  console.log('--onMediaCanPlay--');
};

MediaEngine.prototype.onMediaEnded = function () {
  console.log('--onMediaEnded--');
};

MediaEngine.prototype.onMediaLoadedMetadata = function () {
  console.log('--onMediaMetadata--, width: ' + this.media_.width + ', height: ' + this.media_.height);
};

MediaEngine.prototype.onMediaPaused = function () {
  console.log('--onMediaPaused--');
};

MediaEngine.prototype.onMediaPlay = function () {
  console.log('--onMediaPlay--');
};

MediaEngine.prototype.onMediaSeeking = function () {
    console.log('--onMediaSeeking--');
};

MediaEngine.prototype.onMediaSeeked = function () {
    console.log('--onMediaSeeked--');
};

MediaEngine.prototype.onMediaTimeUpdated = function (e) {
  //console.log(`main buffered : ${TimeRanges.toString(media.buffered)}` + ', currentTime: ' + media.currentTime);
};

MediaEngine.prototype.onMediaWaiting = function () {
  console.log('--onMediaWaiting--');
};
// End

// public function
MediaEngine.prototype.addEventListeners = function () {
  this.media_.addEventListener('canplay', this.onMediaCanPlay.bind(this));
  this.media_.addEventListener('ended', this.onMediaEnded.bind(this));
  this.media_.addEventListener('loadedmetadata', this.onMediaLoadedMetadata.bind(this));
  this.media_.addEventListener('pause', this.onMediaPaused.bind(this));
  this.media_.addEventListener('play', this.onMediaPlay.bind(this));
  this.media_.addEventListener('seeking', this.onMediaSeeking.bind(this));
  this.media_.addEventListener('seeked', this.onMediaSeeked.bind(this));
  this.media_.addEventListener('timeupdate', this.onMediaTimeUpdated.bind(this));
  this.media_.addEventListener('waiting', this.onMediaWaiting.bind(this));
};

MediaEngine.prototype.removeEventsListeners = function () {
  this.media_.removeEventListener('canplay', this.onMediaCanPlay.bind(this));
  this.media_.removeEventListener('ended', this.onMediaEnded.bind(this));
  this.media_.removeEventListener('loadedmetadata', this.onMediaMetadata.bind(this));
  this.media_.removeEventListener('pause', this.onMediaPaused.bind(this));
  this.media_.removeEventListener('play', this.onMediaPlay.bind(this));
  this.media_.removeEventListener('seeking', this.onMediaSeeking.bind(this));
  this.media_.removeEventListener('seeked', this.onMediaSeeked.bind(this));
  this.media_.removeEventListener('timeupdate', this.onMediaTimeUpdated.bind(this));
  this.media_.removeEventListener('waiting', this.onMediaWaiting.bind(this));
};















/////////////////////////////////////////////////////////////
var ProtectionModel_fp = function (media, config) {
    this.media__ = media;
    this.config_ = config;

    this.media_Engine_ = new MediaEngine(media);
    
    console.log('--new onNeedKey--11');
    this.media__.addEventListener('webkitneedkey', this.onNeedKey.bind(this), false);
};

ProtectionModel_fp.prototype.loadCertificate = function () {
    console.log('loadCertificate');
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (event) {
        console.log('onCertificateLoaded, status: ' + xhr.status);
        if (xhr.status == 200) {
            this.certificate = new Uint8Array(xhr.response);
        }
    }.bind(this);

    xhr.onerror = function () {
        console.log('Failed to retrieve the server certificate.');
    };

    xhr.open('GET', this.config_.certificateUrl, true);
    // xhr.setRequestHeader('Pragma', 'Cache-Control: no-cache');
    // xhr.setRequestHeader('Cache-Control', 'max-age=0');
    xhr.send();
};

ProtectionModel_fp.prototype.extractContentId = function (initData) {
    var contentId = arrayToString(initData);
    // contentId is passed up as a URI, from which the host must be extracted:
    /*var link = document.createmedia('a');
    link.href = contentId;
    return link.hostname;*/
    return contentId.split('skd://')[1];
};

ProtectionModel_fp.prototype.concatInitDataIdAndCertificate = function (initData, id, cert) {
    if (typeof id == 'string') {
        id = stringToArray(id);
    }

    // layout is [initData][4 byte: idLength][idLength byte: id][4 byte:certLength][certLength byte: cert]
    var offset = 0;
    var buffer = new ArrayBuffer(initData.byteLength + 4 + id.byteLength + 4 + cert.byteLength);
    var dataView = new DataView(buffer);

    var initDataArray = new Uint8Array(buffer, offset, initData.byteLength);
    initDataArray.set(initData);
    offset += initData.byteLength;

    dataView.setUint32(offset, id.byteLength, true);
    offset += 4;

    var idArray = new Uint16Array(buffer, offset, id.length);
    idArray.set(id);
    offset += idArray.byteLength;

    dataView.setUint32(offset, cert.byteLength, true);
    offset += 4;

    var certArray = new Uint8Array(buffer, offset, cert.byteLength);
    certArray.set(cert);

    return new Uint8Array(buffer, 0, buffer.byteLength);
};

ProtectionModel_fp.prototype.requestKeySystemAccess = function (initData) {
    if (!this.media__.webkitKeys) {
        this.selectKeySystem();
        this.media__.webkitSetMediaKeys(new WebKitMediaKeys(this.keySystem));

        if (!this.media__.webkitKeys) {
            console.log('Could not create MediaKeys');
        }

        var keySession = this.media__.webkitKeys.createSession('video/mp4', initData);
        if (!keySession) {
            console.log('Could not create key session');
        }

        //keySession.contentId = contentId;
        console.log('begin new addEventListener');
        var self = this;
        keySession.addEventListener('webkitkeymessage', this.onSessionMessage.bind(self), false);
        keySession.addEventListener('webkitkeyadded', this.onkeyadded.bind(self), false);
        keySession.addEventListener('webkitkeyerror', this.onkeyerror.bind(self), false);
        console.log('end new addEventListener');
    }
};

ProtectionModel_fp.prototype.onSessionMessage = function () {
    console.log('onSessionMessage: ', event);
    var session = event.target;
    var message = event.message;
    var xhr2 = new XMLHttpRequest();
    if (this.config_.licenseResponseType) {
        xhr2.responseType = this.config_.licenseResponseType;
    } else {
        xhr2.responseType = 'arraybuffer';
    }
    
    xhr2.session = session;

    xhr2.onload = function (event) {
        console.log('xhr2: ', xhr2);
        var xhr0 = event.target;
        if (xhr0.status === 200) {
            console.log('licenseRequestLoaded, new version');
            var session = xhr0.session;
            var key = new Uint8Array(xhr0.response);

            // isResponseBase64Encode

            session.update(key);
        }
    }.bind(this);
    xhr2.onerror = function () {
        console.log('The license xhr2 failed.');
    };
    //var params = 'spc='+base64EncodeUint8Array(message)+'&assetId='+encodeURIComponent(session.contentId);
    var params = message;
    xhr2.open('POST', this.config_.laUrl, true);
    if (this.config_.headers) {
        var key;
        for (key in this.config_.headers) {
            xhr2.setRequestHeader(key, this.config_.headers[key]);
        }
    } else {
        xhr2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    console.log('xhr2, before: ', xhr2);
    xhr2.send(params);
};

ProtectionModel_fp.prototype.onkeyadded = function () { };
ProtectionModel_fp.prototype.onkeyerror = function () { };

ProtectionModel_fp.prototype.selectKeySystem = function () {
    if (WebKitMediaKeys.isTypeSupported('com.apple.fps.1_0', 'video/mp4')) {
        this.keySystem = 'com.apple.fps.1_0';
    }
    else {
        reason = 'Key System not supported';
        console.log(reason);
        //throw "Key System not supported";
    }
};

ProtectionModel_fp.prototype.onNeedKey = function (event) {
    console.log('onNeedKey: ', event);
    var video = event.target;
    var initData = event.initData;
    var contentId = this.extractContentId(initData);
    initData = this.concatInitDataIdAndCertificate(initData, contentId, this.certificate);

    this.requestKeySystemAccess(initData);
};
