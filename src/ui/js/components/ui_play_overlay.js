import React from 'react';
import ReactDOM from 'react-dom';

class UIPlayOverlay extends React.Component {
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
    this.main.player_.play();

    let v = document.querySelector('.vop-play-overlay-container');
    v.style.display = 'none';
  }
}

export default UIPlayOverlay;

