import {
  h,
  Component
} from 'preact';
import '../css/ui_basic.scss';

export default class UIBasic extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <div className='html5-video-player'>
        <div className='vop-video-container'>
          <video className='vop-video' playsInline='true' webkit-playsinline='true'>
          </video>
        </div>
        <div className='vop-ads-container'></div>
      </div>
    );
  }
}

function createMediaElement() {
  const mediaElement = document.createElement('video');

  mediaElement.className = 'vop-video';
  mediaElement.setAttribute('webkit-playsinline', '');
  mediaElement.setAttribute('playsinline', '');

  return mediaElement;
}

function createVideoContainer() {
  let container = document.createElement('div');
  container.setAttribute('class', 'vop-video-container');

  let mediaElement = createMediaElement();
  container.appendChild(mediaElement);
  return container;
}

function createAdsContainer() {
  let container = document.createElement('div');
  container.setAttribute('class', 'vop-ads-container');
  return container;
}

export function dom_initUI(container) {
  let html5VideoPlayer = document.createElement('div');
  html5VideoPlayer.setAttribute('class', 'html5-video-player');

  // create video container
  let vopVideoContainer = createVideoContainer();

  // create ads container
  let vopAdsContainer = createAdsContainer();

  html5VideoPlayer.appendChild(vopVideoContainer);
  html5VideoPlayer.appendChild(vopAdsContainer);

  //
  container.appendChild(html5VideoPlayer);
}