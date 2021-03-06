﻿import Events from './core/events';
import { ErrorTypes } from './core/errors';
import CommonUtils from './utils/common_utils';
import Player from './Player';
import CastReceiver from './cast/cast_receiver';

import UIEngine from './ui/js/ui_engine';

// Test
import SplitMP4 from '../third_party/mp4/splitmp4';


// Shove both of these into the global scope
var context = (typeof window !== 'undefined' && window) || global;

var oldmtn = context.oldmtn;
if (!oldmtn) {
  oldmtn = context.oldmtn = {};
}

oldmtn.Player = Player;
oldmtn.Events = Events;
oldmtn.ErrorTypes = ErrorTypes;
oldmtn.CastReceiver = CastReceiver;

oldmtn.CommonUtils = CommonUtils;

oldmtn.UIEngine = UIEngine;

/////////////////////////////////////////////////////////////////////////

oldmtn.SplitMP4 = SplitMP4;

export default oldmtn;






