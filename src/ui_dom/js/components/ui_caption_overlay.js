import { Component } from './ui_component';

import DOM from '../dom';

class UICaptionOverlay extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  toDom() {
    let tag = 'div';
    let attributes = {
      'class': 'vop-caption-overlay',
      'style': 'background-color: yellow; color: red'
    };

    let dom = new DOM(tag, attributes);

    return dom;
  }
  // render() {
  //   let text = '';
  //   if (this.main.cue && this.main.cue.text) {
  //     text = this.main.cue.text;
  //   }

  //   let captionStyle = {};
  //   captionStyle.backgroundColor = 'yellow';
  //   captionStyle.color = 'red';

  //   // line-height: normal;
  //   // text-align: center;

  //   return (
  //     <div className="vop-caption-overlay" style={captionStyle}>
  //       {text}
  //     </div>
  //   );
  // }
}

export default UICaptionOverlay;




