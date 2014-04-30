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

var _ = require('underscore');
var fs = require('fs');
var certutils = require('../../node_modules/azure-common/lib/util/certutils');

var exports = module.exports;

/**
* Generates an unique identifier using a prefix, based on a currentList and repeatable or not depending on the isMocked flag.
*
* @param {string} prefix          The prefix to use in the identifier.
* @param {array}  currentList     The current list of identifiers.
* @param {bool}   isMocked        Boolean flag indicating if the test is mocked or not.
* @return {string} A new unique identifier.
*/
exports.generateId = function (prefix, currentList, isMocked) {
  if (!currentList) {
    currentList = [];
  }

  while (true) {
    var newNumber;
    if (isMocked) {
      // Predictable
      newNumber = prefix + (currentList.length + 1);
      currentList.push(newNumber);

      return newNumber;
    } else {
      // Random
      newNumber = prefix + Math.floor(Math.random() * 10000);
      if (currentList.indexOf(newNumber) === -1) {
        currentList.push(newNumber);

        return newNumber;
      }
    }
  }
};

exports.randomFromTo = function (from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
};

exports.libFolder = function () {
  return process.env['AZURE_LIB_PATH'] ? process.env['AZURE_LIB_PATH'] : 'lib';
};

exports.libRequire = function (path) {
  return require('../../' + exports.libFolder() + '/' + path);
};

exports.getAuthenticationCertificate = function () {
  if (process.env['AZURE_CERTIFICATE_PEM_FILE']) {
    var auth = certutils.readPemFile(process.env['AZURE_CERTIFICATE_PEM_FILE']);
    return {
      keyvalue: auth.key,
      certvalue: auth.cert
    };
  } else {
    return {
      keyvalue: exports.GetCertificateKey(),
      certvalue: exports.getCertificate()
    };
  }
}

exports.getCertificateKey = function () {
  if (process.env['AZURE_CERTIFICATE_KEY']) {
    return process.env['AZURE_CERTIFICATE_KEY'];
  } else if (process.env['AZURE_CERTIFICATE_KEY_FILE']) {
    return fs.readFileSync(process.env['AZURE_CERTIFICATE_KEY_FILE']).toString();
  }

  return null;
};

exports.getCertificate = function () {
  if (process.env['AZURE_CERTIFICATE']) {
    return process.env['AZURE_CERTIFICATE'];
  } else if (process.env['AZURE_CERTIFICATE_FILE']) {
    return fs.readFileSync(process.env['AZURE_CERTIFICATE_FILE']).toString();
  }

  return null;
};

// Helper function to save & restore the contents of the
// process environment variables for a test
exports.withEnvironment = function (values, testFunction) {
  var keys = Object.keys(values);
  var originalValues = keys.map(function (key) { return process.env[key]; } );
  _.extend(process.env, values);
  try {
    testFunction();
  } finally {
    _.zip(keys, originalValues).forEach(function (oldVal) {
      if (_.isUndefined(oldVal[1])) {
        delete process.env[oldVal[0]];
      } else {
        process.env[oldVal[0]] = oldVal[1];
      }
    });
  }
};

// Writes content to a temporary file that gets deleted
// at the end of the test. File writes are synchronous

exports.withTempFileSync = function (content, action) {
  var path = exports.generateId('temp') + '.tmp';
  fs.writeFileSync(path, content);
  try {
    action(path);
  } finally {
    fs.unlinkSync(path);
  }
}

// Writes content to a temporary file that gets
// deleted when the 'done' callback is executed.
// Similar to withTempFileSync, but for async
// tests. The file operations themselves are done
// synchronously.

exports.withTempFile = function (content, action) {
  var path = exports.generateId('temp') + '.tmp';
  fs.writeFileSync(path, content);
  action(path, function () {
    fs.unlinkSync(path);
  });
}
