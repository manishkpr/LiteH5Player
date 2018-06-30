import { h } from 'preact';
import Preact from 'preact';

import '../../assets/img/logo.png';

class UITimeDisplay extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player_ = this.main.player_;
  }

  render() {
    let position = this.player_.getPosition();
    let duration = this.player_.getDuration();
    let timeText = '00:00/00:00';
    switch (this.main.playerState) {
      case 'playing':
        timeText = this.main.updateTimeDisplay(position, duration);
        break;
    }

    return (
      <div className="vop-time-display">
        <span className="vop-time-text">{timeText}</span>
      </div>
    );
  }
}



export default UITimeDisplay;
