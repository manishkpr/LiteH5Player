import {
  h
} from 'preact';
import Preact from 'preact';

import '../../assets/img/logo.png';

class UILogoOverlay extends Preact.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="vop-logo-container"
        onClick={this.onLogoClick.bind(this)}
        onMouseDown={this.onLogoMouseDown.bind(this)}>
        <a href="http://localhost/1/LiteH5Player/samples/simple.html" target="_Blank">
          <img src="./assets/img/logo.png"></img>
        </a>
      </div>
    );
  }

  onLogoClick(e) {
    e.stopPropagation();
  }

  onLogoMouseDown(e) {
    e.stopPropagation();
  }
}

export default UILogoOverlay;