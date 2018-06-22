import React from 'react';
import ReactDOM from 'react-dom';

import UIPlayer from './ui_player';

class UIEngine {
  constructor(player) {
    this.player_ = player;

    this.h5VideoPlayer_ = document.querySelector('.html5-video-player');
    this.vopVideo = document.querySelector('.vop-video');
  }

  installSkin() {
    this.vopVideo.removeAttribute('controls');

    if (!this.skinContainer_) {
      this.skinContainer_ = document.createElement('div');
      this.h5VideoPlayer_.appendChild(this.skinContainer_);
    }
    this.uiPlayer_ = ReactDOM.render(<UIPlayer player={this.player_}/>, this.skinContainer_);
  }

  uninstallSkin() {
    ReactDOM.unmountComponentAtNode(this.skinContainer_);
    this.vopVideo.setAttribute('controls', 'true');
    $('.html5-video-player').removeClass('vop-autohide');
  }
}

export default UIEngine;




