import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIAirplayToggleButton extends Component {
  constructor(props) {
    super(props);
    this.main = this.props.main;
  }

  render() {
    let btnStyle = {};
    if (this.main.flagAdStarted && this.main.flagIsLinearAd) {
      btnStyle.display = 'none';
    } else {
      btnStyle.display = 'inline-block';
    }

    return (
      <button className={"vop-button vop-airplay-button vop-style-airplay"} title="airplay"
        style={btnStyle}>
      </button>
    );
  }
}

export default UIAirplayToggleButton;

