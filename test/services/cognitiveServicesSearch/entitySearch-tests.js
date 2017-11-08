/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

const Search = require('../../../lib/services/cognitiveServices.Search/lib/cognitiveServicesSearch');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

var assert = require('assert');

describe('Cognitive Services Search', function() {
    describe('EntitySearchAPI', function() {
        it('should return a valid response', function(done) {
            var subscriptionKey = process.env['API_SUBSCRIPTION_KEY']
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
