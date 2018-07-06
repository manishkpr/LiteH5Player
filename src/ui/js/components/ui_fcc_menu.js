import { h } from 'preact';
import Preact from 'preact'; 

class UIFccMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  componentDidUpdate() {
    if (this.main.settingMenuUIData.currMenu === 'fcc_menu') {
      let v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    //printLog('+render, UIFccMenu: ' + this.main.settingMenuUIData.currMenu);

    if (this.main.settingMenuUIData.currMenu === 'fcc_menu') {
      const menuitems = this.main.settingMenuUIData.fccPropertyList.map((item, index) =>
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
    this.main.onFccMenuBack(e);
  }

  onMenuItemClick(e) {
    this.main.onFccMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    this.main.onFccMenuItemBlur(e);
  }
}

export default UIFccMenu;




