import React from 'react';

import '../../css/ui_skin_youtube.scss';
import '../../assets/img/logo.png';

class UILogo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="vop-logo"
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

export default UILogo;
