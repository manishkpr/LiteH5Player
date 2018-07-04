import { h } from 'preact';
import Preact from 'preact';

import UITools from '../ui_tools';

class UIGiantButtonOverlay extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
  }

  componentDidMount() {
    this.uiGiantButton = document.querySelector('.vop-giant-button');

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
    console.log('UIGiantButtonOverlay, this.main.playerState: ' + this.main.playerState);
    let ret = <div></div>;
    switch(this.main.playerState) {
      case 'opened':
      ret = (
        <div className="vop-giant-button-container" onAnimationEnd={this.onGiantAnimationEnd.bind(this)}>
          <div className="vop-giant-button"></div>
        </div>
      );
      break;
    }

    return ret;
  }

  onGiantAnimationEnd(e) {
    this.uiGiantBtnContainer = document.querySelector('.vop-giant-button-container');
    this.uiGiantBtnContainer.style.display = 'none';
  }

  onMediaPlay() {
    this.updateGiantPlayBtnUI(false);
  }

  onMediaPaused() {
    this.updateGiantPlayBtnUI(true);
  }

  updateGiantPlayBtnUI(paused) {
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

export default UIGiantButtonOverlay;
