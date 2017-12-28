/**
 * Copyright (c) Microsoft.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// all the requires
var should = require('should');
var assert = require('assert');
var nock = require('nock');
var msRestAzure = require('../lib/msRestAzure');
const MSIAppServiceTokenCredentials = msRestAzure.MSIAppServiceTokenCredentials;

describe('MSI App Service Authentication', function () {
  function setupNockResponse(resource, response, error) {

    if (!resource) {
      resource = 'https://management.azure.com/';
    }

    let interceptor = nock('http://127.0.0.1:41741').get(`/MSI/token/?resource=${resource}&api-version=2017-09-01`);
    if (!error) {
      interceptor.reply(200, response);
    } else {
      interceptor.replyWithError(error);
    }
  }


  describe('Credential getToken()', () => {
    it('should get token from the App service MSI by providing optional properties', function (done) {
      let response = {
        access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1d',
        expires_in: '3599',
        expires_on: '1502930996',
        resource: 'https://management.azure.com/',
        token_type: 'Bearer'
      };

      let requestBodyToMatch = {
        "resource": "https://management.azure.com/"
      };

      setupNockResponse(null, response);

      let msiCredsObj = new MSIAppServiceTokenCredentials({ msiEndpoint: 'http://127.0.0.1:41741/MSI/token/', msiSecret: '69418689F1E342DD946CB82994CDA3CB' });
      msiCredsObj.getToken((err, response) => {
        should.not.exist(err);
        should.exist(response);
        should.exist(response.accessToken);
        should.exist(response.tokenType);
        done();
      });
    });

    it('should get token from the App service MSI by reading the environment variables', function (done) {
      let response = {
        access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1d',
        expires_in: '3599',
        expires_on: '1502930996',
        resource: 'https://management.azure.com/',
        token_type: 'Bearer'
      };

      setupNockResponse(null, response);
      process.env['MSI_ENDPOINT'] = 'http://127.0.0.1:41741/MSI/token/';
      process.env['MSI_SECRET'] = '69418689F1E342DD946CB82994CDA3CB';
      let msiCredsObj = new MSIAppServiceTokenCredentials();
      msiCredsObj.getToken((err, response) => {
        should.not.exist(err);
        should.exist(response);
        should.exist(response.accessToken);
        should.exist(response.tokenType);
        done();
      });
    });

    it('should throw if the response contains "ExceptionMessage"', function (done) {
      let errorResponse = {
        "error": "unkwnown",
        "error_description": "ExceptionMessage: Failed to retrieve token from the Active directory. For details see logs in C:\\User1\\Logs\\Plugins\\Microsoft.Identity.MSI\\1.0\\service_identity_0.log"
      };

      setupNockResponse(null, null, errorResponse);
      process.env['MSI_ENDPOINT'] = 'http://127.0.0.1:41741/MSI/token/';
      process.env['MSI_SECRET'] = '69418689F1E342DD946CB82994CDA3CB';
      let msiCredsObj = new MSIAppServiceTokenCredentials();
      msiCredsObj.getToken((err, response) => {
        should.exist(err);
        should.not.exist(response);
        done();
      });
    });
  });

  describe('loginWithAppServiceMSI', () => {

    it('should successfully provide MSIAppServiceTokenCredentials object by providing optional properties', function (done) {
      let response = {
        access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1d',
        expires_in: '3599',
        expires_on: '1502930996',
        resource: 'https://management.azure.com/',
        token_type: 'Bearer'
      };

      let requestBodyToMatch = {
        "resource": "https://management.azure.com/"
      };

      setupNockResponse(null, response);

      let options = { msiEndpoint: 'http://127.0.0.1:41741/MSI/token/', msiSecret: '69418689F1E342DD946CB82994CDA3CB' }
      msRestAzure.loginWithAppServiceMSI(options, (err, response) => {
        should.not.exist(err);
        should.exist(response);
        assert.equal(response instanceof MSIAppServiceTokenCredentials, true);
        done();
      });
    });

    it('should successfully provide MSIAppServiceTokenCredentials object by reading the environment variables', function (done) {
      let response = {
        access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1d',
        expires_in: '3599',
        expires_on: '1502930996',
        resource: 'https://management.azure.com/',
        token_type: 'Bearer'
      };

      setupNockResponse(null, response);
      process.env['MSI_ENDPOINT'] = 'http://127.0.0.1:41741/MSI/token/';
      process.env['MSI_SECRET'] = '69418689F1E342DD946CB82994CDA3CB';
      msRestAzure.loginWithAppServiceMSI((err, response) => {
        should.not.exist(err);
        should.exist(response);
        assert.equal(response instanceof MSIAppServiceTokenCredentials, true);
        done();
      });
    });

    it('should throw if the response contains "ExceptionMessage"', function (done) {
      let errorResponse = {
        "error": "unkwnown",
        "error_description": "ExceptionMessage: Failed to retrieve token from the Active directory. For details see logs in C:\\User1\\Logs\\Plugins\\Microsoft.Identity.MSI\\1.0\\service_identity_0.log"
      };

      setupNockResponse(null, null, errorResponse);
      process.env['MSI_ENDPOINT'] = 'http://127.0.0.1:41741/MSI/token/';
      process.env['MSI_SECRET'] = '69418689F1E342DD946CB82994CDA3CB';
      msRestAzure.loginWithAppServiceMSI((err, response) => {
        should.exist(err);
        should.not.exist(response);
        done();
      });
    });
  });
});
