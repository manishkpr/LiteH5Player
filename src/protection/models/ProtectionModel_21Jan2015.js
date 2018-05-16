import FactoryMaker from '../../core/FactoryMaker';
import StringUtils from '../../utils/string_utils';
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
    k: StringUtils.u8arrToB64(key)
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
function ProtectionModel_21Jan2015() {
  let media_ = null;

  let initDataType_ = null;
  let initData_ = null;
  let keySystem_ = null;
  let session_ = null;
  let streamInfo_ = null;

  let promiseAction_ = null;

  function attachMedia(media) {
    media_ = media;
    media_.addEventListener('encrypted', onNeedKey, false);
  }

  function detachMedia() {
    if (media_) {
      media_.removeEventListener('encrypted', onNeedKey, false);
      media_ = null;
    }
  }

  function setKeySystem(keySystem) {
    keySystem_ = keySystem;
  }

  // ev.initData: it is pssh data hidden in mp4 pssh box
  function onNeedKey(ev) {
    console.log('onNeedKey, initDataType: ' + ev.initDataType);
    console.log('onNeedKey, initData length: ' + ev.initData.byteLength);
    console.log('onNeedKey, initData', StringUtils.ab2str_v1(ev.initData));

    // 
    if (streamInfo_.drm.initDataType && streamInfo_.drm.initData) {
      initDataType_ = streamInfo_.drm.initDataType;
      initData_ = streamInfo_.drm.initData;
    } else {
      initDataType_ = ev.initDataType;
      initData_ = ev.initData;
    }

    // BD
    var pssh = CommonEncryption.parsePSSHList(ev.initData);
    let a1 = StringUtils.ab2str_v1(pssh['edef8ba9-79d6-4ace-a3c8-27dcd51d21ed']);
    let a2 = StringUtils.ab2str_v1(pssh['9a04f079-9840-4286-ab92-e65be0885f95']);
    console.log('DRM, a1: ' + a1);
    console.log('DRM, a2: ' + a2);
    // ED

    if (!promiseAction_) {
      promiseAction_ = requestKeySystemAccess();
    }
  }

  function onSessionMessage(ev) {
    console.log('message event: ', ev);
    // If you had a license server, you would make an asynchronous XMLHttpRequest
    // with event.message as the body.  The response from the server, as a
    // Uint8Array, would then be passed to session.update().
    // Instead, we will generate the license synchronously on the client, using
    // the hard-coded KEY at the top.

    console.log('session message, length: ' + ev.message.byteLength);
    console.log('session message, data:', StringUtils.ab2str_v1(ev.message));

    // Determine license server URL
    let laUrl = streamInfo_.drm.laUrl;

    if (!laUrl) {
      console.log('DRM: no license url');

      if (streamInfo_.drm.type === 'org.w3.clearkey') {
        let license = generateLicense(event.message, streamInfo_.drm.key);
        console.log('license: ', license);
        let session = ev.target;
        session.update(license);
      }

      return;
    }
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
    console.log('DRM: message: ' + StringUtils.ab2str_v1(ev.message));
    xhr.onload = function(event) {
      if (this.status == 200) {
        let data = this.response;

        console.log('DRM: request response length: ' + data.byteLength);
        session_.update(new Uint8Array(this.response));
      }
    };
    xhr.onabort = function() {
      console.log('license request abort');
    };
    xhr.onerror = function() {
      console.log('license request error');
    };

    // BD
    var updateHeaders = function(headers) {
      var key;
      if (headers) {
        for (key in headers) {
          console.log('DRM: key: ' + key + ', value: ' + headers[key]);
          xhr.setRequestHeader(key, headers[key]);
        }
      }
    };

    updateHeaders(streamInfo_.drm.headers);
    // ED

    //xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    //xhr.setRequestHeader('SOAPAction', '\"http://schemas.microsoft.com/DRM/2007/03/protocols/AcquireLicense\"');
    let body = keySystem_.getLicenseRequestFromMessage(ev.message);
    console.log('body: ', body);
    xhr.send(body);
  }

  function onSessionChange(ev) {
    let a = 2;
    let b = a;
  }

  function setDrmInfo(streamInfo) {
    console.log('--setDrmInfo in 21Jan2015--');
    streamInfo_ = streamInfo;
  }

  function requestKeySystemAccess() {
    let audioCapabilities = [];
    let videoCapabilities = [];
    let robustnessLevel = ''; // SW_SECURE_CRYPTO
    if (streamInfo_.drm.audioCodec) {
      audioCapabilities.push(new MediaCapability(streamInfo_.drm.audioCodec, robustnessLevel));
    }
    if (streamInfo_.drm.videoCodec) {
      videoCapabilities.push(new MediaCapability(streamInfo_.drm.videoCodec, robustnessLevel));
    }

    let ksConfig = new KeySystemConfiguration(
      audioCapabilities, videoCapabilities, 'optional', 'optional', ['temporary']);

    let configs_ = [];
    configs_.push(ksConfig);

    // BD
    //dumpKSConfig(keySystem_.systemString, ksConfig);
    // ED

    return navigator.requestMediaKeySystemAccess(keySystem_.systemString, configs_)
      .then(function(keySystemAccess) {
        console.log('H5Player, requestMediaKeySystemAccess is ok');
        return keySystemAccess.createMediaKeys();
      })
      .then(function(mediaKeys) {
        console.log('H5Player, createMediaKeys is ok, mediaKeys: ' + mediaKeys);
        let ret = media_.setMediaKeys(mediaKeys);
        return ret;
      })
      .then(function() {
        // create session
        let mediaKeys = media_.mediaKeys;
        session_ = mediaKeys.createSession('temporary');
        session_.addEventListener('message', onSessionMessage, false);
        session_.addEventListener('keystatuseschange', onSessionChange, false);
        session_.generateRequest(initDataType_, initData_).then(function() {
          console.log('generateRequest is ok');
        }).catch(function(error) {
          console.error('generateRequest failed at: ', error);
        });
      }).catch(function(error) {
        console.error('Failed to set up MediaKeys', error);
      });
  }

  let instance_ = {
    attachMedia: attachMedia,
    detachMedia: detachMedia,
    setKeySystem: setKeySystem,
    setDrmInfo: setDrmInfo
  };
  return instance_;
}

export default ProtectionModel_21Jan2015;