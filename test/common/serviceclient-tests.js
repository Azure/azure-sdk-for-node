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
var sinon = require('sinon');
var testutil = require('../util/util');
var azure = testutil.libRequire('azure');
var ServiceClient = azure.ServiceClient;

var sandbox;

describe('serviceclient-tests', function () {
  before(function () {
    sandbox = sinon.sandbox.create();
  });

  after(function () {
    sandbox.restore();
  });

  describe('_parseResponse', function () {
    it('should work for XML replies with headers without content-type', function (done) {
      var response = {
        body: '<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<error xmlns=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\">\r\n  <code>TableAlreadyExists</code>\r\n  <message xml:lang=\"en-US\">The table specified already exists.\nRequestId:ebcc9f6b-c774-4f22-b4a9-078a393394eb\nTime:2013-05-30T20:57:11.1474844Z</message>\r\n</error>',
        headers: {
          'cache-control': 'no-cache',
          'transfer-encoding': 'chunked'
        }
      };

      var obj = { xml2jsSettings: ServiceClient._getDefaultXml2jsSettings() };
      var parsedResponse = ServiceClient._parseResponse.call(obj, response, obj.xml2jsSettings);
      should.exist(parsedResponse);
      should.exist(parsedResponse.body.error);
      parsedResponse.body.error.code.should.equal('TableAlreadyExists');

      done();
    });

    it('should work for XML replies without headers', function (done) {
      var response = {
        body: '<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<error xmlns=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\">\r\n  <code>TableAlreadyExists</code>\r\n  <message xml:lang=\"en-US\">The table specified already exists.\nRequestId:ebcc9f6b-c774-4f22-b4a9-078a393394eb\nTime:2013-05-30T20:57:11.1474844Z</message>\r\n</error>'
      };

      var obj = { xml2jsSettings: ServiceClient._getDefaultXml2jsSettings() };
      var parsedResponse = ServiceClient._parseResponse.call(obj, response, obj.xml2jsSettings);
      should.exist(parsedResponse);
      should.exist(parsedResponse.body.error);
      parsedResponse.body.error.code.should.equal('TableAlreadyExists');

      done();
    });

    it('should work for XML replies with headers mixed casing', function (done) {
      var response = {
        body: '<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\r\n<error xmlns=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\">\r\n  <code>TableAlreadyExists</code>\r\n  <message xml:lang=\"en-US\">The table specified already exists.\nRequestId:ebcc9f6b-c774-4f22-b4a9-078a393394eb\nTime:2013-05-30T20:57:11.1474844Z</message>\r\n</error>',
        headers: {
          'content-type': 'application/XML'
        }
      };

      var obj = { xml2jsSettings: ServiceClient._getDefaultXml2jsSettings() };
      var parsedResponse = ServiceClient._parseResponse.call(obj, response, obj.xml2jsSettings);
      should.exist(parsedResponse);
      should.exist(parsedResponse.body.error);
      parsedResponse.body.error.code.should.equal('TableAlreadyExists');

      done();
    });

    it('should work for strings with code without content-type', function (done) {
      var response = {
        body: 'code: TableAlreadyExists\r\n'
      };

      var obj = { xml2jsSettings: ServiceClient._getDefaultXml2jsSettings() };
      var parsedResponse = ServiceClient._parseResponse.call(obj, response, obj.xml2jsSettings);
      should.exist(parsedResponse);
      should.exist(parsedResponse.body.error);
      parsedResponse.body.error.code.should.equal('TableAlreadyExists');

      done();
    });

    it('should work for strings with code and detail without content-type', function (done) {
      var response = {
        body: 'code: TableAlreadyExists\r\ndetail: The table already exists'
      };

      var obj = { xml2jsSettings: ServiceClient._getDefaultXml2jsSettings() };
      var parsedResponse = ServiceClient._parseResponse.call(obj, response, obj.xml2jsSettings);
      should.exist(parsedResponse);
      should.exist(parsedResponse.body.error);
      parsedResponse.body.error.code.should.equal('TableAlreadyExists');
      parsedResponse.body.error.detail.should.equal('The table already exists');

      done();
    });

    it('should work for JSON replies', function (done) {
      var response = {
        body: '{ "hithere": "Something" }',
        headers: {
          'content-type': 'application/json'
        }
      };

      var obj = { xml2jsSettings: ServiceClient._getDefaultXml2jsSettings() };
      var parsedResponse = ServiceClient._parseResponse.call(obj, response, obj.xml2jsSettings);
      should.exist(parsedResponse);
      parsedResponse.body.hithere.should.equal('Something');

      done();
    });
  });

  describe('NormalizedErrors', function () {
    it('not in odata error format should be parsed properly', function (done) {
      var error = { 
        Error: {
          'detail': 'this is an error message',
          'ResultCode': 500,
          'somethingElse': 'goes here'
        }
      };

      var normalizedError = ServiceClient._normalizeError(error);
      normalizedError.should.be.an.instanceOf(Error);
      normalizedError.should.have.keys('detail', 'resultcode', 'somethingelse');

      done();
    });

    it('in odata error format should be parsed properly', function (done) {
      var error = {
        'odata.error': {
          'code': 'Request_ResourceNotFound',
          'message' : {
            'lang': 'en',
            'value': 'Resource \'helloworld\' does not exist or one of its queried reference-property objects are not present.'
          }
        }
      };
      var normalizedError = ServiceClient._normalizeError(error, {statusCode: 404});
      normalizedError.should.be.an.instanceOf(Error);
      normalizedError.should.have.keys('code', 'statusCode');
      done();
    });

    it('in odata error format with message as a string instead of object should be parsed properly', function (done) {
      var error = {
        'odata.error': {
          'code': 'Request_ResourceNotFound',
          'message' : 'Resource \'helloworld\' does not exist or one of its queried reference-property objects are not present.'
        }
      };
      var normalizedError = ServiceClient._normalizeError(error, {statusCode: 404});
      normalizedError.should.be.an.instanceOf(Error);
      normalizedError.should.have.keys('code', 'statusCode');
      done();
    });

    it('in odata error format with message object not having the \'value\' key should be parsed properly', function (done) {
      var error = {
        'odata.error': {
          'code': 'Request_ResourceNotFound',
          'message' : {
            'lang': 'en'
          }
        }
      };
      var normalizedError = ServiceClient._normalizeError(error, {statusCode: 404});
      normalizedError.should.be.an.instanceOf(Error);
      normalizedError.should.have.keys('code', 'statusCode');
      done();
    });
  });
});

