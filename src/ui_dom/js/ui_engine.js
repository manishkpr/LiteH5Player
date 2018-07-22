import '../css/ui_skin_youtube.scss';

import UICaptionOverlay from './components/ui_caption_overlay';
import UIChromecastOverlay from './components/ui_chromecast_overlay';
import UILogoOverlay from './components/ui_logo_overlay';
import UIPlayButtonOverlay from './components/ui_play_overlay';
import UITitleBar from './components/ui_title_bar';

import UIBottomBar from './components/ui_bottom_bar';

window.myPrintLog = function (msg, level) {
  if (printLog) {
    printLog(msg, level);
  }
};


class UISkinYoutube {
  constructor(player) {
    this.player = player;

    // sub components
    this.components = [];
    this.uiCaptionOverlay_ = new UICaptionOverlay({main: this});
    this.uiChromecastOverlay_ = new UIChromecastOverlay({main: this});
    this.uiTitleBar_ = new UITitleBar({main: this});
    this.uiPlayerBtnOverlay_ = new UIPlayButtonOverlay({main: this});
    this.uiLogoOverlay_ = new UILogoOverlay({main: this});
    this.uiBottomBar_ = new UIBottomBar({main: this});

    this.components.push(this.uiChromecastOverlay_);
    this.components.push(this.uiTitleBar_);
    this.components.push(this.uiLogoOverlay_);
    this.components.push(this.uiPlayerBtnOverlay_);
    this.components.push(this.uiBottomBar_);
  }

  toDom() {
    //
    let container = document.createElement('div');
    container.setAttribute('class', 'vop-skin-youtube');

    this.components.forEach(function(item, index) {
      let element = item.toDom();
      container.appendChild(element);
    });

    return container;
    // <div className="vop-skin-youtube">
    //     <UIChromecastOverlay main={this} />
    //     <UITitleBar main={this} />
    //     <UILogoOverlay />
    //     <UIPopupMenu main={this} />
    //     <UICaptionOverlay main={this} />
    //     <UIToolTip main={this} />
    //     <UIGradientBottom main={this} />
    //     <UIBottomBar main={this} />
    //     <UIBufferingOverlay />
    //     <UIHugeButtonOverlay main={this} />
    //     <UIPlayOverlay main={this} />
    //   </div>
  }

  play() {
    this.player.play();
  }
}

class UIEngine {
  constructor(player) {
    this.player = player;

    this.h5VideoPlayer_ = document.querySelector('.html5-video-player');
  }

  installSkin() {
    this.skinContainerYb_ = document.querySelector('.vop-skin-default');
    if (!this.skinContainerYb_) {
      this.skinContainerYb_ = document.createElement('div');
      this.skinContainerYb_.setAttribute('class', 'vop-skin-default');
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





