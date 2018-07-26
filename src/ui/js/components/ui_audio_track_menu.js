import { h, Component } from 'preact';
import Events from '../events';
import ID from '../id';

class UIAudioTrackMenu extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.evEmitter = this.main.evEmitter;

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);

    this.onPopupMenuChange = this.onPopupMenuChange.bind(this);
    this.evEmitter.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange);

    this.audioTrackData = {
      audioTrackList: [{
        id: '1',
        lang: 'English'
      }, {
        id: '2',
        lang: 'French'
      }, {
        id: '3',
        lang: 'Chinese'
      }, {
        id: '4',
        lang: 'Dutch'
      }, {
        id: '5',
        lang: 'Spanish'
      }, {
        id: '6',
        lang: 'Korean'
      }],
      currAudioTrackId: '1'
    };
    this.state = {
      audioTrackData: this.audioTrackData
    };
  }

  componentDidMount() {
    this.vopAudioTrackMenu = document.querySelector('.vop-audio-track-menu');
  }

  render() {
    const { audioTrackData } = this.state;

    const menuitems = audioTrackData.audioTrackList.map((item, index) =>
      <div key={index} className="vop-menuitem" role="menuitemradio"
          aria-checked={audioTrackData.currAudioTrackId === item.id}
          data-id={item.id} onClick={this.onMenuItemClick_}
          tabIndex="0" onBlur={this.onMenuItemBlur_}>
        <div className="vop-menuitem-label">
          <span>{ item.lang }</span>
        </div>
      </div>
    );

    return (
      <div className="vop-audio-track-menu" style="display: none;">
        <div className="vop-panel-header">
          <button className="vop-panel-title" onClick={this.onMenuBackClick_}>AudioTrack</button>
        </div>
        <div className="vop-panel-menu">
          { menuitems }
        </div>
      </div>
    );
  }

  onMenuBackClick(e) {
    this.main.settingMenuUIData.currMenu = 'settings_menu';
    this.evEmitter.emit(Events.POPUPMENU_CHANGE, {
      menu: this.main.settingMenuUIData.currMenu
    });
  }

  onMenuItemClick(e) {
    let nextFocus = e.currentTarget;
    this.audioTrackData.currAudioTrackId = nextFocus.dataset.id;
    this.setState({audioTrackData: this.audioTrackData});
  }

  onMenuItemBlur(e) {
    if (this.main.settingMenuUIData.currMenu !== 'fcc_menu') {
      return;
    }
    this.main.onAudioTrackMenuItemBlur(e);
  }

  onPopupMenuChange(e) {
    if (e.menu === 'audio_track_menu') {
      this.vopAudioTrackMenu.style.display = 'block';
      let v = this.vopAudioTrackMenu.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    } else {
      this.vopAudioTrackMenu.style.display = 'none';
    }
  }
}

export default UIAudioTrackMenu;




