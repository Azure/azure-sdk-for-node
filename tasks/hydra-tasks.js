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

_ = require('underscore');
child_process = require('child_process');
fs = require('fs');
os = require('os');
path = require('path');
request = require('request');
util = require('util');

module.exports = function(grunt) {
  'use strict';

  grunt.registerTask('downloadNuGet', 'Download the NuGet.exe file if not already present', function() {
    var config = {
      path: grunt.config('downloadNuGet.path') || '.nuget',
      src: grunt.config('downloadNuGet.src') || 'http://www.nuget.org/nuget.exe'
    };

    var done = this.async();

    if (!grunt.file.exists(config.path)) {
      grunt.file.mkdir(config.path);
    }

    var nugetExePath = path.join(config.path, 'nuget.exe');

    if (!grunt.file.exists(nugetExePath)) {
      var nugetExeStream = fs.createWriteStream(nugetExePath);

      nugetExeStream.on('finish', function (err) {
        // Wait a few milliseconds - finish fires before the file is actually closed
        setTimeout(function () { done(err); }, 500);
      });

      request(config.src).pipe(nugetExeStream);
    } else {
      done();
    }
  });

  grunt.registerTask('restorePackages', 'Download any missing packages from the nuget repositories', function () {
    var nugetPath = grunt.config('downloadNuGet.path') || '.nuget';
    var nugetExe = path.join(nugetPath, 'nuget.exe');
    var n;
    var restoreConfigFile = 'restore.config';
    var done = this.async();

    var configVars = [
      ['PRIVATE_FEED_URL', 'privateFeedUrl'],
      ['PRIVATE_FEED_USER_NAME', 'privateFeedUserName'],
      ['PRIVATE_FEED_PASSWORD', 'privateFeedPassword']
    ];

    configVars = configVars.map(function (v) { return [v[0], v[1], process.env[v[0]] || grunt.config('restorePackages.' + v[1])]; });

    if (configVars[0][2]) {
      var unsetVars = configVars.filter(function (v) { return v[0] != 'PRIVATE_FEED_URL' && !(v[2]); });
      if (unsetVars.length !== 0) {
        grunt.fail.fatal('The following environment variables must be set: ' + unsetVars.map(function (v) { return v[0]; }), 1);
        return;
      }

      var config = _.chain(configVars).map(function (v) { return [v[1], v[2]]; }).object().value();

      deleteFile(restoreConfigFile);

      n = nuget(nugetExe, restoreConfigFile);

      var cleanupAndFail = function(err) {
        deleteFile(restoreConfigFile);
        grunt.fatal(err);
        done(false);
      }

      n.addSource('hydra', config.privateFeedUrl, function (err) {
        if (err) { return cleanupAndFail(err); }

        n.updateSource('hydra', config.privateFeedUserName, config.privateFeedPassword, function (err) {
          if (err) { return cleanupAndFail(err); }

          n.restorePackages('packages.config', 'packages', function (err) {
            deleteFile(restoreConfigFile);
            if (err) {
              grunt.fatal(err);
              done(false);
            } else {
              done();
            }
          });
        });
      });
    } else {
      console.log('No configuration for private feed, using default sources');
      n = nuget(nugetExe);
      n.restorePackages('packages.config', 'packages', function (err) {
        if (err) { done(false); } else { done(); }
      });
    }
  });

  grunt.registerMultiTask('hydra', 'Run hydra code generator', function () {
    var hydraExePath = grunt.file.expand('./packages/Hydra.Generator.*/tools/hydra.exe')[0];
    var specDllName = this.target;
    var specPath = grunt.file.expand('./packages/**/tools/' + specDllName)[0];
    var args;

    var data;
    if (Object.prototype.toString.call(this.data) === '[object Array]') {
      data = this.data;
    } else {
      data = [ this.data ];
    }

    function generate(elements, cb) {
      if (elements.length <= 0) {
        return cb();
      }

      var element = elements.pop();
      if (element.split) {
        args = [ '-f', 'js', '-d', element.destDir, '-s', element.split, '-c', element.clientType, specPath];
      } else if (element.output) {
        args = [ '-f', 'js', '-d', element.destDir, '-o', element.output, '-c', element.clientType, specPath];
      } else {
        // this will most likely be an error on the CLI, but pass it anyways to make sure
        // we throw the right error
        args = [ '-f', 'js', '-d', element.destDir, '-c', element.clientType, specPath];
      }

      runExe(hydraExePath, args, function (err) {
        if (err) { grunt.fatal(err); cb(false); } else { generate(elements, cb); }
      });
    }

    generate(data, this.async());
  });

  grunt.registerTask('generateCode', 'Run hydra code generator over the specifications and generate code', function () {
    var hydraPath = grunt.file.expand('./hydra/Hydra.Generator.*/tools/hydra.exe')[0];

    var hydraXmls = grunt.file.expand('./lib/service/codegen/*.hydra.xml');

    var done = this.async();
    var outstanding = hydraXmls.length;

    function whenFinished(err, result, code) {
      if (err) {
        console.log(result.toString());
        grunt.fail.fatal('Code generation failed');
      }

      outstanding -= 1;
      if (outstanding === 0) {
        done();
      }
    }

    _.each(hydraXmls, function (xmlFile) {
      runExe(hydraPath, [xmlFile], whenFinished);
    });
  });

  function deleteFile(filename) {
    if (grunt.file.exists(filename)) {
      grunt.file.delete(filename);
    }
  }

  // helper function/object to make it easier to run nuget

  function nuget(nugetExePath, configFile) {
    var defaultArgs = [];
    var argsTail = ['-NonInteractive'];

    if(os.platform() !== 'win32') {
      defaultArgs = ['--runtime=v4.0.30319', nugetExePath];
      nugetExePath = 'mono';
    }

    if (configFile) {
      argsTail.push('-configFile', configFile);
      grunt.file.write(configFile, '<configuration></configuration>');
    }

    function spawnOpts() {
      var args = _.toArray(arguments);
      return {
        cmd: nugetExePath,
        args: defaultArgs.concat(args).concat(argsTail)
      };
    }

    function addSource(sourceName, sourceUrl, callback) {
      var opts = spawnOpts('sources', 'add', '-name', sourceName, '-source', sourceUrl);
      grunt.util.spawn(opts, callback);
    }

    function updateSource(sourceName, userName, password, callback) {
      var opts = spawnOpts('sources', 'update', '-name', sourceName, '-username', userName, '-password', password);
      grunt.util.spawn(opts, callback);
    }

    function restorePackages(packageConfigFile, packagesDir, callback) {
      var opts = spawnOpts('restore', packageConfigFile, '-PackagesDirectory', packagesDir);
      var child = grunt.util.spawn(opts, callback);
    }

    return {
      addSource: addSource,
      updateSource: updateSource,
      restorePackages: restorePackages
    };
  }


  //
  // Run a CLR executable - run it directly if on Windows,
  // through mono if not
  //
  function runExe(exePath, args, callback) {

    var spawnOpts = {
      cmd: exePath,
      args: args
    };

    if (os.platform() !== 'win32') {
      spawnOpts.args = ['--runtime=v4.0.30319', exePath].concat(args);
      spawnOpts.cmd = 'mono';
    }

    grunt.util.spawn(spawnOpts, callback);
  }
};
