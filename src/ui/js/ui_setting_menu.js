import React from 'react';
import ReactDOM from 'react-dom';

class UISettingMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(e) {
    
  }

  componentDidUpdate() {
    if (this.props.state.settingMenuUIData.currMenu === 'main_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    if (this.props.state.settingMenuUIData.currMenu === 'main_menu') {
      const menuitems = this.props.state.settingMenuUIData.mainList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitem" aria-haspopup="true"
          data-id={item.id} onClick={this.onMenuItemClick.bind(this)}
          tabIndex="0" onBlur={this.onMenuItemBlur.bind(this)}>
          <div className="vop-menuitem-label">
            { item.text }
          </div>
          <div className="vop-menuitem-content">
            <span className="vop-menuitem-content-text">360p</span>
          </div>
        </div>
      );

      return (
        <div className="vop-panel-menu">
          { menuitems }
        </div>
      );
    } else {
      return (<div></div>);
    }
  }

  onMenuItemClick(e) {
    this.props.onMainMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    this.props.onMainMenuItemBlur(e);
  }
}


export default UISettingMenu;




