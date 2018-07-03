import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIChromecastToggleButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button className={"vop-button vop-cast-button vop-style-cast"} title="chromecast">
      </button>
    );
  }
}


export default UIChromecastToggleButton;

