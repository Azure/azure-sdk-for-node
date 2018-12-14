/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

const ImageSearchAPIClient = require('../../../lib/services/imageSearch/lib/imageSearchClient');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

const SuiteBase = require('../../framework/suite-base');
const should = require('should');

let requiredEnvironment = [
  { name: 'AZURE_IMAGE_SEARCH_KEY', secure: true }
];

let testPrefix = 'cognitiveservices-imagesearch-tests';
let suite;
let client;

describe('Cognitive Services Search', function () {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      let credentials = new CognitiveServicesCredentials(process.env["AZURE_IMAGE_SEARCH_KEY"]);
      client = new ImageSearchAPIClient(credentials);
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

  describe('ImageSearchAPI', function () {
    it('should return a valid response', function (done) {
      client.imagesOperations.search('Obama', function (err, result, request, response) {
        if (err) done(err);
        result.value.should.not.empty();
        done();
      });
    });
  });
});
