import { Component } from './ui_component';

class UICaptionOverlay extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  toDom() {
    let captionStyle = 'background-color: yellow; color: red';
    let container = document.createElement('div');
    container.setAttribute('class', 'vop-caption-overlay');
    container.setAttribute('style', captionStyle);

    return container;
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




