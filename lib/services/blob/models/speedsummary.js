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

var azureutil = require('../../../util/util');
var util = require('util');

/**
* Blob upload/download speed summary
*/
function SpeedSummary (name) {
  this.name = name;
  this._startTime = Date.now();
  this.totalSize = undefined;
  this.completeSize = 0;
}

/**
* Convert the size to human readable size
*/
function toHumanReadableSize(size, len) {
  if(!size) return '0B';
  if (!len || len <= 0) {
    len = 2;
  }
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor( Math.log(size) / Math.log(1024));
  return (size/Math.pow(1024, i)).toFixed(len) + units[i];
}

/**
* Get running seconds
*/
SpeedSummary.prototype.getElapsedSeconds = function(humanReadable) {
  var now = Date.now();
  var seconds = parseInt((now - this._startTime) / 1000, 10);
  if (humanReadable !== false) {
    var s = parseInt(seconds % 60, 10);
    seconds /= 60;
    var m = Math.floor(seconds % 60);
    seconds /= 60;
    var h = Math.floor(seconds);
    seconds = util.format('%s:%s:%s', azureutil.zeroPaddingString(h, 2), azureutil.zeroPaddingString(m, 2), azureutil.zeroPaddingString(s, 2));
  }
  return seconds;
};

/**
* Get complete percentage
* @param {int} len The number of digits after the decimal point.
*/
SpeedSummary.prototype.getCompletePercent = function(len) {
  if (this.totalSize) {
    if(!len || len <= 0) {
      len = 1;
    }
    return parseInt(this.completeSize * 100 / this.totalSize, 10).toFixed(len);
  } else {
    if(this.totalSize === 0) {
      return 100;
    } else {
      return 0;
    }
  }
};

/**
* Get average upload/download speed
*/
SpeedSummary.prototype.getAverageSpeed = function(humanReadable) {
  var elapsedTime = this.getElapsedSeconds(false);
  if (elapsedTime <= 0) {
    elapsedTime = 1;
  }
  var speed = this.completeSize / elapsedTime;
  if(humanReadable !== false) {
    speed = toHumanReadableSize(speed) + '/S';
  }
  return speed;
};

/**
* Increment the complete data size
*/
SpeedSummary.prototype.increment = function(len) {
  this.completeSize += len;
  return this.completeSize;
};

/**
* Get auto increment function
*/
SpeedSummary.prototype.getAutoIncrementFunction = function(size) {
  var self = this;
  return function(error, retValue) {
    if(error) {
      throw error;
    } else {
      var doneSize = 0;
      if((!retValue && retValue !== 0) || isNaN(retValue)) {
        doneSize = size;
      } else {
        doneSize = retValue;
      }
      self.increment(doneSize);
    }
  };
};

/**
* Get total size
*/
SpeedSummary.prototype.getTotalSize = function(humanReadable) {
  if (humanReadable !== false) {
    return toHumanReadableSize(this.totalSize);
  } else {
    return this.totalSize;
  }
};

/**
* Get completed data size
*/
SpeedSummary.prototype.getCompleteSize = function(humanReadable) {
  if (humanReadable !== false) {
    return toHumanReadableSize(this.completeSize);
  } else {
    return this.completeSize;
  }
};

module.exports = SpeedSummary;
