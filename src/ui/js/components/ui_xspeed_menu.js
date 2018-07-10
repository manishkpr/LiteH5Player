import { h } from 'preact';
import Preact from 'preact';

class UIXSpeedMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);
  }

  componentDidUpdate() {
    if (this.main.state.settingMenuUIData.currMenu === 'xspeed_menu') {
      let v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    //myPrintLog('+render, UIXSpeedMenu: ' + this.main.state.settingMenuUIData.currMenu);

    if (this.main.state.settingMenuUIData.currMenu === 'xspeed_menu') {
      const menuitems = this.main.state.settingMenuUIData.xspeedList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitemradio" aria-checked={this.main.state.settingMenuUIData.currSpeedId === item.id}
          data-id={item.id} onClick={this.onMenuItemClick_}
          tabIndex="0" onBlur={this.onMenuItemBlur_}>
          <div className="vop-menuitem-label">
            <span>{ item.value }</span>
          </div>
        </div>
      );

      return (
        <div>
          <div className="vop-panel-header">
            <button className="vop-panel-title" onClick={this.onMenuBackClick_}>XSpeed</button>
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
    this.main.onXSpeedMenuBack(e);
  }
  
  onMenuItemClick(e) {
    this.main.onXSpeedMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    if (this.main.settingMenuUIData.currMenu !== 'xspeed_menu') {
      return;
    }
    this.main.onXSpeedMenuItemBlur(e);
  }
}

export default UIXSpeedMenu;


