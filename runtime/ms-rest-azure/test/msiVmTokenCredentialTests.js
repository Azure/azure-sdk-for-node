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
var MSIVmTokenCredentials = require('../lib/credentials/msiVmTokenCredentials');


describe('MSI Vm Authentication', function () {
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

  function setupNockResponse(msiEndpoint, response, error, apiVersion, resource) {
    if (!msiEndpoint) {
      msiEndpoint = "http://169.254.169.254/metadata/identity";
    }

    if (!apiVersion) {
      apiVersion = "2018-02-01";
    }

    if (!resource) {
      resource = "https://management.azure.com/";
    }

    nock(`${msiEndpoint}`)
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      .matchHeader('Metadata', 'true')
      .get(`/oauth2/token`)
      .query({
        'api-version': apiVersion,
        'resource': resource
      })
      .reply((error ? 400 : 200), function (body) {
        return error || response;
      });
  }

  it('should get token from the virtual machine with MSI service running at default endpoint', function (done) {
    let response = {
      access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1d',
      refresh_token: '',
      expires_in: '3599',
      expires_on: '1502930996',
      not_before: '1502927096',
      resource: 'https://management.azure.com/',
      token_type: 'Bearer'
    };

    setupNockResponse(undefined, response);

    let msiCredsObj = new MSIVmTokenCredentials();
    msiCredsObj.getToken((err, response) => {
      should.not.exist(err);
      should.exist(response);
      should.exist(response.accessToken);
      should.exist(response.tokenType);
      done();
    });
  });

  it('should get token from the virtual machine with MSI service running at custom endpoint', function (done) {
    let response = {
      access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1d',
      refresh_token: '',
      expires_in: '3599',
      expires_on: '1502930996',
      not_before: '1502927096',
      resource: 'https://management.azure.com/',
      token_type: 'Bearer'
    };

    let customMsiEndpoint = "http://localhost:50342";
    setupNockResponse(customMsiEndpoint, response);

    let msiCredsObj = new MSIVmTokenCredentials({
      msiEndpoint: `${customMsiEndpoint}/oauth2/token`
    });
    msiCredsObj.getToken((err, response) => {
      should.not.exist(err);
      should.exist(response);
      should.exist(response.accessToken);
      should.exist(response.tokenType);
      done();
    });
  });

  it('should throw on requests with bad resource', function (done) {
    let errorResponse = {
      "error": "unkwnown",
      "error_description": "Failed to retrieve token from the Active directory. For details see logs in C:\\User1\\Logs\\Plugins\\Microsoft.Identity.MSI\\1.0\\service_identity_0.log"
    };

    setupNockResponse(undefined, undefined, errorResponse);

    let msiCredsObj = new MSIVmTokenCredentials({
      "resource": "badvalue"
    });
    msiCredsObj.getToken((err, response) => {
      should.exist(err);
      should.not.exist(response);
      done();
    });
  });

  it('should set default MSI endpoint', function(done) {
    const msiCredsObj = new MSIVmTokenCredentials();
    should.exist(msiCredsObj.msiEndpoint);
    done();
  });

  it('should set default api-version header', function(done) {
    const msiCredsObj = new MSIVmTokenCredentials();
    should.exist(msiCredsObj.apiVersion);
    done();
  });
});