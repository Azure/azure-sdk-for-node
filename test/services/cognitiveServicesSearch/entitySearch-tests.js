/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

const Search = require('../../../lib/services/cognitiveServices.Search/lib/cognitiveServicesSearch');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

var SuiteBase = require('../../framework/suite-base');
var assert = require('assert');

var testPrefix = 'cognitiveservices-entitySearch-tests';
var requiredEnvironment = [
  { name: 'AZURE_COGNITIVE_SERVICES_KEY', secure: true }
];

var suite;
var subscriptionKey;

describe('Cognitive Services Search', function() {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      subscriptionKey = process.env['AZURE_COGNITIVE_SERVICES_KEY'];
      done();
    });
  });

  describe('EntitySearchAPI', function() {
    it('should return a valid response', function(done) {
      var credentials = new CognitiveServicesCredentials(subscriptionKey);
      var api = new Search.EntitySearchAPI(credentials);
      api.entitiesOperations.search('seahawks', function(err, result, request, response){
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
