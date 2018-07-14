import {
  h,
  Component
} from 'preact';

import UITools from '../ui_tools';

class UIBufferingOverlay extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;

    this.onMediaPlaying = this.onMediaPlaying.bind(this);
    this.onMediaWaiting = this.onMediaWaiting.bind(this);

    this.player.on(oldmtn.Events.MEDIA_WAITING, this.onMediaWaiting);
    this.player.on(oldmtn.Events.MEDIA_PLAYING, this.onMediaPlaying);
  }

  componentDidMount() {}

  componentWillUnmount() {}

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

  onMediaWaiting() {
    if (!this.vopPlayer) {
      this.vopPlayer = document.querySelector('.html5-video-player');
    }
    UITools.addClass(this.vopPlayer, 'vop-buffering');
  }

  onMediaPlaying() {
    if (!this.vopPlayer) {
      this.vopPlayer = document.querySelector('.html5-video-player');
    }
    UITools.removeClass(this.vopPlayer, 'vop-buffering');
  }
}

export default UIBufferingOverlay;