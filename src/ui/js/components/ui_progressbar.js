import { h, Component } from 'preact';

class UIProgressBar extends Component {
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
      <div className="vop-progress-bar"
        onMouseDown={this.onProgressBarMouseDown.bind(this)}
        onMouseMove={this.onProgressBarMouseMove.bind(this)}
        onMouseLeave={this.onProgressBarMouseLeave.bind(this)}>
        <div className="vop-progress-list">
          <div className="vop-load-progress"></div>
          <div className="vop-hover-progress"></div>
          <div className="vop-play-progress"></div>
        </div>
        <div className="vop-scrubber-container"></div>
      </div>
    );
  }

  onProgressBarMouseDown(e) {
    this.main.onProgressBarMouseDown(e);
  }

  onProgressBarMouseMove(e) {
    this.main.onProgressBarMouseMove(e);
  }

  onProgressBarMouseLeave(e) {
    this.main.onProgressBarMouseLeave(e);
  }
}

export default UIProgressBar;

