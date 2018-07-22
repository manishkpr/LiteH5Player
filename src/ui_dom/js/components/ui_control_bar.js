import { Component } from './ui_component';

import UIPlayToggleButton from './ui_play_toggle_button';
import UIVolumeToggleButton from './ui_volume_toggle_button';
import UIVolumeBar from './ui_volume_bar';
// import UITimeLabel from './ui_time_label';

import UISpacer from './ui_spacer';

import UIPipToggleButton from './ui_pip_toggle_button';
// import UIAirplayToggleButton from './ui_airplay_toggle_button';
// import UIChromecastToggleButton from './ui_chromecast_toggle_button';
// import UISubtitlesToggleButton from './ui_subtitles_toggle_button';
// import UISettingsToggleButton from './ui_settings_toggle_button';
import UIFullscreenToggleButton from './ui_fullscreen_toggle_button';

class UIControlBar extends Component {
  constructor(props) {
    super(props);
    this.main = this.props.main;

    this.components = [
      new UIPlayToggleButton({main: this.main}),
      new UIVolumeToggleButton({main: this.main}),
      new UIVolumeBar({main: this.main}),
      new UISpacer({main: this.main}),
      new UIPipToggleButton({main: this.main}),
      new UIFullscreenToggleButton({main: this.main})
    ];
  }

  toDom() {
    let container = document.createElement('div');
    container.setAttribute('class', 'vop-control-bar');

    this.components.forEach(function(item, index) {
      let element = item.toDom();
      container.appendChild(element);
    });

    return container;
  }

  // render() {
  //   return (
  //     <div className="vop-control-bar">
  //       <UIPlayToggleButton main={this.main} />
  //       <UIVolumeToggleButton main={this.main} />
  //       <UIVolumeBar main={this.main} />
  //       <UITimeLabel main={this.main} />
  //       <div className="vop-spacer"></div>
  //       <UIPipToggleButton main={this.main} />
  //       <UIAirplayToggleButton main={this.main} />
  //       <UIChromecastToggleButton main={this.main} />
  //       <UISubtitlesToggleButton main={this.main} />
  //       <UISettingsToggleButton main={this.main} />
  //       <UIFullscreenToggleButton main={this.main} />
  //     </div>
  //   );
  // }
}

export default UIControlBar;