import { h, Component } from 'preact';

class UIPlayToggleButton extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    let btnStyle = '';
    switch(this.main.playerState) {
      case 'idle':
      case 'opened':
      btnStyle = 'vop-style-play';
      break;
      case 'playing':
      btnStyle = 'vop-style-pause';
      break;
      case 'paused':
      btnStyle = 'vop-style-play';
      break;
      case 'ended':
      btnStyle = 'vop-style-replay';
      break;
    }

    return (
      <button className={'vop-button vop-play-button ' + btnStyle} title="play"
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