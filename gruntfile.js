module.exports = function(grunt) {
  //init stuff
  grunt.initConfig({
    //jsdoc config
    jsdoc : {
        dist : {
            src: [
              'lib/services/azure.js',
              'lib/services/blob/*.js',
              'lib/services/queue/*.js',
              'lib/services/serviceBus/apnsservice.js',
              'lib/services/serviceBus/gcmservice.js',
              'lib/services/serviceBus/notificationhubservice.js',
              'lib/services/serviceBus/servicebusservice.js',
              'lib/services/serviceBus/wnsservice.js',
              'lib/services/serviceManagement/*.js',
              'lib/services/sqlAzure/sqlservice.js',
              'lib/services/table/tableservice.js'
            ], 
            options: {
                destination: 'docs'
            }
        }
    },
    devserver: { options: 
      { 'type' : 'http',
        'port' : 8888,
        'base' : './docs/'
      }
    }
  });
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-devserver');
};