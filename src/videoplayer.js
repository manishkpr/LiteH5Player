import FactoryMaker from './core/FactoryMaker';

function VideoPlayer() {
  let context_ = this.context;

  function setSrc(url) {
    context_.media.src = url;
  }

  let instance_ = {
    setSrc: setSrc
  };

  return instance_;
}


VideoPlayer.__h5player_factory_name = 'VideoPlayer';
export default FactoryMaker.getSingletonFactory(VideoPlayer);





