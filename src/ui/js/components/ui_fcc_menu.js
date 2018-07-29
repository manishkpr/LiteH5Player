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
    this.onFccPropertyValueChange = this.onFccPropertyValueChange.bind(this);
    this.evEmitter.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange);
    this.evEmitter.on(Events.FCC_PROPERTY_VALUE_CHANGE, this.onFccPropertyValueChange);
    
    this.fccData = {
      currFccPropertyName: 'background_color', // only valid when currMenu is 'fcc_property_menu'.
      isEnableFCC: true,
      fccPropertyList: [{
        // white/black(default)/red/green/blue/yellow/magenta/cyan
        name: 'background_color',
        values: ['white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
        currValue: 'black'
      }, {
        name: 'background_opacity',
        values: ['0%', '25%', '50%', '75%', '100%'],
        currValue: '100%'
      }, {
        // white/black(default)/red/green/blue/yellow/magenta/cyan
        name: 'font_color',
        values: ['white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
        currValue: 'black'
      }, {
        name: 'font_opacity',
        values: ['0%', '25%', '50%', '75%', '100%'],
        currValue: '100%'
      }, {
        // Arial(default)/Courier/Times New Roman/Helvetica/Dom/Coronet/Gothic
        name: 'font_family',
        values: ['Arial', 'Courier', 'Times New Roman', 'Helvetica', 'Dom', 'Coronet', 'Gothic'],
        currValue: 'Arial'
      }, {
        // none/dropshadow/raised(default)/depressed/uniform
        name: 'font_edge_type',
        values: ['none', 'leftDropShadow', 'rightDropShadow', 'raised', 'depressed', 'uniform'],
        currValue: 'none'
      }, {
        // white/black/red/green/blue(default)/yellow/magenta/cyan
        name: 'font_edge_color',
        values: ['white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
        currValue: 'black'
      }, {
        name: 'font_edge_opacity',
        values: ['0%', '25%', '50%', '75%', '100%'],
        currValue: '100%'
      }, {
        name: 'font_size',
        values: ['50%', '75%', '100%', '150%', '200%', '300%', '400%'],
        currValue: '100%'
      }, {
        name: 'font_bold',
        values: ['true', 'false'],
        currValue: 'false'
      }, {
        name: 'font_underline',
        values: ['true', 'false'],
        currValue: 'false'
      }, {
        name: 'font_italic',
        values: ['true', 'false'],
        currValue: 'false'
      }, {
        // white/black/red/green/blue(default)/yellow/magenta/cyan
        name: 'window_color',
        values: ['white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
        currValue: 'green'
      }, {
        name: 'window_color_opacity',
        values: ['0%', '25%', '50%', '75%', '100%'],
        currValue: '50%'
      }, {
        name: 'bounding_box',
        values: ['Left', 'Top', 'Right', 'Bottom'],
        currValue: 'Left'
      }, {
        name: 'horizontal_position',
        values: ['left', 'center', 'right'],
        currValue: 'left'
      }, {
        name: 'vertical_position',
        values: ['top', 'middle', 'bottom'],
        currValue: 'top'
      }]
    };
    this.state = {
      fccData: this.fccData
    }
  }

  componentDidMount() {
    this.vopFccMenu = document.querySelector('.vop-fcc-menu');
  }

  render() {
    myPrintLog('+render, UIFccMenu: ' + this.main.settingMenuUIData.currMenu);
    const { fccData } = this.state;

    const menuitems = fccData.fccPropertyList.map((item, index) =>
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
    myPrintLog('+onFccMenuItemClick, e.currentTarget.dataset.id: ' + e.currentTarget.dataset.id);

    this.main.settingMenuUIData.currMenu = 'fcc_property_menu';

    let currFccPropertyName = e.currentTarget.dataset.id;
    let fccProperty;
    for (let i = 0; i < this.fccData.fccPropertyList.length; i ++) {
      fccProperty = this.fccData.fccPropertyList[i];
      if (currFccPropertyName === fccProperty.name) {
        break;
      }
    }
    this.evEmitter.emit(Events.POPUPMENU_CHANGE, {menu: this.main.settingMenuUIData.currMenu, fccProperty: fccProperty});
  }

  onMenuItemBlur(e) {
    if (this.main.settingMenuUIData.currMenu !== 'fcc_menu') {
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

  onFccPropertyValueChange(e) {
    let fccProperty = e.fccProperty;
    for (let i = 0; i < this.fccData.fccPropertyList.length; i ++) {
      let tmpFccProperty = this.fccData.fccPropertyList[i];
      if (tmpFccProperty.name === fccProperty.name) {
        this.fccData.fccPropertyList[i] = fccProperty;
        this.setState({fccData: this.fccData});
        break;
      }
    }
  }
}

export default UIFccMenu;




