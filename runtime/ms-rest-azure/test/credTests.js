// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var assert = require('assert');
var should = require('should');
var login = require('../lib/login');
var path = require('path');
var fs = require('fs');
var sinon = require('sinon');
var CognitiveServicesCredentials = require('../lib/credentials/cognitiveServicesCredentials');

var testPrefix = 'cred-tests';
var credsObj = {};
var customCredsObj = {};
var requiredEnvironment = [];
var authFilePathUsProd = path.join(__dirname, 'data/auth-usProd.json');
var authFilePathCustom = path.join(__dirname, 'data/auth-customEnv.json');

describe('Login', () => {
  before((done) => {
    try {
      credsObj = JSON.parse(fs.readFileSync(authFilePathUsProd, { encoding: 'utf8' }));
      customCredsObj = JSON.parse(fs.readFileSync(authFilePathCustom, { encoding: 'utf8' }));
      var dummyCreds = {
        tokenAudience: undefined,
        environment: {},
        authorizationScheme: 'Bearer',
        tokenCache: {},
        clientId: credsObj.clientSecret,
        domain: credsObj.tenantId,
        secret: credsObj.clientSecret,
        context: {}
      }
      var clientId = credsObj.clientId;
      var secret = credsObj.clientSecret;
      var domain = credsObj.tenantId;
      sinon.stub(login, 'withServicePrincipalSecret').callsFake((clientId, secret, domain, { }, callback) => {
        return callback(null, dummyCreds, []);
      });
    } catch (err) {
      done(err);
    }
    done();
  });

  after((done) => {
    done();
  });

  beforeEach((done) => {
    delete process.env['AZURE_SUBSCRIPTION_ID'];
    delete process.env['AZURE_AUTH_LOCATION'];
    done();
  });

  afterEach((done) => {
    done();
  });

  describe('withAuthFile', () => {
    it('should throw an error when authFile is not provided as a parameter or env var', (done) => {
      login.withAuthFile((err) => {
        should.exist(err);
        err.message.should.match(/Either provide an absolute file path to the auth file or set\/export the environment variable - AZURE_AUTH_LOCATION\./ig);
        done();
      });
    });

    it('should accept the auth file path from env var', (done) => {
      process.env['AZURE_AUTH_LOCATION'] = authFilePathUsProd;
      login.withAuthFile((err, creds, subscriptions) => {
        should.not.exist(err);
        should.exist(creds);
        should.exist(subscriptions);
        process.env['AZURE_SUBSCRIPTION_ID'].should.equal(credsObj.subscriptionId);
        done();
      });
    });

    it('should accept the auth file path as parameter and set subscriptionId to given env var', (done) => {
      process.env['AZURE_AUTH_LOCATION'] = path.join(__dirname, '../foo/bar.json');
      var params = {
        filePath: authFilePathUsProd,
        subscriptionEnvVariableName: 'SUB_ID'
      }
      login.withAuthFile(params, (err, creds, subscriptions) => {
        should.not.exist(err);
        should.exist(creds);
        should.exist(subscriptions);
        should.not.exist(process.env['AZURE_SUBSCRIPTION_ID']);
        process.env['SUB_ID'].should.equal(credsObj.subscriptionId);
        done();
      });
    });

    it('should add custom env to AzureEnvironment and authenticate against it', (done) => {
      var params = {
        filePath: authFilePathCustom,
        subscriptionEnvVariableName: 'SUB_ID'
      }
      login.withAuthFile(params, (err, creds, subscriptions) => {
        should.not.exist(err);
        should.exist(creds);
        should.exist(subscriptions);
        should.not.exist(process.env['AZURE_SUBSCRIPTION_ID']);
        process.env['SUB_ID'].should.equal(credsObj.subscriptionId);
        done();
      });
    });
  });
});

describe('CognitiveServices credentials', function () {
  it('should set subscriptionKey properly in request', function (done) {
    var creds = new CognitiveServicesCredentials('123-456-7890');
    var request = {
      headers: {}
    };

    creds.signRequest(request, function () {
      request.headers.should.have.property('Ocp-Apim-Subscription-Key');
      request.headers.should.have.property('X-BingApis-SDK-Client');
      request.headers['Ocp-Apim-Subscription-Key'].should.match(new RegExp('^123\-456\-7890$'));
      request.headers['X-BingApis-SDK-Client'].should.match(new RegExp('^node\-SDK$'));
      done();
    });
  });
});