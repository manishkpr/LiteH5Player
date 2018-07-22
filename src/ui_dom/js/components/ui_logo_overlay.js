import '../../assets/img/logo.png';

import { Component } from './ui_component';

class UILogoOverlay extends Component {
  constructor(props) {
    super(props);
  }

  toDom() {
    let container = document.createElement('div');
    container.setAttribute('class', 'vop-logo-container');
    container.addEventListener('click', this.onLogoClick.bind(this));
    container.addEventListener('mousedown', this.onLogoMouseDown.bind(this));

    let a = document.createElement('a');
    a.setAttribute('href', 'http://localhost/1/LiteH5Player/samples/simple.html');
    a.setAttribute('target', '_Blank');

    let img = document.createElement('img');
    img.setAttribute('src', './assets/img/logo.png');
    a.appendChild(img);

    container.appendChild(a);

    return container;
  }

  onLogoClick(e) {
    e.stopPropagation();
  }

  onLogoMouseDown(e) {
    e.stopPropagation();
  }
}

export default UILogoOverlay;
