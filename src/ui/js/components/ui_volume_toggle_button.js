import React from 'react';
import UITools from '../ui_tools';

class UIVolumeToggleButton extends React.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player_ = this.main.player_;
  }

  componentDidMount() {
    this.vopVolumeButton = document.querySelector('.vop-volume-button');

    //
    this.onMediaVolumeChanged = this.onMediaVolumeChanged.bind(this);
    this.player_.on(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged);
  }

  componentWillUnmount() {
    this.player_.off(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged);
  }

  render() {
    return (
      <button className="vop-button vop-volume-button vop-style-volumeup" title="mute"
        onClick={this.onUICmdVolume.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}>
      </button>
    );
  }

  onMediaVolumeChanged() {
    let muted = this.player_.isMuted();
    let volume = this.player_.getVolume();

    let uiVolumeIcon;
    if (volume === 0 || muted) {
      uiVolumeIcon = 'vop-style-volumeoff';
    } else {
      if (volume >= 0.5) {
        uiVolumeIcon = 'vop-style-volumeup';
      } else {
        uiVolumeIcon = 'vop-style-volumedown';
      }
    }

    // update volume button
    UITools.removeClass(this.vopVolumeButton, 'vop-style-volumedown');
    UITools.removeClass(this.vopVolumeButton, 'vop-style-volumeup');
    UITools.removeClass(this.vopVolumeButton, 'vop-style-volumeoff');
    UITools.addClass(this.vopVolumeButton, uiVolumeIcon);
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
    this.main.onControlMouseMove(e);
  }
}


export default UIVolumeToggleButton;


