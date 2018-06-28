import React from 'react';
import ReactDOM from 'react-dom';

class UIAudioTrackMenu extends React.Component {
  constructor(props) {
    super(props);
    this.main = this.props.main;
  }

  componentDidUpdate() {
    if (this.main.state.settingMenuUIData.currMenu === 'audio_track_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    console.log('+render, UIAudioTrackMenu: ' + this.main.state.settingMenuUIData.currMenu);

    if (this.main.state.settingMenuUIData.currMenu === 'audio_track_menu') {
      const menuitems = this.main.state.settingMenuUIData.audioTrackList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitemradio" aria-checked={this.main.state.settingMenuUIData.currAudioTrackId === item.id}
          data-id={item.id} onClick={this.onAudioTrackMenuItemClick.bind(this)}
          tabIndex="0" onBlur={this.onAudioTrackMenuItemBlur.bind(this)}>
          <div className="vop-menuitem-label">
            <span>{ item.lang }</span>
          </div>
        </div>
      );

      return (
        <div>
          <div className="vop-panel-header">
            <button className="vop-panel-title" onClick={this.onAudioTrackMenuBack.bind(this)}>AudioTrack</button>
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

  onAudioTrackMenuBack(e) {
    this.main.onAudioTrackMenuBack(e);
  }

  onAudioTrackMenuItemClick(e) {
    this.main.onAudioTrackMenuItemClick(e);
  }

  onAudioTrackMenuItemBlur(e) {
    this.main.onAudioTrackMenuItemBlur(e);
  }
}

export default UIAudioTrackMenu;




