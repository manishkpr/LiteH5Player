import {
  h,
  Component
} from 'preact';

import UITools from '../ui_tools';

import Events from '../events';
import ID from '../id';

class UISettingsToggleButton extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.evEmitter = this.main.evEmitter;
  }

  componentDidMount() {
    this.vopSettingsButton = document.querySelector('.vop-settings-button');

  }

  render() {
    return (
      <button data-id={ID.SETTINGS_BUTTON} className="vop-button vop-settings-button" title="settings"
        onClick={this.onUICmdSettings.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}>
      </button>
    );
  }

  onUICmdSettings() {
    if (this.main.settingMenuUIData.currMenu === 'subtitles_menu') {
      this.main.settingMenuUIData.currMenu = 'settings_menu';
    } else {
      if (this.main.settingMenuUIData.currMenu !== 'none') {
        this.main.settingMenuUIData.currMenu = 'none';
      } else {
        this.main.settingMenuUIData.currMenu = 'settings_menu';
      }
    }
    this.evEmitter.emit(Events.POPUPMENU_CHANGE, {
      menu: this.main.settingMenuUIData.currMenu
    });
  }

  onControlMouseMove(e) {
    e.stopPropagation();
    this.main.removeAutohideAction();
  }
}

export default UISettingsToggleButton;