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
var fs = require('fs');
var testutil = require('../../util/util');

var azure = testutil.libRequire('azure');
var CertificateCloudCredentials = azure.CertificateCloudCredentials;
var pemFile = 'test/common/credentials/dummy.pem1';
var dummySubscription = '97e5d94b-1609-4049-89c8-5f5a5e1cd2ea';

describe('Certificate credentials', function () {
  describe('construction', function () {

    it('should succeed with pem file read as buffer and subscription', function () {
      (function () {
        new CertificateCloudCredentials({pem: fs.readFileSync(pemFile), subscriptionId: dummySubscription});
      }).should.not.throw();
    });

    it('should succeed with pem file read as string by specifying the encoding and subscription', function () {
      (function () {
        new CertificateCloudCredentials({pem: fs.readFileSync(pemFile, 'utf8'), subscriptionId: dummySubscription});
      }).should.not.throw();
    });

     it('should succeed with pem file read as string by using the toString() method and subscription', function () {
      (function () {
        new CertificateCloudCredentials({pem: fs.readFileSync(pemFile).toString(), subscriptionId: dummySubscription});
      }).should.not.throw();
    });

    it('should fail without credential', function () {
      (function () {
        new CertificateCloudCredentials();
      }).should.throw();
    });

    it('should fail without certificate', function () {
      (function () {
        new CertificateCloudCredentials({subscriptionId: dummySubscription});
      }).should.throw();
    });

    it('should fail without subscription id', function () {
      (function () {
        new CertificateCloudCredentials({pem: fs.readFileSync(pemFile, 'utf8')});
      }).should.throw();
    });
  });
});
