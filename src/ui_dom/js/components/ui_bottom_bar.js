import { Component } from './ui_component';

import UIProgressBar from './ui_progress_bar';
import UIControlBar from './ui_control_bar';

class UIBottomBar extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;

    this.components = [
      new UIProgressBar({main: this.main}),
      new UIControlBar({main: this.main})
    ];
  }

  toDom() {
    let container = document.createElement('div');
    container.setAttribute('class', 'vop-bottom-bar');

    this.components.forEach(function(item, index) {
      let element = item.toDom();
      container.appendChild(element);
    });

    return container;
  }

  // render() {
  //   return (
  //     <div className="vop-bottom-bar"
  //       onMouseDown={this.onUICmdControlBarMouseDown.bind(this)}>
  //       <UIProgressBar main={this.main} />
  //       <UIControlBar main={this.main} />
  //     </div>
  //   );
  // }

  onUICmdControlBarMouseDown(e) {
    e.stopPropagation();
  }
}

export default UIBottomBar;

