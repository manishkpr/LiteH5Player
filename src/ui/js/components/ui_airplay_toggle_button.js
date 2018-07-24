import { h, Component } from 'preact';

import UITools from '../ui_tools';

class UIAirplayToggleButton extends Component {
  constructor(props) {
    super(props);
    this.main = this.props.main;
    this.player = this.main.player;
  }

  componentDidMount() {
    this.vopAirplayButton = document.querySelector('.vop-airplay-button');

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
      <button className={"vop-button vop-airplay-button"} title="airplay"
        onClick={this.onUICmdAirplay.bind(this)}>
      </button>
    );
  }

  onUICmdAirplay() {
    this.player.showPlaybackTargetPicker();
  }

  onAdStarted(e) {
    this.flagAdStarted = true;
    this.flagIsLinearAd = e.linear;
    this.flagIsVpaidAd = e.vpaid;

    if (this.flagAdStarted && this.flagIsLinearAd) {
      this.vopAirplayButton.style.display = 'none';
    } else {
      this.vopAirplayButton.style.display = 'inline-block';
    }
  }

  onAdComplete() {
    this.vopAirplayButton.style.display = 'inline-block';
  }
}

export default UIAirplayToggleButton;

