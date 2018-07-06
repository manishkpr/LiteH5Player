import { h } from 'preact';
import Preact from 'preact';

class UIQualityMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  componentDidMount(e) {
  }

  componentDidUpdate() {
    if (this.main.settingMenuUIData.currMenu === 'quality_menu') {
      let v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    printLog('+render, UIQualityMenu: ' + this.main.settingMenuUIData.currMenu);

    if (this.main.settingMenuUIData.currMenu === 'quality_menu') {
      const menuitems = this.main.settingMenuUIData.qualityList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitemradio" aria-checked={this.main.settingMenuUIData.currQualityId === item.id}
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





