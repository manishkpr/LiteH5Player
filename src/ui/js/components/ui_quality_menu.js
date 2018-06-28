import React from 'react';
import ReactDOM from 'react-dom';

class UIQualityMenu extends React.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  componentDidMount(e) {
    console.log('+componentDidMount');
  }

  componentDidUpdate() {
    if (this.main.state.settingMenuUIData.currMenu === 'quality_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    console.log('+render, UIQualityMenu: ' + this.main.state.settingMenuUIData.currMenu);

    if (this.main.state.settingMenuUIData.currMenu === 'quality_menu') {
      const menuitems = this.main.state.settingMenuUIData.qualityList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitemradio" aria-checked={this.main.state.settingMenuUIData.currQualityId === item.id}
          data-id={item.id} onClick={this.onQualityMenuItemClick.bind(this)}
          tabIndex="0" onBlur={this.onQualityMenuItemBlur.bind(this)}>
          <div className="vop-menuitem-label">
            <span>{ item.bitrate }</span>
          </div>
        </div>
      );

      return (
        <div>
          <div className="vop-panel-header">
            <button className="vop-panel-title" onClick={this.onQualityMenuBack.bind(this)}>Quality</button>
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

  onQualityMenuBack(e) {
    this.main.onQualityMenuBack(e);
  }

  onQualityMenuItemClick(e) {
    this.main.onQualityMenuItemClick(e);
  }

  onQualityMenuItemBlur(e) {
    this.main.onQualityMenuItemBlur(e);
  }
}

export default UIQualityMenu;





