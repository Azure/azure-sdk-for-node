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

/**
 * jonTracker
 * 
 * Track upload jobs
 * 
 * Tracks what needs to be uploaded, including error re-try
 * Estimates progress %%
 */

var getJobTracker = 
  exports.getJobTracker = 
    function getJobTracker(indexCount) {
  
  var fullIndex = -1;
  var errorList = [];
  var completed = 0;
  
  function getIndex() {
    if (fullIndex >= indexCount) {
      return errorList[fullIndex - indexCount];
    }
    return fullIndex;
  }
  
  var tracker = {
      getCompletedPart : function() { return completed / indexCount;},
      getRequestedPart : function() { return (fullIndex + 1 - errorList.length) / indexCount;},
      getIndex : getIndex,
      getCompleted : function() { return completed;},
      nextIndex : function() {
        ++fullIndex;
        var nextIndex = getIndex();
        if (nextIndex === undefined) {
          --fullIndex;
        }
        return nextIndex;
      },
      isDone : function () {
        return completed >= indexCount;
      },
      done : function(doneIndex) {
        if (completed < indexCount) {
          completed++;
        }
        return completed >= indexCount;
      },
      error : function(errorIndex) {
        if (typeof errorIndex !== 'number' || errorIndex < 0 || errorIndex >= indexCount) {
          throw new Error('jobTracker.error() expects index in valid range, was : ' + errorIndex);
        }
        errorList.push(errorIndex);
        return errorList.length;
      },
      getErrorRate : function() {
        var all = completed + errorList.length;
        return all === 0 ? 0 : errorList.length / all;
      }
      
  };
  return tracker;
};

