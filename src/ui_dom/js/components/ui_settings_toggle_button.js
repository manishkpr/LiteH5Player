import { h } from 'preact';
import Preact from 'preact';

import UITools from '../ui_tools';

class UISettingsToggleButton extends Preact.Component {
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
      <button className="vop-button vop-settings-button" title="settings"
        onClick={this.onUICmdSettings.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}
        style={btnStyle}>
      </button>
    );
  }

  onUICmdSettings() {
    this.main.onUICmdSettings();
  }

  onControlMouseMove(e) {
    e.stopPropagation();
    this.main.removeAutohideAction();
  }
}

export default UISettingsToggleButton;

