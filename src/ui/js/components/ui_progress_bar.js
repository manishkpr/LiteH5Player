import {
  h,
  Component
} from 'preact';
import Events from '../events';

class UIProgressBar extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
    this.player = this.main.player;
    this.evEmitter = this.main.evEmitter;

    // flags reference variable of progress bar
    this.progressBarContext;
    this.progressBarMoveContext = {
      movePos: 0
    };
    this.flagThumbnailMode = false;
  }

  componentDidMount() {
    this.vopProgressBar = document.querySelector('.vop-progress-bar');
    this.vopLoadProgress = document.querySelector('.vop-load-progress');
    this.vopPlayProgress = document.querySelector('.vop-play-progress');
    this.vopHoverProgress = document.querySelector('.vop-hover-progress');
    this.vopScrubberContainer = document.querySelector('.vop-scrubber-container');

    this.onMediaDurationChanged = this.onMediaDurationChanged.bind(this);
    this.onMediaTimeupdated = this.onMediaTimeupdated.bind(this);
    this.onMediaSeeked = this.onMediaSeeked.bind(this);
    this.onAdTimeUpdate = this.onAdTimeUpdate.bind(this);

    this.player.on(oldmtn.Events.MEDIA_DURATION_CHANGED, this.onMediaDurationChanged);
    this.player.on(oldmtn.Events.MEDIA_TIMEUPDATE, this.onMediaTimeupdated);
    this.player.on(oldmtn.Events.MEDIA_SEEKED, this.onMediaSeeked);
    this.player.on(oldmtn.Events.AD_TIMEUPDATE, this.onAdTimeUpdate);
  }

  componentWillUnmount() {
    this.player.off(oldmtn.Events.MEDIA_DURATION_CHANGED, this.onMediaDurationChanged);
    this.player.off(oldmtn.Events.MEDIA_TIMEUPDATE, this.onMediaTimeupdated);
    this.player.off(oldmtn.Events.MEDIA_SEEKED, this.onMediaSeeked);
    this.player.off(oldmtn.Events.AD_TIMEUPDATE, this.onAdTimeUpdate);
  }

  render() {
    let endStyle = {
      loadProgressTransform: '',
      playProgressTransform: '',
      scrubberContainerTransform: '',
      uiPosition: 0
    };

    switch (this.main.playerState) {
      case 'ended':
        let position = this.player.getPosition();
        let duration = this.player.getDuration();
        if (this.progressBarContext) {
          this.progressBarContext.movePos = position;
        }
        endStyle = this.getProgressBarUIStyle(position, duration);
        break;
    }

    return (
      <div className='vop-progress-bar'
        onMouseDown={this.onProgressBarMouseDown.bind(this)}
        onMouseMove={this.onProgressBarMouseMove.bind(this)}
        onMouseLeave={this.onProgressBarMouseLeave.bind(this)}>
        <div className='vop-progress-list'>
          <div className={'vop-load-progress' + ' ' + endStyle.loadProgressTransform} ></div>
          <div className={'vop-hover-progress'}></div>
          <div className={'vop-play-progress' + ' ' + endStyle.playProgressTransform}></div>
        </div>
        <div className={'vop-scrubber-container' + ' ' + endStyle.scrubberContainerTransform}></div>
      </div>
    );
  }

  onMediaDurationChanged() {
    let position = this.player.getPosition();
    let duration = this.player.getDuration();
    this.updateProgressBarUI(position, duration);
  }

  onMediaTimeupdated() {
    //myPrintLog('+onMediaTimeupdated, position: ' + this.player.getPosition() + ', duration: ' + this.player.getDuration());

    // Sometime, the timeupdate will trigger after we mouse down on the progress bar,
    // in this situation, we won't update progress bar ui.
    if (this.progressBarContext) {
      // do nothing
    } else {
      //this.progressBarContext.movePos = this.player.getPosition();
      let position = this.player.getPosition();
      let duration = this.player.getDuration();
      this.updateProgressBarUI(position, duration);
      this.updateProgressBarHoverUI();
    }
  }

  onMediaSeeked() {
    myPrintLog('+onMediaSeeked, pos: ' + this.player.getPosition() +
      ', paused: ' + this.player.isPaused() +
      ', ended: ' + this.player.isEnded());

    if (this.progressBarContext) {
      if (!this.progressBarContext.pausedBeforeMousedown || this.progressBarContext.endedBeforeMousedown) {
        this.player.play();
      }
      this.progressBarContext = null;
    }
  }

  onAdTimeUpdate() {
    let position = this.player.getPosition();
    let duration = this.player.getDuration();
    //myPrintLog('ad position: ' + position + ', duration: ' + duration);
    this.updateProgressBarUI(position, duration);
  }

  onProgressBarMouseDown(e) {
    this.captureProgressBarMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    this.progressBarContext = {};
    this.progressBarContext.pausedBeforeMousedown = this.player.isPaused();
    this.progressBarContext.endedBeforeMousedown = this.player.isEnded();
    this.progressBarContext.posBeforeMousedown = this.player.getPosition();
    this.flagThumbnailMode = false;
    this.progressBarContext.timer = setTimeout(function() {
      this.doEnterThumbnailMode();
    }.bind(this), 200);

    // update progress bar ui
    this.progressBarContext.movePos = this.getProgressMovePosition(e);
    let position = this.player.getPosition();
    let duration = this.player.getDuration();
    this.updateProgressBarUI(position, duration);
    this.updateProgressBarHoverUI();
  }

  onProgressBarMouseMove(e) {
    //myPrintLog('+onProgressBarMouseMove, clientX: ' + e.clientX + ', clientY: ' + e.clientY);
    e.stopPropagation();
    this.main.removeAutohideAction();

    // if mouse down, just return
    if (this.progressBarContext ||
      this.main.settingMenuUIData.currMenu !== 'none') {
      return;
    }

    // update progress bar ui
    let movePos = this.getProgressMovePosition(e);
    this.progressBarMoveContext.movePos = movePos;
    this.updateProgressBarHoverUI();

    // 
    this.evEmitter.emit(Events.PROGRESSBAR_MOUSEMOVE, {
      movePos: movePos
    });
  }

  onProgressBarMouseLeave(e) {
    this.evEmitter.emit(Events.PROGRESSBAR_MOUSELEAVE);
    //myPrintLog('+onProgressBarMouseLeave');
  }

  captureProgressBarMouseEvents() {
    this.newProgressBarMousemove = this.docProgressBarMousemove.bind(this);
    this.newProgressBarMouseup = this.docProgressBarMouseup.bind(this);

    document.addEventListener('mousemove', this.newProgressBarMousemove, true);
    document.addEventListener('mouseup', this.newProgressBarMouseup, true);
  }

  releaseProgressBarMouseEvents() {
    document.removeEventListener('mousemove', this.newProgressBarMousemove, true);
    document.removeEventListener('mouseup', this.newProgressBarMouseup, true);
  }

  docProgressBarMousemove(e) {
    myPrintLog('+docProgressBarMousemove');

    let movePos = this.getProgressMovePosition(e);
    if (this.progressBarContext.movePos === movePos) {
      return;
    }

    this.doEnterThumbnailMode();
    this.doProcessThumbnailMove();

    this.progressBarContext.movePos = movePos;
    let position = this.player.getPosition();
    let duration = this.player.getDuration();
    this.updateProgressBarUI(position, duration);
    this.updateProgressBarHoverUI();

    this.evEmitter.emit(Events.PROGRESSBAR_MOUSEMOVE, {
      movePos: movePos
    });
  }

  docProgressBarMouseup(e) {
    myPrintLog('+docProgressBarMouseup');
    e.preventDefault();
    this.releaseProgressBarMouseEvents();

    if (this.flagThumbnailMode) {
      // thumbnail mode click event
      this.doProcessThumbnailUp();
    } else {
      // plain click event
      if (this.progressBarContext.timer) {
        // it's quick click, don't need to pause
        clearTimeout(this.progressBarContext.timer);
        this.progressBarContext.timer = null;
      }
    }

    // update ui first
    this.progressBarContext.movePos = this.getProgressMovePosition(e);
    let position = this.player.getPosition();
    let duration = this.player.getDuration();
    this.updateProgressBarUI(position, duration);
    this.updateProgressBarHoverUI();

    if (this.progressBarContext.posBeforeMousedown != this.progressBarContext.movePos) {
      this.player.setPosition(this.progressBarContext.movePos);
    } else {
      this.progressBarContext = null;
    }

    //
    this.evEmitter.emit(Events.PROGRESSBAR_MOUSELEAVE);
  }

  doEnterThumbnailMode() {
    myPrintLog('+doEnterThumbnailMode');
    if (!this.flagThumbnailMode) {
      // need to pause content first before starting a seek operation.
      if (!this.progressBarContext.pausedBeforeMousedown) {
        this.player.pause();
      }

      this.progressBarContext.timer = null;
      this.flagThumbnailMode = true;
    }
  }

  doProcessThumbnailMove() {
    // for further action, you can add thumbnail popup here.
  }

  doProcessThumbnailUp() {
    // for further action, you can add thumbnail ended event here.
  }

  getProgressMovePosition(e) {
    // part - input
    let rect = this.vopProgressBar.getBoundingClientRect();

    // part - logic process
    let offsetX = e.clientX - rect.left;
    if (offsetX < 0) {
      offsetX = 0;
    } else if (offsetX > rect.width) {
      offsetX = rect.width;
    }

    // update time progress scrubber button
    let duration = this.player.getDuration();
    return (offsetX / rect.width) * duration;
  }

  getProgressBarUIStyle(position, duration) {
    // part - logic process
    let uiPosition = 0;
    let loadProgressTransform = '';
    let playProgressTransform = '';
    let scrubberContainerTransform = '';

    let isLive = (duration === Infinity) ? true : false;
    if (isLive) {
      let seekable = this.player.getSeekableRange();
      let buffered = this.player.getBufferedRanges();
      //myPrintLog('seekable: ' + oldmtn.CommonUtils.TimeRangesToString(seekable) + ', buffered: ' + oldmtn.CommonUtils.TimeRangesToString(buffered));
    } else {
      let uiBufferedPos;
      if (this.progressBarContext) {
        uiPosition = this.progressBarContext.movePos;
      } else {
        uiPosition = position;
      }

      // part - output, update ui
      // update time progress bar
      uiBufferedPos = this.player.getValidBufferPosition(uiPosition);
      loadProgressTransform = 'scaleX(' + uiBufferedPos / duration + ')';
      playProgressTransform = 'scaleX(' + uiPosition / duration + ')';

      // update time progress scrubber button
      scrubberContainerTransform = 'translateX(' + ((uiPosition / duration) * this.vopProgressBar.clientWidth).toString() + 'px)';
    }

    let ret = {
      loadProgressTransform: loadProgressTransform,
      playProgressTransform: playProgressTransform,
      scrubberContainerTransform: scrubberContainerTransform,
      uiPosition: uiPosition
    };

    return ret;
  }

  updateProgressBarUI(position, duration) {
    // part - input
    let ret = this.getProgressBarUIStyle(position, duration);

    // part - logic process
    let isLive = (duration === Infinity) ? true : false;
    if (isLive) {} else {
      this.vopLoadProgress.style.transform = ret.loadProgressTransform;
      this.vopPlayProgress.style.transform = ret.playProgressTransform;

      // update time progress scrubber button
      this.vopScrubberContainer.style.transform = ret.scrubberContainerTransform;
    }
  }

  updateProgressBarHoverUI() {
    let position = this.player.getPosition();
    let duration = this.player.getDuration();

    let movePos = 0;
    if (this.progressBarContext) {
      //myPrintLog('test0703, this.progressBarContext.movePos: ' + this.progressBarContext.movePos);
    }
    //myPrintLog('test0703, this.progressBarMoveContext.movePos: ' + this.progressBarMoveContext.movePos);
    if (this.progressBarContext) {
      movePos = this.progressBarContext.movePos;
    } else if (this.progressBarMoveContext) {
      movePos = this.progressBarMoveContext.movePos;
    }
    //myPrintLog('test0703, movePost: ' + movePos);
    if (movePos <= position) {
      this.vopHoverProgress.style.transform = 'scaleX(0)';
    } else {
      let rect = this.vopProgressBar.getBoundingClientRect();
      let offsetX = (position / duration) * rect.width;
      this.vopHoverProgress.style.left = offsetX + 'px';
      this.vopHoverProgress.style.transform = 'scaleX(' + (movePos - position) / duration + ')';
    }
  }
}

export default UIProgressBar;