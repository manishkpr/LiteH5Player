import { h } from 'preact';
import Preact from 'preact';


class UIPlayOverlay extends Preact.Component {
  constructor(props) {
    super(props);
    this.main = this.props.main;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="vop-play-overlay-container">
        <div className="vop-play-overlay" onClick={this.onPlayOverlayClick.bind(this)}>
        </div>
      </div>
    );
  }

  onPlayOverlayClick() {
    this.main.player.play();
  }
}

export default UIPlayOverlay;

