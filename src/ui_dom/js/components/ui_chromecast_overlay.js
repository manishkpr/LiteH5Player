import { Component } from './ui_component';

class UIChromecastOverlay extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  toDom() {
    let container = document.createElement('div');
    container.setAttribute('class', 'vop-chromecast-overlay');

    let status = document.createElement('div');
    status.setAttribute('class', 'vop-chromecast-status');

    let icon = document.createElement('div');
    icon.setAttribute('class', 'vop-chromecast-status-icon');

    let info = document.createElement('div');
    info.setAttribute('class', 'vop-chromecast-status-info');
    info.innerText = 'Playing on';

    let title = document.createElement('div');
    title.setAttribute('class', 'vop-chromecast-status-title');
    title.innerText = 'Joseph TV(2nd Gen)';

    status.appendChild(icon);
    status.appendChild(info);
    status.appendChild(title);

    container.appendChild(status);

    return container;
  }
  // render() {
  //   return (
  //     <div className='vop-chromecast-overlay'>
  //       <div className='vop-chromecast-status'>
  //         <div className='vop-chromecast-status-icon'></div>
  //         <div className='vop-chromecast-status-info'>Playing on</div>
  //         <div className='vop-chromecast-status-title'>Joseph TV(2nd Gen)</div>
  //       </div>
  //     </div>
  //   );
  // }
}

export default UIChromecastOverlay;




