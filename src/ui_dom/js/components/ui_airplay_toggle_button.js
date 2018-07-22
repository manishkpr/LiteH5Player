import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIAirplayToggleButton extends Component {
  constructor(props) {
    super(props);
    this.main = this.props.main;
    this.player = this.main.player;
  }

  render() {
    let btnStyle = {};
    if (this.main.flagAdStarted && this.main.flagIsLinearAd) {
      btnStyle.display = 'none';
    } else {
      btnStyle.display = 'inline-block';
    }

    return (
      <button className={"vop-button vop-airplay-button"} title="airplay"
        onClick={this.onUICmdAirplay.bind(this)}
        style={btnStyle}>
      </button>
    );
  }

  onUICmdAirplay() {
    this.player.showPlaybackTargetPicker();
  }
}

export default UIAirplayToggleButton;

