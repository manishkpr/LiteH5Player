import FactoryMaker from '../core/FactoryMaker';
import XHRLoader from '../utils/xhr_loader';

function DashParser() {
    let instance,
    activeStream_;

    // flag
    let videoHeaderAdded_ = false;
    let videoIndex_ = 0;

    let audioHeaderAdded_ = false;
    let audioIndex_ = 0;

    function audio_only_case01() {
        let aRep = null;

        // construct dash audio
        let aContents = [];
        for (let i = 1; i <= 15; i++) {
            let content = 'http://10.2.68.64/2/mydash/features/av_nonmuxed/A48/' + i.toString() + '.m4s';
            aContents.push(content);
        }

        aRep = {
            type: 'audio',
            codecs: 'audio/mp4; codecs="mp4a.40.2"',
            initialization: 'http://10.2.68.64/2/mydash/features/av_nonmuxed/A48/init.mp4',
            media: aContents
        };

        activeStream_ = {
            aRep: aRep,
            vRep: null
        };

        return activeStream_;
    }

    function video_only_case01() {
        let vRep = null;
        let vContents = [];
        for (let i = 1; i <= 15; i++) {
            let content = 'http://10.2.68.64/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/' + i.toString() + '.m4s';
            vContents.push(content);
        }
        vRep = {
            type: 'video',
            codecs: 'video/mp4; codecs="avc1.64001e"',
            initialization: 'http://10.2.68.64/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/init.mp4',
            media: vContents
        };

        activeStream_ = {
            aRep: null,
            vRep: vRep
        };

        return activeStream_;
    }

    function case01() {
        let aRep = null;
        let vRep = null;

        // construct dash audio
        let aContents = [];
        for (let i = 1; i <= 15; i++) {
            let content = 'http://10.2.68.64/2/mydash/features/av_nonmuxed/A48/' + i.toString() + '.m4s';
            aContents.push(content);
        }

        aRep = {
            type: 'audio',
            codecs: 'audio/mp4; codecs="mp4a.40.2"',
            initialization: 'http://10.2.68.64/2/mydash/features/av_nonmuxed/A48/init.mp4',
            media: aContents
        };

        // construct dash video
        let vContents = [];
        for (let i = 1; i <= 15; i++) {
            let content = 'http://10.2.68.64/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/' + i.toString() + '.m4s';
            vContents.push(content);
        }
        vRep = {
            type: 'video',
            codecs: 'video/mp4; codecs="avc1.64001e"',
            initialization: 'http://10.2.68.64/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/init.mp4',
            media: vContents
        };

        activeStream_ = {
            aRep: aRep,
            vRep: vRep
        };

        return activeStream_;
    }

    function case02() {
        // the video contains audio
        let aRep = null;
        let vRep = null;
        let vContents = [];
        for (let i = 1; i <= 6; i++) {
            let content = 'http://10.2.68.64/2/pd/fmp4/111/segment_file' + i.toString() + '.m4s';
            vContents.push(content);
        }
        vRep = {
            type: 'video',
            codecs: 'video/mp4; codecs="mp4a.40.2, avc1.64001e"',
            initialization: 'http://10.2.68.64/2/pd/fmp4/111/segment_fileinit.mp4',
            media: vContents
        };

        activeStream_ = {
            vRep: vRep,
            aRep: null,
        };

        return activeStream_;
    }

    function case03() {
        let aRep = null;
        let vRep = null;

        // construct dash audio
        let aContents = [];
        for (let i = 0; i <= 50; i++) {
            let content = 'http://10.2.68.64/2/dash_example/test2_main_index/Audio1/' + i.toString() + '.m4s';
            aContents.push(content);
        }

        aRep = {
            type: 'audio',
            codecs: 'audio/mp4; codecs="mp4a.40.29"',
            initialization: 'http://10.2.68.64/2/dash_example/test2_main_index/Audio1/Header.m4s',
            media: aContents
        };

        // construct dash video
        let vContents = [];
        for (let i = 0; i <= 50; i++) {
            let content = 'http://10.2.68.64/2/dash_example/test2_main_index/Video1/' + i.toString() + '.m4s';
            vContents.push(content);
        }
        vRep = {
            type: 'video',
            codecs: 'video/mp4; codecs="avc1.4D4029"',
            initialization: 'http://10.2.68.64/2/dash_example/test2_main_index/Video1/Header.m4s',
            media: vContents
        };

        activeStream_ = {
            aRep: aRep,
            vRep: vRep
        };

        return activeStream_;
    }

    function loadManifest(url) {
        videoHeaderAdded_ = false;
        videoIndex_ = 0;
        audioHeaderAdded_ = false;
        audioIndex_ = 0;

        if (url.indexOf('audio_only_case01') !== -1) {
            return audio_only_case01();
        } else if (url.indexOf('video_only_case01') !== -1) {
            return video_only_case01();
        } else if (url.indexOf('case01') !== -1) {
            return case01();
        } else if (url.indexOf('case02') !== -1) {
            return case02();
        } else if (url.indexOf('case03') !== -1) {
            return case03();
        }
    }

    function getNextFragment() {
        let ret = {};

        if (activeStream_.vRep && activeStream_.aRep) {
            do {
            // init segments
            if (videoHeaderAdded_ === false) {
                ret.type = activeStream_.vRep.type;
                ret.url = activeStream_.vRep.initialization;
                videoHeaderAdded_ = true;
                break;
            }
            if (audioHeaderAdded_ === false) {
                ret.type = activeStream_.aRep.type;
                ret.url = activeStream_.aRep.initialization;
                audioHeaderAdded_ = true;
                break;
            }

            // BD
            if (videoIndex_ < 1) {
                ret.type = activeStream_.vRep.type;
                ret.url = activeStream_.vRep.media[videoIndex_];
                videoIndex_++;
                break;
            }
            // ED

            // media segments
            if (videoIndex_ >= activeStream_.vRep.media.length ||
                audioIndex_ >= activeStream_.aRep.media.length) {
                ret = null;
            } else {
                if (videoIndex_ > audioIndex_) {
                    if (audioIndex_ < activeStream_.aRep.media.length) {
                        ret.type = activeStream_.aRep.type;
                        ret.url = activeStream_.aRep.media[audioIndex_];
                        audioIndex_++;
                    }
                } else {
                    if (videoIndex_ < activeStream_.vRep.media.length) {
                        ret.type = activeStream_.vRep.type;
                        ret.url = activeStream_.vRep.media[videoIndex_];
                        videoIndex_++;
                    }
                }
            }
            } while (false);
        } else {
            if (activeStream_.vRep) {
                ret.type = activeStream_.vRep.type;

                if (videoHeaderAdded_ === false) {
                    ret.url = activeStream_.vRep.initialization;
                    videoHeaderAdded_ = true;
                } else {
                    if (videoIndex_ < activeStream_.vRep.media.length) {
                        ret.url = activeStream_.vRep.media[videoIndex_];
                        videoIndex_++;
                    } else {
                        ret = null;
                    }
                }
            } else if (activeStream_.aRep) {
                ret.type = activeStream_.aRep.type;

                if (audioHeaderAdded_ === false) {
                    ret.url = activeStream_.aRep.initialization;
                    audioHeaderAdded_ = true;
                } else {
                    if (audioIndex_ < activeStream_.aRep.media.length) {
                        ret.url = activeStream_.aRep.media[audioIndex_];
                        audioIndex_++;
                    } else {
                        ret = null;
                    }
                }
            }
        }

        return ret;
    }

    instance = {
        loadManifest: loadManifest,
        getNextFragment: getNextFragment
    };
    return instance;
}

DashParser.__h5player_factory_name = 'DashParser';
export default FactoryMaker.getSingletonFactory(DashParser);
