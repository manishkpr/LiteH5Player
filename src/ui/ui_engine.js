import React from 'react';
import ReactDOM from 'react-dom';

import UIPlayer from './ui_player';

function UIEngine() {
  let playerContainer_ = null;
  let videoContainer_ = null;
  let video_ = null;
  let adContainer_ = null;

  function initUI(playerContainer) {
    playerContainer_ = document.getElementById(playerContainer);

    ReactDOM.render(<UIPlayer/>, playerContainer_);

    videoContainer_ = document.querySelector('.vop-video-container');
    video_ = document.querySelector('.vop-video');
    adContainer_ = document.querySelector('.vop-ads-container');
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
    getVideoContainer: getVideoContainer,
    getAdContainer: getAdContainer
  };

  return instance;
};

export default UIEngine;