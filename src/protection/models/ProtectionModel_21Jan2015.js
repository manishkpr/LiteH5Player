import FactoryMaker from '../../core/FactoryMaker';
import TypeConverter from '../../utils/TypeConverter';
import CommonEncryption from '../vo/CommonEncryption';
import MediaCapability from '../vo/MediaCapability';
import KeySystemConfiguration from '../vo/KeySystemConfiguration';

import KeySystemWidevine from '../drm/KeySystemWidevine';


// This takes the place of a license server.
// kids is an array of base64-encoded key IDs
// keys is an array of base64-encoded keys
function generateLicense(message, key) {
    // Parse the clearkey license request.
    var request = JSON.parse(new TextDecoder().decode(message));
    // We only know one key, so there should only be one key ID.
    // A real license server could easily serve multiple keys.
    console.assert(request.kids.length === 1);

    var keyObj = {
        kty: 'oct',
        //alg: 'A128KW',
        kid: request.kids[0],
        k: TypeConverter.u8arrToB64(key)
    };
    return new TextEncoder().encode(JSON.stringify({
        keys: [keyObj]
    }));
}


function dumpKSConfig(ksString, ksConfig) {
    console.log('H5Player, requestMediaKeySystemAccess, keySystem_ = ' + ksString);
    console.log('H5Player, requestMediaKeySystemAccess, config, initDataTypes: ' + ksConfig.initDataTypes[0]);
    console.log('H5Player, requestMediaKeySystemAccess, config, distinctiveIdentifier: ' + ksConfig.distinctiveIdentifier);
    console.log('H5Player, requestMediaKeySystemAccess, config, persistentState: ' + ksConfig.persistentState);
    console.log('H5Player, requestMediaKeySystemAccess, config, sessionTypes: ' + ksConfig.sessionTypes[0]);
    console.log('H5Player, requestMediaKeySystemAccess, config, videoCapabilities[0].contentType: ' + ksConfig.videoCapabilities[0].contentType);
    console.log('H5Player, requestMediaKeySystemAccess, config, videoCapabilities[0].robustness: ' + ksConfig.videoCapabilities[0].robustness);

// liteH5Player.debug.js:3558 H5Player, requestMediaKeySystemAccess, keySystem_ = com.chromecast.playready
// liteH5Player.debug.js:3559 H5Player, requestMediaKeySystemAccess, config, initDataTypes: cenc
// liteH5Player.debug.js:3560 H5Player, requestMediaKeySystemAccess, config, distinctiveIdentifier: optional
// liteH5Player.debug.js:3561 H5Player, requestMediaKeySystemAccess, config, persistentState: optional
// liteH5Player.debug.js:3562 H5Player, requestMediaKeySystemAccess, config, sessionTypes: temporary
// liteH5Player.debug.js:3563 H5Player, requestMediaKeySystemAccess, config, videoCapabilities[0].contentType: video/mp4; codecs="avc1.42C014"
// liteH5Player.debug.js:3564 H5Player, requestMediaKeySystemAccess, config, videoCapabilities[0].robustness: 

// shaka-player.compiled.debug.js:100 DRM: queryMediaKeys_, keySystem: com.chromecast.playready
// shaka-player.compiled.debug.js:100 DRM: queryMediaKeys_, videoCapabilities = [object Object]
// shaka-player.compiled.debug.js:100 DRM: queryMediaKeys_, distinctiveIdentifier = optional
// shaka-player.compiled.debug.js:100 DRM: queryMediaKeys_, persistentState = optional
// shaka-player.compiled.debug.js:100 DRM: queryMediaKeys_, sessionTypes = temporary
// shaka-player.compiled.debug.js:100 DRM: queryMediaKeys_, label = com.chromecast.playready
// shaka-player.compiled.debug.js:100 DRM: queryMediaKeys_, drmInfos = [object Object]
// shaka-player.compiled.debug.js:100 DRM: queryMediaKeys_, videoCapabilities[0].contentType video/mp4; codecs="avc1.42C014"
// shaka-player.compiled.debug.js:100 DRM: queryMediaKeys_, videoCapabilities[0].robustness 

        // for (var i in ksConfig) {
        //     console.log('H5Player, ' + i + ' = ' + ksConfig[i]);
        // }
}

/**
 * Most recent EME implementation
 *
 * Implemented by Google Chrome v36+ (Windows, OSX, Linux), Edge
 */

var ProtectionModel_21Jan2015 = function () {
    this.media_ = null;

    this.initDataType_ = null;
    this.initData_ = null;
    this.keySystem_ = null;

    this.streamInfo_ = null;

    this.promiseAction_ = null;
};

ProtectionModel_21Jan2015.prototype.attachMedia = function (media) {
    this.media_ = media;
    this.media_.addEventListener('encrypted', this.onNeedKey.bind(this), false);
};

ProtectionModel_21Jan2015.prototype.detachMedia = function () {
    if (this.media_) {
        this.media_.removeEventListener('encrypted', this.onNeedKey.bind(this), false);
        this.media_ = null;
    }
};

ProtectionModel_21Jan2015.prototype.setKeySystem = function (keySystem) {
    this.keySystem_ = keySystem;
};

