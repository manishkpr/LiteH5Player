import { h, Component } from 'preact';

import Events from '../events';
import ID from '../id';

class UIFccMenu extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.evEmitter = this.main.evEmitter;

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);

    this.onPopupMenuChange = this.onPopupMenuChange.bind(this);
    this.evEmitter.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange);
  }

  componentDidMount() {
    this.vopFccMenu = document.querySelector('.vop-fcc-menu');
  }

  render() {
    //myPrintLog('+render, UIFccMenu: ' + this.main.settingMenuUIData.currMenu);

    const menuitems = this.main.settingMenuUIData.fccPropertyList.map((item, index) =>
      <div key={index} className="vop-menuitem" role="menuitem" aria-haspopup="true"
          data-id={item.name} onClick={this.onMenuItemClick_}
          tabIndex="0" onBlur={this.onMenuItemBlur_}>
        <div className="vop-menuitem-label">
          <span>{ item.name }</span>
        </div>
        <div className="vop-menuitem-content">
          <span>{ item.currValue }</span>
        </div>
      </div>
    );

    return (
      <div className="vop-fcc-menu" style="display: none;">
        <div className="vop-panel-header">
          <button className="vop-panel-title" onClick={this.onMenuBackClick_}>Fcc</button>
        </div>
        <div className="vop-panel-menu">
          { menuitems }
        </div>
      </div>
    );
  }

  onMenuBackClick(e) {
    this.main.settingMenuUIData.currMenu = 'settings_menu';
    this.evEmitter.emit(Events.POPUPMENU_CHANGE, {
      menu: this.main.settingMenuUIData.currMenu
    });
  }

  onMenuItemClick(e) {
    this.main.onFccMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    if (this.main.settingMenuUIData.currMenu !== 'audio_track_menu') {
      return;
    }
    this.main.onFccMenuItemBlur(e);
  }

  onPopupMenuChange(e) {
    if (e.menu === 'fcc_menu') {
      this.vopFccMenu.style.display = 'block';
      let v = this.vopFccMenu.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    } else {
      this.vopFccMenu.style.display = 'none';
    }
  }
}

export default UIFccMenu;




