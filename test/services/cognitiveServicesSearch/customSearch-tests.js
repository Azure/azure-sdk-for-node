/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

const CustomSearchAPIClient = require('../../../lib/services/cognitiveServicesCustomSearch/lib/customSearchAPIClient');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

const SuiteBase = require('../../framework/suite-base');
const assert = require('assert');

let requiredEnvironment = [
  { name: 'AZURE_CUSTOM_SEARCH_KEY', secure: true }
];

let testPrefix = 'cognitiveservices-customsearch-tests';
let suite;
let client;

describe('Cognitive Services Search', function () {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      let credentials = new CognitiveServicesCredentials(process.env["AZURE_CUSTOM_SEARCH_KEY"]);
      client = new CustomSearchAPIClient(credentials);
      done();
    });
  });

  after(function (done) {
    suite.teardownSuite(done);
  });

  beforeEach(function (done) {
    suite.setupTest(done);
  });

  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });

  describe('CustomSearchAPI', function () {
    it('should return a valid response', function (done) {
      client.customInstance.search('cortana', {customConfig: 10}, function (err, result, request, response) {
        if (err) done(err);
        assert.equal(result.queryContext.originalQuery, "cortana");
        assert.notEqual(result.webPages.value, null);
        assert.notEqual(result.webPages.value, undefined);
        done();
      });
    });
  });
});
