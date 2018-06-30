import { h } from 'preact';
import Preact from 'preact';

import '../../assets/img/logo.png';

import UISubtitlesMenu from './ui_subtitles_menu';
import UISettingsMenu from './ui_settings_menu';
import UIQualityMenu from './ui_quality_menu';
import UIAudioTrackMenu from './ui_audio_track_menu';
import UIFccMenu from './ui_fcc_menu';
import UIFccPropertyMenu from './ui_fcc_property_menu';
import UIXSpeedMenu from './ui_xspeed_menu';

class UIPopupMenu extends Preact.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    return (
      <div className="vop-popup vop-settings-menu"
        onMouseDown={this.onPopupMenuMouseDown.bind(this)}>
        <div className="vop-panel">
          <UISubtitlesMenu main={this.main} />
          <UISettingsMenu main={this.main} />
          <UIQualityMenu main={this.main} />
          <UIAudioTrackMenu main={this.main} />
          <UIFccMenu main={this.main} />
          <UIFccPropertyMenu main={this.main} />
          <UIXSpeedMenu main={this.main} />
        </div>
      </div>
    );
  }

  onPopupMenuMouseDown(e) {
    // Don't route 'click' event from panel to its parent div
    e.stopPropagation();
  }
}

export default UIPopupMenu;

