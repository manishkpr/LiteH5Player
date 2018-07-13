import { h } from 'preact';
import Preact from 'preact';


class UIAudioTrackMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);
  }

  componentDidUpdate() {
    if (this.main.settingMenuUIData.currMenu === 'audio_track_menu') {
      let v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    //myPrintLog('+render, UIAudioTrackMenu: ' + this.main.settingMenuUIData.currMenu);
    let ret = (<div></div>);

    if (this.main.settingMenuUIData.currMenu === 'audio_track_menu') {
      const menuitems = this.main.settingMenuUIData.audioTrackList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitemradio"
          aria-checked={this.main.settingMenuUIData.currAudioTrackId === item.id}
          data-id={item.id} onClick={this.onMenuItemClick_}
          tabIndex="0" onBlur={this.onMenuItemBlur_}>
          <div className="vop-menuitem-label">
            <span>{ item.lang }</span>
          </div>
        </div>
      );

      ret = (
        <div>
          <div className="vop-panel-header">
            <button className="vop-panel-title" onClick={this.onMenuBackClick_}>AudioTrack</button>
          </div>
          <div className="vop-panel-menu">
            { menuitems }
          </div>
        </div>
      );
    }

    return ret;
  }

  onMenuBackClick(e) {
    this.main.onAudioTrackMenuBack(e);
  }

  onMenuItemClick(e) {
    this.main.onAudioTrackMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    if (this.main.settingMenuUIData.currMenu !== 'fcc_menu') {
      return;
    }
    this.main.onAudioTrackMenuItemBlur(e);
  }
}

export default UIAudioTrackMenu;




