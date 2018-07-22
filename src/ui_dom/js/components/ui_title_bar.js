import { Component } from './ui_component';

class UITitleBar extends Component {
  constructor(props) {
    super(props);
    this.main = this.props.main;
  }

  toDom() {
    // let titleText = '';
    // let descriptionText = '';
    let titleText = 'Sintel';
    let descriptionText = 'A woman, Sintel, is attacked while traveling through a wintry mountainside. After defeating her attacker and taking his spear, she finds refuge in a shaman\'s hut...';
    // let titleText = 'Big Buck Bunny';
    // let descriptionText = 'Tired of being picked on by Frankie the squirrel and his band of puny forest creatures, JC the bunny finally decides to fight back.';

    let titleBar = document.createElement('div');
    titleBar.setAttribute('class', 'vop-titlebar');

    let title = document.createElement('span');
    title.setAttribute('class', 'vop-titlebar-title');
    title.innerText = titleText;

    let description = document.createElement('span');
    description.setAttribute('class', 'vop-titlebar-description');
    description.innerText = descriptionText;

    titleBar.appendChild(title);
    titleBar.appendChild(description);

    return titleBar;
  }

  // render() {
    // let title = '';
    // let description = '';
    // // let title = 'Sintel';
    // // let description = 'A woman, Sintel, is attacked while traveling through a wintry mountainside. After defeating her attacker and taking his spear, she finds refuge in a shaman\'s hut...';
    // // let title = 'Big Buck Bunny';
    // // let description = 'Tired of being picked on by Frankie the squirrel and his band of puny forest creatures, JC the bunny finally decides to fight back.';

  //   let ret = (<div></div>);
    
  //   switch(this.main.playerState) {
  //     case 'idle':
  //     case 'opening':
  //     break;
  //     case 'opened':
  //     case 'playing':
  //     case 'paused':
  //     case 'ended':
  //     ret = (
  //       <div className='vop-titlebar'>
  //         <span className='vop-titlebar-title'>{title}</span>
  //         <span className='vop-titlebar-description'>{description}</span>
  //       </div>
  //     );
  //     break;
  //   }
  //   return ret;
  // }
}

export default UITitleBar;


