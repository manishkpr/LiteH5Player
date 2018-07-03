import { h } from 'preact';
import Preact from 'preact';

import UITools from '../ui_tools';

class UIFullscreenToggleButton extends Preact.Component {
  constructor(props) {
    super(props);
    
    this.player_ = this.props.main.player_;
  }

  componentDidMount() {
    console.log('+componentDidMount');

    this.vopFullscreenBtn = document.querySelector('.vop-fullscreen-button');

    this.onFullscreenChanged = this.onFullscreenChanged.bind(this);
    this.player_.on(oldmtn.Events.FULLSCREEN_CHANGE, this.onFullscreenChanged);
  }

  componentWillUnmount() {
    this.player_.off(oldmtn.Events.FULLSCREEN_CHANGE, this.onFullscreenChanged);
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
    printLog('+onBtnFullscreen');
    if (this.player_.isFullscreen()) {
      UITools.leaveFullscreen();
    } else {
      let v = this.props.main.playerContainer
      UITools.enterFullscreen(v);
    }
  }

  onControlMouseMove(e) {
    this.props.main.onControlMouseMove(e);
  }

  onFullscreenChanged() {
    let flagIsFullscreen = this.player_.isFullscreen();
    printLog('fullscreen changed, ret: ' + flagIsFullscreen + ', width: ' + window.screen.width + ', height: ' + window.screen.height);

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
