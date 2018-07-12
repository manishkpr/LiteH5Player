import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIVolumeToggleButton extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;

    this.vopVolumeBtnStyle = 'icon-up';
  }

  componentDidMount() {
    this.vopVolumeBtn = document.querySelector('.vop-volume-button');

    //
    this.onMediaVolumeChanged = this.onMediaVolumeChanged.bind(this);
    this.player.on(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged);
    this.player.on(oldmtn.Events.AD_VOLUME_CHANGED, this.onMediaVolumeChanged);
  }

  componentWillUnmount() {
    this.player.off(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged);
    this.player.off(oldmtn.Events.AD_VOLUME_CHANGED, this.onMediaVolumeChanged);
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

    let muted = this.player.isMuted();
    let volume = this.player.getVolume();
    if (volume === 0 || muted) {
      newVolumeBtnStyle = 'icon-off';
    } else {
      if (volume >= 0.5) {
        newVolumeBtnStyle = 'icon-up';
      } else {
        newVolumeBtnStyle = 'icon-down';
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
    let muted = this.player.isMuted();
    let volume = this.player.getVolume();

    if (volume === 0) {
      if (muted) {
        this.player.unmute();
        muted = false;
      }

      // If the this.player is muted, and volume is 0,
      // in this situation, we will restore volume to 0.2
      volume = 0.1;
      this.player.setVolume(volume);
    } else {
      if (muted) {
        this.player.unmute();
        muted = false;
      } else {
        this.player.mute();
        muted = true;
      }
    }
  }

  onControlMouseMove(e) {
    this.main.onControlMouseMove(e);
  }
}


export default UIVolumeToggleButton;



