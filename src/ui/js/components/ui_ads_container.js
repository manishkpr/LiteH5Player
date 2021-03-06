import {
  h,
  Component
} from 'preact';

import UITools from '../ui_tools';
import Events from '../events';
import ID from '../id';
import CONSTS from '../consts';

class UIAdsContainer {
  constructor(props) {
    this.props = props;
    this.main = this.props.main;
    this.player = this.main.player;

    this.vopAdContainer = document.querySelector('.vop-ads-container');
    this.onAdContainerMouseDown = this.onAdContainerMouseDown.bind(this);
    this.vopAdContainer.addEventListener('mousedown', this.onAdContainerMouseDown);

    //
    this.onAdStarted = this.onAdStarted.bind(this);
    this.onAdComplete = this.onAdComplete.bind(this);
    this.player.on(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player.on(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
  }

  onAdStarted(e) {
    // BD
    let videos = document.getElementsByTagName('video');
    myPrintLog('onAdStarted, linear: ' + e.linear + ', videos length: ' + videos.length);
    // ED

    if (!this.vopPlayer) {
      this.vopPlayer = document.querySelector('.html5-video-player');
    }

    this.flagAdStarted = true;
    this.flagIsLinearAd = e.linear;
    this.flagIsVpaidAd = e.vpaid;

    // update control bar ui
    if (this.flagIsVpaidAd) {
      this.vopAdContainer.style.zIndex = '3';
    } else {
      if (this.flagIsLinearAd) {
        this.vopAdContainer.style.zIndex = '1';
      } else {
        let adDstWidth = this.vopPlayer.clientWidth;
        let adDstHeight = e.height + 10;
        this.player.resize(adDstWidth, e.height + 5);
        this.vopAdContainer.style.bottom = CONSTS.BOTTOM_BAR_HEIGHT.toString() + 'px';
        //this.vopAdContainer.style.width = adDstWidth.toString() + 'px';
        this.vopAdContainer.style.height = adDstHeight.toString() + 'px';
        this.vopAdContainer.style.zIndex = '1';

        // Consider ad height.
        //this.updateCaptionOverlay();
      }
    }
  }

  onAdComplete(e) {
    myPrintLog('onAdComplete, linear: ' + this.flagIsLinearAd);
    this.flagAdStarted = false;

    if (this.flagIsVpaidAd) {
      this.vopAdContainer.style.zIndex = 'auto';
    } else {
      if (this.flagIsLinearAd) {
        this.vopAdContainer.style.zIndex = 'auto';
      } else {
        this.vopAdContainer.style.zIndex = 'auto';
      }
    }
  }

  onAdContainerMouseDown(e) {
    // If ad is playing, it will overlay on the top of 'html5-video-player',
    // when click on ad, we should stop this event transfer to its parent.
    if (this.flagAdStarted) {
      e.stopPropagation();
    }
  }
}

export default UIAdsContainer;