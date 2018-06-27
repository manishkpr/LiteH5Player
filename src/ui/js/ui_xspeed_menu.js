import React from 'react';
import ReactDOM from 'react-dom';

class UIXSpeedMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (this.props.state.settingMenuUIData.currMenu === 'xspeed_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    console.log('+render, UIXSpeedMenu: ' + this.props.state.settingMenuUIData.currMenu);

    if (this.props.state.settingMenuUIData.currMenu === 'xspeed_menu') {
      const menuitems = this.props.state.settingMenuUIData.xspeedList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitemradio" aria-checked={this.props.state.settingMenuUIData.currSpeed === item.id}
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
    this.props.onXSpeedMenuBack(e);
  }
  
  onMenuItemClick(e) {
    this.props.onXSpeedMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    this.props.onXSpeedMenuItemBlur(e);
  }
}

export default UIXSpeedMenu;