// ev.initData: it is pssh data hidden in mp4 pssh box
ProtectionModel_21Jan2015.prototype.onNeedKey = function (ev) {
    console.log('onNeedKey, initDataType: ' +  ev.initDataType);
    console.log('onNeedKey, initData length: ' +  ev.initData.byteLength);
    console.log('onNeedKey, initData', TypeConverter.ab2str_v1(ev.initData));

    // 
    if (this.streamInfo_.drm.initDataType && this.streamInfo_.drm.initData) {
        this.initDataType_ = this.streamInfo_.drm.initDataType;
        this.initData_ = this.streamInfo_.drm.initData;
    } else {
        this.initDataType_ = ev.initDataType;
        this.initData_ = ev.initData;
    }

    // BD
    // var pssh = CommonEncryption.parsePSSHList(ev.initData);
    // let a1 = TypeConverter.ab2str_v1(pssh['edef8ba9-79d6-4ace-a3c8-27dcd51d21ed']);
    // let a2 = TypeConverter.ab2str_v1(pssh['9a04f079-9840-4286-ab92-e65be0885f95']);
    // console.log('DRM, a1: ' + a1);
    // console.log('DRM, a2: ' + a2);
    // ED

    this.requestKeySystemAccess();
};

ProtectionModel_21Jan2015.prototype.onSessionMessage = function (ev) {
    console.log('message event: ', ev);
    // If you had a license server, you would make an asynchronous XMLHttpRequest
    // with event.message as the body.  The response from the server, as a
    // Uint8Array, would then be passed to session.update().
    // Instead, we will generate the license synchronously on the client, using
    // the hard-coded KEY at the top.

    console.log('session message, length: ' + ev.message.byteLength);
    console.log('session message, data:', TypeConverter.ab2str_v1(ev.message));

    // Determine license server URL
    let laUrl = this.streamInfo_.drm.laUrl;

    if (!laUrl) {
        console.log('DRM: no license url');

        if (this.streamInfo_.drm.type === 'org.w3.clearkey') {
            let license = generateLicense(event.message, this.streamInfo_.drm.key);
            console.log('license: ', license);
            let session = ev.target;
            session.update(license);
        }

        return;
    }
    var self = this;
    //
    // All remaining key system scenarios require a request to a remote license server
    let xhr = new XMLHttpRequest();

    xhr.open('POST', laUrl, true);
    xhr.responseType = 'arraybuffer';
    xhr.timeout = 0;
    xhr.withCredentials = false;

    console.log('DRM: open method: POST');
    console.log('DRM: timeout: ' + xhr.timeout);
    console.log('DRM: withCredentials: ' + xhr.withCredentials);
    console.log('DRM: message: ' + TypeConverter.ab2str_v1(ev.message));
    xhr.onload = function(event) {
        if (this.status == 200) {
            let data = this.response;

            console.log('DRM: request response length: ' + data.byteLength);
            self.session_.update(new Uint8Array(this.response));
        }
    };
    xhr.onabort = function() {
        console.log('license request abort');
    };
    xhr.onerror = function() {
        console.log('license request error');
    };

    // BD
    var updateHeaders = function (headers) {
        var key;
        if (headers) {
            for (key in headers) {
                console.log('DRM: key: ' + key + ', value: ' + headers[key]);
                xhr.setRequestHeader(key, headers[key]);
            }
        }
    };

    updateHeaders(this.streamInfo_.drm.headers);
    // ED

    //xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    //xhr.setRequestHeader('SOAPAction', '\"http://schemas.microsoft.com/DRM/2007/03/protocols/AcquireLicense\"');
    let body = this.keySystem_.getLicenseRequestFromMessage(ev.message);
    console.log('body: ', body);
    xhr.send(body);
};

ProtectionModel_21Jan2015.prototype.onSessionChange = function (ev) {
    let a=2;
    let b=a;
};

ProtectionModel_21Jan2015.prototype.setDrmInfo = function (streamInfo) {
    console.log('--setDrmInfo in 21Jan2015--');
    this.streamInfo_ = streamInfo;
};

ProtectionModel_21Jan2015.prototype.requestKeySystemAccess = function () {
    let audioCapabilities = [];
    let videoCapabilities = [];
    let robustnessLevel = ''; // SW_SECURE_CRYPTO
    if (this.streamInfo_.audioCodec) {
        audioCapabilities.push(new MediaCapability(this.streamInfo_.audioCodec, robustnessLevel));
    }
    if (this.streamInfo_.videoCodec) {
        videoCapabilities.push(new MediaCapability(this.streamInfo_.videoCodec, robustnessLevel));
    }

    let ksConfig = new KeySystemConfiguration(
        audioCapabilities, videoCapabilities, 'optional', 'optional', ['temporary']);

    let configs_ = [];
    configs_.push(ksConfig);

    // BD
    //dumpKSConfig(this.keySystem_.systemString, ksConfig);
    // ED

    if (this.promiseAction_) { return; }

    var self = this;
    this.promiseAction_ = navigator.requestMediaKeySystemAccess(self.keySystem_.systemString, configs_
    ).then(function(keySystemAccess) {
            console.log('H5Player, requestMediaKeySystemAccess is ok');
            return keySystemAccess.createMediaKeys();
        }
    ).then(function(mediaKeys) {
        console.log('H5Player, createMediaKeys is ok, mediaKeys: ' + mediaKeys);
        let ret = self.media_.setMediaKeys(mediaKeys);
        return ret;
    }).then(function() {
        // create session
        let mediaKeys = self.media_.mediaKeys;
        self.session_ = mediaKeys.createSession('temporary');
        self.session_.addEventListener('message', self.onSessionMessage.bind(self), false);
        self.session_.addEventListener('keystatuseschange', self.onSessionChange.bind(self), false);
        self.session_.generateRequest(self.initDataType_, self.initData_).then(function() {
                console.log('generateRequest is ok');
            }).catch(function(error) {
                console.error('generateRequest failed at: ', error);
        });
    }).catch(function(error) {
        console.error('Failed to set up MediaKeys', error);
    });
};

export default ProtectionModel_21Jan2015;

