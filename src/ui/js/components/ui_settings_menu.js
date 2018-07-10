import {
  h
} from 'preact';
import Preact from 'preact';

class UISettingsMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;

    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);
  }

  componentDidMount(e) {

  }

  componentDidUpdate() {
    //myPrintLog(`UISettingsMenu, componentDidUpdate, ${this.main.settingMenuUIData.currMenu}`);
    if (this.main.settingMenuUIData.currMenu === 'settings_menu') {
      let v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    //myPrintLog(`UISettingsMenu, render, ${this.main.settingMenuUIData.currMenu}`);
    if (this.main.settingMenuUIData.currMenu === 'settings_menu') {
      const menuitems = this.main.settingMenuUIData.settingsList.map(function(item, index) {
        let currValue = '';
        switch (item.id) {
          case '1':
          for (let i = 0; i < this.main.settingMenuUIData.qualityList.length; i ++) {
            let currItem = this.main.settingMenuUIData.qualityList[i];
            if (currItem.id === this.main.settingMenuUIData.currQualityId) {
              currValue = currItem.bitrate;
            }
          }
          break;
          case '2':
          for (let i = 0; i < this.main.settingMenuUIData.audioTrackList.length; i ++) {
            let currItem = this.main.settingMenuUIData.audioTrackList[i];
            if (currItem.id === this.main.settingMenuUIData.currAudioTrackId) {
              currValue = currItem.lang;
            }
          }
          break;
          case '3':
          // for (let i = 0; i < this.main.settingMenuUIData.qualityList.length; i ++) {
          //   let currItem = this.main.settingMenuUIData.qualityList[i];
          //   if (currItem.id === this.main.settingMenuUIData.currQualityId) {
          //     currValue = currItem.bitrate;
          //   }
          // }
          break;
          case '4':
          for (let i = 0; i < this.main.settingMenuUIData.xspeedList.length; i ++) {
            let currItem = this.main.settingMenuUIData.xspeedList[i];
            if (currItem.id === this.main.settingMenuUIData.currSpeedId) {
              currValue = currItem.value;
            }
          }
          break;
        }

        return (
          <div key={index} className="vop-menuitem" role="menuitem" aria-haspopup="true"
            data-id={item.id} onClick={this.onMenuItemClick_}
            tabIndex="0" onBlur={this.onMenuItemBlur_}>
            <div className="vop-menuitem-label">
              { item.text }
            </div>
            <div className="vop-menuitem-content">
              <span className="vop-menuitem-content-text">{currValue}</span>
            </div>
          </div>
        );
      }.bind(this));

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
    if (this.main.settingMenuUIData.currMenu !== 'settings_menu') {
      return;
    }

    this.main.onMainMenuItemBlur(e);
  }


}

export default UISettingsMenu;