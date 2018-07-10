import { h, Component } from 'preact';

class UIChromecastOverlay extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
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
}

export default UIChromecastOverlay;




