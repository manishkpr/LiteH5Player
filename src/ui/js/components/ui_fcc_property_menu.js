import { h } from 'preact';
import Preact from 'preact';

class UIFccPropertyMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);
  }

  componentDidUpdate() {
    if (this.main.settingMenuUIData.currMenu === 'fcc_property_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    let currFccPropertyName = this.main.settingMenuUIData.currFccPropertyName;

    if (this.main.settingMenuUIData.currMenu === 'fcc_property_menu') {
      let fccProperty = null;
      for (let i = 0; i < this.main.settingMenuUIData.fccPropertyList.length; i++) {
        let fccPropertyTmp = this.main.settingMenuUIData.fccPropertyList[i];
        if (fccPropertyTmp.name === currFccPropertyName) {
          fccProperty = fccPropertyTmp;
          break;
        }
      }
      if (fccProperty) {
        const menuitems = fccProperty.values.map((value, index) =>
          <div key={index} className="vop-menuitem" role="menuitemradio" aria-checked={fccProperty.currValue === value}
              onClick={this.onMenuItemClick_} data-id={value}
              tabIndex="0" onBlur={this.onMenuItemBlur_}>
            <div className="vop-menuitem-label">
              <span>{ value }</span>
            </div>
          </div>
        );

        return (
          <div>
            <div className="vop-panel-header">
              <button className="vop-panel-title" onClick={this.onMenuBackClick_}>Fcc</button>
            </div>
            <div className="vop-panel-menu">
              { menuitems }
            </div>
          </div>
        );
      } else {
        return (
          <div></div>
        );
      }
    } else {
      return (
        <div></div>
      );
    }
  }

  onMenuBackClick(e) {
    this.main.onFccPropertyMenuBack(e);
  }

  onMenuItemClick(e) {
    this.main.onFccPropertyMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    if (this.main.settingMenuUIData.currMenu !== 'fcc_property_menu') {
      return;
    }
    this.main.onFccPropertyMenuItemBlur(e);
  }
}

export default UIFccPropertyMenu;