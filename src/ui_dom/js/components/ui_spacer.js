import { Component } from './ui_component';

class UISpacer extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
  }

  toDom() {
    let container = document.createElement('div');
    container.setAttribute('class', 'vop-spacer');
    return container;
  }
}

export default UISpacer;

