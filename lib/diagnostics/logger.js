/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// Module dependencies.
var Log = require('log');

// Expose 'Logger'.
exports = module.exports = Logger;

Logger.LogLevels = {
  /**
  * System is unusable.
  */
  EMERGENCY: 'emergency',

  /**
  * Action must be taken immediately.
  */
  ALERT : 'alert',

  /**
  * Critical condition.
  */
  CRITICAL : 'critical',

  /**
  * Error condition.
  */
  ERROR : 'error',

  /**
  * Warning condition.
  */
  WARNING : 'warning',

  /**
  * Normal but significant condition.
  */
  NOTICE : 'notice',

  /**
  * Purely informational message.
  */
  INFO : 'info',

  /**
  * Application debug messages.
  */
  DEBUG : 'debug'
};

function Logger(level, stream) {
  this.logger = new Log(level, stream);
}

Logger.prototype.log = function (level, msg) {
  switch (level) {
    case Logger.LogLevels.EMERGENCY:
      this.logger.emergency(msg);
      break;
    case Logger.LogLevels.ALERT:
      this.logger.alert(msg);
      break;
    case Logger.LogLevels.CRITICAL:
      this.logger.critical(msg);
      break;
    case Logger.LogLevels.ERROR:
      this.logger.error(msg);
      break;
    case Logger.LogLevels.WARNING:
      this.logger.warning(msg);
      break;
    case Logger.LogLevels.NOTICE:
      this.logger.notice(msg);
      break;
    case Logger.LogLevels.INFO:
      this.logger.info(msg);
      break;
    case Logger.LogLevels.DEBUG:
      this.logger.debug(msg);
  }
};