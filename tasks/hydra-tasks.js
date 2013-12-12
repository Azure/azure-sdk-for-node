fs = require('fs');
path = require('path');
request = require('request');
util = require('util');

module.exports = function(grunt) {

  grunt.registerTask('downloadNuGet', 'Download the NuGet.exe file if not already present', function() {
    grunt.log.writeln(this.name + ' task has executed, path = ' + grunt.config('downloadNuGet.path') +
      ' source = ' + grunt.config('downloadNuGet.src'));

    var config = {
      path: grunt.config('downloadNuGet.path') || 'hydra',
      src: grunt.config('downloadNuGet.src') || 'http://www.nuget.org/nuget.exe'
    };

    var done = this.async();

    if (!grunt.file.exists(config.path)) {
      grunt.file.mkdir(config.path);
    }

    var nugetExePath = path.join(config.path, 'nuget.exe');
    var nugetExeStream = fs.createWriteStream(nugetExePath);

    nugetExeStream.on('finish', done);

    request(config.src).pipe(nugetExeStream);
  });

  grunt.registerTask('findspecdlls', 'Find the specification dlls in packages and print them out', function () {
    var paths = grunt.file.expand("./hydra/*.Specification.*/tools/*.Specification.dll");
    console.log(paths);
  });
};

