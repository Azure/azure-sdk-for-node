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

var Constants = require('../../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

exports.create = function() {
  return function handle (resource, next, callback) {
    exports.addStorageHeaders(resource);
    return next(resource, callback);
  };
};

exports.addStorageHeaders = function (resource) {
  resource.withHeader(HeaderConstants.STORAGE_VERSION_HEADER, this.apiVersion);
  resource.withHeader(HeaderConstants.DATE_HEADER, new Date().toUTCString());
  resource.withHeader(HeaderConstants.ACCEPT_HEADER, 'application/atom+xml,application/xml');
  resource.withHeader(HeaderConstants.ACCEPT_CHARSET_HEADER, 'UTF-8');
};