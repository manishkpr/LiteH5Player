import { h } from 'preact';
import Preact from 'preact'; 

class UICaptionOverlay extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    let text = '';
    if (this.main.cue || this.main.cue.text) {
      text = this.main.cue.text;
    }

    return (
      <div className="vop-caption-overlay">
        {text}
      </div>
    );
  }
}

export default UICaptionOverlay;




