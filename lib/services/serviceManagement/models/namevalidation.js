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

var validNameRegex = /^[a-zA-Z][a-zA-Z0-9-]*$/
var illegalEndings = /(-|-sb|-mgmt|-cache|-appfabric)$/;

/**
* Validates that a Service Bus namespace name
* is legally allowable. Does not check availability.
*
* @param {string} name the name to check
*
* @return nothing. Throws exception if name is invalid, message
*                  describes what validity criteria it violates.
*/

function namespaceNameIsValid(name, callback) {
  var fail;

  if(callback) {
    fail = function (err) {
      callback(new Error(err));
      return false;
    }
  } else {
    fail = function (err) {
      throw new Error(err);
    }
    callback = function () {};
  }

  if (name.length < 6 || name.length > 50) {
    return fail('Service Bus namespace names must be 6 to 50 characters long.');
  }
  if (!validNameRegex.test(name)) {
    return fail('Service Bus namespace names must start with a letter and include only letters, digits, and hyphens');
  }
  if (illegalEndings.test(name)) {
    return fail('Service Bus namespace names may not end with "-", "-sb", "-mgmt", "-cache", or "-appfabric"');
  }

  callback();
  return true;
}

module.exports = namespaceNameIsValid;