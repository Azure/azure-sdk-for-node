/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

const gulp = require('gulp');
const args = require('yargs').argv;
const colors = require('colors');
const fs = require('fs');
const util = require('util');
const path = require('path');
const glob = require('glob');
const execSync = require('child_process').execSync;

const mappings = {
  'advisor': {
    'packageName': 'azure-arm-advisor',
    'dir': 'advisorManagement/lib',
    'source': 'advisor/resource-manager/readme.md'
  },
  'analysisservices': {
    'packageName': 'azure-arm-analysisservices',
    'dir': 'analysisServices/lib',
    'source': 'analysisservices/resource-manager/readme.md',
  },
  'apimanagement': {
    'packageName': 'azure-arm-apimanagement',
    'dir': 'apimanagement/lib',
    'source': 'apimanagement/resource-manager/readme.md',
  },
  'appinsights': {
    'packageName': 'azure-arm-appinsights',
    'dir': 'appinsights/lib',
    'source': 'appinsights/resource-manager/readme.md',
  },
  'authorization': {
    'packageName': 'azure-arm-authorization',
    'dir': 'authorizationManagement/lib',
    'source': 'authorization/resource-manager/readme.md',
    'ft': 1
  },
  'automation': {
    'packageName': 'azure-arm-automation',
    'dir': 'automationManagement/lib',
    'source': 'automation/resource-manager/readme.md',
  },
  'batch.Management': {
    'packageName': 'azure-arm-batch',
    'dir': 'batchManagement/lib',
    'source': 'batch/resource-manager/readme.md',
    'ft': 1
  },
  'batch.Service': {
    'packageName': 'azure-batch',
    'dir': 'batch/lib',
    'source': 'batch/data-plane/readme.md',
    'ft': 1
  },
  'billing': {
    'packageName': 'azure-arm-billing',
    'dir': 'billingManagement/lib',
    'source': 'billing/resource-manager/readme.md',
    'ft': 1
  },
  'cdn': {
    'packageName': 'azure-arm-cdn',
    'dir': 'cdnManagement/lib',
    'source': 'cdn/resource-manager/readme.md',
    'ft': 2
  },
  'cognitiveServices': {
    'packageName': 'azure-arm-cognitiveServices',
    'dir': 'coginitiveServicesManagement/lib',
    'source': 'cognitiveservices/resource-manager/readme.md'
  },
  'commerce': {
    'packageName': 'azure-arm-commerce',
    'dir': 'commerce/lib',
    'source': 'commerce/resource-manager/readme.md',
    'ft': 2
  },
  'compute': {
    'packageName': 'azure-arm-compute',
    'dir': 'computeManagement2/lib',
    'source': 'compute/resource-manager/readme.md',
    'ft': 1
  },
  'consumption': {
    'packageName': 'azure-arm-consumption',
    'dir': 'consumptionManagement/lib',
    'source': 'consumption/resource-manager/readme.md'
  },
  'containerregistry': {
    'packageName': 'azure-arm-containerregistry',
    'dir': 'containerRegistryManagement/lib',
    'source': 'containerregistry/resource-manager/readme.md'
  },
  'cosmosdb': {
    'packageName': 'azure-arm-cosmosdb',
    'dir': 'cosmosdbManagement/lib',
    'source': 'cosmos-db/resource-manager/readme.md'
  },
  'customerinsights': {
    'packageName': 'azure-arm-customerinsights',
    'dir': 'customerInsightsManagement/lib',
    'source': 'customer-insights/resource-manager/readme.md'
  },
  'datalake-analytics.account': {
    'packageName': 'azure-arm-datalake-analytics',
    'dir': 'dataLake.Analytics/lib/account',
    'source': 'datalake-analytics/resource-manager/Microsoft.DataLakeAnalytics/2016-11-01/account.json'
  },
  'datalake-analytics.catalog': {
    'packageName': 'azure-arm-datalake-analytics',
    'dir': 'dataLake.Analytics/lib/catalog',
    'source': 'datalake-analytics/data-plane/Microsoft.DataLakeAnalytics/2016-11-01/catalog.json'
  },
  'datalake-analytics.job': {
    'packageName': 'azure-arm-datalake-analytics',
    'dir': 'dataLake.Analytics/lib/job',
    'source': 'datalake-analytics/data-plane/Microsoft.DataLakeAnalytics/2016-11-01/job.json'
  },
  'datalake-store.account': {
    'packageName': 'azure-arm-datalake-store',
    'dir': 'dataLake.Store/lib/account',
    'source': 'datalake-store/resource-manager/readme.md'
  },
  'datalake-store.filesystem': {
    'packageName': 'azure-arm-datalake-store',
    'dir': 'dataLake.Store/lib/filesystem',
    'source': 'datalake-store/data-plane/readme.md'
  },
  'devtestlabs': {
    'packageName': 'azure-arm-devtestlabs',
    'dir': 'devTestLabs/lib',
    'source': 'devtestlabs/resource-manager/readme.md'
  },
  'dns': {
    'packageName': 'azure-arm-dns',
    'dir': 'dnsManagement/lib',
    'source': 'dns/resource-manager/readme.md'
  },
  'eventhub': {
    'packageName': 'azure-arm-eventhub',
    'dir': 'eventHubManagement/lib',
    'source': 'eventhub/resource-manager/readme.md'
  },
  'graph': {
    'packageName': 'azure-graph',
    'dir': 'graphManagement/lib',
    'source': 'graphrbac/data-plane/readme.md',
    'ft': 1
  },
  'hdinsight': {
    'packageName': 'azure-arm-hdinsight',
    'dir': 'hdInsightManagement/lib',
    'source': 'hdinsight/resource-manager/readme.md',
  },
  'intune': {
    'packageName': 'azure-arm-intune',
    'dir': 'intune/lib',
    'source': 'intune/resource-manager/readme.md',
  },
  'iothub': {
    'packageName': 'azure-arm-iothub',
    'dir': 'iothub/lib',
    'source': 'iothub/resource-manager/readme.md',
    'ft': 1
  },
  'keyvault': {
    'packageName': 'azure-keyvault',
    'dir': 'keyvault/lib',
    'source': 'keyvault/data-plane/readme.md'
  },
  'arm-keyvault': {
    'packageName': 'azure-arm-keyvault',
    'dir': 'keyVaultManagement/lib',
    'source': 'keyvault/resource-manager/readme.md'
  },
  'logic': {
    'packageName': 'azure-arm-logic',
    'dir': 'logicManagement/lib',
    'source': 'logic/resource-manager/readme.md',
  },
  'machinelearning': {
    'packageName': 'azure-arm-machinelearning',
    'dir': 'machinelearning/lib',
    'source': 'machinelearning/resource-manager/readme.md'
  },
  'mediaservices': {
    'packageName': 'azure-arm-mediaservices',
    'dir': 'mediaServicesManagement/lib',
    'source': 'mediaservices/resource-manager/readme.md'
  },
  'mobileengagement': {
    'packageName': 'azure-arm-mobileengagement',
    'dir': 'mobileEngagementManagement/lib',
    'source': 'mobileengagement/resource-manager/readme.md'
  },
  'monitor': {
    'package': 'azure-monitor',
    'dir': 'monitor/lib',
    'source': 'monitor/data-plane/readme.md',
    'ft': 1
  },
  'monitor.management': {
    'package': 'azure-arm-monitor',
    'dir': 'monitorManagement/lib',
    'source': 'monitor/resource-manager/readme.md',
    'ft': 1
  },
  'mysql': {
    'packageName': 'azure-arm-mysql',
    'dir': 'mysqlManagement/lib',
    'source': 'mysql/resource-manager/readme.md'
  },
  'network': {
    'packageName': 'azure-arm-network',
    'dir': 'networkManagement2/lib',
    'source': 'network/resource-manager/readme.md'
  },
  'notificationhubs': {
    'packageName': 'azure-arm-notificationhubs',
    'dir': 'notificationHubsManagement/lib',
    'source': 'notificationhubs/resource-manager/readme.md'
  },
  'operationalinsights': {
    'packageName': 'azure-arm-operationalinsights',
    'dir': 'operationalInsightsManagement2/lib',
    'source': 'operationalinsights/resource-manager/readme.md',
    'clientName': 'OperationalInsightsManagementClient'
  },
  'postgresql': {
    'packageName': 'azure-arm-postgresql',
    'dir': 'postgresqlManagement/lib',
    'source': 'postgresql/resource-manager/readme.md'
  },
  'powerbiembedded': {
    'packageName': 'azure-arm-powerbiembedded',
    'dir': 'powerbiembedded/lib',
    'source': 'powerbiembedded/resource-manager/readme.md'
  },
  'recoveryservices': {
    'packageName': 'azure-arm-recoveryservices',
    'dir': 'recoveryServicesManagement/lib',
    'source': 'recoveryservices/resource-manager/readme.md'
  },
  'recoveryservicesbackup': {
    'packageName': 'azure-arm-recoveryservicesbackup',
    'dir': 'recoveryServicesBackupManagement/lib',
    'source': 'recoveryservicesbackup/resource-manager/readme.md'
  },
  'recoveryservicessiterecovery': {
    'packageName': 'azure-arm-recoveryservices-siterecovery',
    'dir': 'recoveryServicesSiteRecoveryManagement/lib',
    'source': 'recoveryservicessiterecovery/resource-manager/readme.md'
  },
  'rediscache': {
    'packageName': 'azure-arm-rediscache',
    'dir': 'rediscachemanagement/lib',
    'source': 'redis/resource-manager/readme.md',
    'ft': 1
  },
  'relay': {
    'packageName': 'azure-arm-relay',
    'dir': 'relayManagement/lib',
    'source': 'relay/resource-manager/readme.md'
  },
  'resourcehealth': {
    'packageName': 'azure-arm-resourcehealth',
    'dir': 'resourceHealthManagement/lib',
    'source': 'resourcehealth/resource-manager/readme.md'
  },
  'resource': {
    'packageName': 'azure-arm-resource',
    'dir': 'resourceManagement/lib',
    'source': 'resources/resource-manager/readme.md'
  },
  'scheduler': {
    'packageName': 'azure-arm-scheduler',
    'dir': 'schedulerManagement2/lib',
    'source': 'scheduler/resource-manager/readme.md'
  },
  'searchindex': {
    'packageName': 'azure-search',
    'dir': 'search/lib/index',
    'source': 'search/data-plane/Microsoft.Search/2016-09-01/searchindex.json'
  },
  'searchservice': {
    'packageName': 'azure-search',
    'dir': 'search/lib/service',
    'source': 'search/data-plane/Microsoft.Search/2016-09-01/searchservice.json'
  },
  'arm-search': {
    'packageName': 'azure-arm-search',
    'dir': 'searchManagement/lib',
    'source': 'search/resource-manager/readme.md'
  },
  'servermanagement': {
    'packageName': 'azure-arm-servermanagement',
    'dir': 'servermanagement/lib',
    'source': 'servermanagement/resource-manager/readme.md'
  },
  'servicemap': {
    'packageName': 'azure-arm-servicemap',
    'dir': 'serviceMapManagement/lib',
    'source': 'service-map/resource-manager/readme.md',
    'clientName': 'ServicemapManagementClient'
  },
  'sb': {
    'packageName': 'azure-arm-sb',
    'dir': 'serviceBusManagement2/lib',
    'source': 'servicebus/resource-manager/readme.md'
  },
  'arm-servicefabric': {
    'packageName': 'azure-arm-servicefabric',
    'dir': 'serviceFabricManagement/lib',
    'source': 'servicefabric/resource-manager/readme.md'
  },
  'servicefabric': {
    'packageName': 'azure-servicefabric',
    'dir': 'serviceFabric/lib',
    'source': 'servicefabric/data-plane/readme.md',
    'language': 'NodeJS'
  },
  'sql': {
    'packageName': 'azure-arm-sql',
    'dir': 'sqlManagement2/lib',
    'source': 'sql/resource-manager'
  },
  'storage': {
    'packageName': 'azure-arm-storage',
    'dir': 'storageManagement2/lib',
    'source': 'storage/resource-manager/readme.md',
    'ft': 2,
    'clientName': 'StorageManagementClient'
  },
  'storageimportexport': {
    'packageName': 'azure-arm-storageimportexport',
    'dir': 'storageImportExportManagement/lib',
    'source': 'storageimportexport/resource-manager/readme.md',
    'clientName': 'StorageImportExportManagementClient'
  },
  'storsimple8000series': {
    'packageName': 'azure-arm-storsimple8000series',
    'dir': 'storsimple8000series/lib',
    'source': 'storsimple8000series/resource-manager/readme.md'
  },
  'streamanalytics': {
    'packageName': 'azure-arm-streamanalytics',
    'dir': 'streamanalyticsManagement/lib',
    'source': 'streamanalytics/resource-manager/readme.md'
  },
  'timeseriesinsights': {
    'packageName': 'azure-arm-timeseriesinsights',
    'dir': 'timeseriesinsightsManagement/lib',
    'source': 'timeseriesinsights/resource-manager/readme.md'
  },
  'trafficmanager': {
    'packageName': 'azure-arm-trafficmanager',
    'dir': 'trafficManagerManagement2/lib',
    'source': 'trafficmanager/resource-manager/readme.md',
    'ft': 1
  },
  'website': {
    'packageName': 'azure-arm-website',
    'dir': 'websiteManagement2/lib',
    'source': 'web/resource-manager/readme.md',
    'ft': 1
  }
};

