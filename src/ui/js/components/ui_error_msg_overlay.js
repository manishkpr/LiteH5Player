import { h, Component } from 'preact';

import Events from '../events';
import { ErrorTypes } from '../../../core/errors';

import UITools from '../ui_tools';

import UITvNoiseCanvas from './ui_tvnoise_canvas';

class UIErrorMsgOverlay extends Component {
  constructor(props) {
    super(props);
    this.main = this.props.main;
    this.player = this.main.player;

    this.onError = this.onError.bind(this);
    this.player.on(oldmtn.Events.ERROR, this.onError);
  }

  componentDidMount() {
    this.vopErrorMsgOverlay = document.querySelector('.vop-error-msg-overlay');
    this.vopTvNoiseCanvas = document.querySelector('.vop-tvnoise-canvas');
    this.vopErrorMsgText = document.querySelector('.vop-error-msg-text');

    this.tvNoiseCanvas = new UITvNoiseCanvas({element: this.vopTvNoiseCanvas});
  }

  render() {
    return (
      <div className={'vop-error-msg-overlay'}>
        <canvas className={'vop-tvnoise-canvas'}></canvas>
        <span className={'vop-error-msg-text'}></span>
      </div>
    );
  }

  onError(e) {
    if (e.type === ErrorTypes.LICENSE_ERROR) {
      this.vopErrorMsgText.innerHTML = '<strong>License Error<\/strong><br\/>Could not find license.';
      this.vopErrorMsgOverlay.style.display = 'block';

      let canvasWidth = this.vopErrorMsgOverlay.clientWidth;
      let canvasHeight = this.vopErrorMsgOverlay.clientHeight;
      this.tvNoiseCanvas.start({width: canvasWidth, height: canvasHeight});
    }
  }
}

export default UIErrorMsgOverlay;