
var UIEngine = function (cfg) {
    this.cfg_ = cfg;
    this.playerContainer_ = document.getElementById(this.cfg_.playerContainer);
    this.video_ = null;
    this.videoContainer_ = null;
    this.adContainer_ = null;

    this.initUIElement();
};

UIEngine.prototype.initUIStyle = function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'body{margin:0px;background-color:lightgray;}.player{position:relative;width:640px;height:360px;margin:16px;}.html5-video-player{width:100%;height:100%;}.h5p-autohide{cursor:none}.h5p-video-container,.h5p-video-ads{position:absolute;width:100%;height:100%;background-color:black;}.h5p-video{width:100%;height:100%;}.h5p-shade{position:absolute;width:100%;height:100%;z-index:100;}.h5p-shade:not(.h5p-shade-test1){}.h5p-gradient-bottom{width:100%;position:absolute;background-repeat:repeat-x;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==);-moz-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);-webkit-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);pointer-events:none}.h5p-gradient-bottom{height:49px;padding-top:49px;bottom:0;z-index:22;background-position:bottom}.h5p-chrome-bottom{position:absolute;text-shadow:0 0 2px rgba(0,0,0,.5)}.h5p-chrome-bottom{bottom:0;height:41px;z-index:60;text-align:left;direction:ltr;left:12px;right:12px;}.h5p-chrome-bottom{-moz-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);-webkit-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1)}.h5p-autohide .h5p-chrome-bottom{opacity:0;-moz-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);-webkit-transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);transition:opacity .25s cubic-bezier(0.0,0.0,0.2,1);}.h5p-progress-bar{width:100%;height:5px;background-color:orange;}.h5p-controls{width:100%;height:36px;}.h5p-left-controls{height:100%;float:left;}.h5p-right-controls{float:right;}.h5p-button{width:36px;height:100%;border:none;color:inherit;background-color:transparent;padding:0;text-align:inherit;font-size:100%;font-family:inherit;cursor:default;line-height:inherit}.h5p-button:focus,.h5p-button{outline:0}.h5p-button::-moz-focus-inner{padding:0;border:0}.h5p-time-display{float:left;}.h5p-time-text{color:white;position:absolute;top:50%;transform:translateY(-50%);}.h5p-svg-shadow{stroke:#000;stroke-opacity:.15;stroke-width:2px;fill:none}.h5p-svg-fill{fill:#fff}.h5p-play-button{float:left;cursor:pointer;}.h5p-autohide .h5p-play-button{cursor:none;}.h5p-play-button::before{content:"";display:block;height:100%;width:12px;position:absolute;top:0;left:-12px;}.h5p-ads-container{position:absolute;top:0px;left:0px;width:100%;height:100%;}#idBtnController{position:relative;}#idBufferingContainer{position:absolute;background-color:lightgreen;margin:auto;width:200px;height:200px;top:0;left:0;bottom:0;right:0;}.spinnerSvg{position:absolute;width:100%;height:100%;top:0;bottom:0;left:0;right:0;margin:auto;animation:rotate 2s linear infinite;transform-origin:center center;}.spinnerPath{stroke:#d62d20;stroke-dasharray:20,200;stroke-dashoffset:0;animation:dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;stroke-linecap:round;}@keyframes rotate{100%{transform:rotate(360deg);}}@keyframes dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0;}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px;}100%{stroke-dasharray:89,200;stroke-dashoffset:-124px;}}@keyframes color{100%,0%{stroke:#d62d20;}40%{stroke:#0057e7;}66%{stroke:#008744;}80%,90%{stroke:#ffa700;}}.spinner{position:absolute;width:300px;height:301px;background-image:url("assets/buffering7.png");-webkit-animation:spin 1s infinite linear;top:50%;left:50%;display:block;}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg);}100%{-webkit-transform:rotate(-360deg);}}';

    document.getElementsByTagName('HEAD').item(0).appendChild(style);
};

UIEngine.prototype.initUIElement = function () {
    // create video element here
    this.video_ = document.createElement('video');
    this.video_.setAttribute('class', 'h5p-video');
    this.video_.setAttribute('playsinline', 'false');

    this.videoContainer_ = document.createElement('div');
    this.videoContainer_.setAttribute('class', 'h5p-video-container');
    this.videoContainer_.appendChild(this.video_);

    // 
    let firstChild = this.playerContainer_.firstChild;
    if (firstChild) {
        this.playerContainer_.insertBefore(this.videoContainer_, firstChild);
    } else {
        this.playerContainer_.appendChild(this.videoContainer_);
    }
    
    // create ads container
    if (this.cfg_.advertising) {
        this.adContainer_ = document.createElement('div');
        this.adContainer_.setAttribute('class', 'h5p-ads-container');

        this.playerContainer_.insertBefore(this.adContainer_, firstChild);
    }
};

UIEngine.prototype.getVideo = function () {
    return this.video_;
};

UIEngine.prototype.getVideoContainer = function () {
    return this.videoContainer_;
};

UIEngine.prototype.getAdContainer = function () {
    return this.adContainer_;
};

export default UIEngine;










