import {
  h,
  Component
} from 'preact';

import Events from '../events';
import {
  ErrorTypes
} from '../../../core/errors';

import UITools from '../ui_tools';

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
    this.vopErrorMsgText = document.querySelector('.vop-error-msg-text');
  }

  render() {
    return (
      <div className={'vop-error-msg-overlay'}>
        <span className={'vop-error-msg-text'}></span>
      </div>
    );
  }

  onError(e) {
    if (e.type === ErrorTypes.LICENSE_ERROR) {
      this.vopErrorMsgText.innerHTML = '<strong>License Error</strong><br/>Could not find license.';

      this.vopErrorMsgOverlay.style.display = 'block';
    }
  }
}

export default UIErrorMsgOverlay;