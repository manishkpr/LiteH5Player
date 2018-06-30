import { h } from 'preact';
import Preact from 'preact';

import UITools from '../ui_tools';

class UISettingsToggleButton extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    return (
      <button className="vop-button vop-settings-button vop-style-settings" title="settings"
        onClick={this.onUICmdSettings.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}>
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

