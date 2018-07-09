import {
  h, Component
} from 'preact';

import UIProgressBar from './ui_progress_bar';
import UIControls from './ui_controls';

class UIControlBar extends Component {
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
      <div className="vop-control-bar"
        style={style}
        onMouseDown={this.onUICmdControlBarMouseDown.bind(this)}>
        <UIProgressBar main={this.main} />
        <UIControls main={this.main} />
      </div>
    );
  }

  onUICmdControlBarMouseDown(e) {
    e.stopPropagation();
  }
}

export default UIControlBar;

