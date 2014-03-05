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


suite('array-datatype-deserialization-tests', function () {
  var baseUri = 'http://helloworld';
  var subscriptionId = "c9cbd920-c00c-427c-852b-8aaf38badaeb";
  var pemfile = process.env.AZURE_CERTIFICATE_PEM_FILE;
  var credentials = new CertificateCloudCredentials({ subscriptionId: subscriptionId, pem: fs.readFileSync(pemfile).toString()});
  var testclient = new TestSerializationClient(credentials, baseUri);

  test('GetPrimitiveSequence with valid primitive values should deserialize properly', function (done) {
    nock("http://helloworld")
    .get("/GetPrimitiveSequence")
    .reply(200, "<LIST><STRING>Hello world</STRING><STRING>Hurray!!</STRING></LIST>");
    testclient.complexDeserialization.getPrimitiveSequence(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.list.length.should.equal(2);
      result.list[0].should.equal('Hello world');
      result.list[1].should.equal('Hurray!!');
    });
    done();
  });
  
  test('GetPrimitiveSequence with valid primitive values should deserialize properly', function (done) {
    var xml = "<foo><bar>baz lab=\"fui\"</bar></foo>";
    nock("http://helloworld")
    .get("/GetPrimitiveSequence")
    .reply(200, "<LIST><STRING>One</STRING><STRING>Two</STRING><STRING>&lt;foo&gt;&lt;bar&gt;baz lab=&quot;fui&quot;&lt;/bar&gt;&lt;/foo&gt;</STRING></LIST>");
    testclient.complexDeserialization.getPrimitiveSequence(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      console.log('result: ' + JSON.stringify(result));
      result.list.length.should.equal(3);
      result.list[0].should.equal('One');
      result.list[1].should.equal('Two');
      result.list[2].should.equal(xml);
    });
    done();
  });
  
  test('GetPrimitiveSequence with a nilable list should throw an error', function (done) {
    var listValue = "<LIST xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />";
    console.log('response xml: ' + util.inspect(listValue));
    nock("http://helloworld")
    .get("/GetPrimitiveSequence")
    .reply(200, listValue);
    testclient.complexDeserialization.getPrimitiveSequence(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.exist(error);
      error.should.match(/Cannot deserialize a nilable list/);
    });
    done();
  });
  
  test('GetPrimitiveSequence with a null list should deserialize into an empty array', function (done) {
    var listValue = "<LIST />";
    console.log('response xml: ' + util.inspect(listValue));
    nock("http://helloworld")
    .get("/GetPrimitiveSequence")
    .reply(200, listValue);
    testclient.complexDeserialization.getPrimitiveSequence(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.not.exist(error);
      should.exist(result);
      result.list.length.should.equal(0);
    });
    done();
  });
  
  test('GetPrimitiveSequence with an empty list should deserialize into an empty array', function (done) {
    var listValue = "<LIST></LIST>";
    console.log('response xml: ' + util.inspect(listValue));
    nock("http://helloworld")
    .get("/GetPrimitiveSequence")
    .reply(200, listValue);
    testclient.complexDeserialization.getPrimitiveSequence(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.not.exist(error);
      should.exist(result);
      result.list.length.should.equal(0);
    });
    done();
  });
  
  test('GetPrimitiveSequence with empty, null, valid and encoded element items should deserialize properly', function (done) {
    var xml = "<foo><bar>baz lab=\"fui\"</bar></foo>";
    var listValue = "<LIST><STRING></STRING><STRING /><STRING>three</STRING><STRING>&lt;foo&gt;&lt;bar&gt;baz lab=&quot;fui&quot;&lt;/bar&gt;&lt;/foo&gt;</STRING></LIST>";
    nock("http://helloworld")
    .get("/GetPrimitiveSequence")
    .reply(200, listValue);
    testclient.complexDeserialization.getPrimitiveSequence(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.not.exist(error);
      should.exist(result);
      result.list.length.should.equal(4);
      result.list[0].should.equal('');
      result.list[1].should.equal('');
      result.list[2].should.equal('three');
      result.list[3].should.equal(xml);
    });
    done();
  });
  
  test('GetPrimitiveSequence with nilable element item should throw an error', function (done) {
    var listValue = "<LIST><STRING></STRING><STRING /><STRING>three</STRING><STRING xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" /></LIST>";
    nock("http://helloworld")
    .get("/GetPrimitiveSequence")
    .reply(200, listValue);
    testclient.complexDeserialization.getPrimitiveSequence(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.exist(error);
      error.should.match(/Cannot deserialize a list with empty items/);
    });
    done();
  });

  test('GetPrimitiveSequenceNilable with valid primitive values should deserialize properly', function (done) {
    nock("http://helloworld")
    .get("/GetPrimitiveSequenceNilable")
    .reply(200, "<LIST><STRING>Hello world</STRING><STRING>Hurray!!</STRING></LIST>");
    testclient.complexDeserialization.getPrimitiveSequenceNilable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      console.log('result: ' + util.inspect(result));
      result.list.length.should.equal(2);
      result.list[0].should.equal('Hello world');
      result.list[1].should.equal('Hurray!!');
    });
    done();
  });
  
  test('GetPrimitiveSequenceNilable with null, empty and nil element items should throw an error', function (done) {
    var listValue = "<LIST><STRING></STRING><STRING /><STRING xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" /></LIST>";
    console.log('response xml: ' + util.inspect(listValue));
    nock("http://helloworld")
    .get("/GetPrimitiveSequenceNilable")
    .reply(200, listValue);
    testclient.complexDeserialization.getPrimitiveSequenceNilable(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.exist(error);
      error.should.match(/Cannot deserialize a list with null items/);
    });
    done();
  });
  
  test('GetPrimitiveSequenceNilable with a nilable list should deserialize into null', function (done) {
    var listValue = "<LIST xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />";
    console.log('response xml: ' + util.inspect(listValue));
    nock("http://helloworld")
    .get("/GetPrimitiveSequenceNilable")
    .reply(200, listValue);
    testclient.complexDeserialization.getPrimitiveSequenceNilable(function (error, result) {
      console.log('result: ' + util.inspect(result));
      should.not.exist(error);
      should.exist(result);
      should.not.exist(result.list);
    });
    done();
  });
  
  test('GetPrimitiveSequenceNilable with a null list should deserialize into an empty array', function (done) {
    var listValue = "<LIST />";
    nock("http://helloworld")
    .get("/GetPrimitiveSequenceNilable")
    .reply(200, listValue);
    testclient.complexDeserialization.getPrimitiveSequenceNilable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.list.length.should.equal(0);
    });
    done();
  });
  
  test('GetPrimitiveSequenceNilable with an empty list should deserialize into an empty array', function (done) {
    var listValue = "<LIST></LIST>";
    nock("http://helloworld")
    .get("/GetPrimitiveSequenceNilable")
    .reply(200, listValue);
    testclient.complexDeserialization.getPrimitiveSequenceNilable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.list.length.should.equal(0);
    });
    done();
  });
  
  test('GetPrimitiveSequenceNilable with empty, null, valid nilable and encoded element items should deserialize properly', function (done) {
    var xml = "<foo><bar>baz lab=\"fui\"</bar></foo>";
    var listValue = "<LIST><STRING></STRING><STRING /><STRING>three</STRING><STRING xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" /><STRING>&lt;foo&gt;&lt;bar&gt;baz lab=&quot;fui&quot;&lt;/bar&gt;&lt;/foo&gt;</STRING></LIST>";
    nock("http://helloworld")
    .get("/GetPrimitiveSequenceNilable")
    .reply(200, listValue);
    testclient.complexDeserialization.getPrimitiveSequenceNilable(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      result.list.length.should.equal(5);
      result.list[0].should.equal('');
      result.list[1].should.equal('');
      result.list[2].should.equal('three');
      should.not.exist(result.list[3]);
      result.list[4].should.equal(xml);
    });
    done();
  });
});