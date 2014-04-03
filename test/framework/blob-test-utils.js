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

var fs = require('fs');
var util = require('util');

var existsSync = fs.existsSync;
if (!existsSync) {
  existsSync = require('path').existsSync;
}

var MockedTestUtils = require('./mocked-test-utils');

function BlobTestUtils(service, testPrefix) {
  BlobTestUtils.super_.call(this, service, testPrefix);
}

util.inherits(BlobTestUtils, MockedTestUtils);

BlobTestUtils.prototype.teardownTest = function (callback) {
  var self = this;

  function asyncDeleteFiles(files, count, callback) {
    if (count > 3) {
      throw new Error('Could not delete file ' + files[0]);
    }
    if (files.length === 0) {
      return callback();
    }
    try {
      if (existsSync(files[0])) {
        fs.unlinkSync(files[0]);
      }
      asyncDeleteFiles(files.slice(1), 0, callback);
    } catch (ex) {
      setTimeout(function () { asyncDeleteFiles(files, count + 1, callback); }, 1500);
    }
  }

  var deleteFiles = function () {
    // delete test files
    var list = fs.readdirSync('./').filter(function (f) { return f.indexOf('.test') !== -1; });
    asyncDeleteFiles(list, 0, function (err) {
      self.baseTeardownTest(callback);
    });
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