const defaultAutoRestVersion = '1.2.2';
var usingAutoRestVersion;
const specRoot = args['spec-root'] || "https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master";
const project = args['project'];
var language = 'Azure.NodeJS';
var modeler = 'Swagger';

function getAutorestVersion(version) {
  if (!version) version = 'latest';
  let getVersion, execHelp;
  let result = true;
  try {
    let getVersionCmd = `autorest --version=${version}`;
    let execHelpCmd = `autorest --help`;
    console.log(getVersionCmd);
    getVersion = execSync(getVersionCmd, { encoding: 'utf8' });
    //console.debug(getVersion);
    console.log(execHelpCmd);
    execHelp = execSync(execHelpCmd, { encoding: 'utf8' });
    //console.debug(execHelp);
  } catch (err) {
    result = false;
    console.log(`An error occurred while getting the "${version}" of autorest and executing "autorest --help":\n ${util.inspect(err, { depth: null })}.`);
  }
  return result;
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function clearProjectBeforeGenerating(projectDir) {
  let modelsDir = `${projectDir}/models`;
  let operationsDir = `${projectDir}/operations`;
  let clientTypedefFile = path.basename(glob.sync(`${projectDir}/*.d.ts`)[0] || '');
  let clientJSFile = `${clientTypedefFile.split('.')[0]}.js`;
  let directoriesToBeDeleted = [modelsDir, operationsDir];
  let filesToBeDeleted = [clientTypedefFile, clientJSFile];
  directoriesToBeDeleted.forEach((dir) => {
    if (fs.existsSync(dir)) {
      deleteFolderRecursive(dir);
    }
  });
  filesToBeDeleted.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
  return;
}

function generateProject(project, specRoot, autoRestVersion) {
  let specPath = specRoot + '/' + mappings[project].source;
  let isInputJson = mappings[project].source.endsWith("json");
  let result;
  const azureTemplate = 'Azure.NodeJs';
  language = azureTemplate;
  //servicefabric wants to generate using generic NodeJS.
  if (mappings[project].language && mappings[project].language.match(/^NodeJS$/ig) !== null) {
    language = mappings[project].language;
  }

  console.log(`\n>>>>>>>>>>>>>>>>>>>Start: "${project}" >>>>>>>>>>>>>>>>>>>>>>>>>`);
  let outputDir = `lib/services/${mappings[project].dir}`;
  let packageName = mappings[project].packageName;
  let cmd = `autorest --output-folder=${outputDir} --package-name=${packageName} --nodejs --license-header=MICROSOFT_MIT_NO_VERSION --version=${autoRestVersion}`;
  
  // if using azure template, pass in azure-arm argument. otherwise, get the generic template by not passing in anything.
  if (language === azureTemplate) cmd += '  --azure-arm ';
  if (isInputJson){
    cmd += `  --input-file=${specPath} `;
  }
  else{
    cmd += `  ${specPath} `;
  }

  if (mappings[project].ft !== null && mappings[project].ft !== undefined) cmd += ' --payload-flattening-threshold=' + mappings[project].ft;
  if (mappings[project].clientName !== null && mappings[project].clientName !== undefined) cmd += ' --override-client-name=' + mappings[project].clientName;
  if (mappings[project].args !== undefined) {
    cmd = cmd + ' ' + args;
  }

  try {
    console.log(`Cleaning the output directory: "${outputDir}".`);
    clearProjectBeforeGenerating(outputDir);
    console.log('Executing command:');
    console.log('------------------------------------------------------------');
    console.log(cmd);
    console.log('------------------------------------------------------------');
    result = execSync(cmd, { encoding: 'utf8' });
    console.log('Output:');
    console.log(result);
  } catch (err) {
    console.log('Error:');
    console.log(`An error occurred while generating client for project: "${project}":\n ${util.inspect(err, { depth: null })}`);
  }
  console.log(`>>>>>>>>>>>>>>>>>>>>>End: "${project}" >>>>>>>>>>>>>>>>>>>>>>>>>\n`);
  return;
}

function installAutorest() {
  let installation;
  let isSuccessful = true;
  let autorestAlreadyInstalled = true;
  try {
    execSync(`autorest --help`);
  } catch (error) {
    autorestAlreadyInstalled = false;
  }
  try {
    if (!autorestAlreadyInstalled) {
      console.log('Looks like autorest is not installed on your machine. Installing autorest . . .');
      let installCmd = 'npm install -g autorest';
      console.log(installCmd);
      installation = execSync(installCmd, { encoding: 'utf8' });
      //console.debug('installation');
    }
    isSuccessful = getAutorestVersion();
  } catch (err) {
    isSuccessful = false;
    console.log(`An error occurred while installing autorest via npm:\n ${util.inspect(err, { depth: null })}.`);
  }
  return isSuccessful;
}

function codegen(project, index) {
  let versionSuccessfullyFound = false;
  if (mappings[project].autorestversion) {
    usingAutoRestVersion = mappings[project].autoRestVersion;
  } else {
    usingAutoRestVersion = defaultAutoRestVersion;
  }
  if (index === 0) {
    versionSuccessfullyFound = getAutorestVersion(usingAutoRestVersion);
    if (!versionSuccessfullyFound) {
      process.exit(1);
    }
  }
  return generateProject(project, specRoot, usingAutoRestVersion);
}

gulp.task('default', function () {
  console.log("Usage: gulp codegen [--spec-root <swagger specs root>] [--project <project name>]\n");
  console.log("--spec-root");
  console.log("\tRoot location of Swagger API specs, default value is \"https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master\"");
  console.log("--project\n\tProject to regenerate, default is all. List of available project names:");
  Object.keys(mappings).forEach(function (i) {
    console.log('\t' + i.magenta);
  });
});

//This task is used to generate libraries based on the mappings specified above.
gulp.task('codegen', function (cb) {
  if (project === undefined) {
    let arr = Object.keys(mappings);
    for (let i = 0; i < arr.length; i++) {
      codegen(arr[i], i);
    }
  } else {
    if (mappings[project] === undefined) {
      console.error('Invalid project name "' + project + '"!');
      process.exit(1);
    }
    codegen(project, null);
  }
});

//This task validates that the entry in "main" and "types" in package.json points to a file that exists on the disk.
// for best results run on mac or linux. Windows is case insenstive for file paths. Hence it will not catch those issues.
//If not tested this will cause "module not found" errors for customers when they try to use the package.
gulp.task('validate-each-packagejson', (cb) => {
  let packagePaths = glob.sync(path.join(__dirname, '/lib/services', '/**/package.json'));
  packagePaths.forEach((packagePath) => {
    const package = require(packagePath);
    //console.log(package);
    if (package.name.startsWith('azure-arm-')) {
      console.log(`Validating package: ${package.name}`);
      if (package.main) {
        let mainPath = path.resolve(path.dirname(packagePath), package.main);
        if (!fs.existsSync(mainPath)) console.log(`\t>${mainPath} does not exist.`);
      } else {
        console.log(`\t>Could not find "main" entry in package.json for ${packagePath}.`);
      }
      if (package.types) {
        let typesPath = path.resolve(path.dirname(packagePath), package.types);
        if (!fs.existsSync(typesPath)) console.log(`\t>${typesPath} does not exist.`);
      } else {
        console.log(`\t>Could not find "types" entry in package.json for ${packagePath}.`);
      }
    }
  });
});

//This task updates the dependencies in package.json to the relative service libraries inside lib/services directory.
gulp.task('update-deps-rollup', (cb) => {
  let packagePaths = glob.sync(path.join(__dirname, './lib/services', '/**/package.json'));
  let rollupPackage = require('./package.json');
  let rollupDependencies = rollupPackage.dependencies;
  rollupDependencies['ms-rest'] = './runtime/ms-rest';
  rollupDependencies['ms-rest-azure'] = './runtime/ms-rest-azure';
  packagePaths.forEach((packagePath) => {
    const package = require(packagePath);
    //console.log(package);
    let packageName = package.name
    packageDir = path.dirname(packagePath);
    if (rollupDependencies[packageName]) {
      rollupDependencies[packageName] = packageDir;
    } else {
      console.log(`Could not find ${packageName} as a dependecy in rollup package.json file..`);
    }
  });
  fs.writeFileSync('./package.json', JSON.stringify(rollupPackage, null, 2), { 'encoding': 'utf8' });
});

//This task ensures that all the exposed createSomeClient() methods, can correctly instantiate clients. By doing this we test,
//that the "main" entry in package.json points to a file at the correct location. We test the signature of the client constructor 
//is as expected. As of now HD Isnight is expected to fail as it is still using the Hyak generator. Once it moves to Autorest, it should
//not fail.
gulp.task('test-create-rollup', (cb) => {
  const azure = require('./lib/azure');
  const keys = Object.keys(azure).filter((key) => { return key.startsWith('create') && !key.startsWith('createASM') && key.endsWith('Client') && key !== 'createSchedulerClient' });
  //console.dir(keys);
  //console.log(keys.length);
  const creds = { signRequest: {} };
  const subId = '1234556';

  keys.forEach((key) => {
    console.log(key);
    const Client = azure[key];
    var c;
    try {
      if (key === 'createKeyVaultClient' || key === 'createSubscriptionManagementClient' ||
        key === 'createDataLakeAnalyticsJobManagementClient' || key === 'createDataLakeStoreFileSystemManagementClient' ||
        key === 'createDataLakeAnalyticsCatalogManagementClient') {
        c = new Client(creds);
      } else {
        c = new Client(creds, subId);
      }
      //console.dir(Object.keys(c));
    } catch (err) {
      console.dir(err);
    }
  });
});
