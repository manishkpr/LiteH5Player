import { h } from 'preact';
import Preact from 'preact';

class UITimeLabel extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
  }

  render() {
    let position = this.player.getPosition();
    let duration = this.player.getDuration();
    let timeText = '00:00/00:00';
    switch (this.main.playerState) {
      case 'idle':
      case 'opened':
      case 'playing':
      case 'paused':
      case 'ended':
        timeText = this.main.getTimeDisplay(position, duration);
        break;
      default:
        break;
    }

    return (
      <div className="vop-time-display">
        <span className="vop-time-text">{timeText}</span>
      </div>
    );
  }
}

export default UITimeLabel;


