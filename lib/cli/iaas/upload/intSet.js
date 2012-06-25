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
 * intSet
 * 
 * Implements some operations with integer range sets
 * 
 */

// Create int set from start, end or from ranges array of {start : start, end : end} objects
// Caveat: range array is not copied. Please do not modify it after set creation.

var createIntSet = 
  exports.createIntSet = 
    function createIntSet(start, end) {
  
  var v;
  
  switch (typeof start) {
    
  case 'number':
    v = start > end ? [] : [{ start : start, end : end }];
    break;
  
  case 'object':
    v = start;
    for (var i in v) {
      if (v[i].start > v[i].end || (i > 0 && v[i].start <= v[i - 1].end)) {
        throw new Error('intSet.createIntSet(ranges): incorrectly formed or intersected with previous interval ' + 
            i + ': [' + v[i].start + ', ' + v[i].end + ']');
      }
    }
    break;

  default:
    throw new Error ('intSet.createIntSet(): incorrect type of start value: ' + start);

  }
  
  function subtractRanges(ranges) {
    for (var i in ranges) {
      subtractInterval(ranges[i].start, ranges[i].end);
    }
  }
  
  function getMin() {
    if (!isEmpty()) {
      return v[0].start;
    }
  }
  
  function getMax() {
    if (!isEmpty()) {
      return v[v.length - 1].end;
    }
  }
  
  function intersects2(start1, end1, start2, end2) {
    return !(end1 < start2 || end2 < start1); // assuming ordered start and end
  }
  
  function intersects(start, end) {
    for (var i in v) {
     if (intersects2(v[i].start, v[i].end, start, end))
       return true;
    }
    return false;
  }
  
  function subtractInterval(start, end) {
    if (typeof start !== 'number' || typeof end !=='number' || start % 1 || end % 1) {
      throw new Error('Integer numbers are expected in subtractInterval()');
    }
    if (start > end) {
      return;
    }
    for (var i = v.length; --i >= 0;) { // need to go backwards here
       if (v[i].start > end || v[i].end < start) {
         continue;
       }
       if (v[i].start >= start && v[i].end <= end) {
         // delete it
         v.splice(i, 1);
         continue;
      }
      if (v[i].start < start && v[i].end > end) {
        // split
        v.splice(i, 1, {start : v[i].start, end : start - 1}, {start : end + 1, end : v[i].end});
        continue;
      }
      if (v[i].start < start) {
        v[i].end = start - 1;
      } else {
        v[i].start = end + 1;
      }
    }
  }

  function isEmpty() {
    return v.length === 0;
  }

  function toString() {
    if (v.length === 0) {
      return '{ }';
    }
    var s = '';
    for (var i = 0; i < v.length; ++i) {
      if (i) {
        s += ' U ';
      }
      s += ('[' + v[i].start + ', ' + v[i].end + ']');
    }
    return s;
   } 

  function getInterval(i) {
    return i >= v.length || i < 0 ? null : {start : v[i].start, end : v[i].end};
  } 

  function getIntervalCount() {
    return v.length;
  }
   
  return {  
    subtractInterval : subtractInterval,
    isEmpty : isEmpty,
    toString : toString,
    getInterval : getInterval,
    getIntervalCount : getIntervalCount,
    subtractRanges : subtractRanges,
    intersects : intersects,
    getMin : getMin,
    getMax : getMax
  };
};


