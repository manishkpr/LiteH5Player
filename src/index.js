import Events from './core/CoreEvents';
import Player from './Player';
import TestPlayer from './TestPlayer';
import CastSender from './cast/cast_sender';
import CastReceiver from './cast/cast_receiver';

// Shove both of these into the global scope
var context = (typeof window !== 'undefined' && window) || global;

var micromtn = context.micromtn;
if (!micromtn) {
    micromtn = context.micromtn = {};
}

micromtn.Player = Player;
micromtn.Events = Events;
micromtn.TestPlayer = TestPlayer;
micromtn.CastSender = CastSender;
micromtn.CastReceiver = CastReceiver;


export default micromtn;

