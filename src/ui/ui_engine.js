import React from 'react';
import ReactDOM from 'react-dom';

import UISubtitleMenu from './ui_subtitlemenu';
import UIPlayer from './ui_player';

class UIEngine {
  constructor(idPlayerContainer) {
    this.playerContainer_ = document.getElementById(idPlayerContainer);

    this.video_ = null;
    this.adContainer_ = null;
    this.initUI();
  }

  initUI() {
    this.uiPlayer_ = ReactDOM.render(<UIPlayer/>, this.playerContainer_);

    this.video_ = document.querySelector('.vop-video');
    this.adContainer_ = document.querySelector('.vop-ads-container');
  }

  getVideo() {
    return this.video_;
  }

  getAdContainer() {
    return this.adContainer_;
  }

  playerInit(cfg) {
    this.uiPlayer_.playerInit(cfg);
  };

  playerOpen(mediaCfg) {
    this.uiPlayer_.playerOpen(mediaCfg);
  }

  uninitPlayer() {
    if (this.player_) {
      this.player_.close();
      this.player_ = null;
    }
  };
};

export default UIEngine;