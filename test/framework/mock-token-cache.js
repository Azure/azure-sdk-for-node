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

'use strict';

var _ = require('underscore');
var util = require('util');

//
// An Adal token cache implementation that serves up fake
// tokens, used in mock test playback. Always returns a
// cache hit on find, ignores add and remove calls.
//

function createSearchEntry(resource, query) {
  var entry = {
    resource: resource,
    accessToken: 'fakeToken',
    refreshToken: 'fakeToken',
    expiresIn: 24 * 60 * 60, // seconds until expiration
    expiresOn: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isMRRT: true
  };
  _.extend(entry, query);
  return entry;
}

function MockTokenCache() {
}

_.extend(MockTokenCache.prototype, {
  add: function () {
    // deliberate noop
  },
  
  remove: function () {
    // deliberate noop
  },
  
  find: function (query, callback) {
    // Used by most management commands.
    var mgmtEntry = createSearchEntry('https://management.core.windows.net/', query);
    // Used by keyvault 'key' and 'secret' commands, which access the Data Plane service.
    var keyVaultEntry = createSearchEntry('https://vault.azure.net', query);
    process.nextTick(function () {
      callback(null, [mgmtEntry, keyVaultEntry]);
    });
  }
});

module.exports = MockTokenCache;
