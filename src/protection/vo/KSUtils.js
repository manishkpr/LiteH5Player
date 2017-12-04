const KSUtils = {
    GetKSString: function(drmType) {
        if (drmType === 'widevine') {
            return 'com.widevine.alpha';
        } else if (drmType === 'playready') {
            return 'com.microsoft.playready';
        } else if (drmType === 'chromecast.playready') {
            return 'com.chromecast.playready';
        }
    },

    GetKSUUID: function(drmType) {
        if (drmType === 'widevine') {
            return 'edef8ba9-79d6-4ace-a3c8-27dcd51d21ed';
        } else if (drmType === 'playready') {
            return '9a04f079-9840-4286-ab92-e65be0885f95';
        } else if (drmType === 'chromecast.playready') {
            return '9a04f079-9840-4286-ab92-e65be0885f95';
        }
    }
};


module.exports = KSUtils;