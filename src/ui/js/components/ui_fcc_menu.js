import { h } from 'preact';
import Preact from 'preact'; 

class UIFccMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);
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
      return (<div></div>);
    }
  }

  onMenuBackClick(e) {
    this.main.onFccMenuBack(e);
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
}

export default UIFccMenu;




