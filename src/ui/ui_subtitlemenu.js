import React from 'react';
import ReactDOM from 'react-dom';


class UISubtitleMenu extends React.Component {
  constructor(props) {
    super(props);

    this.uiData = props.uiData;
  }

  onHeaderClick() {
    console.log('+onHeaderClick');
  }

  onMenuItemClick(e) {
    console.log(`+onMenuItemClick11, id: ${e.currentTarget.dataset.id}`);
  }

  onMenuItemBlur(e) {
    console.log('+onMenuItemBlur');
  }

  

  render() {
    const menuitems = this.uiData.subtitleTracks.map((track, index) =>
      <div key={index} className="vop-menuitem" role="menuitem" aria-checked={this.uiData.currSubtitleId === track.id ? 'true' : 'false'}
      tabIndex="0" onBlur={this.onMenuItemBlur.bind(this)} onClick={this.onMenuItemClick.bind(this)} data-id={track.id}>
        <div className="vop-menuitem-label">
          {track.lang}
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
          <button className="vop-panel-title" onClick={this.onHeaderClick.bind(this)}>Subtitles</button>
        </div>
        <div className="vop-panel-menu">
          {menuitems}
        </div>
      </div>
    );
  }
}

export default UISubtitleMenu;
