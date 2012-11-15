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

var should = require('should');
var testutil = require('../util/util');
var WebResource = require('../../lib/http/webresource');
var azure = testutil.libRequire('azure');
var Constants = azure.Constants;
var HeaderConstants = Constants.HeaderConstants;

suite('webresource-tests', function () {
  test('addOptionalAccessConditionHeader', function () {
    var ifMatch = 'ifmatch';
    var ifModifiedSince = 'ifModifiedSince';
    var ifNoneMatch = 'ifNoneMatch';
    var ifUnmodifiedSince = 'ifUnmodifiedSince';

    var accessConditions = {
      'If-Match': ifMatch,
      'If-Modified-Since': ifModifiedSince,
      'If-None-Match': ifNoneMatch,
      'If-Unmodified-Since': ifUnmodifiedSince
    };

    var webResource = new WebResource();
    webResource.addOptionalAccessConditionHeader(accessConditions);

    webResource.headers[HeaderConstants.IF_MATCH].should.equal(ifMatch);
    webResource.headers[HeaderConstants.IF_MODIFIED_SINCE].should.equal(ifModifiedSince);
    webResource.headers[HeaderConstants.IF_NONE_MATCH].should.equal(ifNoneMatch);
    webResource.headers[HeaderConstants.IF_UNMODIFIED_SINCE].should.equal(ifUnmodifiedSince);
  });

  test('addOptionalSourceAccessConditionHeader', function () {
    var sourceIfMatch = 'sourceIfmatch';
    var sourceIfModifiedSince = 'sourceIfModifiedSince';
    var sourceIfNoneMatch = 'sourceIfNoneMatch';
    var sourceIfUnmodifiedSince = 'sourceIfUnmodifiedSince';

    var accessConditions = {
      'x-ms-source-If-Match': sourceIfMatch,
      'x-ms-source-If-Modified-Since': sourceIfModifiedSince,
      'x-ms-source-If-None-Match': sourceIfNoneMatch,
      'x-ms-source-If-Unmodified-Since': sourceIfUnmodifiedSince
    };

    var webResource = new WebResource();
    webResource.addOptionalSourceAccessConditionHeader(accessConditions);

    webResource.headers[HeaderConstants.SOURCE_IF_MATCH_HEADER].should.equal(sourceIfMatch);
    webResource.headers[HeaderConstants.SOURCE_IF_MODIFIED_SINCE_HEADER].should.equal(sourceIfModifiedSince);
    webResource.headers[HeaderConstants.SOURCE_IF_NONE_MATCH_HEADER].should.equal(sourceIfNoneMatch);
    webResource.headers[HeaderConstants.SOURCE_IF_UNMODIFIED_SINCE_HEADER].should.equal(sourceIfUnmodifiedSince);
  });
});