import { h } from 'preact';
import Preact from 'preact';

class UISubtitlesMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  componentDidMount(e) {}

  componentDidUpdate() {
    if (this.main.state.settingMenuUIData.currMenu === 'subtitle_menu') {
      let v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    if (this.main.state.settingMenuUIData.currMenu === 'subtitle_menu') {
      const menuitems = this.main.state.settingMenuUIData.subtitleTracks.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitem" aria-checked={this.main.state.settingMenuUIData.currSubtitleId === item.id ? 'true' : 'false'}
        data-id={item.id} onClick={this.onMenuItemClick.bind(this)}
        tabIndex="0" onBlur={this.onMenuItemBlur.bind(this)}>
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
            <button className="vop-panel-title" onClick={this.onMenuBack.bind(this)}>Subtitles</button>
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

  onMenuBack() {
    console.log('+onMenuBack');
    this.main.onSubtitleMenuBack();
  }

  onMenuItemClick(e) {
    console.log('+onMenuItemClick');
    this.main.onSubtitleMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    console.log('+onMenuItemBlur');
    this.main.onSubtitleMenuItemBlur(e);
  }
}

export default UISubtitlesMenu;