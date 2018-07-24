import { h } from 'preact';
import Preact from 'preact';

class UISubtitleToggleButton extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
  }

  componentDidMount() {
    this.vopSubtitlesButton = document.querySelector('.vop-subtitles-button');

    this.onAdStarted = this.onAdStarted.bind(this);
    this.onAdComplete = this.onAdComplete.bind(this);
    this.player.on(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player.on(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
  }

  componentWillUnmount() {
    this.player.off(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player.off(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
  }

  render() {
    return (
      <button className="vop-button vop-subtitles-button" title="subtitles"
        onClick={this.onUICmdSubtitles.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}>
      </button>
    );
  }

  onUICmdSubtitles() {
    this.main.onUICmdSubtitles();
  }

  onControlMouseMove(e) {
    e.stopPropagation();
    this.main.removeAutohideAction();
  }

  onAdStarted(e) {
    this.flagAdStarted = true;
    this.flagIsLinearAd = e.linear;
    this.flagIsVpaidAd = e.vpaid;

    if (this.flagAdStarted && this.flagIsLinearAd) {
      this.vopSubtitlesButton.style.display = 'none';
    } else {
      this.vopSubtitlesButton.style.display = 'inline-block';
    }
  }

  onAdComplete() {
    this.vopSubtitlesButton.style.display = 'inline-block';
  }
}

export default UISubtitleToggleButton;
