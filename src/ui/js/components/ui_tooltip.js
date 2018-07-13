import { h, Component } from 'preact';

// Functionality:
// 1. show tooltip thumbnail;
// 2. show current duration;

// Needs:
// 1. player instance;
// 2. player current position;

class UIToolTip extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  componentDidMount(e) {
    this.vopTooltip = document.querySelector('.vop-tooltip');
    this.vopTooltipBg = document.querySelector('.vop-tooltip-bg');
    this.vopTooltipText = document.querySelector('.vop-tooltip-text');
  }

  componentDidUpdate() {
  }

  render() {
    //myPrintLog('UIToolTip, render');

    let oldTooltipText = '00:00';
    let vopTooltipText = document.querySelector('.vop-tooltip-text');
    if (vopTooltipText) {
      oldTooltipText = vopTooltipText.innerText;
    }

    return (
      <div className="vop-tooltip">
        <div className="vop-tooltip-bg"></div>
        <div className="vop-tooltip-text-wrapper">
          <span className="vop-tooltip-text">{oldTooltipText}</span>
        </div>
      </div>
    );
  }
}

export default UIToolTip;




