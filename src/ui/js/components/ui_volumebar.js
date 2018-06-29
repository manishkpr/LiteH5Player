import React from 'react';
import UITools from '../ui_tools';

class UIVolumeBar extends React.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player_ = this.main.player_;

    //
    this.colorList_volume = ['#ccc', 'rgba(192,192,192,0.3)'];
    this.vopVolumeSliderWidth = 52;
    this.vopVolumeSliderHandleWidth = 10;
  }

  componentDidMount() {
    this.vopVolumeSlider = document.querySelector('.vop-volume-slider');
    this.vopVolumeSliderHandle = document.querySelector('.vop-volume-slider-handle');

    this.vopVolumeButton = document.querySelector('.vop-volume-button');

    //
    this.onMediaVolumeChanged = this.onMediaVolumeChanged.bind(this);
    this.player_.on(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged);
  }

  componentWillUnmount() {
    this.player_.off(oldmtn.Events.MEDIA_VOLUME_CHANGED, this.onMediaVolumeChanged);
  }

  render() {
    let info = this.getVolumeInfo();
    let background = UITools.genGradientColor(info.uiVolumeList, this.colorList_volume);
    let left = info.uiVolumeHandleLeft;

    return (
      <div className="vop-volume-panel" onMouseMove={this.onVolumeBarMouseMove.bind(this)}>
        <div className="vop-volume-slider" style={{background: background}}
          onMouseDown={this.onVolumeSliderMouseDown.bind(this)}>
          <div className="vop-volume-slider-handle" style={{left: left}}>
          </div>
        </div>
      </div>
    );
  }

  getVolumeInfo() {
    let muted = this.player_.isMuted();
    let volume = this.player_.getVolume();

    // Process
    let uiVolumeList;
    let uiVolumeHandleLeft;

    if (volume === 0 || muted) {
      uiVolumeList = [0, 1];
      uiVolumeHandleLeft = '0px';
    } else {
      uiVolumeList = [volume, 1];

      let vLeft = (volume / 1) * this.vopVolumeSliderWidth;
      if (vLeft + this.vopVolumeSliderHandleWidth > this.vopVolumeSliderWidth) {
        vLeft = this.vopVolumeSliderWidth - this.vopVolumeSliderHandleWidth;
      }

      uiVolumeHandleLeft = vLeft.toString() + 'px';
    }

    return { uiVolumeList: uiVolumeList, uiVolumeHandleLeft: uiVolumeHandleLeft};
  }

  onMediaVolumeChanged() {
    let info = this.getVolumeInfo();

    // update volume slider background
    this.vopVolumeSlider.style.background = UITools.genGradientColor(info.uiVolumeList, this.colorList_volume);
    // update volume slider handle
    this.vopVolumeSliderHandle.style.left = info.uiVolumeHandleLeft;
  }

  onVolumeSliderMouseDown(e) {
    printLog('+onVolumeSliderMouseDown');
    this.captureVolumeSliderMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    this.flagVolumeSliderMousedown = true;

    this.docVolumeSliderMousemove(e);
  }

  docVolumeSliderMousemove(e) {
    let valueVolumeMovePosition = this.getVolumeMovePosition(e);

    let muted = this.player_.isMuted();
    let volume = valueVolumeMovePosition;
    if (volume === 0) {
      // do nothing
    } else {
      if (muted === true) {
        this.player_.unmute();
      }

      muted = false;
    }

    this.player_.setVolume(valueVolumeMovePosition);
  }

  docVolumeSliderMouseup(e) {
    printLog('+docVolumeSliderMouseup');
    this.releaseVolumeSliderMouseEvents();
    e.preventDefault();

    this.flagVolumeSliderMousedown = false;

    this.main.onVolumeBarMouseUp(e);
  }

  captureVolumeSliderMouseEvents() {
    this.newVolumeSliderMousemove = this.docVolumeSliderMousemove.bind(this);
    this.newVolumeSliderMouseup = this.docVolumeSliderMouseup.bind(this);

    document.addEventListener('mousemove', this.newVolumeSliderMousemove, true);
    document.addEventListener('mouseup', this.newVolumeSliderMouseup, true);
  }

  releaseVolumeSliderMouseEvents() {
    document.removeEventListener('mousemove', this.newVolumeSliderMousemove, true);
    document.removeEventListener('mouseup', this.newVolumeSliderMouseup, true);
  }

  getVolumeMovePosition(e) {
    // part - input
    let rect = this.vopVolumeSlider.getBoundingClientRect();

    // part - logic process
    let offsetX = e.clientX - rect.left;
    if (offsetX < 0) {
      offsetX = 0;
    } else if (offsetX + this.vopVolumeSliderHandleWidth > rect.width) {
      offsetX = rect.width;
    }

    // update time progress scrubber button
    let valueVolumeMovePosition = (offsetX / rect.width) * 1.0;
    return valueVolumeMovePosition;
  }

  onVolumeBarMouseMove(e) {
    this.main.onControlMouseMove(e);
  }
}

export default UIVolumeBar;

