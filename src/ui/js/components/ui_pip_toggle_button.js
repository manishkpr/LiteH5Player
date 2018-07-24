import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIPipToggleButton extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.pipMode = false;
  }

  componentDidMount() {
    this.vopPipButton = document.querySelector('.vop-pip-button');

    this.onAdStarted = this.onAdStarted.bind(this);
    this.onAdComplete = this.onAdComplete.bind(this);
    this.player.on(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player.on(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
  }

  componentWillUnmount() {
    this.player.off(oldmtn.Events.AD_STARTED, this.onAdStarted);
    this.player.off(oldmtn.Events.AD_COMPLETE, this.onAdComplete);
  }

  render() {
    return (
      <button className={"vop-button vop-pip-button"} title="picture in picture"
        onClick={this.onUICmdPip.bind(this)}>
      </button>
    );
  }

  onUICmdPip() {
    this.pipMode = !this.pipMode;
    this.player.setPipPresentation(this.pipMode);
  }

  onAdStarted(e) {
    this.flagAdStarted = true;
    this.flagIsLinearAd = e.linear;
    this.flagIsVpaidAd = e.vpaid;

    if (this.flagAdStarted && this.flagIsLinearAd) {
      this.vopPipButton.style.display = 'none';
    } else {
      this.vopPipButton.style.display = 'inline-block';
    }
  }

  onAdComplete() {
    this.vopPipButton.style.display = 'inline-block';
  }
}


export default UIPipToggleButton;

