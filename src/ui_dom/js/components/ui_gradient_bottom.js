import { Component } from './ui_component';
import DOM from '../dom';

class UIGradientBottom extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  toDom() {
    let tag = 'div';
    let attributes = {
      'class': 'vop-gradient-bottom'
    };
    let dom = new DOM(tag, attributes);
    return dom;
  }

  // render() {
  //   return (
  //     <div className="vop-gradient-bottom">
  //     </div>
  //   );
  // }
}

export default UIGradientBottom;


