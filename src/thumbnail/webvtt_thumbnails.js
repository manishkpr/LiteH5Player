
import FactoryMaker from '../core/FactoryMaker';
import XHRLoader from '../utils/xhr_loader';
import VTTParser from '../utils/VTTParser';
import StringUtils from '../utils/string_utils';

function WebvttThumbnails() {
    let context_ = this.context;
    let xhrLoader_ = XHRLoader(context_).getInstance();
    let vttParser_ = VTTParser(context_).getInstance();

    let vttUrl_;
    let thumbnails_;

    function init(url) {
        vttUrl_ = url;
        let request = {
            url: vttUrl_,
            cbSuccess: onRequestVttSuccess
        };
        xhrLoader_.load(request);
    }

    function onRequestVttSuccess(buffer) {
        function getThumbnailInfo(text, baseUrl) {
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
        thumbnails_ = vttParser_.parse(data);

        let lastSlash = vttUrl_.lastIndexOf('/');
        let baseUrl = vttUrl_.substring(0, lastSlash);
        for (let i = 0; i < thumbnails_.length; i ++) {
            thumbnails_[i].data = getThumbnailInfo(thumbnails_[i].data, baseUrl);
        }
    }

    function getThumbnail(time) {
        if (!thumbnails_) {
            return null;
        }

        for (let i in thumbnails_) {
            let info = thumbnails_[i];
            if (info.start <= time && time <= info.end) {
                return info;
            }
        }

        return null;
    }

    let instance_ = {
        init: init,
        getThumbnail: getThumbnail
    };

    return instance_;
}

WebvttThumbnails.__h5player_factory_name = 'WebvttThumbnails';
export default FactoryMaker.getSingletonFactory(WebvttThumbnails);



