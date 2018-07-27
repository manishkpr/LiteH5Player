/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */
import EventBus from './EventBus';
import Events from './events';
import FactoryMaker from './FactoryMaker';

const LOG_LEVEL_NONE = 0;
const LOG_LEVEL_FATAL = 1;
const LOG_LEVEL_ERROR = 2;
const LOG_LEVEL_WARNING = 3;
const LOG_LEVEL_INFO = 4;
const LOG_LEVEL_DEBUG = 5;

/**
 * @module Debug
 */
function Debug() {

  let context = this.context;
  let eventBus = EventBus(context).getInstance();

  const logFn = [];

  let instance,
    logToBrowserConsole,
    showLogTimestamp,
    showCalleeName,
    startTime;

  function setup() {
    logToBrowserConsole = true;
    showLogTimestamp = true;
    showCalleeName = true;
    startTime = new Date().getTime();

    if (typeof window !== 'undefined' && window.console) {
      logFn[LOG_LEVEL_FATAL] = getLogFn(window.console.error);
      logFn[LOG_LEVEL_ERROR] = getLogFn(window.console.error);
      logFn[LOG_LEVEL_WARNING] = getLogFn(window.console.warn);
      logFn[LOG_LEVEL_INFO] = getLogFn(window.console.info);
      logFn[LOG_LEVEL_DEBUG] = getLogFn(window.console.debug);
    }
  }

  function getLogFn(fn) {
    if (fn && fn.bind) {
      return fn.bind(window.console);
    }
    // if not define, return the default function for reporting logs
    return window.console.log.bind(window.console);
  }

  /**
   * Prepends a timestamp in milliseconds to each log message.
   * @param {boolean} value Set to true if you want to see a timestamp in each log message.
   * @default false
   * @memberof module:Debug
   * @instance
   */
  function setLogTimestampVisible(value) {
    showLogTimestamp = value;
  }
  /**
   * Prepends the callee object name, and media type if available, to each log message.
   * @param {boolean} value Set to true if you want to see the callee object name and media type in each log message.
   * @default false
   * @memberof module:Debug
   * @instance
   */
  function setCalleeNameVisible(value) {
    showCalleeName = value;
  }
  /**
   * Toggles logging to the browser's javascript console.  If you set to false you will still receive a log event with the same message.
   * @param {boolean} value Set to false if you want to turn off logging to the browser's console.
   * @default true
   * @memberof module:Debug
   * @instance
   */
  function setLogToBrowserConsole(value) {
    logToBrowserConsole = value;
  }
  /**
   * Use this method to get the state of logToBrowserConsole.
   * @returns {boolean} The current value of logToBrowserConsole
   * @memberof module:Debug
   * @instance
   */
  function getLogToBrowserConsole() {
    return logToBrowserConsole;
  }

  function fatal(...params) {
    doLog(LOG_LEVEL_FATAL, ...params);
  }

  function error(...params) {
    doLog(LOG_LEVEL_ERROR, ...params);
  }
  
  function warn(...params) {
    doLog(LOG_LEVEL_WARNING, ...params);
  }
  
  function info(...params) {
    doLog(LOG_LEVEL_INFO, ...params);
  }

  function debug(...params) {
    doLog(LOG_LEVEL_DEBUG, ...params);
  }

  function log(...params) {
    doLog(LOG_LEVEL_DEBUG, ...params);
  }

  /**
   * This method will allow you send log messages to either the browser's console and/or dispatch an event to capture at the media player level.
   * @param {...*} arguments The message you want to log. The Arguments object is supported for this method so you can send in comma separated logging items.
   * @memberof module:Debug
   * @instance
   */
  function doLog(level, ...params) {
    let message = '';
    let logTime = null;

    if (showLogTimestamp) {
      // old from dashjs
      //logTime = new Date().getTime();
      //message += '[' + (logTime - startTime) + ']';
      // new by oldmtn
      logTime = new Date();
      message += '[' + ('0' + (logTime.getMonth() + 1)).slice(-2) + '-' +
        ('0' + logTime.getDate()).slice(-2) + ' ' +
        ('0' + logTime.getHours()).slice(-2) + ':' +
        ('0' + logTime.getMinutes()).slice(-2) + ':' +
        ('0' + logTime.getSeconds()).slice(-2) + '.' +
        ('0' + logTime.getMilliseconds()).slice(-3) + ']';
    }

    if (showCalleeName && this && this.getClassName) {
      message += '[' + this.getClassName() + ']';
      if (this.getType) {
        message += '[' + this.getType() + ']';
      }
    }

    if (message.length > 0) {
      message += ' ';
    }

    Array.apply(null, params).forEach(function(item) {
      message += item + ' ';
    });

    if (logFn[level]) {
      logFn[level](message);
    }

    eventBus.trigger(Events.LOG, {
      message: message
    });
  }

  instance = {
    fatal: fatal,
    error: error,
    warn: warn,
    info: info,
    debug: debug,
    log: log,
    setLogTimestampVisible: setLogTimestampVisible,
    setCalleeNameVisible: setCalleeNameVisible,
    setLogToBrowserConsole: setLogToBrowserConsole,
    getLogToBrowserConsole: getLogToBrowserConsole
  };

  setup();

  return instance;
}

Debug.__h5player_factory_name = 'Debug';
const factory = FactoryMaker.getSingletonFactory(Debug);
factory.LOG_LEVEL_NONE = LOG_LEVEL_NONE;
factory.LOG_LEVEL_FATAL = LOG_LEVEL_FATAL;
factory.LOG_LEVEL_ERROR = LOG_LEVEL_ERROR;
factory.LOG_LEVEL_WARNING = LOG_LEVEL_WARNING;
factory.LOG_LEVEL_INFO = LOG_LEVEL_INFO;
factory.LOG_LEVEL_DEBUG = LOG_LEVEL_DEBUG;
export default factory;