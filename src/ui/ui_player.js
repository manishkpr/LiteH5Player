import React from 'react';
import ReactDOM from 'react-dom';

import "./ui_player.css";

class UIPlayer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <div className="html5-video-player vop-autohide">
        <div className="vop-video-container">
          <video className="vop-video" playsInline="true" webkit-playsinline="true">
          </video>
        </div>
        <div className="vop-ads-container"></div>
        <div className="vop-tooltip">
          <div className="vop-tooltip-bg"></div>
          <div className="vop-tooltip-text-wrapper">
            <span className="vop-tooltip-text">00:00</span>
          </div>
        </div>
        <div className="vop-popup vop-settings-menu">
          <div className="vop-panel">
            <div className="vop-panel-menu">
            </div>
          </div>
        </div>
        <div className="vop-gradient-bottom"></div>
        <div className="vop-control-bar">
          <div className="vop-progress-bar">
            <div className="vop-progress-list">
              <div className="vop-load-progress"></div>
              <div className="vop-play-progress"></div>
              <div className="vop-hover-progress"></div>
            </div>
            <div className="vop-scrubber-container"></div>
          </div>
          <div className="vop-controls">
            <div className="vop-left-controls">
              <button className="vop-button material-icons vop-play-button" title="play">&#xe037;</button>
              <button className="vop-button material-icons vop-mute-button" title="mute">&#xe050;</button>
              <div className="vop-volume-panel">
                <div className="vop-volume-slider">
                  <div className="vop-volume-slider-handle">
                  </div>
                </div>
              </div>
              <div className="vop-time-display"><span className="vop-time-text">00:00/00:00</span></div>
            </div>
            <div className="vop-right-controls">
              <button className="vop-button material-icons vop-subtitles-button" title="subtitles">&#xe048;</button>
              <button className="vop-button material-icons vop-settings-button" title="settings">&#xe8b8;</button>
              <button className="vop-button material-icons vop-fullscreen-button" title="fullscreen">&#xe5d0;</button>
            </div>
          </div>
        </div>
        <div className="vop-caption-window">
        </div>
        <div className="vop-spinner">
          <div className="vop-spinner-container">
            <div className="vop-spinner-rotator">
              <div className="vop-spinner-left">
                <div className="vop-spinner-circle">
                </div>
              </div>
              <div className="vop-spinner-right">
                <div className="vop-spinner-circle">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="vop-giant-button-container" style={{display: 'none'}}>
          <div className="material-icons vop-giant-button" style={{color: 'white', fontSize: '48px'}}>&#xe037;</div>
        </div>
      </div>
    )
  }
};

export default UIPlayer;