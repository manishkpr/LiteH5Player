import { h, Component } from 'preact';

import Events from '../events';
import ID from '../id';

class UISubtitlesMenu extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.evEmitter = this.main.evEmitter;

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);

    this.onPopupMenuChange = this.onPopupMenuChange.bind(this);
    this.evEmitter.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange);
  }

  componentDidMount(e) {
    this.vopSubtitlesMenu = document.querySelector('.vop-subtitle-menu');
  }

  render() {
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
      <div className="vop-subtitle-menu" style="display: none;">
        <div className="vop-panel-header">
          <button className="vop-panel-title" onClick={this.onMenuBackClick_}>Subtitles</button>
        </div>
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
    this.main.onSubtitleMenuItemClick(e);
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
      let v = document.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    } else {
      this.vopSubtitlesMenu.style.display = 'none';
    }
  }
}

export default UISubtitlesMenu;





// old
// class UISubtitlesMenu extends Preact.Component {
//   constructor(props) {
//     super(props);

//     this.main = this.props.main;

//     this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
//     this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
//     this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);
//   }

//   componentDidMount(e) {}

//   componentDidUpdate() {
//     if (this.main.settingMenuUIData.currMenu === 'subtitles_menu') {
//       let v = document.querySelector('.vop-menuitem');
//       if (v) {
//         v.focus();
//       }
//     }
//   }

//   render() {
//     let ret = (<div></div>);

//     if (this.main.settingMenuUIData.currMenu === 'subtitles_menu') {
//       const menuitems = this.main.settingMenuUIData.subtitleTracks.map((item, index) =>
//         <div key={index} className="vop-menuitem" role="menuitem"
//         aria-checked={this.main.settingMenuUIData.currSubtitleId === item.id ? 'true' : 'false'}
//         data-id={item.id} onClick={this.onMenuItemClick_}
//         tabIndex="0" onBlur={this.onMenuItemBlur_}>
//           <div className="vop-menuitem-label">
//             { item.lang }
//           </div>
//           <div className="vop-menuitem-content">
//             <div className="vop-menuitem-toggle-checkbox">
//             </div>
//           </div>
//         </div>
//       );

//       ret = (
//         <div>
//           <div className="vop-panel-header">
//             <button className="vop-panel-title" onClick={this.onMenuBackClick_}>Subtitles</button>
//           </div>
//           <div className="vop-panel-menu">
//             { menuitems }
//           </div>
//         </div>
//       );
//     }

//     return ret;
//   }

//   onMenuBackClick() {
//     myPrintLog('+onMenuBack');
//     this.main.onSubtitleMenuBack();
//   }

//   onMenuItemClick(e) {
//     myPrintLog('+onMenuItemClick');
//     this.main.onSubtitleMenuItemClick(e);
//   }

//   onMenuItemBlur(e) {
//     myPrintLog('+onMenuItemBlur');
//     if (this.main.settingMenuUIData.currMenu !== 'subtitles_menu') {
//       return;
//     }
    
//     this.main.onSubtitleMenuItemBlur(e);
//   }
// }

// export default UISubtitlesMenu;




