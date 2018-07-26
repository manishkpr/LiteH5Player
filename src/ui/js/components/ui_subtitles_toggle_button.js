import { h, Component } from 'preact';

import Events from '../events';
import ID from '../id';

class UISubtitlesToggleButton extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.evEmitter = this.main.evEmitter;
  }

  componentDidMount() {
    this.vopSubtitlesButton = document.querySelector('.vop-subtitles-button');

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
      <button data-id={ID.SUBTITLES_BUTTON} className="vop-button vop-subtitles-button" title="subtitles"
        onClick={this.onUICmdSubtitles.bind(this)}
        onMouseMove={this.onControlMouseMove.bind(this)}>
      </button>
    );
  }

  onUICmdSubtitles() {
    if (this.main.settingMenuUIData.currMenu !== 'subtitles_menu') {
      this.main.settingMenuUIData.currMenu = 'subtitles_menu';
    } else {
      this.main.settingMenuUIData.currMenu = 'none';
    }
    this.evEmitter.emit(Events.POPUPMENU_CHANGE, { menu: this.main.settingMenuUIData.currMenu });
  }

  onControlMouseMove(e) {
    e.stopPropagation();
    this.main.removeAutohideAction();
  }

  onAdStarted(e) {
    this.flagAdStarted = true;
    this.flagIsLinearAd = e.linear;
    this.flagIsVpaidAd = e.vpaid;

    if (this.flagAdStarted && this.flagIsLinearAd) {
      this.vopSubtitlesButton.style.display = 'none';
    } else {
      this.vopSubtitlesButton.style.display = 'inline-block';
    }
  }

  onAdComplete() {
    this.vopSubtitlesButton.style.display = 'inline-block';
  }
}

export default UISubtitlesToggleButton;
