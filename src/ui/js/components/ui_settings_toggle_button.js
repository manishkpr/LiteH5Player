import React from 'react';
import UITools from '../ui_tools';

class UISettingsToggleButton extends React.Component {
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
    this.main.onControlMouseMove(e);
  }
}

export default UISettingsToggleButton;

