import { h } from 'preact';
import Preact from 'preact';

class UISettingsMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  componentDidMount(e) {
    
  }

  componentDidUpdate() {
    if (this.main.settingMenuUIData.currMenu === 'main_menu') {
      let v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    if (this.main.settingMenuUIData.currMenu === 'main_menu') {
      const menuitems = this.main.settingMenuUIData.mainList.map((item, index) =>
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
    this.main.onMainMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    this.main.onMainMenuItemBlur(e);
  }
}


export default UISettingsMenu;




