import { h } from 'preact';
import Preact from 'preact';

import UITools from '../ui_tools';

class UIFullscreenToggleButton extends Preact.Component {
  constructor(props) {
    super(props);
    
    this.main = this.props.main;
    this.player = this.main.player;
  }

  componentDidMount() {
    this.vopFullscreenBtn = document.querySelector('.vop-fullscreen-button');

    this.onFullscreenChanged = this.onFullscreenChanged.bind(this);
    this.player.on(oldmtn.Events.FULLSCREEN_CHANGE, this.onFullscreenChanged);
  }

  componentWillUnmount() {
    this.player.off(oldmtn.Events.FULLSCREEN_CHANGE, this.onFullscreenChanged);
  }

  render() {
    return (
      <button className="vop-button vop-fullscreen-button vop-style-fullscreen" title="fullscreen"
        onClick={this.onUICmdFullscreen.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}>
      </button>
    );
  }

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
      UITools.removeClass(this.vopFullscreenBtn, 'vop-style-fullscreen');
      UITools.addClass(this.vopFullscreenBtn, 'vop-style-fullscreen-exit');
    } else {
      UITools.removeClass(this.vopFullscreenBtn, 'vop-style-fullscreen-exit');
      UITools.addClass(this.vopFullscreenBtn, 'vop-style-fullscreen');
    }
  }
}


export default UIFullscreenToggleButton;
