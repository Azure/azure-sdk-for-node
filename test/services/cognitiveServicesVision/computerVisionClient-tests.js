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


const should = require('should');

const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

const SuiteBase = require('../../framework/suite-base');
const ComputerVisionAPIClient = require('../../../lib/services/computerVision/lib/computerVisionClient');
const fs = require('fs');

let requiredEnvironment = [
  { name: 'AZURE_COMPUTER_VISION_KEY', secure: true }
];

let testPrefix = 'computervision-tests';
let suite;
let client;
let credentials;

describe('Computer Vision', () => {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(() => {
      credentials = new CognitiveServicesCredentials(process.env["AZURE_COMPUTER_VISION_KEY"]);
      client = new ComputerVisionAPIClient(credentials, "westus");
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

  describe('Analyze image.', () => {
    it('should detect words, "I Love You"', (done) => {
      let fileStream = fs.createReadStream('test/services/cognitiveServicesVision/i_love_you.JPG');
      client.recognizeTextInStreamWithHttpOperationResponse(fileStream, "Printed").then((response) => {
        let url = response.response.headers["operation-location"];
        let pollUrl = () => {
          setTimeout(() => {
            client.sendRequest({
              method: 'GET',
              url: url
            }).then((result) => {
              if (result.status === "Succeeded") {
                result.recognitionResult.lines[0].text.should.equal("I Love You");
                done();
              }
              else {
                pollUrl();
              }
            });
          }, 100);
        };
        pollUrl();
      }).catch((err) => {
        done(err);
      });
    });
    it('should detect wolves', (done) => {
      let fileStream = fs.createReadStream('test/services/cognitiveServicesVision/wolves.jpg');
      client.analyzeImageInStreamWithHttpOperationResponse(fileStream, {
        visualFeatures: ["Categories", "Tags", "Description"]
      }).then((response) => {
        let filtered = response.body.tags.filter(tag => tag.name == "wolf");
        filtered.should.not.empty();
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});
