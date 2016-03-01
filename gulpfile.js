var gulp = require('gulp');
var args = require('yargs').argv;
var colors = require('colors');
var exec = require('child_process').exec;

var mappings = {
  'authorization': {
    'dir': 'authorizationManagement/lib',
    'source': 'arm-authorization/2015-07-01/swagger/authorization.json', 
    'ft': 1
  },
  'graph': {
    'dir': 'graphManagement/lib',
    'source': 'arm-graphrbac/1.6-internal/swagger/graphrbac.json',
    'ft': 1
  },
  'compute': {
    'dir': 'computeManagement2/lib',
    'source': 'arm-compute/2015-06-15/swagger/compute.json',
    'ft': 1
  },
  'intune': {
    'dir': 'intune/lib',
    'source': 'arm-intune/2015-01-14-preview/swagger/intune.json',
  },
  'network': {
    'dir': 'networkManagement2/lib',
    'source': 'arm-network/2015-06-15/swagger/network.json',
    'ft': 1
  },
  'rediscache': {
    'dir': 'rediscachemanagement/lib',
    'source': 'arm-redis/2015-08-01/swagger/redis.json',
    'ft': 1
  },
  'storage': {
    'dir': 'storageManagement2/lib',
    'source': 'arm-storage/2015-06-15/swagger/storage.json',
    'ft': 2
  },
  'resource': {
    'dir': 'resourceManagement/lib/resource',
    'source': 'arm-resources/resources/2015-11-01/swagger/resources.json'
  },
  'resource.subscription': {
    'dir': 'resourceManagement/lib/subscription',
    'source': 'arm-resources/subscriptions/2015-11-01/swagger/subscriptions.json'
  },
  'resource.authorization': {
    'dir': 'resourceManagement/lib/authorization',
    'source': 'arm-resources/authorization/2015-01-01/swagger/authorization.json'
  },
  'resource.feature': {
    'dir': 'resourceManagement/lib/feature',
    'source': 'arm-resources/features/2015-12-01/swagger/features.json'
  },
  'website': {
    'dir': 'websiteManagement2/lib',
    'source': 'arm-web/2015-08-01/swagger/service.json',
    'ft': 1
  }
};

var autoRestVersion = '0.15.0-Nightly20160225';
var specRoot = args['spec-root'] || "https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master";
var project = args['project'];
var autoRestExe = 'packages\\autorest.' + autoRestVersion + '\\tools\\AutoRest.exe';
var nugetExe = 'tools/nuget.exe';
var nugetSource = 'https://www.myget.org/F/autorest/api/v2';
var language = 'Azure.NodeJS';
var isWindows = (process.platform.lastIndexOf('win') === 0);
var clrCmd = function(cmd){
  return isWindows ? cmd : ('mono ' + cmd);
};

function codegen(project, cb) {
  //servicefabric wants to generate using generic NodeJS.
  if (mappings[project].language && mappings[project].language.match(/^NodeJS$/ig) !== null) {
    language = mappings[project].language;
  }

  console.log(util.format('Generating "%s" from spec file "%s" with language "%s" and AutoRest version "%s".', 
    project,  specRoot + '/' + mappings[project].source, language, autoRestVersion));
  cmd = autoRestExe + ' -Modeler Swagger -CodeGenerator Azure.NodeJS' + ' -Input ' + specRoot + '/' + mappings[project].source + 
    ' -outputDirectory lib/services/' + mappings[project].dir + ' -Header MICROSOFT_MIT';
  if (mappings[project].ft !== null && mappings[project].ft !== undefined) cmd += ' -FT ' + mappings[project].ft;
  if (mappings[project].args !== undefined) {
    cmd = cmd + ' ' + args;
  }
  exec(clrCmd(cmd), function(err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
  });
}

gulp.task('default', function() {
  console.log("Usage: gulp codegen [--spec-root <swagger specs root>] [--project <project name>]\n");
  console.log("--spec-root");
  console.log("\tRoot location of Swagger API specs, default value is \"https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master\"");
  console.log("--project\n\tProject to regenerate, default is all. List of available project names:");
  Object.keys(mappings).forEach(function(i) {
      console.log('\t' + i.magenta);
  });
});

gulp.task('codegen', function(cb) {
  exec('tools/nuget.exe install autorest -Source ' + nugetSource + ' -Version ' + autoRestVersion + ' -o packages', function(err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    if (project === undefined) {
      Object.keys(mappings).forEach(function(proj) {
        codegen(proj, cb);
      });
    } else {
      if (mappings[project] === undefined) {
        console.error('Invalid project name "' + project + '"!');
        process.exit(1);
      }
      codegen(project, cb);
    }
  });
});
