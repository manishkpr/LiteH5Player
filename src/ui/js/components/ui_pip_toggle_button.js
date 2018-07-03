import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIPipToggleButton extends Component {
  constructor(props) {
    super(props);

    this.player = this.props.main.player;
    this.pipMode = false;
  }

  render() {
    return (
      <button className={"vop-button vop-pip-button vop-style-pip"} title="picture in picture"
        onClick={this.onUICmdPip.bind(this)}>
      </button>
    );
  }

  onUICmdPip() {
    this.pipMode = !this.pipMode;
    this.player.setPipPresentation(this.pipMode);
  }
}


export default UIPipToggleButton;

