import {
  h,
  Component
} from 'preact';

import Events from '../events';
import CONSTS from '../consts';

import {
  identity,
  difference,
  isNumber,
  isFinite,
  filter
} from '../../../externals/underscore';

class UICaptionOverlay extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.evEmitter = this.main.evEmitter;

    this.onTrackAdded = this.onTrackAdded.bind(this);
    this.onTrackChanged = this.onTrackChanged.bind(this);
    this.player.on(oldmtn.Events.TRACK_ADDED, this.onTrackAdded);
    this.player.on(oldmtn.Events.TRACK_CHANGED, this.onTrackChanged);

    this.onMediaTimeupdated = this.onMediaTimeupdated.bind(this);
    this.player.on(oldmtn.Events.MEDIA_TIMEUPDATE, this.onMediaTimeupdated);

    this.onAutoHideChange = this.onAutoHideChange.bind(this);
    this.evEmitter.on(Events.AUTOHIDE_CHANGE, this.onAutoHideChange);
  }

  componentDidMount() {
    this.vopCaptionOverlay = document.querySelector('.vop-caption-overlay');
  }

  render() {
    let captionStyle = {};
    captionStyle.backgroundColor = 'yellow';
    captionStyle.color = 'red';

    // line-height: normal;
    // text-align: center;

    return (
      <div className="vop-caption-overlay" style={captionStyle}>
      </div>
    );
  }

  onMediaTimeupdated(e) {
    let pos = this.player.getPosition();

    let cues = [];
    if (this.textTrack_) {
      cues = this.getCurrentCues(this.textTrack_.data, pos);
    }

    this.updateCurrentCues(cues);
    this.renderCues();
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
    if (this.currTrackId_ !== e.currTrackId) {
      this.currTrackId_ = e.currTrackId;
      this.textTrack_ = e.track;
    }
  }

  onTrackChanged(e) {
    if (this.currTrackId_ !== e.currTrackId) {
      this.currTrackId_ = e.currTrackId;
      this.textTrack_ = this.player.getCurrentSubtitleTrack();
    }
  }

  // Tools
  getCurrentCues(allCues, pos) {
    return filter(allCues, function(cue) {
      return pos >= (cue.start) && (!cue.end || pos <= cue.end);
    });
  }

  updateCurrentCues(cues) {
    // Render with vtt.js if there are cues, clear if there are none
    if (!cues.length) {
      this.currentCues_ = [];
    } else if (difference(cues, this.currentCues_).length) {
      this.currentCues_ = cues;
    }
  }

  renderCues() {
    if (this.currentCues_.length > 0) {
      const cue = this.currentCues_[0];
      this.vopCaptionOverlay.innerText = cue.data;
    } else {
      this.vopCaptionOverlay.innerText = '';
    }
  }
}

export default UICaptionOverlay;