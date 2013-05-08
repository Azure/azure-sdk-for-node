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

var testutil = require('../../util/util');
var mockData = null;

var sinon = require('sinon');
var _performRequestOriginal;
var _performRequestStub;
var _originalClass;

function HDInsightUtil(originalClass) {
  _originalClass = originalClass;
  _performRequestOriginal = originalClass.prototype._performRequest;
  console.log(_performRequestOriginal);
  originalClass.prototype._performRequestOriginal = originalClass.prototype._performRequest;
  _performRequestStub = sinon.stub(originalClass.prototype, '_performRequest', function(webResource, body, options, callback) {
    var response;
    var result;
    if (!mockData) {
      this._performRequestOriginal(webResource, body, options, callback);
    }
    else if (mockData.errorCode) {
      response = {
        isSuccessful: false,
        statusCode: mockData.statusCode,
        body: { Error: { '$': {}, Code: mockData.errorCode, Message: mockData.message } }
      };

      var err = [];
      err['Error'] = mockData.message;
      err.code = mockData.errorCode;
      result = { error: err, response: response };
      callback(result, function(responseObject, finalCallback) {
        finalCallback(responseObject);
      });
    }
    else if (mockData.body) {
      response = {
        isSuccessful: true,
        statusCode: 200,
        body: mockData.body
      };
      result = { error: null, response: response };
      callback(result, function(responseObject, finalCallback) {
        finalCallback(responseObject);
      });
    }
  });
  originalClass.prototype._performRequest = _performRequestStub;
  // hdInsight._performRequest = function(webResource, body, options, callback) {
  //   if (!isMocked) {
  //     _performRequestOriginal(webResource, body, options, callback);
  //   }
}

module.exports = HDInsightUtil;

HDInsightUtil.prototype.StubProcessRequestWithError = function(statusCode, errorCode, message) {
  mockData = { statusCode: statusCode, errorCode: errorCode, message: message };
};

HDInsightUtil.prototype.NoStubProcessRequest = function() {
  mockData = null;
};

HDInsightUtil.prototype.StubProcessRequestWithSuccess = function(body) {
  mockData = { body: body };
};

HDInsightUtil.prototype.Revert = function() {
  _originalClass.prototype._performRequest = _performRequestOriginal;
};