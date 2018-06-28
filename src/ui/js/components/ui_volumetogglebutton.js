import React from 'react';

class UIVolumeToggleButton extends React.Component {
  constructor(props) {
    super(props);

    this.player_ = this.props.player;
  }

  render() {
    return (
      <button className="vop-button vop-volume-button vop-style-volumeup" title="mute"
        onClick={this.onUICmdVolume.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}>
      </button>
    );
  }

  onUICmdVolume() {
    var muted = this.player_.isMuted();
    var volume = this.player_.getVolume();

    if (volume === 0) {
      if (muted) {
        this.player_.unmute();
        muted = false;
      }

      // If the this.player_ is muted, and volume is 0,
      // in this situation, we will restore volume to 0.2
      volume = 0.1;
      this.player_.setVolume(volume);
    } else {
      if (muted) {
        this.player_.unmute();
        muted = false;
      } else {
        this.player_.mute();
        muted = true;
      }
    }
  }

  onControlMouseMove(e) {
    this.props.onControlMouseMove(e);
  }

}


export default UIVolumeToggleButton;
