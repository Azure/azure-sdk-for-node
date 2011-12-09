/**
* Copyright 2011 Microsoft Corporation
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

// Based on bin/nodeunit.js from the nodeunit module.

var fs = require('fs');
var path = require('path');

var fileContent;
var root = false;
if (path.existsSync('./extendedtestlist.txt')) {
  fileContent = fs.readFileSync('./extendedtestlist.txt').toString();
} else {
  fileContent = fs.readFileSync('./test/extendedtestlist.txt').toString();
  root = true;
}

var files = fileContent.split('\n');

var args = (process.ARGV || process.argv);
files.forEach(function (file) {
  // trim trailing \r if it exists
  file = file.replace('\r', '');

  if (root) {
    args.push('test/' + file);
  } else {
    args.push(file);
  }
});

var nodebin = require('../node_modules/nodeunit/bin/nodeunit');