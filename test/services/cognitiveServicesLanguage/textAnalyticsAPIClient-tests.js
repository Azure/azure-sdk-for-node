//
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
var CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

var SuiteBase = require('../../framework/suite-base');
var TextAnalyticsClient = require('../../../lib/services/cognitiveServicesTextAnalytics/lib/textAnalyticsClient');

var requiredEnvironment = [
  { name: 'AZURE_TEXT_ANALYTICS_KEY', secure: true }
];

var testPrefix = 'textanalytics-tests';
var suite;
var client;
var credentials;

describe('Text Analytics', () => {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(() => {
      credentials = new CognitiveServicesCredentials(process.env["AZURE_TEXT_ANALYTICS_KEY"]);
      client = new TextAnalyticsClient(credentials, "westus");
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

  describe('Analyze language.', () => {
    it('should detect that text is english', (done) => {
      var input = {
        documents: [
          {
            'id': "1",
            'text': "I had a wonderful experience! The rooms were wonderful and the staff was helpful."
          }
        ]
      }
      client.detectLanguage(input, (err, result, request, response) => {
        if (err) done(err);
        result.documents[0].detectedLanguages[0].name.should.equal("English");
        result.documents[0].detectedLanguages[0].score.should.equal(1);
        done();
      });
    });
  });
  describe('Analyze sentiment.', () => {
    it('should detect happiness and unhappiness successfully', (done) => {
      var input = {
        documents: [
          {
            'id': "1",
            'text': "I had a wonderful experience! The rooms were wonderful and the staff was helpful."
          },
          {
            'id': "2",
            'text': "I had a terrible day. I hate life."
          }
        ]
      }
      client.sentiment(input, (err, result, request, response) => {
        if (err) done(err);
        result.documents[0].score.should.greaterThan(.8);
        result.documents[1].score.should.lessThan(.2);
        done();
      });
    });
  });
});