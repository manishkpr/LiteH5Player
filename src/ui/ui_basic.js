import React from 'react';
import ReactDOM from 'react-dom';

import "./css/ui_player.scss";

class UIBasic extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentDidMount() {
    let video = document.querySelector('.vop-video');
    video.setAttribute('controls', 'true');
  }

  render() {
    return (
      <div className="html5-video-player">
        <div className="vop-video-container">
          <video className="vop-video" playsInline="true" webkit-playsinline="true">
          </video>
        </div>
        <div className="vop-ads-container"></div>
      </div>
    );
  }
}

export default UIBasic;



