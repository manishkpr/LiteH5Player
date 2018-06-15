import React from 'react';
import ReactDOM from 'react-dom';

import UIPlayer from './ui_player';

class UIEngine {
  constructor(idContainer) {
    this.playerContainer_ = document.getElementById(idContainer);

    this.initUI();
  }

  initUI() {
    this.uiPlayer_ = ReactDOM.render(<UIPlayer/>, this.playerContainer_);
  }

  // A series of API similar to oldmtn.Player class.
  init(cfg) {
    this.uiPlayer_.playerInit(cfg);
  }

  open(mediaCfg) {
    this.uiPlayer_.playerOpen(mediaCfg);
  }

  uninitPlayer() {
    if (this.player_) {
      this.player_.close();
      this.player_ = null;
    }
  }

  test() {
    this.uiPlayer_.playerTest();
  }
}

export default UIEngine;






