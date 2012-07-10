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

var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

var jshint = require('../node_modules/jshint/packages/jshint/jshint');

if  (!fs.existsSync) {
  fs.existsSync = require('path').existsSync;
}

var libDir = '../lib';
if (!fs.existsSync(libDir + '/azure.js')) {
  libDir = './lib';
}

walk(libDir, function (err, files) {
  var args = (process.ARGV || process.argv);

  files.forEach(function (file) {
    // NOTE: TableQuery uses regular expressions which seem to confuse JSHint. Exclude for now...
    if (file.indexOf('lib/services/table/tablequery.js') === -1) {
      args.push(file);
    }
  });

  args.push('--jslint-reporter');

  require('../node_modules/jshint/lib/cli').interpret(process.argv);
});