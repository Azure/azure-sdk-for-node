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
    'source': 'arm-advisor/2017-03-31/swagger/advisor.json'
  },
  'analysisservices': {
    'packageName': 'azure-arm-analysisservices',
    'dir': 'analysisServices/lib',
    'source': 'arm-analysisservices/2016-05-16/swagger/analysisservices.json',
  },
  'authorization': {
    'packageName': 'azure-arm-authorization',
    'dir': 'authorizationManagement/lib',
    'source': 'arm-authorization/2015-07-01/swagger/authorization.json',
    'ft': 1
  },
  'automation': {
    'packageName': 'azure-arm-automation',
    'dir': 'automationManagement/lib',
    'source': 'arm-automation/compositeAutomation.json',
    'modeler': 'CompositeSwagger'
  },
  'batch.Management': {
    'packageName': 'azure-arm-batch',
    'dir': 'batchManagement/lib',
    'source': 'arm-batch/2017-01-01/swagger/BatchManagement.json',
    'ft': 1
  },
  'batch.Service': {
    'packageName': 'azure-batch',
    'dir': 'batch/lib',
    'source': 'batch/2017-01-01.4.0/swagger/BatchService.json',
    'ft': 1
  },
  'billing': {
    'packageName': 'azure-arm-billing',
    'dir': 'billingManagement/lib',
    'source': 'arm-billing/2017-02-27-preview/swagger/billing.json',
    'ft': 1
  },
  'cdn': {
    'packageName': 'azure-arm-cdn',
    'dir': 'cdnManagement/lib',
    'source': 'arm-cdn/2016-10-02/swagger/cdn.json',
    'ft': 2
  },
  'coginitiveServices': {
    'packageName': 'azure-arm-coginitiveServices',
    'dir': 'coginitiveServicesManagement/lib',
    'source': 'arm-cognitiveservices/2016-02-01-preview/swagger/cognitiveservices.json'
  },
  'commerce': {
    'packageName': 'azure-arm-commerce',
    'dir': 'commerce/lib',
    'source': 'arm-commerce/2015-06-01-preview/swagger/commerce.json',
    'ft': 2
  },
  'compute': {
    'packageName': 'azure-arm-compute',
    'dir': 'computeManagement2/lib',
    'source': 'arm-compute/compositeComputeClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  },
  'containerregistry': {
    'packageName': 'azure-arm-containerregistry',
    'dir': 'containerRegistryManagement/lib',
    'source': 'arm-containerregistry/2017-03-01/swagger/containerregistry.json'
  },
  'customerinsights': {
    'packageName': 'azure-arm-customerinsights',
    'dir': 'customerInsightsManagement/lib',
    'source': 'arm-customer-insights/2017-01-01/swagger/customer-insights.json'
  },
  'datalake-analytics.account': {
    'packageName': 'azure-arm-datalake-analytics',
    'dir': 'dataLake.Analytics/lib/account',
    'source': 'arm-datalake-analytics/account/2016-11-01/swagger/account.json'
  },
  'datalake-analytics.catalog': {
    'packageName': 'azure-arm-datalake-analytics',
    'dir': 'dataLake.Analytics/lib/catalog',
    'source': 'arm-datalake-analytics/catalog/2016-11-01/swagger/catalog.json'
  },
  'datalake-analytics.job': {
    'packageName': 'azure-arm-datalake-analytics',
    'dir': 'dataLake.Analytics/lib/job',
    'source': 'arm-datalake-analytics/job/2016-11-01/swagger/job.json'
  },
  'datalake-store.account': {
    'packageName': 'azure-arm-datalake-store',
    'dir': 'dataLake.Store/lib/account',
    'source': 'arm-datalake-store/account/2016-11-01/swagger/account.json'
  },
  'datalake-store.filesystem': {
    'packageName': 'azure-arm-datalake-store',
    'dir': 'dataLake.Store/lib/filesystem',
    'source': 'arm-datalake-store/filesystem/2016-11-01/swagger/filesystem.json'
  },
  'devtestlabs': {
    'packageName': 'azure-arm-devtestlabs',
    'dir': 'devTestLabs/lib',
    'source': 'arm-devtestlabs/2016-05-15/swagger/DTL.json'
  },
  'dns': {
    'packageName': 'azure-arm-dns',
    'dir': 'dnsManagement/lib',
    'source': 'arm-dns/2016-04-01/swagger/dns.json'
  },
  'documentdb': {
    'packageName': 'azure-arm-documentdb',
    'dir': 'documentdbManagement/lib',
    'source': 'arm-documentdb/2015-04-08/swagger/documentdb.json',
    'clientName': 'DocumentdbManagementClient'
  },
  'eventhub': {
    'packageName': 'azure-arm-eventhub',
    'dir': 'eventHubManagement/lib',
    'source': 'arm-eventhub/2015-08-01/swagger/EventHub.json'
  },
  'graph': {
    'packageName': 'azure-graph',
    'dir': 'graphManagement/lib',
    'source': 'arm-graphrbac/compositeGraphRbacManagementClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  },
  'intune': {
    'packageName': 'azure-arm-intune',
    'dir': 'intune/lib',
    'source': 'arm-intune/2015-01-14-preview/swagger/intune.json',
  },
  'insights': {
    'packageName': 'azure-insights',
    'dir': 'insights/lib',
    'source': 'insights/compositeInsightsClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  },
  'arm-insights': {
    'packageName': 'azure-arm-insights',
    'dir': 'insightsManagement/lib',
    'source': 'arm-insights/compositeInsightsManagementClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  },
  'iothub': {
    'packageName': 'azure-arm-iothub',
    'dir': 'iothub/lib',
    'source': 'arm-iothub/2016-02-03/swagger/iothub.json',
    'ft': 1
  },
  'keyvault': {
    'packageName': 'azure-keyvault',
    'dir': 'keyvault/lib',
    'source': 'keyvault/2016-10-01/swagger/keyvault.json'
  },
  'arm-keyvault': {
    'packageName': 'azure-arm-keyvault',
    'dir': 'keyVaultManagement/lib',
    'source': 'arm-keyvault/2015-06-01/swagger/keyvault.json'
  },
  'logic': {
    'packageName': 'azure-arm-logic',
    'dir': 'logicManagement/lib',
    'source': 'arm-logic/2016-06-01/swagger/logic.json',
  },
  'machinelearning.commitmentPlan': {
    'packageName': 'azure-arm-machinelearning',
    'dir': 'machinelearning/lib/commitmentPlan',
    'source': 'arm-machinelearning/2016-05-01-preview/swagger/commitmentPlans.json'
  },
  'machinelearning.webservices': {
    'packageName': 'azure-arm-machinelearning',
    'dir': 'machinelearning/lib/webservices',
    'source': 'arm-machinelearning/2016-05-01-preview/swagger/webservices.json'
  },
  'mediaservices': {
    'packageName': 'azure-arm-mediaservices',
    'dir': 'mediaServicesManagement/lib',
    'source': 'arm-mediaservices/2015-10-01/swagger/media.json'
  },
  'network': {
    'packageName': 'azure-arm-network',
    'dir': 'networkManagement2/lib',
    'source': 'arm-network/compositeNetworkClient.json',
    'modeler': 'CompositeSwagger'
  },
  'notificationhubs': {
    'packageName': 'azure-arm-notificationhubs',
    'dir': 'notificationHubsManagement/lib',
    'source': 'arm-notificationhubs/2016-03-01/swagger/notificationhubs.json'
  },
  'operationalinsights': {
    'packageName': 'azure-arm-operationalinsights',
    'dir': 'operationalInsightsManagement2/lib',
    'source': 'arm-operationalinsights/compositeOperationalInsights.json',
    'modeler': 'CompositeSwagger',
    'clientName': 'OperationalInsightsManagementClient'
  },
  'powerbiembedded': {
    'packageName': 'azure-arm-powerbiembedded',
    'dir': 'powerbiembedded/lib',
    'source': 'arm-powerbiembedded/2016-01-29/swagger/powerbiembedded.json'
  },
  'recoveryservices': {
    'packageName': 'azure-arm-recoveryservices',
    'dir': 'recoveryServicesManagement/lib',
    'source': 'arm-recoveryservices/2016-06-01/swagger/recoveryservices.json'
  },
  'recoveryservicesbackup': {
    'packageName': 'azure-arm-recoveryservicesbackup',
    'dir': 'recoveryServicesBackupManagement/lib',
    'source': 'arm-recoveryservicesbackup/compositeRecoveryServicesBackupClient.json',
    'modeler': 'CompositeSwagger'
  },
  'rediscache': {
    'packageName': 'azure-arm-rediscache',
    'dir': 'rediscachemanagement/lib',
    'source': 'arm-redis/2016-04-01/swagger/redis.json',
    'ft': 1
  },
  'relay': {
    'packageName': 'azure-arm-relay',
    'dir': 'relayManagement/lib',
    'source': 'arm-relay/2016-07-01/swagger/relay.json'
  },
  'resource.feature': {
    'packageName': 'azure-arm-resource',
    'dir': 'resourceManagement/lib/feature',
    'source': 'arm-resources/features/2015-12-01/swagger/features.json'
  },
  'resource.link': {
    'packageName': 'azure-arm-resource',
    'dir': 'resourceManagement/lib/link',
    'source': 'arm-resources/links/2016-09-01/swagger/links.json'
  },
  'resource.lock': {
    'packageName': 'azure-arm-resource',
    'dir': 'resourceManagement/lib/lock',
    'source': 'arm-resources/locks/2016-09-01/swagger/locks.json'
  },
  'resource.policy': {
    'packageName': 'azure-arm-resource',
    'dir': 'resourceManagement/lib/policy',
    'source': 'arm-resources/policy/2016-12-01/swagger/policy.json'
  },
  'resource': {
    'packageName': 'azure-arm-resource',
    'dir': 'resourceManagement/lib/resource',
    'source': 'arm-resources/resources/2016-09-01/swagger/resources.json'
  },
  'resource.subscription': {
    'packageName': 'azure-arm-resource',
    'dir': 'resourceManagement/lib/subscription',
    'source': 'arm-resources/subscriptions/2016-06-01/swagger/subscriptions.json'
  },
  'scheduler': {
    'packageName': 'azure-arm-scheduler',
    'dir': 'schedulerManagement2/lib',
    'source': 'arm-scheduler/2016-03-01/swagger/scheduler.json'
  },
  'searchindex': {
    'packageName': 'azure-search',
    'dir': 'search/lib/index',
    'source': 'search/2016-09-01/swagger/searchindex.json'
  },
  'searchservice': {
    'packageName': 'azure-search',
    'dir': 'search/lib/service',
    'source': 'search/2016-09-01/swagger/searchservice.json'
  },
  'arm-search': {
    'packageName': 'azure-arm-search',
    'dir': 'searchManagement/lib',
    'source': 'arm-search/2015-08-19/swagger/search.json'
  },
  'servermanagement': {
    'packageName': 'azure-arm-servermanagement',
    'dir': 'servermanagement/lib',
    'source': 'arm-servermanagement/2016-07-01-preview/swagger/servermanagement.json'
  },
  'servicemap': {
    'packageName': 'azure-arm-servicemap',
    'dir': 'serviceMapManagement/lib',
    'source': 'arm-service-map/2015-11-01-preview/swagger/arm-service-map.json',
    'clientName': 'ServicemapManagementClient'
  },
  'sb': {
    'packageName': 'azure-arm-sb',
    'dir': 'serviceBusManagement2/lib',
    'source': 'arm-servicebus/2015-08-01/swagger/servicebus.json'
  },
  'arm-servicefabric': {
    'packageName': 'azure-arm-servicefabric',
    'dir': 'serviceFabricManagement/lib',
    'source': 'arm-servicefabric/2016-09-01/swagger/servicefabric.json'
  },
  'servicefabric': {
    'packageName': 'azure-servicefabric',
    'dir': 'serviceFabric/lib',
    'source': 'servicefabric/2016-01-28/swagger/servicefabric.json',
    'language': 'NodeJS'
  },
  'sql': {
    'packageName': 'azure-arm-sql',
    'dir': 'sqlManagement2/lib',
    'source': 'arm-sql/compositeSql.json',
    'modeler': 'CompositeSwagger'
  },
  'storage': {
    'packageName': 'azure-arm-storage',
    'dir': 'storageManagement2/lib',
    'source': 'arm-storage/2016-12-01/swagger/storage.json',
    'ft': 2,
    'clientName': 'StorageManagementClient'
  },
  'storageimportexport': {
    'packageName': 'azure-arm-storageimportexport',
    'dir': 'storageImportExportManagement/lib',
    'source': 'arm-storageimportexport/2016-11-01/swagger/storageimportexport.json',
    'clientName': 'StorageImportExportManagementClient'
  },
  'trafficmanager': {
    'packageName': 'azure-arm-trafficmanager',
    'dir': 'trafficManagerManagement2/lib',
    'source': 'arm-trafficmanager/2017-03-01/swagger/trafficmanager.json',
    'ft': 1
  },
  'website': {
    'packageName': 'azure-arm-website',
    'dir': 'websiteManagement2/lib',
    'source': 'arm-web/compositeWebAppClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  }
};

const defaultAutoRestVersion = '1.0.1-20170331-2300-nightly';
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
  let currentModeler = modeler;
  let specPath = specRoot + '/' + mappings[project].source;
  let result;
  language = 'Azure.NodeJS'
  //servicefabric wants to generate using generic NodeJS.
  if (mappings[project].language && mappings[project].language.match(/^NodeJS$/ig) !== null) {
    language = mappings[project].language;
  }
  //default Modeler is Swagger. However, some services may want to use CompositeSwaggerModeler
  if (mappings[project].modeler && mappings[project].modeler.match(/^CompositeSwagger$/ig) !== null) {
    currentModeler = mappings[project].modeler;
  }
  console.log(`\n>>>>>>>>>>>>>>>>>>>Start: "${project}" >>>>>>>>>>>>>>>>>>>>>>>>>`);
  let outputDir = `lib/services/${mappings[project].dir}`;
  let cmd = `autorest -Modeler ${currentModeler} -CodeGenerator ${language} -Input ${specPath}  -outputDirectory ${outputDir} -Header MICROSOFT_MIT_NO_VERSION --version=${autoRestVersion}`;
  if (mappings[project].ft !== null && mappings[project].ft !== undefined) cmd += ' -FT ' + mappings[project].ft;
  if (mappings[project].clientName !== null && mappings[project].clientName !== undefined) cmd += ' -ClientName ' + mappings[project].clientName;
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
  if (true) {
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
  } else {
    process.exit(1);
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