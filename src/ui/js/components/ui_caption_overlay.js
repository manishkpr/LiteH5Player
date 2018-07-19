import { h } from 'preact';
import Preact from 'preact'; 

class UICaptionOverlay extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    let text = '';
    if (this.main.cue && this.main.cue.text) {
      text = this.main.cue.text;
    }

    let captionStyle = {};
    captionStyle.backgroundColor = 'yellow';
    captionStyle.color = 'red';

    // line-height: normal;
    // text-align: center;

    return (
      <div className="vop-caption-overlay" style={captionStyle}>
        {text}
      </div>
    );
  }
}

export default UICaptionOverlay;




