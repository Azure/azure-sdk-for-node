var gulp = require('gulp');
var args = require('yargs').argv;
var colors = require('colors');
var fs = require('fs');
var util = require('util');
var path = require('path');
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
  'serviceFabric': {
    'dir': 'serviceFabric/lib',
    'source': 'arm-servicefabric/2016-01-28/swagger/servicefabric.json',
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
  },
  'cdn': {
	'dir': 'cdnManagement/lib',
	'source': 'arm-cdn/2016-04-02/swagger/cdn.json',
	'ft': 2
  },
  'datalake.analytics.account': {
    'dir': 'dataLake.Analytics/lib/account',
    'source': 'arm-datalake-analytics/account/2015-10-01-preview/swagger/account.json'
  },
  'datalake.analytics.job': {
    'dir': 'dataLake.Analytics/lib/job',
    'source': 'arm-datalake-analytics/job/2015-11-01-preview/swagger/job.json'
  },
  'datalake.analytics.catalog': {
    'dir': 'dataLake.Analytics/lib/catalog',
    'source': 'arm-datalake-analytics/catalog/2015-10-01-preview/swagger/catalog.json'
  },
  'datalake.store.account': {
    'dir': 'dataLake.Store/lib/account',
    'source': 'arm-datalake-store/account/2015-10-01-preview/swagger/account.json'
  },
  'datalake.store.filesystem': {
    'dir': 'dataLake.Store/lib/filesystem',
    'source': 'arm-datalake-store/filesystem/2015-10-01-preview/swagger/filesystem.json'
  }
};

var defaultAutoRestVersion = '0.15.0-Nightly20160304';
var usingAutoRestVersion;
var specRoot = args['spec-root'] || "https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master";
var project = args['project'];
var nugetExe = path.join('tools', 'nuget.exe');
var autoRestExe = constructAutorestExePath(defaultAutoRestVersion);
var nugetSource = 'https://www.myget.org/F/autorest/api/v2';
var language = 'Azure.NodeJS';
var modeler = 'Swagger';
var isWindows = (process.platform.lastIndexOf('win') === 0);
function clrCmd(cmd){
  return isWindows ? cmd : ('mono ' + cmd);
};

function constructAutorestExePath(version) {
  return path.join('packages', 'autorest.' + version, 'tools', 'AutoRest.exe');
}
function codegen(project, cb) {
  var found = false;
  if (mappings[project].autorestversion) {
    usingAutoRestVersion = mappings[project].autoRestVersion;
  } else {
    usingAutoRestVersion = defaultAutoRestVersion;
  }
  autoRestExe = constructAutorestExePath(usingAutoRestVersion);
  try {
    fs.statSync(autoRestExe);
    found = true;
  } catch (err) {
    if (!err.message.match(/^ENONET.*/ig)) {
      cb(err);
    }
  }
  if (found) {
    generateProject(project, specRoot, usingAutoRestVersion);
  } else {
    var nugetCmd2 = clrCmd(nugetExe) + ' install autorest -Source ' + nugetSource + ' -Version ' + usingAutoRestVersion + ' -o packages';
    console.log('Downloading Autorest version: ' + nugetCmd2);
    exec(nugetCmd2, function(err, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);
      generateProject(project, specRoot, usingAutoRestVersion);
    });
  }
}

function generateProject(project, specRoot, autoRestVersion) {
  var specPath = specRoot + '/' + mappings[project].source;
  //servicefabric wants to generate using generic NodeJS.
  if (mappings[project].language && mappings[project].language.match(/^NodeJS$/ig) !== null) {
    language = mappings[project].language;
  }
  //default Modeler is Swagger. However, some services may want to use CompositeSwaggerModeler
  if (mappings[project].modeler && mappings[project].modeler.match(/^CompositeSwagger$/ig) !== null) {
    modeler = mappings[project].modeler;
  }

  console.log(util.format('Generating "%s" from spec file "%s" with language "%s" and AutoRest version "%s".', 
    project,  specRoot + '/' + mappings[project].source, language, autoRestVersion));
  autoRestExe = constructAutorestExePath(autoRestVersion);
  var cmd = util.format('%s -Modeler %s -CodeGenerator %s -Input %s  -outputDirectory lib/services/%s -Header MICROSOFT_MIT',
    autoRestExe, modeler, language, specPath, mappings[project].dir);
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
  var nugetCmd = clrCmd(nugetExe) + ' install autorest -Source ' + nugetSource + ' -Version ' + defaultAutoRestVersion + ' -o packages';
  console.log('Downloading default AutoRest version: ' + nugetCmd);
  exec(nugetCmd, function(err, stdout, stderr) {
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
