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

module.exports = function(grunt) {
  var glob = require('glob');
  var _ = require('underscore');
  var path = require('path');
  var fs = require('fs');

  var jsdocOptions = {
    destination: 'docs',
    template: "jsdocs/template",
    configure: "jsdocs/template/jsdoc.conf.json",
    tutorials: "examples"
  };


  var sources = _.map(glob.sync("lib/**/package.json", {}), function(pack) {
    return _.map(["/**/*.js", '/package.json', "/README.md"], function(i) {
      return path.dirname(pack) + i;
    });
  });

  var jsdocConfig = {};
  _.each(sources, function(source) {
    jsdocConfig[JSON.parse(fs.readFileSync(source[1])).name] = {
      src: source,
      options: jsdocOptions
    };
  });

  jsdocConfig['Azure'] = {
    src: ["lib/**/*.js", "README.md"],
    options: jsdocOptions
  };

  var packageVersions = {};
  _.each(sources, function(source) {
    var pack = JSON.parse(fs.readFileSync(source[1]));
    packageVersions[pack.name] = pack.version;
  });

  //init stuff
  grunt.initConfig({
    packageVersions: packageVersions,
    jsdoc: jsdocConfig,
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        keepalive: true
      },
      server: {
        options: {
          base: './docs',
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadTasks('tasks');
  grunt.registerTask('publishdocs', ['githubPages:target']);
};
