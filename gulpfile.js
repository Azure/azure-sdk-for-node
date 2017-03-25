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
    'dir': 'advisorManagement/lib',
    'source': 'arm-advisor/2016-07-12-preview/swagger/advisor.json',
  },
  'analysisservices': {
    'dir': 'analysisServices/lib',
    'source': 'arm-analysisservices/2016-05-16/swagger/analysisservices.json',
  },
  'authorization': {
    'dir': 'authorizationManagement/lib',
    'source': 'arm-authorization/2015-07-01/swagger/authorization.json',
    'ft': 1
  },
  'automation': {
    'dir': 'automationManagement/lib',
    'source': 'arm-automation/compositeAutomation.json',
    'modeler': 'CompositeSwagger'
  },
  'batch.Management': {
    'dir': 'batchManagement/lib',
    'source': 'arm-batch/2017-01-01/swagger/BatchManagement.json',
    'ft': 1
  },
  'batch.Service': {
    'dir': 'batch/lib',
    'source': 'batch/2017-01-01.4.0/swagger/BatchService.json',
    'ft': 1
  },
  'billing': {
    'dir': 'billingManagement/lib',
    'source': 'arm-billing/2017-02-27-preview/swagger/billing.json',
    'ft': 1
  },
  'cdn': {
    'dir': 'cdnManagement/lib',
    'source': 'arm-cdn/2016-10-02/swagger/cdn.json',
    'ft': 2
  },
  'coginitiveServices': {
    'dir': 'coginitiveServicesManagement/lib',
    'source': 'arm-cognitiveservices/2016-02-01-preview/swagger/cognitiveservices.json'
  },
  'commerce': {
    'dir': 'commerce/lib',
    'source': 'arm-commerce/2015-06-01-preview/swagger/commerce.json',
    'ft': 2
  },
  'compute': {
    'dir': 'computeManagement2/lib',
    'source': 'arm-compute/compositeComputeClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  },
  'containerRegistry': {
    'dir': 'containerRegistryManagement/lib',
    'source': 'arm-containerregistry/2017-03-01/swagger/containerregistry.json'
  },
  'customerInsights': {
    'dir': 'customerInsightsManagement/lib',
    'source': 'arm-customer-insights/2017-01-01/swagger/customer-insights.json'
  },
  'datalake.analytics.account': {
    'dir': 'dataLake.Analytics/lib/account',
    'source': 'arm-datalake-analytics/account/2016-11-01/swagger/account.json'
  },
  'datalake.analytics.job': {
    'dir': 'dataLake.Analytics/lib/job',
    'source': 'arm-datalake-analytics/job/2016-11-01/swagger/job.json'
  },
  'datalake.analytics.catalog': {
    'dir': 'dataLake.Analytics/lib/catalog',
    'source': 'arm-datalake-analytics/catalog/2016-11-01/swagger/catalog.json'
  },
  'datalake.store.account': {
    'dir': 'dataLake.Store/lib/account',
    'source': 'arm-datalake-store/account/2016-11-01/swagger/account.json'
  },
  'datalake.store.filesystem': {
    'dir': 'dataLake.Store/lib/filesystem',
    'source': 'arm-datalake-store/filesystem/2016-11-01/swagger/filesystem.json'
  },
  'devtestlabs': {
    'dir': 'devTestLabs/lib',
    'source': 'arm-devtestlabs/2016-05-15/swagger/DTL.json'
  },
  'dns': {
    'dir': 'dnsManagement/lib',
    'source': 'arm-dns/2016-04-01/swagger/dns.json'
  },
  'documentdb': {
    'dir': 'documentdbManagement/lib',
    'source': 'arm-documentdb/2015-04-08/swagger/documentdb.json'
  },
  'eventhub': {
    'dir': 'eventHubManagement/lib',
    'source': 'arm-eventhub/2015-08-01/swagger/EventHub.json'
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
  'insights': {
    'dir': 'insights/lib',
    'source': 'insights/compositeInsightsClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  },
  'insights.management': {
    'dir': 'insightsManagement/lib',
    'source': 'arm-insights/compositeInsightsManagementClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  },
  'iothub': {
    'dir': 'iothub/lib',
    'source': 'arm-iothub/2016-02-03/swagger/iothub.json',
    'ft': 1
  },
  'keyvault': {
    'dir': 'keyvault/lib',
    'source': 'keyvault/2016-10-01/swagger/keyvault.json',
    'ft': 1
  },
  'keyvaultmanagement': {
    'dir': 'keyVaultManagement/lib',
    'source': 'arm-keyvault/2015-06-01/swagger/keyvault.json',
    'ft': 1
  },
  'logic': {
    'dir': 'logicManagement/lib',
    'source': 'arm-logic/2016-06-01/swagger/logic.json',
  },
  'mediaServices': {
    'dir': 'mediaServicesManagement/lib',
    'source': 'arm-mediaservices/2015-10-01/swagger/media.json'
  },
  'network': {
    'dir': 'networkManagement2/lib',
    'source': 'arm-network/compositeNetworkClient.json',
    'modeler': 'CompositeSwagger'
  },
  'notificationHubs': {
    'dir': 'notificationHubsManagement/lib',
    'source': 'arm-notificationhubs/2016-03-01/swagger/notificationhubs.json'
  },
  'operationalInsights': {
    'dir': 'operationalInsightsManagement2/lib',
    'source': 'arm-operationalInsights/compositeOperationalInsights.json',
    'modeler': 'CompositeSwagger'
  },
  'powerbiembedded': {
    'dir': 'powerbiembedded/lib',
    'source': 'arm-powerbiembedded/2016-01-29/swagger/powerbiembedded.json'
  },
  'recoveryServices': {
    'dir': 'recoveryServicesManagement',
    'source': 'arm-recoveryservices/2016-06-01/swagger/recoveryservices.json'
  },
  'recoveryServicesBackup': {
    'dir': 'recoveryServicesBackupManagement',
    'source': 'arm-recoveryservicesbackup/compositeRecoveryServicesBackupClient.json',
    'modeler': 'CompositeSwagger'
  },
  'rediscache': {
    'dir': 'rediscachemanagement/lib',
    'source': 'arm-redis/2016-04-01/swagger/redis.json',
    'ft': 1
  },
  'relay': {
    'dir': 'relayManagement/lib',
    'source': 'arm-relay/2016-07-01/swagger/relay.json'
  },
  'resource': {
    'dir': 'resourceManagement/lib/resource',
    'source': 'arm-resources/resources/2016-09-01/swagger/resources.json'
  },
  'resource.subscription': {
    'dir': 'resourceManagement/lib/subscription',
    'source': 'arm-resources/subscriptions/2016-06-01/swagger/subscriptions.json'
  },
  'resource.lock': {
    'dir': 'resourceManagement/lib/lock',
    'source': 'arm-resources/locks/2016-09-01/swagger/locks.json'
  },
  'resource.link': {
    'dir': 'resourceManagement/lib/link',
    'source': 'arm-resources/links/2016-09-01/swagger/links.json'
  },
  'resource.feature': {
    'dir': 'resourceManagement/lib/feature',
    'source': 'arm-resources/features/2015-12-01/swagger/features.json'
  },
  'resource.policy': {
    'dir': 'resourceManagement/lib/policy',
    'source': 'arm-resources/policy/2016-12-01/swagger/policy.json'
  },
  'schedulerManagement': {
    'dir': 'schedulerManagement2/lib',
    'source': 'arm-scheduler/2016-03-01/swagger/scheduler.json'
  },
  'searchIndex': {
    'dir': 'searchIndex/lib',
    'source': 'search/2016-09-01/swagger/searchindex.json'
  },
  'searchService': {
    'dir': 'searchService/lib',
    'source': 'search/2016-09-01/swagger/searchservice.json'
  },
  'searchManagement': {
    'dir': 'searchManagement/lib',
    'source': 'arm-search/2015-08-19/swagger/search.json'
  },
  'servermanagement': {
    'dir': 'servermanagement/lib',
    'source': 'arm-servermanagement/2015-07-01-preview/servermanagement.json'
  },
  'servicebus.management': {
    'dir': 'serviceBusManagement2/lib',
    'source': 'arm-servicebus/2015-08-01/swagger/servicebus.json'
  },
  'serviceFabricManagement': {
    'dir': 'serviceFabricManagement/lib',
    'source': 'arm-servicefabric/2016-09-01/swagger/servicefabric.json'
  },
  'serviceFabric': {
    'dir': 'serviceFabric/lib',
    'source': 'servicefabric/2016-01-28/swagger/servicefabric.json',
    'language': 'NodeJS'
  },
  'serviceMap': {
    'dir': 'serviceMapManagement/lib',
    'source': 'arm-service-map/2015-11-01-preview/swagger/arm-service-map.json'
  },
  'sql': {
    'dir': 'sqlManagement2/lib',
    'source': 'arm-sql/compositeSql.json',
    'modeler': 'CompositeSwagger'
  },
  'storage': {
    'dir': 'storageManagement2/lib',
    'source': 'arm-storage/2016-12-01/swagger/storage.json',
    'ft': 2,
    'ClientName': 'StorageManagementClient'
  },
  'storageImportExport': {
    'dir': 'storageImportExportManagement/lib',
    'source': 'arm-storageimportexport/2016-11-01/swagger/storageimportexport.json'
  },
  'traffic': {
    'dir': 'trafficManagerManagement2/lib',
    'source': 'arm-trafficmanager/2017-03-01/swagger/trafficmanager.json',
    'ft': 1
  },
  'website': {
    'dir': 'websiteManagement2/lib',
    'source': 'arm-web/compositeWebAppClient.json',
    'ft': 1,
    'modeler': 'CompositeSwagger'
  }
};

const defaultAutoRestVersion = '1.0.1-20170322-2300-nightly';
var usingAutoRestVersion;
const specRoot = args['spec-root'] || "https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master";
const project = args['project'];
const language = 'Azure.NodeJS';
const modeler = 'Swagger';

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

function clearProjectBeforeGenerating(projectDir) {
  let modelsDir = `${projectDir}/models`;
  let operationsDir = `${projectDir}/operations`;
  let clientTypedefFile = path.basename(glob.sync(`${projectDir}/*.d.ts`)[0]);
  let clientJSFile = `${clientTypedefFile.split('.')[0]}.js`;
  let directoriesToBeDeleted = [modelsDir, operationsDir];
  let filesToBeDeleted = [clientTypedefFile, clientJSFile];
  directoriesToBeDeleted.forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir);
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
  if (mappings[project].ClientName !== null && mappings[project].ClientName !== undefined) cmd += ' -ClientName ' + mappings[project].ClientName;
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

gulp.task('codegen', function (cb) {
  if (installAutorest()) {
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