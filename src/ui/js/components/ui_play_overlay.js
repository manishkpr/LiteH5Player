import { h, Component } from 'preact';

class UIPlayOverlay extends Component {
  constructor(props) {
    super(props);
    this.main = this.props.main;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    let ret = <div></div>;
    let retUI = (
      <div className="vop-play-overlay-container">
        <div className="vop-play-overlay" onClick={this.onPlayOverlayClick.bind(this)}>
        </div>
      </div>
    );

    switch(this.main.playerState) {
      case 'opened':
      if (this.main.flagAdStarted && this.main.flagIsLinearAd) {
      } else {
        ret = retUI;
      }
      break;
      case 'ended':
      ret = retUI;
      break;
    }

    return ret;
  }

  onPlayOverlayClick() {
    this.main.player.play();
  }
}

export default UIPlayOverlay;

