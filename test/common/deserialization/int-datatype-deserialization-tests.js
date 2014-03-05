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
var assert = require('assert');
var testutil = require('../../util/util');
var util = require('util');
var tc = require('../../stubs/Test.Serialization');
var fs = require('fs');
var nock = require('nock');
var azure = testutil.libRequire('azure');
var CertificateCloudCredentials = azure.CertificateCloudCredentials;
var TestSerializationClient = tc.TestSerializationClient;


suite('int-datatype-deserialization-tests', function () {
  var baseUri = 'http://helloworld';
  var subscriptionId = "c9cbd920-c00c-427c-852b-8aaf38badaeb";
  var pemfile = process.env.AZURE_CERTIFICATE_PEM_FILE;
  var credentials = new CertificateCloudCredentials({ subscriptionId: subscriptionId, pem: fs.readFileSync(pemfile).toString()});
  var testclient = new TestSerializationClient(credentials, baseUri);

  test('GetInt with a 2^53 (9007199254740992) should deserialize into 2^53', function (done) {
    nock("http://helloworld")
    .get("/GetInt")
    .reply(200, "<IntValue>9007199254740992</IntValue>");
    testclient.deserialization.getInt(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.intValue.should.equal(9007199254740992);
    });
    done();
  });
  
  test('GetInt with a 2^53 + 1 should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetInt")
    .reply(200, "<IntValue>9007199254740993</IntValue>");
    testclient.deserialization.getInt(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse an integer beyond 2^53/);
      assert.equal(result.intValue, null);
    });
    done();
  });
  
  test('GetInt with a -2^53 (-9007199254740992) should deserialize into -2^53', function (done) {
    nock("http://helloworld")
    .get("/GetIntNullable")
    .reply(200, "<IntValue>-9007199254740992</IntValue>");
    testclient.deserialization.getIntNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.intValue.should.equal(-9007199254740992);
    });
    done();
  });
  
  test('GetInt with a '+ Number.MAX_VALUE + ' value should throw an error', function (done) {
    var num = Number.MAX_VALUE;
    nock("http://helloworld")
    .get("/GetInt")
    .reply(200, "<IntValue>"+ num + "</IntValue>");
    testclient.deserialization.getInt(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse Number.MAX_VALUE to an integer/);
    });
    done();
  });
  
  test('GetInt with a '+ Number.MIN_VALUE + ' value should throw an error', function (done) {
    var num = Number.MIN_VALUE;
    nock("http://helloworld")
    .get("/GetInt")
    .reply(200, "<IntValue>"+ num + "</IntValue>");
    testclient.deserialization.getInt(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse Number.MIN_VALUE to an integer/);
    });
    done();
  });
  
  test('GetInt with a '+ Number.NaN + ' value should throw an error', function (done) {
    var num = Number.NaN;
    nock("http://helloworld")
    .get("/GetInt")
    .reply(200, "<IntValue>"+ num + "</IntValue>");
    testclient.deserialization.getInt(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse NaN to an integer/);
    });
    done();
  });
  
  test('GetInt with a '+ Number.NEGATIVE_INFINITY + ' value should throw an error', function (done) {
    var num = Number.NEGATIVE_INFINITY;
     nock("http://helloworld")
    .get("/GetInt")
    .reply(200, "<IntValue>"+ num + "</IntValue>");
    testclient.deserialization.getInt(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse Number.NEGATIVE_INFINITY to an integer/);
    });
    done();
  });
  
  test('GetInt with a '+ Number.POSITIVE_INFINITY + ' value should throw an error', function (done) {
    var num = Number.POSITIVE_INFINITY;
    nock("http://helloworld")
    .get("/GetInt")
    .reply(200, "<IntValue>"+ num + "</IntValue>");
    testclient.deserialization.getInt(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse Number.NEGATIVE_INFINITY to an integer/);
    });
    done();
  });
  
  test('GetInt with an empty value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetInt")
    .reply(200, "<IntValue></IntValue>");
    testclient.deserialization.getInt(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot deserialize a null to an int/);
    });
    done();
  });
  
  test('GetInt with a null value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetInt")
    .reply(200, "<IntValue />");
    testclient.deserialization.getInt(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot deserialize a null to an int/);
    });
    done();
  });
  
  test('GetInt with an nil value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetInt")
    .reply(200, "<IntValue xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getInt(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot deserialize a null to an int/);
    });
    done();
  });
  
  test('GetIntNullable with a 0 value should deserialize into 0 value', function (done) {
    nock("http://helloworld")
    .get("/GetIntNullable")
    .reply(200, "<IntValue>0</IntValue>");
    testclient.deserialization.getIntNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.intValue.should.equal(0);
    });
    done();
  });
  
  test('GetIntNullable with a -1 value should deserialize into -1 value', function (done) {
    nock("http://helloworld")
    .get("/GetIntNullable")
    .reply(200, "<IntValue>-1</IntValue>");
    testclient.deserialization.getIntNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.intValue.should.equal(-1);
    });
    done();
  });
  
  test('GetIntNullable with a null element should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetIntNullable")
    .reply(200, "<INTVALUE />");
    testclient.deserialization.getIntNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(result.intValue, null);
    });
    done();
  });
 
  test('GetIntNullable with an empty element should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetIntNullable")
    .reply(200, "<IntValue></IntValue>");
    testclient.deserialization.getIntNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(result.intValue, null);
    });
    done();
  });
  
  test('GetIntNullable with a nil element should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetIntNullable")
    .reply(200, "<IntValue xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getIntNullable(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot deserialize a null to an int/);
    });
    done();
  });
  
  test('GetIntNilableNullable with a null element should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetIntNilableNullable")
    .reply(200, "<IntValue />");
    testclient.deserialization.getIntNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(result.intValue, null);
    });
    done();
  });
  
  test('GetIntNilableNullable with an empty element should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetIntNilableNullable")
    .reply(200, "<IntValue></IntValue>");
    testclient.deserialization.getIntNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(result.intValue, null);
    });
    done();
  });
  
  test('GetIntNilableNullable with a nil element should be deserialized into null', function (done) {
    nock("http://helloworld")
    .get("/GetIntNilableNullable")
    .reply(200, "<IntValue xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getIntNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(result.intValue, null);
    });
    done();
  });

});