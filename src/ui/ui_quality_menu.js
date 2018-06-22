import React from 'react';
import ReactDOM from 'react-dom';

class UIQualityMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(e) {
    console.log('+componentDidMount');
  }

  componentDidUpdate() {
    if (this.props.state.settingMenuUIData.currMenu === 'quality_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    console.log('+render, UIQualityMenu: ' + this.props.state.settingMenuUIData.currMenu);

    if (this.props.state.settingMenuUIData.currMenu === 'quality_menu') {
      const menuitems = this.props.state.settingMenuUIData.qualityList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitemradio" aria-checked={this.props.state.settingMenuUIData.currQualityId === item.id}
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
    this.props.onQualityMenuBack(e);
  }

  onQualityMenuItemClick(e) {
    this.props.onQualityMenuItemClick(e);
  }

  onQualityMenuItemBlur(e) {
    this.props.onQualityMenuItemBlur(e);
  }
}

export default UIQualityMenu;





