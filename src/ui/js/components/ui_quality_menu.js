import { h, Component } from 'preact';

import Events from '../events';
import ID from '../id';

class UIQualityMenu extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.evEmitter = this.main.evEmitter;

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onMenuItemBlur_ = this.onMenuItemBlur.bind(this);

    this.onPopupMenuChange = this.onPopupMenuChange.bind(this);
    this.evEmitter.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange);

    this.qualityData = { // quality settings menu
      qualityList: [{
        id: '6',
        bitrate: '1080p'
      }, {
        id: '5',
        bitrate: '720p'
      }, {
        id: '4',
        bitrate: '480p'
      }, {
        id: '3',
        bitrate: '360p'
      }, {
        id: '2',
        bitrate: '240p'
      }, {
        id: '1',
        bitrate: '144p'
      }, {
        id: '-1',
        bitrate: 'Auto'
      }],
      isQualityAuto: true,
      currQualityId: '2'
    };
    this.state = {
      qualityData: this.qualityData
    };
  }

  componentDidMount(e) {
    this.vopQualityMenu = document.querySelector('.vop-quality-menu');
  }

  render() {
    const { qualityData } = this.state;

    const menuitems = qualityData.qualityList.map((item, index) =>
      <div key={index} className="vop-menuitem" role="menuitemradio"
          aria-checked={qualityData.currQualityId === item.id}
          data-id={item.id} onClick={this.onMenuItemClick_}
          tabIndex="0" onBlur={this.onMenuItemBlur_}>
        <div className="vop-menuitem-label">
          <span>{ item.bitrate }</span>
        </div>
      </div>
    );

    return (
      <div className="vop-quality-menu" style="display:none;">
        <div className="vop-panel-header">
          <button className="vop-panel-title" onClick={this.onMenuBackClick_}>Quality</button>
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
    myPrintLog('+onQualityMenuItemClick, this.settingMenuUIData.currMenu: ' + this.main.settingMenuUIData.currMenu +
      ', text: ' + e.target.innerText);
    let nextFocus = e.currentTarget;

    this.qualityData.currQualityId = nextFocus.dataset.id;
    this.setState({qualityData: this.qualityData});
  }

  onMenuItemBlur(e) {
    if (this.main.settingMenuUIData.currMenu !== 'quality_menu') {
      return;
    }

    myPrintLog('+onQualityMenuItemBlur');
    let nextFocus = e.relatedTarget;
    if (nextFocus) {
      myPrintLog('className: ' + nextFocus.className);
      if (nextFocus.className.indexOf('vop-panel-title') !== -1 ||
        nextFocus.className.indexOf('vop-menuitem') !== -1 ||
        nextFocus.className.indexOf('vop-settings-button') !== -1) {
        // click on quality menu, do nothing
        // click on settings menu, do nothing, since onUICmdSettings will do it for us.
      } else {
        this.main.settingMenuUIData.currMenu = 'none';
        this.evEmitter.emit(Events.POPUPMENU_CHANGE, {
          menu: this.main.settingMenuUIData.currMenu
        });
      }
    } else {
      this.main.settingMenuUIData.currMenu = 'none';
      this.evEmitter.emit(Events.POPUPMENU_CHANGE, {
        menu: this.main.settingMenuUIData.currMenu
      });
    }
  }

  onPopupMenuChange(e) {
    if (e.menu === 'quality_menu') {
      this.vopQualityMenu.style.display = 'block';
      let v = this.vopQualityMenu.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    } else {
      this.vopQualityMenu.style.display = 'none';
    }
  }
}

export default UIQualityMenu;





