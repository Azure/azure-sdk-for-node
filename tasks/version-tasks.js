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

_ = require('underscore');
child_process = require('child_process');
fs = require('fs');
path = require('path');
util = require('util');

module.exports = function (grunt) {
  grunt.registerTask('updateVersions', 'Update versions of packages and dependencies', function () {
    var versions = grunt.config.get('packageVersions');

    var packageJsons = allPackageJsons();

    console.log(packageJsons);

    packageJsons.forEach(function (packageJsonPath) {
      grunt.log.writeln('Updating ' + packageJsonPath);
      var packageJson = grunt.file.readJSON(packageJsonPath);
      updatePackageJson(packageJson, versions);
      savePackageJson(packageJsonPath, packageJson);
    });
  });

  grunt.registerTask('harvestVersions', 'List versions off main package and all subpackages', function () {
    var packages = {};
    allPackageJsons().forEach(function (packageJsonPath) {
      var packageJson = grunt.file.readJSON(packageJsonPath);
      packages[packageJson.name] = packageJson.version;
    });

    _.keys(packages).sort().forEach(function (packageName) {
      grunt.log.writeln(util.format("'%s': '%s'", packageName, packages[packageName]));
    });
  });

  function allPackageJsons() {
    return grunt.file.expand({
        cwd: path.join(__dirname, '../lib/services'),
        filter: function (path) { return !(/node_modules/.test(path)); }
      }, '**/package.json')
      .map(function (pathname) { return path.join(__dirname, '../lib/services', pathname); })
      .concat(['../lib/common', '..'].map(function (p) { return path.join(__dirname, p, 'package.json'); }));
  }

  function updatePackageJson(packageJson, versions) {
    console.log('updating package named', packageJson.name, packageJson.version);
    if (_.has(versions, packageJson.name)) {
      packageJson.version = versions[packageJson.name];
    }

    function update(deps) {
      if (!deps) { return; }
      _.keys(versions)
        .forEach(function (packageName) {
          console.log('checking for update to', packageName);
          if (_.has(deps, packageName)) {
            deps[packageName] = versions[packageName];
          }
        });
    }

    update(packageJson.dependencies);
    update(packageJson.devDependencies);
  }

  function savePackageJson(packageJsonPath, packageJson) {
    console.log('saving', packageJsonPath);
    grunt.file.write(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
};
