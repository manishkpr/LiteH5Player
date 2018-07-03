import { h, Component } from 'preact';

import Events from '../events';
import CONSTS from '../consts';

class UICaptionOverlay extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.evEmitter = this.main.evEmitter;

    this.onTrackAdded = this.onTrackAdded.bind(this);
    this.player.on(oldmtn.Events.TRACK_ADDED, this.onTrackAdded);

    this.onCueStart = this.onCueStart.bind(this);
    this.onCueEnd = this.onCueEnd.bind(this);
    this.player.on(oldmtn.Events.CUE_START, this.onCueStart);
    this.player.on(oldmtn.Events.CUE_END, this.onCueEnd);

    this.onAutoHideChange = this.onAutoHideChange.bind(this);
    this.evEmitter.on(Events.AUTOHIDE_CHANGE, this.onAutoHideChange);

    //
    
  }

  componentDidMount() {
    this.vopCaptionOverlay = document.querySelector('.vop-caption-overlay');
  }

  render() {
    let text = '';
    if (this.cue && this.cue.text) {
      text = this.cue.text;
    }

    let captionStyle = {};
    captionStyle.backgroundColor = 'yellow';
    captionStyle.color = 'red';

    // line-height: normal;
    // text-align: center;

    return (
      <div className="vop-caption-overlay" style={captionStyle}>
        {text}
      </div>
    );
  }

  onCueStart(e) {
    this.cue = e.cue;

    let text;
    if (this.cue && this.cue.text) {
      text = this.cue.text;
    } else {
      text = '';
    }
    this.vopCaptionOverlay.innerText = text;
  }

  onCueEnd(e) {
    this.cue = null;
    this.vopCaptionOverlay.innerText = '';
  }

  onAutoHideChange(e) {
    const height = CONSTS.BOTTOM_BAR_HEIGHT;
    if (e.autohide) {
      this.vopCaptionOverlay.style.bottom = '0px';
    } else {
      this.vopCaptionOverlay.style.bottom = height.toString() + 'px';
    }
  }

  onTrackAdded(e) {

  }
}

export default UICaptionOverlay;




