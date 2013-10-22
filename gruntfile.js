module.exports = function(grunt) {
  //init stuff
  grunt.initConfig({
    //jsdoc config
    jsdoc : {
        dist : {
            src: [
              'README.md',
              'lib/azure.js',
              'lib/services/core/serviceclient.js',
              'lib/services/core/filters/exponentialretrypolicyfilter.js',
              'lib/services/core/filters/linearretrypolicyfilter.js',
              'lib/services/blob/*.js',
              'lib/services/queue/*.js',
              'lib/services/serviceBus/apnsservice.js',
              'lib/services/serviceBus/gcmservice.js',
              'lib/services/serviceBus/notificationhubservice.js',
              'lib/services/serviceBus/servicebusservice.js',
              'lib/services/serviceBus/wnsservice.js',
              'lib/services/management/*.js',
              'lib/services/sql/sqlservice.js',
              'lib/services/table/tableservice.js',
              'lib/serviceruntime/roleenvironment.js',
              'lib/util/date.js'
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