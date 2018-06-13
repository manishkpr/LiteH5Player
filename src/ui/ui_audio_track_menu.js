import React from 'react';
import ReactDOM from 'react-dom';

class UIAudioTrackMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (this.props.state.settingMenuUIData.currMenu === 'audio_track_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    console.log('+render, UIAudioTrackMenu');

    if (this.props.state.settingMenuUIData.currMenu === 'audio_track_menu') {
      const menuitems = this.props.state.settingMenuUIData.audioTrackList.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitemradio" aria-checked={this.props.state.settingMenuUIData.currAudioTrackId === item.id}
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
    this.props.onAudioTrackMenuBack(e);
  }

  onAudioTrackMenuItemClick(e) {
    this.props.onAudioTrackMenuItemClick(e);
  }

  onAudioTrackMenuItemBlur(e) {
    this.props.onAudioTrackMenuItemBlur(e);
  }
}

export default UIAudioTrackMenu;




