// 
import Events from './core/CoreEvents';
import CommonUtils from './utils/common_utils';
import Player from './Player';
import CastSender from './cast/cast_sender';
import CastReceiver from './cast/cast_receiver';

// Shove both of these into the global scope
var context = (typeof window !== 'undefined' && window) || global;

var oldmtn = context.oldmtn;
if (!oldmtn) {
  oldmtn = context.oldmtn = {};
}

oldmtn.Player = Player;
oldmtn.Events = Events;
oldmtn.CastSender = CastSender;
oldmtn.CastReceiver = CastReceiver;

oldmtn.CommonUtils = CommonUtils;


/////////////////////////////////////////////////////////////////////////



export default oldmtn;

