import { h, Component } from 'preact';

class UICaptionOverlay extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;

    this.onCueStart = this.onCueStart.bind(this);
    this.onCueEnd = this.onCueEnd.bind(this);
    this.player.on(oldmtn.Events.CUE_START, this.onCueStart);
    this.player.on(oldmtn.Events.CUE_END, this.onCueEnd);
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
}

export default UICaptionOverlay;




