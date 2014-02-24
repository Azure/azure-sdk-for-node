// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

var should = require('should');
var testutil = require('../../util/util');
var util = require('util');
var tc = require('../../stubs/Test.Serialization');
var fs = require('fs');
var nock = require('nock');
var azure = testutil.libRequire('azure');
var CertificateCloudCredentials = azure.CertificateCloudCredentials;
var TestSerializationClient = tc.TestSerializationClient;


suite('float-datatype-deserialization-tests', function () {
  var baseUri = 'http://helloworld';
  var subscriptionId = "c9cbd920-c00c-427c-852b-8aaf38badaeb";
  var pemfile = process.env.AZURE_CERTIFICATE_PEM_FILE;
  var credentials = new CertificateCloudCredentials({ subscriptionId: subscriptionId, pem: fs.readFileSync(pemfile).toString()});
  var testclient = new TestSerializationClient(credentials, baseUri);

  test('GetFloat with a 2^53 (9007199254740992) should deserialize into 2^53', function (done) {
    nock("http://helloworld")
    .get("/GetFloat")
    .reply(200, "<FLOATVALUE>9007199254740992</FLOATVALUE>");
    testclient.deserialization.getFloat(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.floatValue.should.equal(9007199254740992);
    });
    done();
  });
  
  test('GetFloat with a 2^53 + 1 should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetFloat")
    .reply(200, "<FLOATVALUE>9007199254740993</FLOATVALUE>");
    testclient.deserialization.getFloat(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse an integer beyond 2^53/);
      should.not.exist(result.floatValue);
    });
    done();
  });
  
  test('GetFloat with a -2^53 (-9007199254740992) should deserialize into -2^53', function (done) {
    nock("http://helloworld")
    .get("/GetFloatNullable")
    .reply(200, "<FLOATVALUE>-9007199254740992</FLOATVALUE>");
    testclient.deserialization.getFloatNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.floatValue.should.equal(-9007199254740992);
    });
    done();
  });
  
  test('GetFloat with a '+ Number.MAX_VALUE + ' should deserialize properly', function (done) {
    var num = Number.MAX_VALUE;
    nock("http://helloworld")
    .get("/GetFloat")
    .reply(200, "<FLOATVALUE>"+ num + "</FLOATVALUE>");
    testclient.deserialization.getFloat(function (error, result) {
      should.not.exist(error);
      result.floatValue.should.equal(num);
    });
    done();
  });
  
  test('GetFloat with a '+ Number.MIN_VALUE + ' should deserialize properly', function (done) {
    var num = Number.MIN_VALUE;
    nock("http://helloworld")
    .get("/GetFloat")
    .reply(200, "<FLOATVALUE>"+ num + "</FLOATVALUE>");
    testclient.deserialization.getFloat(function (error, result) {
      should.not.exist(error);
      result.floatValue.should.equal(num);
    });
    done();
  });
  
  test('GetFloat with a '+ Number.NaN + ' value should throw an error', function (done) {
    var num = Number.NaN;
    nock("http://helloworld")
    .get("/GetFloat")
    .reply(200, "<FLOATVALUE>"+ num + "</FLOATVALUE>");
    testclient.deserialization.getFloat(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse NaN to a float/);
      should.not.exist(result.floatValue);
    });
    done();
  });
  
  test('GetFloat with a '+ Number.NEGATIVE_INFINITY + ' value should throw an error', function (done) {
    var num = Number.NEGATIVE_INFINITY;
     nock("http://helloworld")
    .get("/GetFloat")
    .reply(200, "<FLOATVALUE>"+ num + "</FLOATVALUE>");
    testclient.deserialization.getFloat(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse Number.NEGATIVE_INFINITY to an integer/);
      should.not.exist(result.floatValue);
    });
    done();
  });
  
  test('GetFloat with a '+ Number.POSITIVE_INFINITY + ' value should throw an error', function (done) {
    var num = Number.POSITIVE_INFINITY;
    nock("http://helloworld")
    .get("/GetFloat")
    .reply(200, "<FLOATVALUE>"+ num + "</FLOATVALUE>");
    testclient.deserialization.getFloat(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse Number.NEGATIVE_INFINITY to a float/);
      should.not.exist(result.floatValue);
    });
    done();
  });
  
  test('GetFloat with an empty value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetFloat")
    .reply(200, "<FLOATVALUE></FLOATVALUE>");
    testclient.deserialization.getFloat(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot deserialize a null to a float/);
    });
    done();
  });
  
  test('GetFloat with a null value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetFloat")
    .reply(200, "<FLOATVALUE />");
    testclient.deserialization.getFloat(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot deserialize a null to an int/);
    });
    done();
  });
  
  test('GetFloat with an nil value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetFloat")
    .reply(200, "<FLOATVALUE xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getFloat(function (error, result) {
      should.exist(error);
    });
    done();
  });
  
  test('GetFloatNullable with a 0 value should deserialize into 0 value', function (done) {
    nock("http://helloworld")
    .get("/GetFloatNullable")
    .reply(200, "<FLOATVALUE>0</FLOATVALUE>");
    testclient.deserialization.getFloatNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.floatValue.should.equal(0);
    });
    done();
  });
  
  test('GetFloatNullable with a -1 value should deserialize into -1 value', function (done) {
    nock("http://helloworld")
    .get("/GetFloatNullable")
    .reply(200, "<FLOATVALUE>-1</FLOATVALUE>");
    testclient.deserialization.getFloatNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.floatValue.should.equal(-1);
    });
    done();
  });
  
  test('GetFloatNullable with a null value should deserialize into undefined value', function (done) {
    nock("http://helloworld")
    .get("/GetFloatNullable")
    .reply(200, "<INTVALUE />");
    testclient.deserialization.getFloatNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.floatValue.should.equal(null);
    });
    done();
  });
// 
  test('GetFloatNullable with an empty value should deserialize into undefined', function (done) {
    nock("http://helloworld")
    .get("/GetFloatNullable")
    .reply(200, "<FLOATVALUE></FLOATVALUE>");
    testclient.deserialization.getFloatNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.floatValue.should.be.NaN;
    });
    done();
  });
  
  test('GetFloatNullable with a nil value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetFloatNullable")
    .reply(200, "<FLOATVALUE xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getFloatNullable(function (error, result) {
      should.exist(error);
    });
    done();
  });
  
  test('GetFloatNilableNullable with a null value should deserialize into undefined value', function (done) {
    nock("http://helloworld")
    .get("/GetFloatNilableNullable")
    .reply(200, "<FLOATVALUE />");
    testclient.deserialization.getFloatNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.floatValue.should.be.NaN;
    });
    done();
  });
  
  test('GetFloatNilableNullable with an empty value should deserialize into undefined', function (done) {
    nock("http://helloworld")
    .get("/GetFloatNilableNullable")
    .reply(200, "<FLOATVALUE></FLOATVALUE>");
    testclient.deserialization.getFloatNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.floatValue.should.be.NaN;
    });
    done();
  });
  
  test('GetFloatNilableNullable with a nil value should deserialize into undefined', function (done) {
    nock("http://helloworld")
    .get("/GetFloatNilableNullable")
    .reply(200, "<FLOATVALUE xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getFloatNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      should.not.exist(result.floatValue);
    });
    done();
  });

});