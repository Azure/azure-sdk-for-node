// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var should = require('should');

var msRest = require('../lib/msRest');
var TokenCredentials = msRest.TokenCredentials;
var BasicAuthenticationCredentials = msRest.BasicAuthenticationCredentials;
var ApiKeyCredentials = msRest.ApiKeyCredentials;

var dummyToken = 'A-dummy-access-token';
var fakeScheme = 'fake-auth-scheme';
var dummyuserName = 'dummy@mummy.com';
var dummyPassword = 'IL0veDummies';

describe('Token credentials', function () {
  describe('usage', function () {
    it('should set auth header with bearer scheme in request', function (done) {
      var creds = new TokenCredentials(dummyToken);
      var request = {
        headers: {}
      };

      creds.signRequest(request, function () {
        request.headers.should.have.property('authorization');
        request.headers['authorization'].should.match(new RegExp('^Bearer\\s+' + dummyToken + '$'));
        done();
      });
    });

    it('should set auth header with custom scheme in request', function (done) {
      var creds = new TokenCredentials(dummyToken, fakeScheme);
      var request = {
        headers: {}
      };

      creds.signRequest(request, function () {
        request.headers.should.have.property('authorization');
        request.headers['authorization'].should.match(new RegExp('^' + fakeScheme + '\\s+' + dummyToken + '$'));
        done();
      });
    });
  });

  describe('construction', function () {

    it('should succeed with token', function () {
      (function () {
        new TokenCredentials(dummyToken);
      }).should.not.throw();
    });

    it('should fail without credentials', function () {
      (function () {
        new TokenCredentials();
      }).should.throw();
    });

    it('should fail without token', function () {
      (function () {
        new TokenCredentials(null, fakeScheme);
      }).should.throw();
    });
  });
});

describe('Basic Authentication credentials', function () {
  var encodedCredentials = Buffer.from(dummyuserName + ':' + dummyPassword).toString('base64')
  describe('usage', function () {
    it('should base64 encode the username and password and set auth header with baisc scheme in request', function (done) {
      var creds = new BasicAuthenticationCredentials(dummyuserName, dummyPassword);
      var request = {
        headers: {}
      };

      creds.signRequest(request, function () {
        request.headers.should.have.property('authorization');
        request.headers['authorization'].should.match(new RegExp('^Basic\\s+' + encodedCredentials + '$'));
        done();
      });
    });

    it('should base64 encode the username and password and set auth header with custom scheme in request', function (done) {
      var creds = new BasicAuthenticationCredentials(dummyuserName, dummyPassword, fakeScheme);
      var request = {
        headers: {}
      };

      creds.signRequest(request, function () {
        request.headers.should.have.property('authorization');
        request.headers['authorization'].should.match(new RegExp('^' + fakeScheme + '\\s+' + encodedCredentials + '$'));
        done();
      });
    });
  });

  describe('construction', function () {

    it('should succeed with userName and password', function () {
      (function () {
        new BasicAuthenticationCredentials(dummyuserName, dummyPassword);
      }).should.not.throw();
    });

    it('should fail without credentials', function () {
      (function () {
        new BasicAuthenticationCredentials();
      }).should.throw();
    });

    it('should fail without userName and password', function () {
      (function () {
        new BasicAuthenticationCredentials(null, null, fakeScheme);
      }).should.throw();
    });
  });
});

describe('ApiKey credentials', function () {
  describe('usage', function () {
    it('should set header parameters properly in request', function (done) {
      var creds = new ApiKeyCredentials({inHeader: {'key1': 'value1', 'key2': 'value2'}});
      var request = {
        headers: {}
      };

      creds.signRequest(request, function () {
        request.headers.should.have.property('key1');
        request.headers.should.have.property('key2');
        request.headers['key1'].should.match(new RegExp('^value1$'));
        request.headers['key2'].should.match(new RegExp('^value2$'));
        done();
      });
    });

    it('should set query parameters properly in the request url without any query parameters', function (done) {
      var creds = new ApiKeyCredentials({inQuery: {'key1': 'value1', 'key2': 'value2'}});
      var request = {
        headers: {},
        url: 'https://example.com'
      };

      creds.signRequest(request, function () {
        request.url.should.equal('https://example.com?key1=value1&key2=value2');
        done();
      });
    });

    it('should set query parameters properly in the request url with existing query parameters', function (done) {
      var creds = new ApiKeyCredentials({inQuery: {'key1': 'value1', 'key2': 'value2'}});
      var request = {
        headers: {},
        url: 'https://example.com?q1=v2'
      };

      creds.signRequest(request, function () {
        request.url.should.equal('https://example.com?q1=v2&key1=value1&key2=value2');
        done();
      });
    });

    it('should set header parameters and query parameters properly in request', function (done) {
      var creds = new ApiKeyCredentials({ inHeader: {'key1': 'value1', 'key2': 'value2'}, inQuery: {'key1': 'value1', 'key2': 'value2'}});
      var request = {
        headers: {},
        url: 'https://example.com'
      };

      creds.signRequest(request, function () {
        request.url.should.equal('https://example.com?key1=value1&key2=value2');
        request.headers.should.have.property('key1');
        request.headers.should.have.property('key2');
        request.headers['key1'].should.match(new RegExp('^value1$'));
        request.headers['key2'].should.match(new RegExp('^value2$'));
        done();
      });
    });
  });

  describe('construction', function () {

    it('should fail with options.inHeader and options.inQuery set to null or undefined', function (done) {
      (function () {
        new ApiKeyCredentials({inHeader: null, inQuery: undefined});
      }).should.throw();
      done();
    });

    it('should fail without options', function (done) {
      (function () {
        new ApiKeyCredentials();
      }).should.throw();
      done();
    });

    it('should fail with empty options', function (done) {
      (function () {
        new ApiKeyCredentials({});
      }).should.throw();
      done();
    });
  });
});