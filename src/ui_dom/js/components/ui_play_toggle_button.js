import { Component } from './ui_component';

import DOM from '../dom';

class UIPlayToggleButton extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
  }

  toDom() {
    let tag = 'button';
    let attributes = {
      'class': 'vop-button vop-play-button icon-play',
      'title': 'play'
    };

    let dom = new DOM(tag, attributes);
    dom.addEventListener('click', this.onUICmdPlay.bind(this));

    return dom;
  }

  // old
  // render() {
  //   let btnStyle = '';
  //   switch(this.main.playerState) {
  //     case 'idle':
  //     case 'opened':
  //     btnStyle = 'icon-play';
  //     break;
  //     case 'playing':
  //     btnStyle = 'icon-pause';
  //     break;
  //     case 'paused':
  //     btnStyle = 'icon-play';
  //     break;
  //     case 'ended':
  //     btnStyle = 'icon-replay';
  //     break;
  //   }

  //   return (
  //     <button className={'vop-button vop-play-button ' + btnStyle} title="play"
  //       onClick={this.onUICmdPlay.bind(this)}
  //       onMouseMove={this.onControlMouseMove.bind(this)}>
  //     </button>
  //   );
  // }

  onUICmdPlay() {
    this.main.onUICmdPlay();
  }

  onControlMouseMove(e) {
    this.main.onControlMouseMove(e);
  }
}

export default UIPlayToggleButton;