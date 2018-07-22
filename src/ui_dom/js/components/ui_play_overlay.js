import { Component } from './ui_component';

class UIPlayOverlay extends Component {
  constructor(props) {
    super(props);
    this.main = props.main;
  }

  toDom() {
    let container = document.createElement('div');
    container.setAttribute('class', 'vop-play-overlay-container');

    let playBtnOverlay = document.createElement('div');
    playBtnOverlay.setAttribute('class', 'vop-play-overlay');
    playBtnOverlay.addEventListener('click', this.onPlayOverlayClick.bind(this));

    container.appendChild(playBtnOverlay);

    return container;
  }

  // render() {
  //   let ret = (<div></div>);
  //   let retUI = (
  //     <div className="vop-play-overlay-container">
  //       <div className="vop-play-overlay" onClick={this.onPlayOverlayClick.bind(this)}>
  //       </div>
  //     </div>
  //   );

  //   switch(this.main.playerState) {
  //     case 'opened':
  //     if (this.main.flagAdStarted && this.main.flagIsLinearAd) {
  //     } else {
  //       ret = retUI;
  //     }
  //     break;
  //     case 'ended':
  //     ret = retUI;
  //     break;
  //   }

  //   return ret;
  // }

  onPlayOverlayClick() {
    this.main.player.play();
  }
}

export default UIPlayOverlay;

