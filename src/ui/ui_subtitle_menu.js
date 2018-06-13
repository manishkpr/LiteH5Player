import React from 'react';
import ReactDOM from 'react-dom';

class UISubtitleMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(e) {}

  componentDidUpdate() {
    if (this.props.state.settingMenuUIData.currMenu === 'main_menu') {
      var v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    }
  }

  render() {
    if (this.props.state.subtitlesMenuUIData.currMenu === 'none') {
      return (<div></div>);
    } else {
      const menuitems = this.props.state.subtitlesMenuUIData.subtitleTracks.map((item, index) =>
        <div key={index} className="vop-menuitem" role="menuitem" aria-checked={this.props.state.subtitlesMenuUIData.currSubtitleId === item.id ? 'true' : 'false'}
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
    }
  }

  onMenuBack() {
    console.log('+onMenuBack');
    this.props.onSubtitleMenuBack();
  }

  onMenuItemClick(e) {
    console.log('+onMenuItemClick');
    this.props.onSubtitleMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    console.log('+onMenuItemBlur');
    this.props.onSubtitleMenuItemBlur(e);
  }
}

export default UISubtitleMenu;