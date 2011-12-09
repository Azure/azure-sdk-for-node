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

var testCase = require('nodeunit').testCase;
var SharedKey = require('../../../lib/services/blob/sharedkey');
var ServiceClient = require('../../../lib/services/serviceclient');
var WebResource = require('../../../lib/http/webresource');
var Constants = require('../../../lib/util/constants');
var QueryStringConstants = Constants.QueryStringConstants;
var HeaderConstants = Constants.HeaderConstants;

var sharedkey;

module.exports = testCase(
{
  setUp: function (callback) {
    sharedkey = new SharedKey(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY, false);

    callback();
  },

  tearDown: function (callback) {
    // clean up
    callback();
  },

  testSignRequest: function (test) {
    var webResource = WebResource.get('container');
    webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'container');
    webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, '');
    webResource.addOptionalHeader(HeaderConstants.STORAGE_VERSION_HEADER, HeaderConstants.TARGET_STORAGE_VERSION);
    webResource.addOptionalHeader(HeaderConstants.DATE_HEADER, 'Fri, 23 Sep 2011 01:37:34 GMT');

    sharedkey.signRequest(webResource);
    test.equal(webResource.headers[HeaderConstants.AUTHORIZATION], 'SharedKey devstoreaccount1:Y5R86+6XE5MH602SIyjeTwlJuQjbawv20PT4kb/F/04=');

    test.done();
  }
});