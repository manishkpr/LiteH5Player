import React from 'react';

import '../../css/ui_skin_youtube.scss';
import UITools from '../ui_tools';

class UIBufferingOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.player_ = this.props.main.player_;
  }

  componentDidMount() {
    this.onMediaWaiting = this.onMediaWaiting.bind(this);
    this.onMediaPlaying = this.onMediaPlaying.bind(this);

    this.player_.on(oldmtn.Events.MEDIA_WAITING, this.onMediaWaiting);
    this.player_.on(oldmtn.Events.MEDIA_PLAYING, this.onMediaPlaying);

    this.player_.on(oldmtn.Events.STATE_CHANGE, this.onStateChange);
  }

  componentWillUnmount() {
    this.player_.off(oldmtn.Events.MEDIA_WAITING, this.onMediaWaiting);
    this.player_.off(oldmtn.Events.MEDIA_PLAYING, this.onMediaPlaying);

    this.player_.off(oldmtn.Events.STATE_CHANGE, this.onStateChange);
  }

  render() {
    return (
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
    );
  }

  startBufferingUI() {
    let v = this.props.main.vopSkinContainer;
    UITools.addClass(v, 'vop-buffering');
  }

  stopBufferingUI() {
    let v = this.props.main.vopSkinContainer;
    UITools.removeClass(v, 'vop-buffering');
  }

  onMediaWaiting() {
    this.startBufferingUI();
  }

  onMediaPlaying() {
    this.stopBufferingUI();
  }

  onStateChange() {
  }
}

export default UIBufferingOverlay;


