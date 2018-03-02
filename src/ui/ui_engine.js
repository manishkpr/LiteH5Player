import FactoryMaker from '../core/FactoryMaker';

function UIEngine() {
    let playerContainer_ = null;
    let videoContainer_ = null;
    let video_ = null;
    let adContainer_ = null;

    function initUI(playerContainer) {
        playerContainer_ = document.getElementById(playerContainer);
        initUIElement();
    }

    function initUIStyle() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = 'body{margin:0px;background-color:lightgray;}.player{position:relative;width:640px;height:360px;margin:16px;}.html5-video-player{width:100%;height:100%;}.vop-autohide{cursor:none}.vop-video-container,.vop-video-ads{position:absolute;width:100%;height:100%;background-color:black;}.vop-video{width:100%;height:100%;}.vop-shade{position:absolute;width:100%;height:100%;z-index:100;}.vop-shade:not(.vop-shade-test1){}.vop-gradient-bottom{width:100%;position:absolute;background-repeat:repeat-x;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==);-moz-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);-webkit-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);pointer-events:none}.vop-gradient-bottom{height:49px;padding-top:49px;bottom:0;z-index:22;background-position:bottom}.vop-chrome-bottom{position:absolute;text-shadow:0 0 2px rgba(0,0,0,.5)}.vop-chrome-bottom{bottom:0;height:41px;z-index:60;text-align:left;direction:ltr;left:12px;right:12px;}.vop-chrome-bottom{-moz-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);-webkit-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1)}.vop-autohide .vop-chrome-bottom{opacity:0;-moz-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);-webkit-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);}.vop-progress-bar{width:100%;height:5px;background-color:orange;}.vop-controls{width:100%;height:36px;}.vop-left-controls{height:100%;float:left;}.vop-right-controls{float:right;}.vop-button{width:36px;height:100%;border:none;color:inherit;background-color:transparent;padding:0;text-align:inherit;font-size:100%;font-family:inherit;cursor:default;line-height:inherit}.vop-button:focus,.vop-button{outline:0}.vop-button::-moz-focus-inner{padding:0;border:0}.vop-time-display{float:left;}.vop-time-text{color:white;position:absolute;top:50%;transform:translateY(-50%);}.vop-svg-shadow{stroke:#000;stroke-opacity:.15;stroke-width:2px;fill:none}.vop-svg-fill{fill:#fff}.vop-play-button{float:left;cursor:pointer;}.vop-autohide .vop-play-button{cursor:none;}.vop-play-button::before{content:"";display:block;height:100%;width:12px;position:absolute;top:0;left:-12px;}.vop-ads-container{position:absolute;top:0px;left:0px;width:100%;height:100%;}#idBtnController{position:relative;}#idBufferingContainer{position:absolute;background-color:lightgreen;margin:auto;width:200px;height:200px;top:0;left:0;bottom:0;right:0;}.spinnerSvg{position:absolute;width:100%;height:100%;top:0;bottom:0;left:0;right:0;margin:auto;animation:rotate 2s linear infinite;transform-origin:center center;}.spinnerPath{stroke:#d62d20;stroke-dasharray:20,200;stroke-dashoffset:0;animation:dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;stroke-linecap:round;}@keyframes rotate{100%{transform:rotate(360deg);}}@keyframes dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0;}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px;}100%{stroke-dasharray:89,200;stroke-dashoffset:-124px;}}@keyframes color{100%,0%{stroke:#d62d20;}40%{stroke:#0057e7;}66%{stroke:#008744;}80%,90%{stroke:#ffa700;}}.spinner{position:absolute;width:300px;height:301px;background-image:url("assets/buffering7.png");-webkit-animation:spin 1s infinite linear;top:50%;left:50%;display:block;}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg);}100%{-webkit-transform:rotate(-360deg);}}';

        document.getElementsByTagName('HEAD').item(0).appendChild(style);
    }

    function initUIElement() {
        // create video element here
        video_ = document.createElement('video');
        video_.setAttribute('class', 'vop-video');
        //video_.setAttribute('autoplay', 'true');
        video_.setAttribute('playsinline', 'true');
        video_.setAttribute('webkit-playsinline', 'true');

        videoContainer_ = document.createElement('div');
        videoContainer_.setAttribute('class', 'vop-video-container');
        videoContainer_.appendChild(video_);

        // create ads container
        adContainer_ = document.createElement('div');
        adContainer_.setAttribute('class', 'vop-ads-container');

        //
        let firstChild = playerContainer_.firstChild;
        if (firstChild) {
            playerContainer_.insertBefore(videoContainer_, firstChild);
        } else {
            playerContainer_.appendChild(videoContainer_);
        }

        let h5pShade = document.querySelector('.vop-shade');
        firstChild = h5pShade.firstChild;
        if (firstChild) {
            h5pShade.insertBefore(adContainer_, firstChild);
        } else {
            h5pShade.appendChild(adContainer_);
        }
    }

    function getVideo() {
        return video_;
    }

    function getVideoContainer() {
        return videoContainer_;
    }

    function getAdContainer() {
        return adContainer_;
    }

    let instance = {
        initUI: initUI,
        getVideo: getVideo,
        getAdContainer: getAdContainer
    };

    return instance;
};

UIEngine.__h5player_factory_name = 'UIEngine';
export default FactoryMaker.getSingletonFactory(UIEngine);
