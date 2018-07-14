import {
  h,
  Component
} from 'preact';

class UIGradientBottom extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    return (
      <div className="vop-gradient-bottom">
      </div>
    );
  }
}

export default UIGradientBottom;