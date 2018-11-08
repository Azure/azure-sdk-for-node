// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var assert = require('assert');
var should = require('should');
var testClient = require('./data/TestClient/lib/testClient');
var CloudError = require('../lib/cloudError');

describe('CloudError', function () {
  it('should correctly deserialize additionalInfo', function (done) {
    var errorBody = `{
      "code": "BadArgument",
      "message": "The provided database ‘foo’ has an invalid username.",
      "target": "query",
      "details": [{
        "code": "301",
        "target": "$search",
        "message": "$search query option not supported",
        "additionalInfo": [{
          "type": "SomeErrorType",
          "info": {
            "someProperty": "SomeValue"
          }
        }]
      }]
    }`;

    var parsedError = JSON.parse(errorBody);
    var client = new testClient('http://localhost:9090');
    var mapper = new client.models['CloudError']().mapper();
    var deserializedError = client.deserialize(mapper, parsedError);

    deserializedError.code.should.equal('BadArgument');
    deserializedError.message.should.equal("The provided database ‘foo’ has an invalid username.");
    deserializedError.target.should.equal('query');
    deserializedError.details.length.should.equal(1);
    deserializedError.details[0].code.should.equal('301');
    deserializedError.details[0].additionalInfo.length.should.equal(1);
    deserializedError.details[0].additionalInfo[0].type.should.equal('SomeErrorType');
    deserializedError.details[0].additionalInfo[0].info.someProperty.should.equal('SomeValue');
    done();
  });
});