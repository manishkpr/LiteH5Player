import { h } from 'preact';
import Preact from 'preact';

import UITools from '../ui_tools';

class UIFullscreenToggleButton extends Preact.Component {
  constructor(props) {
    super(props);
    
    this.player_ = this.props.main.player_;
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
}


export default UIFullscreenToggleButton;
