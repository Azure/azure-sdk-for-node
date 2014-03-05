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
var tc = require('../../stubs/Test.Serialization');
var fs = require('fs');
var nock = require('nock');
var util = require('util');

var azure = testutil.libRequire('azure');
var CertificateCloudCredentials = azure.CertificateCloudCredentials;
var TestSerializationClient = tc.TestSerializationClient;


suite('bool-datatype-deserialization-tests', function () {
  var baseUri = 'http://helloworld';
  var subscriptionId = "c9cbd920-c00c-427c-852b-8aaf38badaeb";
  var pemfile = process.env.AZURE_CERTIFICATE_PEM_FILE;
  var credentials = new CertificateCloudCredentials({ subscriptionId: subscriptionId, pem: fs.readFileSync(pemfile).toString()});
  var testclient = new TestSerializationClient(credentials, baseUri);

  test('GetBool with a true value should deserialize into true value', function (done) {
    nock("http://helloworld")
    .get("/GetBool")
    .reply(200, "<BoolValue>true</BoolValue>");
    testclient.deserialization.getBool(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.boolValue.should.equal(true);
    });
    done();
  });
  
  test('GetBool with a false value should deserialize into false value', function (done) {
    nock("http://helloworld")
    .get("/GetBool")
    .reply(200, "<BoolValue>false</BoolValue>");
    testclient.deserialization.getBool(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.boolValue.should.equal(false);
    });
    done();
  });
  
  test('GetBool with an empty value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetBool")
    .reply(200, "<BoolValue></BoolValue>");
    testclient.deserialization.getBool(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse a null value to a bool/);
    });
    done();
  });
  
  test('GetBool with a null value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetBool")
    .reply(200, "<BoolValue />");
    testclient.deserialization.getBool(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse a null value to a bool/);
    });
    done();
  });
  
  test('GetBool with an nil value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetBool")
    .reply(200, "<BoolValue xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getBool(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse a null value to a bool/);
    });
    done();
  });
  
  test('GetBoolNullable with a true value should deserialize into true value', function (done) {
    nock("http://helloworld")
    .get("/GetBoolNullable")
    .reply(200, "<BoolValue>true</BoolValue>");
    testclient.deserialization.getBoolNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.boolValue.should.equal(true);
    });
    done();
  });
  
  test('GetBoolNullable with a false value should deserialize into false value', function (done) {
    nock("http://helloworld")
    .get("/GetBoolNullable")
    .reply(200, "<BoolValue>false</BoolValue>");
    testclient.deserialization.getBoolNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.boolValue.should.equal(false);
    });
    done();
  });
  
  test('GetBoolNullable with a null elemet should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetBoolNullable")
    .reply(200, "<BoolValue />");
    testclient.deserialization.getBoolNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(result.boolValue, null);;
    });
    done();
  });
 
  test('GetBoolNullable with an empty element should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetBoolNullable")
    .reply(200, "<BoolValue></BoolValue>");
    testclient.deserialization.getBoolNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(result.boolValue, null);;
    });
    done();
  });
  
  test('GetBoolNullable with a nil value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetBoolNullable")
    .reply(200, "<BoolValue xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getBoolNullable(function (error, result) {
      should.exist(error);
      error.should.match(/Cannot parse a null value to a bool/);
    });
    done();
  });
  test('GetBoolNilableNullable with a true value should deserialize into true value', function (done) {
    nock("http://helloworld")
    .get("/GetBoolNilableNullable")
    .reply(200, "<BoolValue>true</BoolValue>");
    testclient.deserialization.getBoolNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.boolValue.should.equal(true);
    });
    done();
  });
  
  test('GetBoolNilableNullable with a false value should deserialize into false value', function (done) {
    nock("http://helloworld")
    .get("/GetBoolNilableNullable")
    .reply(200, "<BoolValue>false</BoolValue>");
    testclient.deserialization.getBoolNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.boolValue.should.equal(false);
    });
    done();
  });
  
  test('GetBoolNilableNullable with a null element should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetBoolNilableNullable")
    .reply(200, "<BoolValue />");
    testclient.deserialization.getBoolNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(result.boolValue, null);;
    });
    done();
  });
  
  test('GetBoolNilableNullable with an empty element should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetBoolNilableNullable")
    .reply(200, "<BoolValue></BoolValue>");
    testclient.deserialization.getBoolNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      assert.equal(result.boolValue, null);;
    });
    done();
  });
  
  test('GetBoolNilableNullable with a nil value should not be deserialized', function (done) {
    nock("http://helloworld")
    .get("/GetBoolNilableNullable")
    .reply(200, "<BOOLVALUE xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getBoolNilableNullable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      console.log(util.inspect(result));
      assert.equal(result.boolValue, null);;
    });
    done();
  });
});