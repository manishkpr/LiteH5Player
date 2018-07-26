import { h, Component } from 'preact';
import Events from '../events';
import ID from '../id';

class UIXSpeedMenu extends Component {
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

    this.xspeedData = {
      currSpeedId: '3',
      xspeedList: [{
        id: '1',
        value: 0.25
      }, {
        id: '2',
        value: 0.5
      }, {
        id: '3',
        value: 1.0
      }, {
        id: '4',
        value: 1.5
      }, {
        id: '5',
        value: 2.0
      }]
    };
    this.state = {
      xspeedData: this.xspeedData
    };
  }

  componentDidMount() {
    this.vopXSpeedMenu = document.querySelector('.vop-xspeed-menu');
  }

  render() {
    console.log('UIXSpeedMenu, render');

    const { xspeedData } = this.state;

    const menuitems = xspeedData.xspeedList.map((item, index) =>
      <div key={index} className="vop-menuitem" role="menuitemradio"
          aria-checked={xspeedData.currSpeedId === item.id}
          data-id={item.id} onClick={this.onMenuItemClick_}
          tabIndex="0" onBlur={this.onMenuItemBlur_}>
        <div className="vop-menuitem-label">
          <span>{ item.value }</span>
        </div>
      </div>
    );

    return (
      <div className="vop-xspeed-menu" style="display:none;">
        <div className="vop-panel-header">
          <button className="vop-panel-title" onClick={this.onMenuBackClick_}>XSpeed</button>
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
    myPrintLog('+onXSpeedMenuItemClick');
    let nextFocus = e.currentTarget;

    this.xspeedData.currSpeedId = nextFocus.dataset.id;
    this.setState({xspeedData: this.xspeedData});

    // Change Player X-Speed
    function getXSpeedValue(id) {
      let value = '';
      for (let i = 0; i < this.xspeedData.xspeedList.length; i++) {
        let item = this.xspeedData.xspeedList[i];
        if (item.id === id) {
          value = item.value;
          break;
        }
      }

      return value;
    }
    let value = getXSpeedValue.call(this, this.xspeedData.currSpeedId);
    this.player.setAudioPlaybackSpeed(parseFloat(value));

    // old
    //this.main.onXSpeedMenuItemClick(e);
  }

  onMenuItemBlur(e) {
    if (this.main.settingMenuUIData.currMenu !== 'xspeed_menu') {
      return;
    }
    this.main.onXSpeedMenuItemBlur(e);
  }

  onPopupMenuChange(e) {
    if (e.menu === 'xspeed_menu') {
      this.vopXSpeedMenu.style.display = 'block';
      let v = this.vopXSpeedMenu.querySelector('.vop-menuitem');
      if (v) {
        v.focus();
      }
    } else {
      this.vopXSpeedMenu.style.display = 'none';
    }
  }
}

export default UIXSpeedMenu;


