import { h } from 'preact';
import Preact from 'preact';

class UISubtitlesMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);
  }

  componentDidMount(e) {}

  componentDidUpdate() {
    if (this.main.settingMenuUIData.currMenu === 'subtitles_menu') {
      let v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    if (this.main.settingMenuUIData.currMenu === 'subtitles_menu') {
      const menuitems = this.main.settingMenuUIData.subtitleTracks.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitem"
        aria-checked={this.main.settingMenuUIData.currSubtitleId === item.id ? 'true' : 'false'}
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
        <div>
          <div className="vop-panel-header">
            <button className="vop-panel-title" onClick={this.onMenuBackClick_}>Subtitles</button>
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

  onMenuBackClick() {
    printLog('+onMenuBack');
    this.main.onSubtitleMenuBack();
  }

  onMenuItemClick(e) {
    printLog('+onMenuItemClick');
    this.main.onSubtitleMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    printLog('+onMenuItemBlur');
    if (this.main.settingMenuUIData.currMenu !== 'subtitles_menu') {
      return;
    }
    
    this.main.onSubtitleMenuItemBlur(e);
  }
}

export default UISubtitlesMenu;