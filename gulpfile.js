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
  'batch.Management': {
    'dir': 'batchManagement/lib',
    'source': 'arm-batch/2015-12-01/swagger/BatchManagement.json',
    'ft': 1
  },
  'batch.Service': {
    'dir': 'batch/lib',
    'source': 'batch/2016-02-01.3.0/swagger/BatchService.json',
    'ft': 1
  },
  'cdn': {
    'dir': 'cdnManagement/lib',
    'source': 'arm-cdn/2016-04-02/swagger/cdn.json',
    'ft': 2
  },
  'compute': {
    'dir': 'computeManagement2/lib',
    'source': 'arm-compute/compositeComputeClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  },
  'datalake.analytics.account': {
    'dir': 'dataLake.Analytics/lib/account',
    'source': 'arm-datalake-analytics/account/2015-10-01-preview/swagger/account.json'
  },
  'datalake.analytics.job': {
    'dir': 'dataLake.Analytics/lib/job',
    'source': 'arm-datalake-analytics/job/2016-03-20-preview/swagger/job.json'
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
  },
  'devTestLabs': {
    'dir': 'devTestLabs/lib',
    'source': 'arm-devtestlabs/2015-05-21-preview/swagger/DTL.json'
  },
  'graph': {
    'dir': 'graphManagement/lib',
    'source': 'arm-graphrbac/compositeGraphRbacManagementClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  },
  'intune': {
    'dir': 'intune/lib',
    'source': 'arm-intune/2015-01-14-preview/swagger/intune.json',
  },
  'network': {
    'dir': 'networkManagement2/lib',
    'source': 'arm-network/2016-06-01/network.json',
    'ft': 1
  },
  'notificationHubs':{
    'dir': 'notificationHubsManagement/lib',
    'source': 'arm-notificationhubs/2014-09-01/swagger/notificationhubs.json'
  },
  'powerbiembedded': {
    'dir': 'powerbiembedded/lib',
    'source': 'arm-powerbiembedded/2016-01-29/swagger/powerbiembedded.json'
  },
  'rediscache': {
    'dir': 'rediscachemanagement/lib',
    'source': 'arm-redis/2015-08-01/swagger/redis.json',
    'ft': 1
  },
  'resource': {
    'dir': 'resourceManagement/lib/resource',
    'source': 'arm-resources/resources/2016-02-01/swagger/resources.json'
  },
  'resource.subscription': {
    'dir': 'resourceManagement/lib/subscription',
    'source': 'arm-resources/subscriptions/2015-11-01/swagger/subscriptions.json'
  },
  'resource.lock': {
    'dir': 'resourceManagement/lib/lock',
    'source': 'arm-resources/locks/2015-01-01/swagger/locks.json'
  },
  'resource.feature': {
    'dir': 'resourceManagement/lib/feature',
    'source': 'arm-resources/features/2015-12-01/swagger/features.json'
  },
  'resource.policy': {
    'dir': 'resourceManagement/lib/policy',
    'source': 'arm-resources/policy/2016-04-01/swagger/policy.json'
  },
  'storage': {
    'dir': 'storageManagement2/lib',
    'source': 'arm-storage/2016-01-01/swagger/storage.json',
    'ft': 2
  },
  'servermanagement': {
    'dir': 'servermanagement/lib',
    'source': 'arm-servermanagement/2015-07-01-preview/servermanagement.json'
  },
  'serviceFabric': {
    'dir': 'serviceFabric/lib',
    'source': 'servicefabric/2016-01-28/swagger/servicefabric.json',
    'language': 'NodeJS'
  },
  'traffic':{
    'dir': 'trafficManagement2/lib',
    'source': 'arm-trafficmanager/2015-11-01/trafficmanager.json',
    'ft': 1
  },
  'website': {
    'dir': 'websiteManagement2/lib',
    'source': 'arm-web/2015-08-01/swagger/service.json',
    'ft': 1
  }
};

var defaultAutoRestVersion = '0.17.0-Nightly20160630';
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
  var currentModeler = modeler;
  var specPath = specRoot + '/' + mappings[project].source;
  //servicefabric wants to generate using generic NodeJS.
  if (mappings[project].language && mappings[project].language.match(/^NodeJS$/ig) !== null) {
    language = mappings[project].language;
  }
  //default Modeler is Swagger. However, some services may want to use CompositeSwaggerModeler
  if (mappings[project].modeler && mappings[project].modeler.match(/^CompositeSwagger$/ig) !== null) {
    currentModeler = mappings[project].modeler;
  }

  console.log(util.format('Generating "%s" from spec file "%s" with language "%s" and AutoRest version "%s".', 
    project,  specRoot + '/' + mappings[project].source, language, autoRestVersion));
  autoRestExe = constructAutorestExePath(autoRestVersion);
  var cmd = util.format('%s -Modeler %s -CodeGenerator %s -Input %s  -outputDirectory lib/services/%s -Header MICROSOFT_MIT_NO_VERSION',
    autoRestExe, currentModeler, language, specPath, mappings[project].dir);
  if (mappings[project].ft !== null && mappings[project].ft !== undefined) cmd += ' -FT ' + mappings[project].ft;
  if (mappings[project].args !== undefined) {
    cmd = cmd + ' ' + args;
  }
  console.log('Executing: ' + clrCmd(cmd));
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