import React from 'react';
import ReactDOM from 'react-dom';

class UIXSpeedMenu extends React.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  componentDidUpdate() {
    if (this.main.state.settingMenuUIData.currMenu === 'xspeed_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    console.log('+render, UIXSpeedMenu: ' + this.main.state.settingMenuUIData.currMenu);

    if (this.main.state.settingMenuUIData.currMenu === 'xspeed_menu') {
      const menuitems = this.main.state.settingMenuUIData.xspeedList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitemradio" aria-checked={this.main.state.settingMenuUIData.currSpeed === item.id}
          data-id={item.id} onClick={this.onMenuItemClick.bind(this)}
          tabIndex="0" onBlur={this.onMenuItemBlur.bind(this)}>
          <div className="vop-menuitem-label">
            <span>{ item.value }</span>
          </div>
        </div>
      );

      return (
        <div>
          <div className="vop-panel-header">
            <button className="vop-panel-title" onClick={this.onMenuBack.bind(this)}>XSpeed</button>
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
    this.main.onXSpeedMenuBack(e);
  }
  
  onMenuItemClick(e) {
    this.main.onXSpeedMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    this.main.onXSpeedMenuItemBlur(e);
  }
}

export default UIXSpeedMenu;


