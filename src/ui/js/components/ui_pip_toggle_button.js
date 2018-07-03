import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIPipToggleButton extends Component {
  constructor(props) {
    super(props);

    this.player_ = this.props.main.player_;
    this.pipMode = false;
  }

  render() {
    return (
      <button className={"vop-button vop-pip-button vop-style-pip"} title="chromecast"
        onClick={this.onUICmdPip.bind(this)}>
      </button>
    );
  }

  onUICmdPip() {
    this.pipMode = !this.pipMode;
    this.player_.setPipPresentation(this.pipMode);
  }
}


export default UIPipToggleButton;

