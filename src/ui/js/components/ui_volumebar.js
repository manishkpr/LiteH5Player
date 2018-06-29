import React from 'react';

class UIVolumeBar extends React.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    return (
      <div className="vop-volume-panel" onMouseMove={this.onVolumePanelMouseMove.bind(this)}>
        <div className="vop-volume-slider" onMouseDown={this.onVolumeSliderMouseDown.bind(this)}>
          <div className="vop-volume-slider-handle">
          </div>
        </div>
      </div>
    );
  }

  onVolumeSliderMouseDown(e) {
    this.main.onVolumeSliderMouseDown(e);
  }

  onVolumePanelMouseMove(e) {
    e.stopPropagation();
    this.main.removeAutohideAction();
  }
}

export default UIVolumeBar;

