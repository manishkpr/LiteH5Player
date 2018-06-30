import { h } from 'preact';
import Preact from 'preact';

class UIToolTip extends Preact.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // 
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



