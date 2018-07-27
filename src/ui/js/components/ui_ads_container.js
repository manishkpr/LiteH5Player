import { h, Component } from 'preact';

import UITools from '../ui_tools';
import Events from '../events';
import ID from '../id';

class UIAdsContainer {
  constructor(props) {
    this.props = props;
    this.main = this.props.main;
    this.player = this.main.player;

    this.vopAdContainer = document.querySelector('.vop-ads-container');

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
    // FIXME: Actually, although bottom bar was display(none), we need to get its height.
    const BOTTOM_BAR_HEIGHT = 41;

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
        this.vopAdContainer.style.bottom = BOTTOM_BAR_HEIGHT.toString() + 'px';
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
}

export default UIAdsContainer;





