import React from 'react';
import ReactDOM from 'react-dom';

class UIPlayOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.main = this.props.main;
  }

  render() {
    return (
      <div className="vop-play-overlay-container">
        <div className="vop-play-overlay">
        </div>
      </div>
    );
  }

}

export default UIPlayOverlay;

