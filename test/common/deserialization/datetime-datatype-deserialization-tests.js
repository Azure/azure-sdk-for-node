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

// strips the milliseconds from the Date object in ISOString() format
//2014-02-22T00:56:09.000Z -> 2014-02-22T00:56:09
function stripMilliseconds (time) {
  return time.slice(0,-5);
}

suite('datetime-datatype-deserialization-tests', function () {
  var baseUri = 'http://helloworld';
  var subscriptionId = "c9cbd920-c00c-427c-852b-8aaf38badaeb";
  var pemfile = process.env.AZURE_CERTIFICATE_PEM_FILE;
  var credentials = new CertificateCloudCredentials({ subscriptionId: subscriptionId, pem: fs.readFileSync(pemfile).toString()});
  var testclient = new TestSerializationClient(credentials, baseUri);
  
  test('GetDateTime with current date time value should deserialize properly', function (done) {
    var nowDate = new Date(Date.now());
    var isoNowString = stripMilliseconds(nowDate.toISOString());
    var utcNowString = nowDate.toUTCString();
    nock("http://helloworld")
    .get("/GetDateTime")
    .reply(200, "<DateTimeValue>" + isoNowString + "</DateTimeValue>");
    testclient.deserialization.getDateTime(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      var resultDateString = stripMilliseconds(result.dateTimeValue.toISOString());
      new Date(resultDateString).valueOf().should.equal(new Date(utcNowString).valueOf());
    });
    done();
  });
  
  test('GetDateTime with max date time value should deserialize properly', function (done) {
    var maxDate = new Date(8640000000000000);
    var isoMaxstr = stripMilliseconds(maxDate.toISOString());
    var utcMaxstr = maxDate.toUTCString();
    nock("http://helloworld")
    .get("/GetDateTime")
    .reply(200, "<DateTimeValue>" + isoMaxstr + "</DateTimeValue>");
    testclient.deserialization.getDateTime(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      var resultDateString = stripMilliseconds(result.dateTimeValue.toISOString());
      new Date(resultDateString).valueOf().should.equal(new Date(utcMaxstr).valueOf());
    });
    done();
  });
  
  test('GetDateTime with min date time value should deserialize properly', function (done) {
    var minDate = new Date(-8640000000000000);
    var isoMinstr = stripMilliseconds(minDate.toISOString());
    nock("http://helloworld")
    .get("/GetDateTime")
    .reply(200, "<DateTimeValue>" + isoMinstr + "</DateTimeValue>");
    testclient.deserialization.getDateTime(function (error, result) {
      should.not.exist(error);
      should.exist(result);
      var resultDateString = stripMilliseconds(result.dateTimeValue.toISOString());
      new Date(resultDateString).valueOf().should.equal(minDate.valueOf());
    });
    done();
  });
    
  test('GetDateTime with empty element should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetDateTime")
    .reply(200, "<DateTimeValue></DateTimeValue>");
    testclient.deserialization.getDateTime(function (error, result) {
      should.exist(error);
    });
    done();
  });
  
  test('GetDateTime with nil value should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetDateTime")
    .reply(200, "<DateTimeValue xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getDateTime(function (error, result) {
      should.exist(error);
    });
    done();
  });
  
  test('GetDateTime with null element should throw an error', function (done) {
    nock("http://helloworld")
    .get("/GetDateTime")
    .reply(200, "<DateTimeValue />");
    testclient.deserialization.getDateTime(function (error, result) {
      should.exist(error);
    });
    done();
  });
  
  test('GetDateTimeNilableNullable with a nil value should deserialize into undefined value', function (done) {
    nock("http://helloworld")
    .get("/GetDateTimeNilableNullable")
    .reply(200, "<DateTimeValue xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getDateTimeNilableNullable(function (error, result) {
      should.not.exist(error);
      should.not.exist(result.dateTimeValue);
    });
    done();
  });
  
  test('GetDateTimeNilableNullable with an empty value should deserialize into undefined', function (done) {
    nock("http://helloworld")
    .get("/GetDateTimeNilableNullable")
    .reply(200, "<DateTimeValue></DateTimeValue>");
    testclient.deserialization.getDateTimeNilableNullable(function (error, result) {
      should.not.exist(error);
      result.dateTimeValue.should.equal(undefined);
    });
    done();
  });
  
  test('GetDateTimeNilableNullable with null element should deserialize into undefined', function (done) {
    nock("http://helloworld")
    .get("/GetDateTime")
    .reply(200, "<DateTimeValue />");
    testclient.deserialization.getDateTime(function (error, result) {
      should.not.exist(error);
      result.dateTimeValue.should.equal(undefined);
    });
    done();
  });
  
  test('GetDateTimeNullable with a nil value should deserialize into undefined value', function (done) {
    nock("http://helloworld")
    .get("/GetDateTimeNullable")
    .reply(200, "<DateTimeValue xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:nil=\"true\" />");
    testclient.deserialization.getDateTimeNullable(function (error, result) {
      should.not.exist(error);
      should.not.exist(result.dateTimeValue);
    });
    done();
  });
  
  test('GetDateTimeNullable with an empty value should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetDateTimeNilableNullable")
    .reply(200, "<DateTimeValue></DateTimeValue>");
    testclient.deserialization.GetDateTimeNullable(function (error, result) {
      should.not.exist(error);
      result.dateTimeValue.should.equal(null);
    });
    done();
  });
  
  test('GetDateTimeNullable with null element should deserialize into null', function (done) {
    nock("http://helloworld")
    .get("/GetDateTime")
    .reply(200, "<DateTimeValue />");
    testclient.deserialization.getDateTime(function (error, result) {
      should.not.exist(error);
      result.dateTimeValue.should.equal(null);
    });
    done();
  });

});