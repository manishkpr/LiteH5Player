import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIChromecastToggleButton extends Component {
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
      <button className={"vop-button vop-cast-button"} title="chromecast"
        style={btnStyle}
        onClick={this.onUIComponentClick.bind(this)}
        onMouseMove={this.onUIComponentMouseMove.bind(this)}>
      </button>
    );
  }

  onUIComponentClick() {
    this.player.castVideo();
  }

  onUIComponentMouseMove(e) {
    this.main.onControlMouseMove(e);
  }
}


export default UIChromecastToggleButton;

