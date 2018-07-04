import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIAirplayToggleButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button className={"vop-button vop-airplay-button vop-style-airplay"} title="airplay">
      </button>
    );
  }
}

export default UIAirplayToggleButton;

