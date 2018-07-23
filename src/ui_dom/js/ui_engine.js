import '../css/ui_skin_youtube.scss';

import DOM from './dom';
import UISkinYoutube from './ui_skin_youtube';

window.myPrintLog = function (msg, level) {
  if (printLog) {
    printLog(msg, level);
  }
};

class UIEngine {
  constructor(player) {
    this.player = player;

    this.h5VideoPlayer_ = document.querySelector('.html5-video-player');
  }

  installSkin() {
    this.skinContainerYb_ = document.querySelector('.vop-skin-default');
    if (!this.skinContainerYb_) {
      let tag = 'div';
      let attributes = {
        'class': 'vop-skin-default'
      };

      this.skinContainerYb_ = new DOM(tag, attributes);
      this.h5VideoPlayer_.appendChild(this.skinContainerYb_);
    }

    this.skinYb_ = new UISkinYoutube(this.player);
    let v1 = this.skinYb_.toDom();
    this.skinContainerYb_.appendChild(v1);

    //let root;
    //this.uiPlayer_ = render(<UISkinYoutube player={this.player} cbLog={this.cbLog} />, this.skinContainerYb_, root);
  }

  uninstallSkin() {
    
  }
}

export default UIEngine;





