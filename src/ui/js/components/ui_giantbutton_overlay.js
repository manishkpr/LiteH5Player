import { h } from 'preact';
import Preact from 'preact';

import UITools from '../ui_tools';

class UIGiantButtonOverlay extends Preact.Component {
  constructor(props) {
    super(props);

    this.player = this.props.main.player;
  }

  componentDidMount() {
    this.uiGiantBtnContainer = document.querySelector('.vop-giant-button-container');
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
    return (
      <div className="vop-giant-button-container" onAnimationEnd={this.onGiantAnimationEnd.bind(this)}>
        <div className="vop-giant-button"></div>
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
