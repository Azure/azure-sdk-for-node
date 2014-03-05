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
var util = require('util');
var testutil = require('../../util/util');
var tc = require('../../stubs/Test.Serialization');
var fs = require('fs');
var nock = require('nock');
var azure = testutil.libRequire('azure');
var CertificateCloudCredentials = azure.CertificateCloudCredentials;
var TestSerializationClient = tc.TestSerializationClient;


suite('enum-datatype-deserialization-tests', function () {
  var size = { 
    Small: 'Small', 
    Medium: 'Medium',
    Large: 'Large',
    ExtraLarge: 'ExtraLarge'
  };
  var baseUri = 'http://helloworld';
  var subscriptionId = "c9cbd920-c00c-427c-852b-8aaf38badaeb";
  var pemfile = process.env.AZURE_CERTIFICATE_PEM_FILE;
  var credentials = new CertificateCloudCredentials({ subscriptionId: subscriptionId, pem: fs.readFileSync(pemfile).toString()});
  var testclient = new TestSerializationClient(credentials, baseUri);

  test('GetEnum with a valid enum value should deserialize properly', function (done) {
    var sizeValue = "Small";
    nock("http://helloworld")
    .get("/GetEnum")
    .reply(200, "<SIZE>" + sizeValue + "</SIZE>");
    testclient.complexDeserialization.getEnum(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      console.log('result: ' + util.inspect(result));
      result.size.should.equal(size.Small);
    });
    done();
  });
  
  test('GetEnum with an empty element should throw an error', function (done) {
    var sizeValue = "";
    nock("http://helloworld")
    .get("/GetEnum")
    .reply(200, "<SIZE>" + sizeValue + "</SIZE>");
    testclient.complexDeserialization.getEnum(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.exist(error);
      error.should.match(/Cannot deserialize an empty string/);
    });
    done();
  });
  
  test('GetEnum with a null element should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetEnum")
    .reply(200, "<SIZE />");
    testclient.complexDeserialization.getEnum(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.exist(error);
      error.should.match(/Cannot deserialize an empty string/);
    });
    done();
  });
  
  test('GetEnum with a nilable element should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetEnum")
    .reply(200, "<SIZE xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.complexDeserialization.getEnum(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.exist(error);
      error.should.match(/Cannot deserialize a null value/);
    });
    done();
  });
  
  test('GetEnumNilable with a valid enum value should deserialize properly', function (done) {
    var sizeValue = "Small";
    nock("http://helloworld")
    .get("/GetEnumNilable")
    .reply(200, "<STATUS>" + sizeValue + "</STATUS>");
    testclient.complexDeserialization.getEnumNilable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      console.log('result: ' + util.inspect(result));
      result.status.should.equal(size.Small);
    });
    done();
  });
  
  test('GetEnumNilable with an empty element should throw an error', function (done) {
    var sizeValue = "";
    nock("http://helloworld")
    .get("/GetEnumNilable")
    .reply(200, "<STATUS>" + sizeValue + "</STATUS>");
    testclient.complexDeserialization.getEnumNilable(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.exist(error);
      error.should.match(/Cannot deserialize an empty string/);
    });
    done();
  });
  
  test('GetEnumNilable with a null element should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetEnumNilable")
    .reply(200, "<STATUS />");
    testclient.complexDeserialization.getEnumNilable(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.exist(error);
      error.should.match(/Cannot deserialize an empty string/);
    });
    done();
  });
  
  test('GetEnumNilable with a nilable element should deserialize properly', function (done) {
    nock("http://helloworld")
    .get("/GetEnumNilable")
    .reply(200, "<STATUS xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.complexDeserialization.getEnumNilable(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.exist(error);
      error.should.match(/Cannot deserialize a null value/);
    });
    done();
  });
});