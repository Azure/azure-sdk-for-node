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


const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

const SuiteBase = require('../../framework/suite-base');
const ContentModeratorClient = require('../../../lib/services/cognitiveServicesContentModerator/lib/contentModeratorClient');
const fs = require('fs');
const assert = require('assert');

let requiredEnvironment = [
  { name: 'AZURE_CONTENT_MODERATOR_KEY', secure: true }
];

let testPrefix = 'contentmoderator-tests';
let suite;
let client;
let credentials;

describe('Content Moderator', () => {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(() => {
      credentials = new CognitiveServicesCredentials(process.env["AZURE_CONTENT_MODERATOR_KEY"]);
      client = new ContentModeratorClient(credentials, "westus.api.cognitive.microsoft.com");
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

  describe('Screen Text', () => {
    it('should detect profanity', (done) => {
      client.textModeration.screenText('eng', 'text/plain', `Is this a crap email abcdef@abcd.com, phone:
        6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052`, (err, result, request, response) => {
        if (err) done(err);
        assert.notEqual(result, null);
        assert.notEqual(result.terms, null);
        assert(result.terms.length > 0);
        assert(result.terms.filter(term => term.term === "crap").length > 0);
        done();
      });
    });
  });
});
