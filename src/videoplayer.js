import FactoryMaker from './core/FactoryMaker';

function VideoPlayer() {
  let context_ = this.context;

  function setSrc(url) {
    // mediaElement.pause();
    // mediaElement.src='';
    context_.media.src = url;

    let media_ = context_.media;
    console.log(`timeupdate, main buffered: ${TimeRanges.toString(media_.buffered)}, position: ${media_.currentTime}, duration: ${media_.duration}`);
  }

  let instance_ = {
    setSrc: setSrc
  };

  return instance_;
}


VideoPlayer.__h5player_factory_name = 'VideoPlayer';
export default FactoryMaker.getSingletonFactory(VideoPlayer);





