import {
  h,
  Component
} from 'preact';
import Events from '../events';
import UITools from '../ui_tools';

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
    this.player = this.main.player;
    this.evEmitter = this.main.evEmitter;
  }

  componentDidMount(e) {
    this.vopTooltip = document.querySelector('.vop-tooltip');
    this.vopTooltipBg = document.querySelector('.vop-tooltip-bg');
    this.vopTooltipText = document.querySelector('.vop-tooltip-text');

    // UI Events
    this.onProgressBarMouseMove_ = this.onProgressBarMouseMove.bind(this);
    this.onProgressBarMouseLeave_ = this.onProgressBarMouseLeave.bind(this);
    this.evEmitter.on(Events.PROGRESSBAR_MOUSEMOVE, this.onProgressBarMouseMove_);
    this.evEmitter.on(Events.PROGRESSBAR_MOUSELEAVE, this.onProgressBarMouseLeave_);
  }


  componentWillUnmount() {
    this.evEmitter.off(Events.PROGRESSBAR_MOUSEMOVE, this.onProgressBarMouseMove_);
    this.evEmitter.off(Events.PROGRESSBAR_MOUSELEAVE, this.onProgressBarMouseLeave_);
  }

  render() {
    //myPrintLog('UIToolTip, render');

    return (
      <div className="vop-tooltip">
        <div className="vop-tooltip-bg"></div>
        <div className="vop-tooltip-text-wrapper">
          <span className="vop-tooltip-text"></span>
        </div>
      </div>
    );
  }

  updateTooltipUI(show, currMovePos) {
    if (!show) {
      this.vopTooltip.style.display = 'none';
      return;
    }

    if (!this.vopProgressBar) {
      this.vopProgressBar = document.querySelector('.vop-progress-bar');
    }

    let thumbnail = this.player.getThumbnail(currMovePos);

    function getTooltipOffsetX(currMovePos, tooltipWidth) {
      // part - input
      // bounding client rect can return the progress bar's rect relative to current page.
      let rect = this.vopProgressBar.getBoundingClientRect();
      let leftMin = 12 + this.vopProgressBar.offsetLeft;
      let rightMax = leftMin + rect.width;

      let duration = this.player.getDuration();

      let currPosWidth = (currMovePos / duration) * rect.width;
      let tooltipLeft_RelativeToVideo = leftMin + currPosWidth - tooltipWidth / 2;
      let tooltipRight_RelativeToVideo = leftMin + currPosWidth + tooltipWidth / 2;

      if (tooltipLeft_RelativeToVideo < leftMin) {
        tooltipLeft_RelativeToVideo = leftMin;
      } else if (tooltipRight_RelativeToVideo > rightMax) {
        tooltipLeft_RelativeToVideo = rightMax - tooltipWidth;
      }

      //myPrintLog('tooltipLeft_RelativeToVideo: ' + tooltipLeft_RelativeToVideo);

      return tooltipLeft_RelativeToVideo;
    }

    if (thumbnail) {
      UITools.addClass(this.vopTooltip, 'vop-tooltip-preview');
      //myPrintLog('thumbnail info: ', thumbnail);
      let isSprite = (thumbnail.data.w && thumbnail.data.h);
      if (isSprite) {
        this.vopTooltipBg.style.width = thumbnail.data.w.toString() + 'px';
        this.vopTooltipBg.style.height = thumbnail.data.h.toString() + 'px';
        this.vopTooltipBg.style.background = 'url(' + thumbnail.data.url + ')' +
          ' -' + thumbnail.data.x.toString() + 'px' +
          ' -' + thumbnail.data.y.toString() + 'px';
      } else {
        this.vopTooltipBg.style.width = '158px';
        this.vopTooltipBg.style.height = '90px';
        this.vopTooltipBg.style.background = 'url(' + thumbnail.data.url + ') no-repeat';
        this.vopTooltipBg.style.backgroundSize = '100% 100%';
      }
    } else {
      UITools.removeClass(this.vopTooltip, 'vop-tooltip-preview');
    }

    // update tooltip offset
    let strTime = oldmtn.CommonUtils.timeToString(currMovePos);
    this.vopTooltipText.innerText = strTime;

    // calculate metrics first
    // A very large offset to hide tooltip.
    this.vopTooltip.style.left = '10000px';
    this.vopTooltip.style.display = 'block';

    // set the correct offset of tooltip.
    let offsetX = getTooltipOffsetX.call(this, currMovePos, this.vopTooltip.clientWidth);
    this.vopTooltip.style.left = offsetX.toString() + 'px';
  }

  onProgressBarMouseMove(e) {
    this.updateTooltipUI(true, e.movePos);
  }

  onProgressBarMouseLeave() {
    this.updateTooltipUI(false);
  }
}

export default UIToolTip;