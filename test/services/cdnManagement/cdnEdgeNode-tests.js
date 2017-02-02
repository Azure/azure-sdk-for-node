﻿//
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
var msRestAzure = require('ms-rest-azure');

var SuiteBase = require('../../framework/suite-base');
var FileTokenCache = require('../../../lib/util/fileTokenCache');
var StorageManagementClient = require('../../../lib/services/cdnManagement/lib/cdnManagementClient');
var testPrefix = 'cdnEdgeNode-tests';

var requiredEnvironment = [{
    name: 'AZURE_TEST_LOCATION',
    defaultValue: 'West US'
}];

var suite;
var client;
var defaultLocation;

describe('Cdn Management ListEdgeNodes', function () {
    
    before(function (done) {
        suite = new SuiteBase(this, testPrefix, requiredEnvironment);
        suite.setupSuite(function () {
            client = new StorageManagementClient(suite.credentials, suite.subscriptionId);
            defaultLocation = process.env['AZURE_TEST_LOCATION'];
            if (suite.isPlayback) {
                client.longRunningOperationRetryTimeout = 0;
            }
            done();
        });
    });
    
    after(function (done) {
        suite.teardownSuite(function () {
            done();
        });
    });
    
    beforeEach(function (done) {
        suite.setupTest(done);
    });
    
    afterEach(function (done) {
        suite.baseTeardownTest(done);
    });
    
    describe('cdn list edge nodes', function () {
        it('should return no error', function (done) {
            client.edgeNodes.list(function (err, result, request, response) {
                should.not.exist(err);
                done();
            });
        });
    });
});