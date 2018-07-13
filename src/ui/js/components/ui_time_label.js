import { h, Component } from 'preact';
import UITools from '../ui_tools';

class UITimeLabel extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
  }

  componentDidMount() {
    this.vopTimeLabel = document.querySelector('.vop-time-text');

    this.onMediaTimeupdated = this.onMediaTimeupdated.bind(this);

    this.player.on(oldmtn.Events.MEDIA_TIMEUPDATE, this.onMediaTimeupdated);
  }

  componentWillUnmount() {
    this.player.off(oldmtn.Events.MEDIA_TIMEUPDATE, this.onMediaTimeupdated);
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
        timeText = this.getTimeDisplay(position, duration);
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

  onMediaTimeupdated() {
    let position = this.player.getPosition();
    let duration = this.player.getDuration();
    this.updateTimeDisplay(position, duration);
  }

  getTimeDisplay(position, duration) {
    let isLive = (duration === Infinity) ? true : false;

    let timeText = '';
    if (isLive) {
      // update time display label
      timeText = 'Live';
    } else {
      // update time display label
      let c = oldmtn.CommonUtils.timeToString(position);
      let d = oldmtn.CommonUtils.timeToString(duration);
      timeText = c + '/' + d;
    }

    return timeText;
  }

  updateTimeDisplay(position, duration) {
    let text = this.getTimeDisplay(position, duration);
    if (text === 'Live') {
      UITools.addClass(this.vopTimeLabel, 'vop-time-text-live');
    } else {
      UITools.removeClass(this.vopTimeLabel, 'vop-time-text-live');
    }
    this.vopTimeLabel.innerText = text;
  }
}

export default UITimeLabel;


