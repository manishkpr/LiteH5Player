import React from 'react';
import UITools from '../ui_tools';

class UIGiantButtonOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.player_ = this.props.main.player_;
  }

  componentDidMount() {
    this.uiGiantBtnContainer = document.querySelector('.vop-giant-button-container');
    this.uiGiantButton = document.querySelector('.vop-giant-button');

    this.onMediaPlay = this.onMediaPlay.bind(this);
    this.onMediaPaused = this.onMediaPaused.bind(this);
    this.player_.on(oldmtn.Events.MEDIA_PLAY, this.onMediaPlay);
    this.player_.on(oldmtn.Events.MEDIA_PAUSED, this.onMediaPaused);
  }

  componentWillUnmount() {
    this.player_.off(oldmtn.Events.MEDIA_PLAY, this.onMediaPlay);
    this.player_.off(oldmtn.Events.MEDIA_PAUSED, this.onMediaPaused);
  }

  render() {
    return (
      <div className="vop-giant-button-container" style={{display: 'none'}} onAnimationEnd={this.onGiantAnimationEnd.bind(this)}>
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