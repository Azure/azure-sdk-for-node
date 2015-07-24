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
    template: 'node_modules/minami',
    configure: 'jsdocs/jsdoc.conf.json',
  };


  var sources = _.map(glob.sync('lib/**/package.json', {}), function(pack) {
    return _.map(['/**/*.js', '/package.json', '/README.md'], function(i) {
      return path.dirname(pack) + i;
    });
  });

  var modifyDefaultConfig = function(confName, jsdocOptions, mutatorFn){
    var confPath = path.join("jsdocs", confName);
    if(fs.existsSync(confPath)){
      fs.unlinkSync(confPath);
    }
    var defaultConf = JSON.parse(fs.readFileSync(jsdocOptions.configure));
    fs.writeFileSync(confPath, JSON.stringify(mutatorFn(defaultConf)));
    return confPath;
  }

  var jsdocConfig = {};
  _.each(sources, function(source) {
    var examplesPath = path.join(path.dirname(source[1]), 'examples');
    var docOptions = _.clone(jsdocOptions);

    if(fs.existsSync(examplesPath)) {
      docOptions.tutorials = examplesPath;
    }

    docOptions.configure = modifyDefaultConfig('child.conf.json', docOptions, function(config){
      config.templates.repoUrl = JSON.parse(fs.readFileSync('package.json')).repository.url;
      config.templates.childPackage = true;
      return config;
    });

    jsdocConfig[JSON.parse(fs.readFileSync(source[1])).name] = {
      src: source,
      options: docOptions
    };
  });

  var packageVersions = {};
  _.each(sources, function(source) {
    var pack = JSON.parse(fs.readFileSync(source[1]));
    packageVersions[pack.name] = pack;

  });

  var docOptions = _.clone(jsdocOptions);
  docOptions.tutorials = 'examples';

  docOptions.configure = modifyDefaultConfig('main.conf.json', docOptions, function(config){
    config.templates.repoUrl = JSON.parse(fs.readFileSync('package.json')).repository.url;
    config.templates.packages = packageVersions;
    return config;
  });

  jsdocConfig['azure'] = {
    src: ['lib/azure.js', 'README.md'],
    options: docOptions
  };

  var packagesLatestSymlinkMapping = Object.keys(packageVersions).map(function(name){
    return {src: path.join('docs', name, packageVersions[name].version), dest: path.join('docs', name, 'latest')};
  });

  symlinkConfig = {
    options: { overwrite: true },
    expanded: {files: packagesLatestSymlinkMapping}
  }

  //init stuff
  grunt.initConfig({
    packageVersions: packageVersions,
    jsdoc: jsdocConfig,
    symlink: symlinkConfig,
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
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadTasks('tasks');
  grunt.registerTask('publishdocs', ['githubPages:target']);
  grunt.registerTask('genDocs', ['jsdoc', 'symlink']);
};
