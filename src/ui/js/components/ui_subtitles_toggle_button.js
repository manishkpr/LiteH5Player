import React from 'react';
import UITools from '../ui_tools';

class UISubtitleToggleButton extends React.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    return (
      <button className="vop-button vop-subtitles-button vop-style-subtitles" title="subtitles"
        onClick={this.onUICmdSubtitles.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}>
      </button>
    );
  }

  onUICmdSubtitles() {
    this.main.onUICmdSubtitles();
  }

  onControlMouseMove(e) {
    this.main.onControlMouseMove(e);
  }

}

export default UISubtitleToggleButton;
