#!/usr/bin/env node
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
var path = require('path');

var args = (process.ARGV || process.argv);

var coverageOption = Array.prototype.indexOf.call(args, '-coverage');

if (coverageOption !== -1) {
  args.splice(coverageOption, 1);
}

var reporter = 'list';
var xunitOption = Array.prototype.indexOf.call(args, '-xunit');
if (xunitOption !== -1) {
  reporter = 'xunit';
  args.splice(xunitOption, 1);
}

var testList = args.pop();

var fileContent;
var root = false;

if  (!fs.existsSync) {
  fs.existsSync = require('path').existsSync;
}

if (fs.existsSync(testList)) {
  fileContent = fs.readFileSync(testList).toString();
} else {
  fileContent = fs.readFileSync('./test/' + testList).toString();
  root = true;
}

var files = fileContent.split('\n');

args.push('-u');
args.push('tdd');

// TODO: remove this timeout once tests are faster
args.push('-t');
args.push('5000000');

files.forEach(function (file) {
  if (file.length > 0 && file.trim()[0] !== '#') {
    // trim trailing \r if it exists
    file = file.replace('\r', '');

    if (root) {
      args.push('test/' + file);
    } else {
      args.push(file);
    }
  }
});

if (coverageOption !== -1) {
  args.push('-R');
  args.push('html-cov');
} else {
  args.push('-R');
  args.push(reporter);
}

require('../node_modules/mocha/bin/mocha');