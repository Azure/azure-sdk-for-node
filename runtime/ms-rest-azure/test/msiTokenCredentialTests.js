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
var nock = require('nock');
var MSITokenCredential = require('../lib/credentials/msiTokenCredentials');


describe('MSI Authentication', function () {
  before(function (done) {
    done();
  });

  after(function (done) {
    done();
  });

  beforeEach(function (done) {
    done();
  });

  afterEach(function (done) {
    done();
  });

  function setupNockResponse(port, requestBodyToMatch, response, error) {

    if (!port) {
      port = 50342;
    }

    let basePath = `http://localhost:${port}`;
    let interceptor = nock(basePath).post("/oauth2/token", function (body) { return JSON.stringify(body) === JSON.stringify(requestBodyToMatch); });

    if (!error) {
      interceptor.reply(200, response);
    } else {
      interceptor.replyWithError(error);
    }
  }

  it('should get token from the virtual machine with MSI service running at default port', function (done) {
    let response = {
      access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1d',
      refresh_token: '',
      expires_in: '3599',
      expires_on: '1502930996',
      not_before: '1502927096',
      resource: 'https://management.azure.com/',
      token_type: 'Bearer'
    };

    let requestBodyToMatch = {
      "resource": "https://management.azure.com/"
    };

    setupNockResponse(null, requestBodyToMatch, response);

    let msiCredsObj = new MSITokenCredential();
    msiCredsObj.getToken((err, response) => {
      should.not.exist(err);
      should.exist(response);
      should.exist(response.access_token);
      should.exist(response.token_type);
      done();
    });
  });

  it('should get token from the virtual machine with MSI service running at custom port', function (done) {
    let response = {
      access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1d',
      refresh_token: '',
      expires_in: '3599',
      expires_on: '1502930996',
      not_before: '1502927096',
      resource: 'https://management.azure.com/',
      token_type: 'Bearer'
    };

    let requestBodyToMatch = {
      "resource": "https://management.azure.com/"
    };

    let customPort = 50341;
    setupNockResponse(customPort, requestBodyToMatch, response);

    let msiCredsObj = new MSITokenCredential({ port: customPort });
    msiCredsObj.getToken((err, response) => {
      should.not.exist(err);
      should.exist(response);
      should.exist(response.access_token);
      should.exist(response.token_type);
      done();
    });
  });

  it('should throw on requests with bad resource', function (done) {
    let errorResponse = {
      "error": "unkwnown",
      "error_description": "Failed to retrieve token from the Active directory. For details see logs in C:\\User1\\Logs\\Plugins\\Microsoft.Identity.MSI\\1.0\\service_identity_0.log"
    };

    let requestBodyToMatch = {
      "resource": "badvalue"
    };

    setupNockResponse(null, requestBodyToMatch, null, errorResponse);

    let msiCredsObj = new MSITokenCredential({ "resource": "badvalue" });
    msiCredsObj.getToken((err, response) => {
      should.exist(err);
      should.not.exist(response);
      done();
    });
  });

  it('should throw on request with empty resource', function (done) {
    let errorResponse = { "error": "bad_resource_200", "error_description": "Invalid Resource" };

    let requestBodyToMatch = {
      "resource": "  "
    };

    setupNockResponse(null, requestBodyToMatch, null, errorResponse);

    let msiCredsObj = new MSITokenCredential({ "resource": "  " });
    msiCredsObj.getToken((err, response) => {
      should.exist(err);
      should.equal(err.error, "bad_resource_200");
      should.not.exist(response);
      done();
    });
  });
});
