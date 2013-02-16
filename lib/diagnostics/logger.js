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

Logger.logPriority = [ 
  Logger.LogLevels.EMERGENCY,
  Logger.LogLevels.ALERT,
  Logger.LogLevels.CRITICAL,
  Logger.LogLevels.ERROR,
  Logger.LogLevels.WARNING,
  Logger.LogLevels.NOTICE,
  Logger.LogLevels.INFO,
  Logger.LogLevels.DEBUG
];

function Logger(level, loggerFunction) {
  this.level = level;
  this.loggerFunction = loggerFunction;

  if (!this.loggerFunction) {
    this.loggerFunction = function (logLevel, msg) {
      var currentLevelIndex = Logger.logPriority.indexOf(level);
      var logLeveLIndex = Logger.logPriority.indexOf(logLevel);

      if (logLeveLIndex <= currentLevelIndex) {
        console.log(msg);
      }
    };
  }
}

Logger.prototype.log = function (level, msg) {
  this.loggerFunction(level, msg);
};