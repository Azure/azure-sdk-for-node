/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

const EntitySearchAPIClient = require('../../../lib/services/cognitiveServicesSearch/lib/entitySearch/entitySearchAPIClient');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

const SuiteBase = require('../../framework/suite-base');
const assert = require('assert');

let requiredEnvironment = [
  { name: 'AZURE_ENTITY_SEARCH_KEY', secure: true }
];

let testPrefix = 'cognitiveservices-entitysearch-tests';
let suite;
let client;

describe('Cognitive Services Search', function () {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      let credentials = new CognitiveServicesCredentials(process.env["AZURE_ENTITY_SEARCH_KEY"]);
      client = new EntitySearchAPIClient(credentials);
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

  describe('EntitySearchAPI', function () {
    it('should return a valid response', function (done) {
      client.entitiesOperations.search('seahawks', function (err, result, request, response) {
        if (err) done(err);
        assert.notEqual(result, null);
        assert.notEqual(result.queryContext, null);
        assert.equal(result.queryContext.originalQuery, 'seahawks');

        assert.notEqual(result.entities, null);
        assert.notEqual(result.entities.value, null);
        assert.equal(result.entities.value.length, 1);

        assert.notEqual(result.entities.value[0].contractualRules, null);
        done();
      });
    });
  });
});
