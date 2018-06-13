import React from 'react';
import ReactDOM from 'react-dom';

class UIFccMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (this.props.state.settingMenuUIData.currMenu === 'fcc_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    console.log('+render, UIFccMenu');

    if (this.props.state.settingMenuUIData.currMenu === 'fcc_menu') {
      const menuitems = this.props.state.settingMenuUIData.fccPropertyList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitem" aria-haspopup="true"
          data-id={item.name} onClick={this.onMenuItemClick.bind(this)}
          tabIndex="0" onBlur={this.onMenuItemBlur.bind(this)}>
          <div className="vop-menuitem-label">
            <span>{ item.name }</span>
          </div>
          <div className="vop-menuitem-content">
            <span>{ item.currValue }</span>
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
      return (<div></div>);
    }
  }

  onMenuBack(e) {
    this.props.onFccMenuBack(e);
  }

  onMenuItemClick(e) {
    this.props.onFccMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    this.props.onFccMenuItemBlur(e);
  }
}

export default UIFccMenu;




