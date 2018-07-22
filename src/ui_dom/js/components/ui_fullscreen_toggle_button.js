import { h } from 'preact';
import Preact from 'preact';

import UITools from '../ui_tools';

class UIFullscreenToggleButton extends Preact.Component {
  constructor(props) {
    super(props);
    
    this.main = this.props.main;
    this.player = this.main.player;

    this.onFullscreenChanged = this.onFullscreenChanged.bind(this);
    this.player.on(oldmtn.Events.FULLSCREEN_CHANGE, this.onFullscreenChanged);
  }

  toDom() {
    let button = document.createElement('button');
    button.setAttribute('class', 'vop-button vop-fullscreen-button icon-on');
    button.setAttribute('title', 'fullscreen');

    button.addEventListener('click', this.onUICmdFullscreen.bind(this));
    //button.addEventListener('mousemove', this.onControlMouseMove.bind(this));

    this.vopFullscreenBtn = button;
    return button;
  }

  // render() {
  //   return (
  //     <button className="vop-button vop-fullscreen-button icon-on" title="fullscreen"
  //       onClick={this.onUICmdFullscreen.bind(this)}
  //       onMouseMove={this.onControlMouseMove.bind(this)}>
  //     </button>
  //   );
  // }

  onUICmdFullscreen() {
    myPrintLog('+onBtnFullscreen');
    if (this.player.isFullscreen()) {
      UITools.leaveFullscreen();
    } else {
      let v = this.main.playerContainer
      UITools.enterFullscreen(v);
    }
  }

  onControlMouseMove(e) {
    this.main.onControlMouseMove(e);
  }

  onFullscreenChanged() {
    let flagIsFullscreen = this.player.isFullscreen();
    myPrintLog('fullscreen changed, ret: ' + flagIsFullscreen + ', width: ' + window.screen.width + ', height: ' + window.screen.height);

    if (flagIsFullscreen) {
      UITools.removeClass(this.vopFullscreenBtn, 'icon-on');
      UITools.addClass(this.vopFullscreenBtn, 'icon-off');
    } else {
      UITools.removeClass(this.vopFullscreenBtn, 'icon-off');
      UITools.addClass(this.vopFullscreenBtn, 'icon-on');
    }
  }
}


export default UIFullscreenToggleButton;
