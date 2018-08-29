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
const FaceAPIClient = require('../../../lib/services/cognitiveServicesFace/lib/faceClient');
const fs = require('fs');

let requiredEnvironment = [
  { name: 'AZURE_FACE_KEY', secure: true }
];

let testPrefix = 'face-tests';
let suite;
let client;
let credentials;

describe('Face', () => {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(() => {
      credentials = new CognitiveServicesCredentials(process.env["AZURE_FACE_KEY"]);
      client = new FaceAPIClient(credentials, "westus");
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

  describe('Analyze face image.', () => {
    it('should detect face is female"', (done) => {
      let fileStream = fs.createReadStream('test/services/cognitiveServicesVision/facefindsimilar.queryface.jpg');
      client.face.detectWithStream(fileStream, {
        returnFaceId: true,
        returnFaceAttributes: ["age", "gender", "headPose", "smile", "facialHair", "glasses", "emotion",
          "hair", "makeup", "occlusion", "accessories", "exposure", "noise"]
      }).then((result) => {
        result[0].faceAttributes.gender.should.equal("female");
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});
