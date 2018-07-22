import { h } from 'preact';
import Preact from 'preact';

import UITools from '../ui_tools';

class UIHugeButtonOverlay extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
  }

  componentDidMount() {
    this.uiGiantButton = document.querySelector('.vop-huge-button');
    this.uiGiantBtnContainer = document.querySelector('.vop-huge-button-container');

    this.onMediaPlay = this.onMediaPlay.bind(this);
    this.onMediaPaused = this.onMediaPaused.bind(this);
    this.player.on(oldmtn.Events.MEDIA_PLAY, this.onMediaPlay);
    this.player.on(oldmtn.Events.MEDIA_PAUSED, this.onMediaPaused);
  }

  componentWillUnmount() {
    this.player.off(oldmtn.Events.MEDIA_PLAY, this.onMediaPlay);
    this.player.off(oldmtn.Events.MEDIA_PAUSED, this.onMediaPaused);
  }

  render() {
    //myPrintLog('UIHugeButtonOverlay, this.main.playerState: ' + this.main.playerState);
    
    let style = {};
    switch(this.main.playerState) {
      case 'idle':
      case 'opened':
      case 'ended':
      style.display = 'none';
      break;
      case 'playing':
      case 'paused':
      break;
    }

    return (
      <div className="vop-huge-button-container"
        style={style}
        onAnimationEnd={this.onGiantAnimationEnd.bind(this)}>
        <div className="vop-huge-button"></div>
      </div>
    );
  }

  onGiantAnimationEnd(e) {
    this.uiGiantBtnContainer.style.display = 'none';
  }

  onMediaPlay() {
    this.updateGiantPlayBtnUI(false);
  }

  onMediaPaused() {
    this.updateGiantPlayBtnUI(true);
  }

  updateGiantPlayBtnUI(paused) {
    if (this.uiGiantButton) {
      UITools.removeClass(this.uiGiantButton, 'vop-style-play-giant');
      UITools.removeClass(this.uiGiantButton, 'vop-style-pause-giant');
      if (paused) {
        UITools.addClass(this.uiGiantButton, 'vop-style-pause-giant');
      } else {
        UITools.addClass(this.uiGiantButton, 'vop-style-play-giant');
      }
      this.uiGiantBtnContainer.style.display = 'block';
    }
  }
}

export default UIHugeButtonOverlay;
