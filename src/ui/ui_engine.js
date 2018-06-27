import React from 'react';
import ReactDOM from 'react-dom';

import UISkinYoutube from './ui_skin_youtube';

class UIEngine {
  constructor(player) {
    this.player_ = player;

    this.h5VideoPlayer_ = document.querySelector('.html5-video-player');
  }

  installSkin() {
    this.skinContainerYb_ = document.querySelector('.vop-skin-default');
    if (!this.skinContainerYb_) {
      this.skinContainerYb_ = document.createElement('div');
      this.skinContainerYb_.setAttribute('class', 'vop-skin-default');
      this.h5VideoPlayer_.appendChild(this.skinContainerYb_);
    }

    this.uiPlayer_ = ReactDOM.render(<UISkinYoutube player={this.player_}/>, this.skinContainerYb_);
  }

  uninstallSkin() {
    ReactDOM.unmountComponentAtNode(this.skinContainerYb_);
  }
}

export default UIEngine;





