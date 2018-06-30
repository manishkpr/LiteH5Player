import { h } from 'preact';
import Preact from 'preact'; 

import UITools from '../ui_tools';

class UIBufferingOverlay extends Preact.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="vop-spinner">
        <div className="vop-spinner-container">
          <div className="vop-spinner-rotator">
            <div className="vop-spinner-left">
              <div className="vop-spinner-circle">
              </div>
            </div>
            <div className="vop-spinner-right">
              <div className="vop-spinner-circle">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UIBufferingOverlay;


