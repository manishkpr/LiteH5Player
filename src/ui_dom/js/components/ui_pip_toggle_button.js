import { Component } from './ui_component';

import UITools from '../ui_tools';

class UIPipToggleButton extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.pipMode = false;
  }

  toDom() {
    let button = document.createElement('button');
    button.setAttribute('class', 'vop-button vop-pip-button');
    button.setAttribute('title', 'picture in picture');

    return button;
  }

  // old
  // render() {
  //   let btnStyle = {};
  //   if (this.main.flagAdStarted && this.main.flagIsLinearAd) {
  //     btnStyle.display = 'none';
  //   } else {
  //     btnStyle.display = 'inline-block';
  //   }

  //   return (
  //     <button className={"vop-button vop-pip-button"} title="picture in picture"
  //       onClick={this.onUICmdPip.bind(this)}
  //       style={btnStyle}>
  //     </button>
  //   );
  // }

  onUICmdPip() {
    this.pipMode = !this.pipMode;
    this.player.setPipPresentation(this.pipMode);
  }
}


export default UIPipToggleButton;

