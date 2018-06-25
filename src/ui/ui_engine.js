import React from 'react';
import ReactDOM from 'react-dom';

import UIPlayer from './ui_player';

class UIEngine {
  constructor(player) {
    this.player_ = player;

    this.h5VideoPlayer_ = document.querySelector('.html5-video-player');
  }

  installSkin() {
    this.skinContainer101 = document.querySelector('.vop-skin-default');
    if (!this.skinContainer101) {
      this.skinContainer101 = document.createElement('div');
      this.skinContainer101.setAttribute('class', 'vop-skin-default');
      this.h5VideoPlayer_.appendChild(this.skinContainer101);
    }

    this.uiPlayer_ = ReactDOM.render(<UIPlayer player={this.player_}/>, this.skinContainer101);
  }

  uninstallSkin() {
    ReactDOM.unmountComponentAtNode(this.skinContainer101);
  }
}

export default UIEngine;





