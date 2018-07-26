import { h, Component } from 'preact';

import Events from '../events';
import ID from '../id';


class UIFccPropertyMenu extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.evEmitter = this.main.evEmitter;

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);

    this.onPopupMenuChange = this.onPopupMenuChange.bind(this);
    this.evEmitter.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange);

    this.fccProperty = null;
    this.state = {
      fccProperty: this.fccProperty
    };
  }

  componentDidUpdate() {
    let v = document.querySelector('.vop-fcc-property-menu');
    if (v) {
      let item = v.querySelector('.vop-menuitem');
      if (item) {
        item.focus();
      }
    }
  }

  render() {
    const { fccProperty } = this.state;

    if (fccProperty) {
      const menuitems = fccProperty.values.map((value, index) =>
        <div key={index} className="vop-menuitem" role="menuitemradio"
          aria-checked={fccProperty.currValue === value}
          onClick={this.onMenuItemClick_} data-id={value}
          tabIndex="0" onBlur={this.onMenuItemBlur_}>
          <div className="vop-menuitem-label">
            <span>{ value }</span>
          </div>
        </div>
      );

      return (
        <div className="vop-fcc-property-menu">
          <div className="vop-panel-header">
            <button className="vop-panel-title" onClick={this.onMenuBackClick_}>Fcc</button>
          </div>
          <div className="vop-panel-menu">
            { menuitems }
          </div>
        </div>
      );
    } else {
      return (<div></div>);
    }
  }

  onMenuBackClick(e) {
    this.main.settingMenuUIData.currMenu = 'fcc_menu';
    this.evEmitter.emit(Events.POPUPMENU_CHANGE, {menu: this.main.settingMenuUIData.currMenu});
  }

  onMenuItemClick(e) {
    let currValue = e.currentTarget.dataset.id;
    this.fccProperty.currValue = currValue;
    this.setState({fccProperty: this.fccProperty});

    this.evEmitter.emit(Events.FCC_PROPERTY_VALUE_CHANGE, {fccProperty: this.fccProperty});
  }

  onMenuItemBlur(e) {
    if (this.main.settingMenuUIData.currMenu !== 'fcc_property_menu') {
      return;
    }

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
      this.evEmitter.emit(Events.POPUPMENU_CHANGE, { menu: this.main.settingMenuUIData.currMenu });
    }
  }

  onPopupMenuChange(e) {
    if (e.menu === 'fcc_property_menu') {
      this.fccProperty = e.fccProperty;
    } else {
      this.fccProperty = null;
    }
    this.setState({fccProperty: this.fccProperty});
  }
}

export default UIFccPropertyMenu;