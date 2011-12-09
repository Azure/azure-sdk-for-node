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
var SharedKeyLiteTable = require('../../../lib/services/table/sharedkeylitetable');
var ServiceClient = require('../../../lib/services/serviceclient');
var WebResource = require('../../../lib/http/webresource');
var Constants = require('../../../lib/util/constants');
var HeaderConstants = Constants.HeaderConstants;
var QueryStringConstants = Constants.QueryStringConstants;

var sharedkey;

module.exports = testCase(
{
  setUp: function (callback) {
    sharedkey = new SharedKeyLiteTable(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY, false);

    callback();
  },

  tearDown: function (callback) {
    // clean up
    callback();
  },

  testSignRequest: function (test) {
    var webResource = WebResource.get('Tables');
    webResource.addOptionalHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml');
    webResource.addOptionalHeader(HeaderConstants.STORAGE_VERSION_HEADER, HeaderConstants.TARGET_STORAGE_VERSION);
    webResource.addOptionalHeader(HeaderConstants.DATE_HEADER, 'Fri, 23 Sep 2011 01:37:34 GMT');

    sharedkey.signRequest(webResource);
    test.equal(webResource.headers[HeaderConstants.AUTHORIZATION], 'SharedKeyLite devstoreaccount1:c8dPVfX0lX++AxpLHNLSU8Afdd7MIoIDNX0xzo1satk=');

    test.done();
  },

  testSignRequestServiceProperties: function (test) {
    var webResource = WebResource.get();
    webResource.addOptionalQueryParam(QueryStringConstants.RESTYPE, 'service');
    webResource.addOptionalQueryParam(QueryStringConstants.COMP, 'properties');
    webResource.addOptionalHeader(HeaderConstants.STORAGE_VERSION_HEADER, '2011-08-18');
    webResource.addOptionalHeader('User-Agent', 'WA-Storage/1.6.0');
    webResource.addOptionalHeader(HeaderConstants.DATE_HEADER, 'Mon, 05 Dec 2011 17:55:02 GMT');

    sharedkey.signRequest(webResource);
    test.equal(webResource.headers[HeaderConstants.AUTHORIZATION], 'SharedKeyLite devstoreaccount1:b89upLBiJ54w3Ju3zBv4GzThZGj/M6C3CdTm1BySj28=');

    test.done();
  }
});