import React from 'react';
import UITools from '../ui_tools';

class UIVolumeToggleButton extends React.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player_ = this.main.player_;

    this.vopVolumeBtnStyle = 'vop-style-volumeup';
  }

  componentDidMount() {
    this.vopVolumeBtn = document.querySelector('.vop-volume-button');

    //
    this.onMediaVolumeChanged = this.onMediaVolumeChanged.bind(this);
    this.player_.on(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged);
  }

  componentWillUnmount() {
    this.player_.off(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged);
  }

  render() {
    this.vopVolumeBtnStyle = this.getNewVolumeBtnStyle();

    return (
      <button className={"vop-button vop-volume-button" + " " + this.vopVolumeBtnStyle} title="mute"
        onClick={this.onUICmdVolume.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}>
      </button>
    );
  }

  getNewVolumeBtnStyle() {
    let newVolumeBtnStyle = '';

    let muted = this.player_.isMuted();
    let volume = this.player_.getVolume();
    if (volume === 0 || muted) {
      newVolumeBtnStyle = 'vop-style-volumeoff';
    } else {
      if (volume >= 0.5) {
        newVolumeBtnStyle = 'vop-style-volumeup';
      } else {
        newVolumeBtnStyle = 'vop-style-volumedown';
      }
    }

    return newVolumeBtnStyle;
  }

  onMediaVolumeChanged() {
    let oldVolumeBtnStyle = this.vopVolumeBtnStyle;
    this.vopVolumeBtnStyle = this.getNewVolumeBtnStyle();

    // update volume button
    UITools.removeClass(this.vopVolumeBtn, oldVolumeBtnStyle);
    UITools.addClass(this.vopVolumeBtn, this.vopVolumeBtnStyle);
  }

  onUICmdVolume() {
    let muted = this.player_.isMuted();
    let volume = this.player_.getVolume();

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
    this.main.onControlMouseMove(e);
  }
}


export default UIVolumeToggleButton;



