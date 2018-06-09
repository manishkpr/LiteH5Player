import React from 'react';
import ReactDOM from 'react-dom';

import UIPlayer from './ui_player';

class UIEngine {
  constructor(idPlayerContainer) {
    this.playerContainer_ = document.getElementById(idPlayerContainer);

    this.videoContainer_ = null;
    this.video_ = null;
    this.adContainer_ = null;

    this.initUI();
  }
  
  initUI() {
    ReactDOM.render(<UIPlayer/>, this.playerContainer_);

    this.videoContainer_ = document.querySelector('.vop-video-container');
    this.video_ = document.querySelector('.vop-video');
    this.adContainer_ = document.querySelector('.vop-ads-container');
  }

  getVideo() {
    return this.video_;
  }

  getVideoContainer() {
    return this.videoContainer_;
  }

  getAdContainer() {
    return this.adContainer_;
  }
};

export default UIEngine;


