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
const SpellCheckClient = require('../../../lib/services/spellCheck/lib/spellCheckClient');
const assert = require('assert');

var requiredEnvironment = [
  { name: 'AZURE_SPELL_CHECK_KEY', secure: true }
];

var testPrefix = 'spellcheck-tests';
var suite;
var client;
var credentials;

describe('Spell Check', () => {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(() => {
      credentials = new CognitiveServicesCredentials(process.env["AZURE_SPELL_CHECK_KEY"]);
      client = new SpellCheckClient(credentials);
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

  describe('Spell Checker.', () => {
    it('should correct spelling', (done) => {
      client.spellChecker('cognituve services', (err, result, request, response) => {
        if (err) done(err);
        assert.equal(result.flaggedTokens[0].token, "cognituve");
        assert.equal(result.flaggedTokens[0].suggestions[0].suggestion, "cognitive");
        done();
      });
    });
  });
});
