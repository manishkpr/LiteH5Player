import {
  h,
  Component
} from 'preact';

class UIPlayToggleButton extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <button className={'vop-button vop-play-button'} title="play"
        onClick={this.onUICmdPlay.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}>
      </button>
    );
  }

  onUICmdPlay() {
    this.main.onUICmdPlay();
  }

  onControlMouseMove(e) {
    this.main.onControlMouseMove(e);
  }
}

export default UIPlayToggleButton;