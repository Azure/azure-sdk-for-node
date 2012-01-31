/**
* Copyright 2011 Microsoft Corporation
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

var queryString = require('querystring');

// Module dependencies.
var Constants = require('../../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

// Expose 'AcsTokenResult'.
exports = module.exports = AcsTokenResult;

function AcsTokenResult() {
}

AcsTokenResult.parse = function (acsTokenQueryString) {
  var acsTokenResult = new AcsTokenResult();

  var parsedQueryString = queryString.parse(acsTokenQueryString);
  acsTokenResult['wrap_access_token'] = parsedQueryString['wrap_access_token'];
  acsTokenResult['wrap_access_token_expires_in'] = parsedQueryString['wrap_access_token_expires_in'];

  return acsTokenResult;
};