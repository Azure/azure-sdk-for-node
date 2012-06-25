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
 * This class-like object allows to wait for multiple callbacks, 
 * calling final callback when one of the events happen: 
 *  all callbacks are finished
 *   or
 *  one of the callbacks had errors (non-null first argument) 
 * 
 */

var callbackAndAggregator = 
  exports.callbackAndAggregator = 
    function callbackAndAggregator(finalCallback) {
  
  var callbacks = {};
  var finished = {};
  var isErrorState = false;
  
  var ret = {};
  
  ret.isErrorState = function() {
    return isErrorState;
  };
  
  ret.getKeys = function() {
    return Object.keys(callbacks);
  };
  
  ret.isFinished = function() {
    return Object.keys(callbacks).length === Object.keys(finished).length;
  };
  
  ret.isInProgressFor = function(key) {
    if (!callbacks[key]) {
      return undefined;
    }
    return !finished[key];
  };
  
  ret.getCallbackArgs = function(key) {
    return finished[key];
  };
  
  var done = false;
  
  ret.getCallback = function(key) {
    if (typeof key !== 'string') {
      throw new Error('getCallback(): expected: string. Found: ' + key);
    }
    if (done || finished[key]) {
      return null;
    }
    if (!callbacks[key]) {
      callbacks[key] = function(error) {
        finished[key] = arguments;
        if (isErrorState) {
          return;
        }
        if (error && !error.isSuccessful) {
          isErrorState = true;
          done = true;
          if (finalCallback) finalCallback(finished, key, arguments);
          return;
        }
        if (ret.isFinished()) {
          done = true;
          if (finalCallback) finalCallback(finished);
        }        
      };    
    }
    return callbacks[key];
  };
  
  return ret;
};
