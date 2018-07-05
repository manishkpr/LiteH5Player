import { h, Component } from 'preact';

import Events from '../events';
import ID from '../id';

class UISubtitlesMenu extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.evEmitter = this.main.evEmitter;

    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);

    this.onTrackAdded = this.onTrackAdded.bind(this);
    this.player.on(oldmtn.Events.TRACK_ADDED, this.onTrackAdded);
    //
    this.onPopupMenuChange = this.onPopupMenuChange.bind(this);
    this.evEmitter.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange);

    this.subtitlesData = {
      // subtitle menu
      subtitleTracks: [{
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
      }, {
        id: '7',
        lang: 'Thai'
      }],
      currSubtitleId: '2'
    }
    this.state = {
      subtitlesData: this.subtitlesData
    }
  }

  componentDidMount(e) {
    this.vopSubtitlesMenu = document.querySelector('.vop-subtitles-menu');
  }

  render() {
    const { subtitlesData } = this.state;

    const menuitems = subtitlesData.subtitleTracks.map((item, index) =>
      <div key={index} className="vop-menuitem" role="menuitem"
        aria-checked={subtitlesData.currSubtitleId === item.id ? 'true' : 'false'}
        data-id={item.id} onClick={this.onMenuItemClick_}
        tabIndex="0" onBlur={this.onMenuItemBlur_}>
          <div className="vop-menuitem-label">
            { item.lang }
          </div>
          <div className="vop-menuitem-content">
            <div className="vop-menuitem-toggle-checkbox">
            </div>
          </div>
        </div>
    );

    return (
      <div className="vop-subtitles-menu" style="display: none;">
        <div className="vop-panel-menu">
          { menuitems }
        </div>
      </div>
    );
  }

  onMenuBackClick() {
    myPrintLog('+onMenuBack');
    this.main.onSubtitleMenuBack();
  }

  onMenuItemClick(e) {
    myPrintLog('+onMenuItemClick');
    e.stopPropagation();
    
    let id = e.currentTarget.dataset.id;
    if (this.subtitlesData.currSubtitleId === id) {
      this.subtitlesData.currSubtitleId = '';
    } else {
      this.subtitlesData.currSubtitleId = id;
    }
    this.setState({subtitlesData: this.subtitlesData});
  }

  onMenuItemBlur(e) {
    myPrintLog('+onMenuItemBlur');
    if (this.main.settingMenuUIData.currMenu !== 'subtitles_menu') {
      return;
    }

    if (e.relatedTarget) {
      if (e.relatedTarget.dataset.id === ID.SUBTITLES_BUTTON) {
        if (this.main.settingMenuUIData.currMenu === 'settings_menu') {
          // do nothing
        }
      }
    } else {
      this.main.settingMenuUIData.currMenu = 'none';
      this.evEmitter.emit(Events.POPUPMENU_CHANGE, {
        menu: this.main.settingMenuUIData.currMenu
      });
    }
  }

  onPopupMenuChange(e) {
    if (e.menu === 'subtitles_menu') {
      this.vopSubtitlesMenu.style.display = 'block';
      let v = this.vopSubtitlesMenu.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    } else {
      this.vopSubtitlesMenu.style.display = 'none';
    }
  }

  onTrackAdded(e) {
    let track = e.track;
    // BD
    track.id = '8';
    // ED
    this.subtitlesData.subtitleTracks.push(track);
    this.setState({
      subtitlesData: this.subtitlesData
    });
  }
}

export default UISubtitlesMenu;




