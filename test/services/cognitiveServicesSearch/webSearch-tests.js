/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

const WebSearchAPIClient = require('../../../lib/services/cognitiveServicesSearch/lib/webSearch/webSearchAPIClient');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

const SuiteBase = require('../../framework/suite-base');
const should = require('should');

let requiredEnvironment = [
  { name: 'AZURE_WEB_SEARCH_KEY', secure: true }
];

let testPrefix = 'cognitiveservices-websearch-tests';
let suite;
let client;

describe('Cognitive Services Search', () => {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      let credentials = new CognitiveServicesCredentials(process.env["AZURE_WEB_SEARCH_KEY"]);
      client = new WebSearchAPIClient(credentials);
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

  describe('Web Search', () => {
    it('should return a valid results', (done) => {
      client.web.search('seahawks').then((result) => {
        result.queryContext.should.have.property('originalQuery', 'seahawks');
        result.images.value.should.not.empty();
        result.webPages.value.should.not.empty();
        result.news.value.should.not.empty();
        done();
      }).catch((err) => {
        done(err);
      })
    });
  });
});
