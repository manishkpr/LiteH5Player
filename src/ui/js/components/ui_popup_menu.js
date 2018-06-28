import React from 'react';

import '../../assets/img/logo.png';

import UISubtitleMenu from './ui_subtitle_menu';
import UISettingMenu from './ui_setting_menu';
import UIQualityMenu from './ui_quality_menu';
import UIAudioTrackMenu from './ui_audio_track_menu';
import UIFccMenu from './ui_fcc_menu';
import UIFccPropertyMenu from './ui_fcc_property_menu';
import UIXSpeedMenu from './ui_xspeed_menu';

class UIPopupMenu extends React.Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    return (
      <div className="vop-popup vop-settings-menu"
        onMouseDown={this.onPopupMenuMouseDown.bind(this)}>
        <div className="vop-panel">
          <UISubtitleMenu main={this.main} />
          <UISettingMenu main={this.main} />
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

