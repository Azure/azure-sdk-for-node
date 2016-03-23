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

'use strict';

// Helper script that can read the set of services included
// in the azure SDK dynamically.

var fs = require('fs');
var path = require('path');
var util = require('util');

var sdkRoot = path.join(__dirname, '..');
var servicesRoot = path.join(sdkRoot, 'lib/services');

//
// Can't use readable-stream, have to only use core modules
// since this is called by ci before npm install runs.
//

//
// Implementation of async versions of fundamental higher-order functions
// over arrays.
//

var autorestgenServices = {
  'authorizationManagement': 'authorizationManagement',
  'batch': 'batch',
  'batchManagement': 'batchManagement',
  'cdnManagement': 'cdnManagement',
  'computeManagement2': 'computeManagement2',
  'dataLake.Analytics': 'dataLake.Analytics',
  'dataLake.Store': 'dataLake.Store',
  'graphManagement': 'graphManagement',
  'intune': 'intune',
  'networkManagement2': 'networkManagement2',
  'rediscachemanagement': 'rediscachemanagement',
  'resourceManagement': 'resourceManagement',
  'serviceFabric': 'serviceFabric',
  'storageManagement2': 'storageManagement2',
  'storeManagement': 'storeManagement',
  'webSiteManagement2': 'webSiteManagement2', 
};

function reduceAsync(items, asyncIterator, done, initialValue) {
  if (!initialValue) { initialValue = []; }
  function doReduce(accumulator, remainingItems, index) {
    if (remainingItems.length === 0) {
      return done(null, accumulator);
    }

    asyncIterator(accumulator, remainingItems[0],
      function (err, newAccumulator) {
        if (err) { return done(err); }
        doReduce(newAccumulator, remainingItems.slice(1), index + 1);
      }, index, items);
  }
  doReduce(initialValue, items, 0);
}

function filterAsync(items, asyncPredicate, done) {
  reduceAsync(items,
    function(acc, item, next, index, array) {
      asyncPredicate(item,
        function(err, passed) {
          if (err) { return next(err); }
          if (passed) {
            acc.push(item);
          }
          return next(null, acc);
        },
        index, array);
    }, done);
}

function mapAsync(items, asyncIterator, done) {
  reduceAsync(items,
    function (acc, item, next, index, array) {
      asyncIterator(item,
        function (err, mappedItem) {
          if (err) { return next(err); }
          return next(null, acc.concat(mappedItem));
        },
        index, array);
    }, done);
}

function forEachAsync(items, asyncIterator, done) {
  reduceAsync(items,
    function(acc, item, next, index, array) {
      asyncIterator(item,
        function (err) { return next(err, acc); },
        index, array);
    },
    function (err, result) {
      done(err);
    }
  );
}

//
// Find the list of potential service directories, including common
//
function readServiceDirs(done) {
  fs.readdir(servicesRoot, function (err, files) {
    if (err) { return done(err); }
    function isNotAutorestgenService(item) {
      if (!autorestgenServices[item]) {
        return item;
      }
    }
    var filteredFiles = files.filter(isNotAutorestgenService);
    done(null, [path.join(sdkRoot, 'lib/common')].concat(
      filteredFiles.map(function (f) {
        return path.join(servicesRoot, f);
      })));
  });
}

function hasPackageJson(servicePath, done) {
  fs.exists(path.join(servicePath, 'package.json'), function (exists) {
    return done(null, exists);
  })
}

function readPackageJson(servicePath, done) {
  var packagejsonpath = path.join(servicePath, 'package.json');
  fs.readFile(packagejsonpath, function (err, buffer) {
    if (err) { return done(err); }
    var json = JSON.parse(buffer.toString().trim());
    return done(null, {
      path: servicePath,
      packageJson: json
    });
  });
}

function forEachService(iterator, done) {
  readServiceDirs(function (err, paths) {
    if (err) { return done(err); }
    filterAsync(paths, hasPackageJson, function (err, filteredPaths) {
      if (err) { return done(err); }
      mapAsync(filteredPaths, readPackageJson, function (err, serviceData) {
        if (err) { return done(err); }
        forEachAsync(serviceData, iterator, done);
      });
    });
  });
}

module.exports = forEachService;
