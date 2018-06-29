import React from 'react';


class UIFccPropertyMenu extends React.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  componentDidUpdate() {
    if (this.main.state.settingMenuUIData.currMenu === 'fcc_property_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    let currFccPropertyName = this.main.state.settingMenuUIData.currFccPropertyName;

    if (this.main.state.settingMenuUIData.currMenu === 'fcc_property_menu') {
      let fccProperty = null;
      for (let i = 0; i < this.main.state.settingMenuUIData.fccPropertyList.length; i++) {
        let fccPropertyTmp = this.main.state.settingMenuUIData.fccPropertyList[i];
        if (fccPropertyTmp.name === currFccPropertyName) {
          fccProperty = fccPropertyTmp;
          break;
        }
      }
      if (fccProperty) {
        const menuitems = fccProperty.values.map((value, index) =>
          <div key={index} className="vop-menuitem" role="menuitemradio" aria-checked={fccProperty.currValue === value}
              onClick={this.onMenuItemClick.bind(this)} data-id={value}
              tabIndex="0" onBlur={this.onMenuItemBlur.bind(this)}>
            <div className="vop-menuitem-label">
              <span>{ value }</span>
            </div>
          </div>
        );

        return (
          <div>
            <div className="vop-panel-header">
              <button className="vop-panel-title" onClick={this.onMenuBack.bind(this)}>Fcc</button>
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

  onMenuBack(e) {
    this.main.onFccPropertyMenuBack(e);
  }

  onMenuItemClick(e) {
    this.main.onFccPropertyMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    this.main.onFccPropertyMenuItemBlur(e);
  }
}

export default UIFccPropertyMenu;