import {
  h, Component
} from 'preact';

import UIProgressBar from './ui_progress_bar';
import UIControlBar from './ui_control_bar';

class UIBottomBar extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    let style = {};
    switch(this.main.playerState) {
      case 'idle':
      case 'opening':
      case 'opened':
      case 'playing':
      case 'paused':
      case 'ended':
      //style.display = 'block';
      break;
    }

    return (
      <div className="vop-bottom-bar"
        style={style}
        onMouseDown={this.onUICmdControlBarMouseDown.bind(this)}>
        <UIProgressBar main={this.main} />
        <UIControlBar main={this.main} />
      </div>
    );
  }

  onUICmdControlBarMouseDown(e) {
    e.stopPropagation();
  }
}

export default UIBottomBar;

