import {
  h, Component
} from 'preact';


import UIPlayToggleButton from './ui_play_toggle_button';
import UIVolumeToggleButton from './ui_volume_toggle_button';
import UIVolumeBar from './ui_volume_bar';
import UITimeLabel from './ui_time_label';

import UIPipToggleButton from './ui_pip_toggle_button';
import UIAirplayToggleButton from './ui_airplay_toggle_button';
import UIChromecastToggleButton from './ui_chromecast_toggle_button';
import UISubtitlesToggleButton from './ui_subtitles_toggle_button';
import UISettingsToggleButton from './ui_settings_toggle_button';
import UIFullscreenToggleButton from './ui_fullscreen_toggle_button';

class UIControlBar extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    return (
      <div className="vop-control-bar">
        <div className="vop-left-controls">
          <UIPlayToggleButton main={this.main} />
          <UIVolumeToggleButton main={this.main} />
          <UIVolumeBar main={this.main} />
          <UITimeLabel main={this.main} />
        </div>
        <div className="vop-right-controls">
          <UIPipToggleButton main={this.main} />
          <UIAirplayToggleButton main={this.main} />
          <UIChromecastToggleButton main={this.main} />
          <UISubtitlesToggleButton main={this.main} />
          <UISettingsToggleButton main={this.main} />
          <UIFullscreenToggleButton main={this.main} />
        </div>
      </div>
    );
  }
}

export default UIControlBar;




