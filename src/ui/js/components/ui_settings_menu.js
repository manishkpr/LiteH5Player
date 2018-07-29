import {
  h,
  Component
} from 'preact';
import Events from '../events';
import ID from '../id';

class UISettingsMenu extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.evEmitter = this.main.evEmitter;

    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);

    this.onPopupMenuChange = this.onPopupMenuChange.bind(this);
    this.evEmitter.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange);

    this.settingsData = {
      settingsList: [{
        id: '1',
        text: 'Quality'
      }, {
        id: '2',
        text: 'Language'
      }, {
        id: '3',
        text: 'Subtitle'
      }, {
        id: '4',
        text: 'XSpeed'
      }]
    };

    this.state = {
      settingsData: this.settingsData
    }
  }

  componentDidMount(e) {
    this.vopSettingsMenu = document.querySelector('.vop-settings-menu');
  }

  render() {
    //myPrintLog(`UISettingsMenu, render, ${this.main.settingMenuUIData.currMenu}`);
    const { settingsData } = this.state;
    const menuitems = settingsData.settingsList.map(function(item, index) {
      let currValue = '';
      return (
        <div key={index} className="vop-menuitem" role="menuitem" aria-haspopup="true"
            data-id={item.id} onClick={this.onMenuItemClick_}
            tabIndex="0" onBlur={this.onMenuItemBlur_}>
          <div className="vop-menuitem-label">
            { item.text }
          </div>
          <div className="vop-menuitem-content">
            <span className="vop-menuitem-content-text">{currValue}</span>
          </div>
        </div>
      );

    }.bind(this));

    return (
      <div className="vop-settings-menu" style="display: none;">
        <div className="vop-panel-menu">
          { menuitems }
        </div>
      </div>
    );
  }

  onMenuItemClick(e) {
    myPrintLog('+onMainMenuItemClick, ' +
      ' this.settingMenuUIData.currMenu: ' + this.main.settingMenuUIData.currMenu +
      ', text: ' + e.target.innerText);
    let nextFocus = e.currentTarget;

    myPrintLog('id: ' + nextFocus.dataset.id);
    let menu;
    switch (nextFocus.dataset.id) {
      case '1':
         menu = 'quality_menu';
        break;
      case '2':
        menu = 'audio_track_menu';
        break;
      case '3':
        menu = 'fcc_menu';
        break;
      case '4':
        menu = 'xspeed_menu';
      default:
        break;
    }

    this.main.settingMenuUIData.currMenu = menu;
    this.evEmitter.emit(Events.POPUPMENU_CHANGE, {
      menu: this.main.settingMenuUIData.currMenu
    });
  }

  onMenuItemBlur(e) {
    if (this.main.settingMenuUIData.currMenu !== 'settings_menu') {
      return;
    }
    let text = '';
    if (e.relatedTarget) {
      text = ', text: ' + e.relatedTarget.innerText;
    }

    myPrintLog('+onMainMenuItemBlur, this.settingMenuUIData.currMenu: ' + this.main.settingMenuUIData.currMenu + text);

    let prevFocus = e.target;
    let nextFocus = e.relatedTarget;

    if (nextFocus) {
      if (nextFocus.dataset.id === ID.SETTINGS_BUTTON) {
        // means we click 'setting' button, do nothing here, onUICmdSettings will handle for us.
      } else {
        if (prevFocus) {
          if (-1 === prevFocus.className.indexOf('vop-menuitem')) {
            // means click another item, do nothing here, on***ItemClick will handle for us.
          } else {}
        } else {}
      }
    } else {
      this.main.settingMenuUIData.currMenu = 'none';
      this.evEmitter.emit(Events.POPUPMENU_CHANGE, {
        menu: this.main.settingMenuUIData.currMenu
      });
    }
  }

  onPopupMenuChange(e) {
    if (e.menu === 'settings_menu') {
      this.vopSettingsMenu.style.display = 'block';
      let v = this.vopSettingsMenu.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    } else {
      this.vopSettingsMenu.style.display = 'none';
    }
  }
}

export default UISettingsMenu;