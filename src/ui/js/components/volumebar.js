import React from 'react';

class UIVolumeBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="vop-volume-panel">
        <div className="vop-volume-slider" onMouseDown={this.onVolumeSliderMouseDown.bind(this)}>
          <div className="vop-volume-slider-handle">
          </div>
        </div>
      </div>
    );
  }

  onVolumeSliderMouseDown(e) {
    this.props.onVolumeSliderMouseDown(e);
  }
}

export default UIVolumeBar;

