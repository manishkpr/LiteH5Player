import {
  h,
  Component
} from 'preact';

class UIChromecastOverlay extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;

    this.onCastConnected = this.onCastConnected.bind(this);
    this.onCastDisconnected = this.onCastDisconnected.bind(this);
    this.player.on(oldmtn.Events.CAST_CONNECTED, this.onCastConnected);
    this.player.on(oldmtn.Events.CAST_DISCONNECTED, this.onCastDisconnected);
  }

  render() {
    return (
      <div className='vop-chromecast-overlay'>
        <div className='vop-chromecast-status'>
          <div className='vop-chromecast-status-icon'></div>
          <div className='vop-chromecast-status-info'>Playing on</div>
          <div className='vop-chromecast-status-title'>Joseph TV(2nd Gen)</div>
        </div>
      </div>
    );
  }

  onCastConnected() {
    if (!this.vopPlayer) {
      this.vopPlayer = document.querySelector('.html5-video-player');
    }

    UITools.addClass(this.vopPlayer, 'vop-chromecast-connected');
  }

  onCastDisconnected() {
    if (!this.vopPlayer) {
      this.vopPlayer = document.querySelector('.html5-video-player');
    }

    UITools.removeClass(this.vopPlayer, 'vop-chromecast-connected');
  }

}

export default UIChromecastOverlay;