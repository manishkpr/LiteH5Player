import FactoryMaker from '../core/FactoryMaker';
import EventBus from '../core/EventBus';
import Events from '../core/events';
import Debug from '../core/Debug';

import VTTParser from '../utils/VTTParser';
import StringUtils from '../utils/string_utils';
import XHRLoader from '../utils/xhr_loader';

function ThumbnailController() {
  let context_ = this.context;
  let eventBus_ = EventBus(context_).getInstance();
  let debug_ = Debug(context_).getInstance();

  let xhrLoader_ = new XHRLoader();
  let vttParser_ = VTTParser(context_).getInstance();

  let track_;
  let thumbnailsData_;

  function setup() {
    eventBus_.on(Events.THUMBNAIL_LOADING, onThumbnailLoading);
  }

  function onThumbnailLoading(data) {
    track_ = data.track;

    let request = {
      url: track_.file
    };
    let callbacks = {
      onSuccess: onRequestThumbnailSuccess
    };
    xhrLoader_.load(request, null, callbacks);
  }

  function onRequestThumbnailSuccess(buffer) {
    function parseVttText(text, baseUrl) {
      let thumbnailInfo = {};
      let subText = null;
      let index = text.indexOf('#');
      if (index > 0) {
        thumbnailInfo.url = text.slice(0, index);
      } else {
        thumbnailInfo.url = text;
      }
      if (thumbnailInfo.url.indexOf('://') < 0) {
        if (baseUrl) {
          if (baseUrl[baseUrl.length - 1] !== '/') {
            thumbnailInfo.url = baseUrl + '/' + thumbnailInfo.url;
          } else {
            thumbnailInfo.url = baseUrl + thumbnailInfo.url;
          }
        }
      }
      index = text.indexOf('=');
      if (index > 0) {
        subText = (text.slice(index + 1)).split(',');
        thumbnailInfo.x = subText[0] ? parseInt(subText[0]) : null;
        thumbnailInfo.y = subText[1] ? parseInt(subText[1]) : null;
        thumbnailInfo.w = subText[2] ? parseInt(subText[2]) : null;
        thumbnailInfo.h = subText[3] ? parseInt(subText[3]) : null;
      }
      return thumbnailInfo;
    }

    let data = StringUtils.ab2str_v1(buffer);
    thumbnailsData_ = vttParser_.parse(data);

    let lastSlash = track_.file.lastIndexOf('/');
    let baseUrl = track_.file.substring(0, lastSlash);
    for (let i = 0; i < thumbnailsData_.length; i++) {
      thumbnailsData_[i].data = parseVttText(thumbnailsData_[i].data, baseUrl);
    }
  }

  function getThumbnail(time) {
    if (!thumbnailsData_) {
      return null;
    }

    for (let i in thumbnailsData_) {
      let info = thumbnailsData_[i];
      if (info.start <= time && time <= info.end) {
        return info;
      }
    }

    return null;
  }

  let instance_ = {
    getThumbnail: getThumbnail
  };
  setup();
  return instance_;
}

ThumbnailController.__h5player_factory_name = 'ThumbnailController';
export default FactoryMaker.getSingletonFactory(ThumbnailController);