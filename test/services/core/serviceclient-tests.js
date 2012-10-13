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
var testutil = require('../../util/util');
var azure = testutil.libRequire('azure');
var ServiceClient = azure.ServiceClient;

suite('serviceclient-tests', function () {
  test('NormalizedErrorsAreErrors', function (done) {
    var error = {
      'message': 'this is an error message',
      'ResultCode': 500,
      'somethingElse': 'goes here'
    };

    var normalizedError = ServiceClient.prototype._normalizeError(error);

    normalizedError.should.be.an.instanceOf(Error);
    normalizedError.should.have.keys('message', 'resultcode', 'somethingelse');

    done();
  });
});

