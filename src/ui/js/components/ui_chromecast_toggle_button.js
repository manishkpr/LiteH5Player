import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIChromecastToggleButton extends Component {
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
      <button className={"vop-button vop-cast-button vop-style-cast"} title="chromecast"
        style={btnStyle}>
      </button>
    );
  }
}


export default UIChromecastToggleButton;

