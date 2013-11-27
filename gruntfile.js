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
  //init stuff
  grunt.initConfig({
    //jsdoc config
    jsdoc : {
        dist : {
            src: [
              'README.md',
              'lib/azure.js',
              'lib/common/lib/services/serviceclient.js',
              'lib/common/lib/services/filters/exponentialretrypolicyfilter.js',
              'lib/common/lib/services/filters/linearretrypolicyfilter.js',
              'lib/common/lib/util/date.js'
              'lib/services/blob/*.js',
              'lib/services/queue/*.js',
              'lib/services/serviceBus/apnsservice.js',
              'lib/services/serviceBus/gcmservice.js',
              'lib/services/serviceBus/notificationhubservice.js',
              'lib/services/serviceBus/servicebusservice.js',
              'lib/services/serviceBus/wnsservice.js',
              'lib/services/management/lib/*.js',
              'lib/services/sql/sqlservice.js',
              'lib/services/table/tableservice.js',
              'lib/serviceruntime/roleenvironment.js',
            ], 
            options: {
                destination: 'docs',
                configure: 'jsdoc/jsdoc.json',
                template: 'jsdoc/template'
            }
        }
    },
    devserver: { options: 
      { 'type' : 'http',
        'port' : 8888,
        'base' : 'docs'
      }
    },
    githubPages: {
      target: {
        options: {
          // The default commit message for the gh-pages branch
          commitMessage: 'pushing docs to pages'
        },
        // The folder where your gh-pages repo is
        src: 'docs'
      }
    }
  });
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-devserver');
  grunt.loadNpmTasks('grunt-github-pages');
  grunt.registerTask('publishdocs', ['githubPages:target']);
};