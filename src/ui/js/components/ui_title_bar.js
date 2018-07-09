import {
  h, Component
} from 'preact';

class UITitleBar extends Component {
  constructor(props) {
    super(props);

    this.main = this.props.main;
  }

  render() {
    // let title = 'Sintel';
    // let description = 'A woman, Sintel, is attacked while traveling through a wintry mountainside. After defeating her attacker and taking his spear, she finds refuge in a shaman\'s hut...';
    let title = 'Big Buck Bunny';
    let description = 'Tired of being picked on by Frankie the squirrel and his band of puny forest creatures, JC the bunny finally decides to fight back.';

    let ret = (<div></div>);
    switch(this.main.playerState) {
      case 'idle':
      case 'opening':
      break;
      case 'opened':
      case 'playing':
      case 'paused':
      case 'ended':
      ret = (
        <div className='vop-titlebar'>
          <span className='vop-titlebar-title'>{title}</span>
          <span className='vop-titlebar-description'>{description}</span>
        </div>
      );
      break;
    }
    return ret;
  }
}

export default UITitleBar;
