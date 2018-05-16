import FactoryMaker from '../../core/FactoryMaker';
import StringUtils from '../../utils/string_utils';

import MediaCapability from '../vo/MediaCapability';
import KeySystemConfiguration from '../vo/KeySystemConfiguration';
import KSUtils from '../vo/KSUtils';
import CommonEncryption from '../vo/CommonEncryption';
import BASE64 from '../../externals/base64';

import KeySystemPlayReady from '../drm/KeySystemPlayReady';

/**
 * Most recent EME implementation
 *
 * Implemented by IE11
 */
function ProtectionModel_3Feb2014(media) {
  let context_ = this.context;
  let media_ = null;
  let streamInfo_ = null;
  let session_ = null;
  let keySystem_ = null;
  let mediaKeys_ = null;

  function attachMedia(media) {
    media_ = media;

    media_.addEventListener('msneedkey', onNeedKey);
  }

  function detachMedia() {
    if (media_) {
      media_.addEventListener('msneedkey', onNeedKey);
    }
  }

  function setKeySystem(keySystem) {
    keySystem_ = keySystem;
  }

  function setDrmInfo(streamInfo) {
    streamInfo_ = streamInfo;
  }

  function onNeedKey(ev) {
    let initDataType = 'cenc';
    // Some browsers return initData as Uint8Array (IE), some as ArrayBuffer (Chrome).
    // Convert to ArrayBuffer
    var abInitData = ev.initData;
    if (ArrayBuffer.isView(abInitData)) {
      abInitData = abInitData.buffer;
    }

    let pssh = CommonEncryption.parsePSSHList(abInitData);
    let uuid = KSUtils.GetKSUUID(streamInfo_.drm.type);

    let actualInitData = pssh[uuid];

    // select key system
    if (media_.readyState >= 1) {
      mediaKeys_ = new window.MSMediaKeys(keySystem_.systemString);
      media_.msSetMediaKeys(mediaKeys_);

      session_ = mediaKeys_.createSession(streamInfo.drm.videoCodec, new Uint8Array(abInitData));
      session_.addEventListener('mskeyerror', onSessionError);
      session_.addEventListener('mskeymessage', onSessionMessage);
      session_.addEventListener('mskeyadded', onSessionAdded);
      session_.addEventListener('mskeyclose', onSessionClose);
    }
  }

  function onSessionError(ev) {}

  function onSessionMessage(ev) {
    console.log("DRM: Key Message");

    let abMessage = ev.message;
    if (ArrayBuffer.isView(abMessage)) {
      abMessage = abMessage.buffer;
    }

    // license request here
    var xhr = new XMLHttpRequest();
    xhr.open('POST', streamInfo_.drm.laUrl, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      if (this.status === 200) {
        session_.update(new Uint8Array(this.response));
      }
    }
    xhr.onabort = function() {
      console.log('DRM: xhr abort');
    }
    xhr.onerror = function() {
      console.log('DRM: xhr error');
    }

    // 
    let headers = keySystem_.getRequestHeadersFromMessage(abMessage);
    for (let key in headers) {
      if ('authorization' === key.toLowerCase()) {
        xhr.withCredentials = true;
      }
      xhr.setRequestHeader(key, headers[key]);
    }

    xhr.send(keySystem_.getLicenseRequestFromMessage(abMessage));
  }

  function onSessionAdded(ev) {
    console.log('DRM: Key added');
  }

  function onSessionClose(ev) {

  }

  function requestKeySystemAccess() {
    let ksString = KSUtils.GetKSString(streamInfo_.drm.type);

    let audioCapabilities = [];
    let videoCapabilities = [];
    let robustnessLevel = '';
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

    // check is supported?
    for (let configIdx = 0; configIdx < configs_.length; configIdx++) {
      let videos = configs_[configIdx].videoCapabilities;

      // Look for supported video container/codecs
      if (videos && videos.length !== 0) {
        for (let videoIdx = 0; videoIdx < videos.length; videoIdx++) {
          if (window['MSMediaKeys'].isTypeSupported(ksString, videos[videoIdx].contentType)) {

          }
        }
      }
    }

    // 
    selectKeySystem(ksString);
  }

  function selectKeySystem(ksString) {
    let mediaKeys = new window['MSMediaKeys'](ksString);

    if (media_.readyState >= 1) {
      media_.msSetMediaKeys(mediaKeys);
    }
  }

  function createKeySession(initData) {}

  let instance_ = {
    attachMedia: attachMedia,
    detachMedia: detachMedia,
    setKeySystem: setKeySystem,
    setDrmInfo: setDrmInfo
  };
  return instance_;
}

export default ProtectionModel_3Feb2014;

