/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var fs = require('fs');
var util = require('util');

var StorageTestUtils = require('./storage-test-utils');

function BlobTestUtils(service, testPrefix) {
  BlobTestUtils.super_.call(this, service, testPrefix);
}

util.inherits(BlobTestUtils, StorageTestUtils);

BlobTestUtils.prototype.teardownTest = function (callback) {
  var self = this;

  var deleteFiles = function () {
    // delete test files
    var list = fs.readdirSync('./');
    list.forEach(function (file) {
      if (file.indexOf('.test') !== -1) {
        fs.unlinkSync(file);
      }
    });

    self.baseTeardownTest(callback);
  };

  var deleteContainers = function (containers, done) {
    if (!containers || containers.length <= 0) {
      done();
    } else {
      var currentContainer = containers.pop();
      self.service.deleteContainer(currentContainer.name, function () {
        deleteContainers(containers, done);
      });
    }
  };

  // delete blob containers
  self.service.listContainers(function (listError, containers) {
    deleteContainers(containers, function () {
      // clean up
      deleteFiles();
    });
  });
};

exports.createBlobTestUtils = function (service, testPrefix) {
  return new BlobTestUtils(service, testPrefix);
};