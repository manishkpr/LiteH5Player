import { h } from 'preact';
import Preact from 'preact';

class UISubtitleToggleButton extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    let btnStyle = {};
    if (this.main.flagAdStarted && this.main.flagIsLinearAd) {
      btnStyle.display = 'none';
    } else {
      btnStyle.display = 'inline-block';
    }

    return (
      <button className="vop-button vop-subtitles-button" title="subtitles"
        style={btnStyle}
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
}

export default UISubtitleToggleButton;
