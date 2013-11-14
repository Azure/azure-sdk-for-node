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

var path = require('path');
var fs = require('fs');
var util = require('util');

var repository = path.join(__dirname, '../../hydra');

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk(repository, function (err, files) {
  files = files.filter(function (f) {
    return path.extname(f) === '.js' && f.toLowerCase().indexOf('/generated/') > 0;
  });

  walk(path.join(__dirname, '../lib/services'), function (err, matchingFiles) {
    files.forEach(function (newFile) {
      var match = matchingFiles.filter(function (matchingFile) {
        return path.basename(matchingFile).toLowerCase() === path.basename(newFile).toLowerCase();
      })[0];

      if (match) {
        fs.writeFileSync(match, fs.readFileSync(newFile));
      } else {
        console.log(util.format('Cloud not find match for %s', newFile));
      }
    });
  });
});