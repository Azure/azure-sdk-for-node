/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

const gulp = require('gulp');
const args = require('yargs').argv;
const fs = require('fs');
const util = require('util');
const path = require('path');
const glob = require('glob');
const execSync = require('child_process').execSync;
const jsonStableStringify = require('json-stable-stringify');

const azureSDKForNodeRepoRoot = __dirname;
const defaultAutoRestVersion = '1.2.2';
var usingAutoRestVersion;
let azureRestAPISpecsRoot = args['azure-rest-api-specs-root'] || path.resolve(azureSDKForNodeRepoRoot, '..', 'azure-rest-api-specs');
const package = args['package'];
const use = args['use'];
const regexForExcludedServices = /\/(intune|documentdbManagement|insightsManagement|insights|search)\//i;

function findReadmeNodejsMdFilePaths(azureRestAPISpecsRoot) {
  const nodejsReadmeFilePaths = [];

  // Find all of the readme.nodejs.md files within the azure-rest-api-specs/specification folder.
  const specificationFolderPath = path.resolve(azureRestAPISpecsRoot, 'specification');

  const folderPathsToSearch = [specificationFolderPath];
  while (folderPathsToSearch.length > 0) {
    const folderPathToSearch = folderPathsToSearch.pop();

    const folderEntryPaths = fs.readdirSync(folderPathToSearch);
    for (let i = 0; i < folderEntryPaths.length; ++i) {
      const folderEntryPath = path.resolve(folderPathToSearch, folderEntryPaths[i]);
      const folderEntryStats = fs.lstatSync(folderEntryPath);
      if (folderEntryStats.isDirectory()) {
        folderPathsToSearch.push(folderEntryPath);
      }
      else if (folderEntryStats.isFile()) {
        const fileName = path.basename(folderEntryPath);
        if (fileName === 'readme.nodejs.md') {
          nodejsReadmeFilePaths.push(folderEntryPath);
        }
      }
    }
  }

  return nodejsReadmeFilePaths;
}

function getPackageNameFromReadmeNodejsMdFileContents(readmeNodejsMdFileContents) {
  return readmeNodejsMdFileContents.match(/package-name: (\S*)/)[1];
}

gulp.task('default', function () {
  console.log('Usage: gulp codegen [--azure-rest-api-specs-root <azure-rest-api-specs root>] [--use <autorest.nodejs root>] [--package <package name>]\n');
  console.log('--azure-rest-api-specs-root');
  console.log('\tRoot location of the local clone of the azure-rest-api-specs-root repository.');
  console.log('--use');
  console.log('\tRoot location of autorest.nodejs repository. If this is not specified, then the latest installed generator for NodeJS will be used.');
  console.log('--package');
  console.log('\tNPM package to regenerate. If no package is specified, then all packages will be regenerated.');
});

//This task is used to generate libraries based on the mappings specified above.
gulp.task('codegen', function (cb) {
  const nodejsReadmeFilePaths = findReadmeNodejsMdFilePaths(azureRestAPISpecsRoot);

  const specificationFolderPath = path.resolve(azureRestAPISpecsRoot, 'specification');

  const folderPathsToSearch = [specificationFolderPath];
  while (folderPathsToSearch.length > 0) {
    const folderPathToSearch = folderPathsToSearch.pop();

    const folderEntryPaths = fs.readdirSync(folderPathToSearch);
    for (let i = 0; i < folderEntryPaths.length; ++i) {
      const folderEntryPath = path.resolve(folderPathToSearch, folderEntryPaths[i]);
      const folderEntryStats = fs.lstatSync(folderEntryPath);
      if (folderEntryStats.isDirectory()) {
        folderPathsToSearch.push(folderEntryPath);
      }
      else if (folderEntryStats.isFile()) {
        const fileName = path.basename(folderEntryPath);
        if (fileName === 'readme.nodejs.md') {
          nodejsReadmeFilePaths.push(folderEntryPath);
        }
      }
    }
  }

  let packageName;
  for (let i = 0; i < nodejsReadmeFilePaths.length; ++i) {
    const nodejsReadmeFilePath = nodejsReadmeFilePaths[i];

    const nodejsReadmeFileContents = fs.readFileSync(nodejsReadmeFilePath, 'utf8');
    const packageName = getPackageNameFromReadmeNodejsMdFileContents(nodejsReadmeFileContents);

    if (!package || package === packageName || packageName.endsWith(`-${package}`)) {
      console.log(`>>>>>>>>>>>>>>>>>>> Start: "${packageName}" >>>>>>>>>>>>>>>>>>>>>>>>>`);

      const readmeFilePath = path.resolve(path.dirname(nodejsReadmeFilePath), 'readme.md');

      let cmd = `autorest --nodejs --node-sdks-folder=${azureSDKForNodeRepoRoot} --license-header=MICROSOFT_MIT_NO_VERSION ${readmeFilePath}`;
      if (use) {
        cmd += ` --use=${use}`;
      }

      try {
        console.log('Executing command:');
        console.log('------------------------------------------------------------');
        console.log(cmd);
        console.log('------------------------------------------------------------');
        const result = execSync(cmd, { encoding: 'utf8' });
        console.log('Output:');
        console.log(result);
      } catch (err) {
        console.log('Error:');
        console.log(`An error occurred while generating client for package: "${packageName}":\n ${err.stderr}`);
      }

      console.log(`>>>>>>>>>>>>>>>>>>> End: "${packageName}" >>>>>>>>>>>>>>>>>>>>>>>>>`);
      console.log();
    }
  }
});

//This task validates that the entry in "main" and "types" in package.json points to a file that exists on the disk.
// for best results run on mac or linux. Windows is case insenstive for file paths. Hence it will not catch those issues.
//If not tested this will cause "module not found" errors for customers when they try to use the package.
gulp.task('validate-each-packagejson', (cb) => {
  let packagePaths = glob.sync(path.join(azureSDKForNodeRepoRoot, '/lib/services', '/**/package.json'), { ignore: '**/node_modules/**' });
  packagePaths.forEach((packagePath) => {
    const package = require(packagePath);
    //console.log(package);
    if (!package.name.startsWith('azure-asm-')) {
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

  let packagePaths = glob.sync(path.join(azureSDKForNodeRepoRoot, './lib/services', '/**/package.json')).filter((packagePath) => {
    return packagePath.match(regexForExcludedServices) === null;
  });
  let rollupPackage = require('./package.json');
  let rollupDependencies = rollupPackage.dependencies;
  rollupDependencies['ms-rest'] = './runtime/ms-rest';
  rollupDependencies['ms-rest-azure'] = './runtime/ms-rest-azure';
  packagePaths.forEach((packagePath) => {
    const package = require(packagePath);
    //console.log(package);
    let packageName = package.name;
    const packageDir = path.dirname(packagePath);
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
//not fail. Before executing this task, execute `gulp update-deps-rollup`, `rm -rf node_modules` and `npm install` so that the changes inside the sdks in lib/services
//are installed inside the node_modules folder.
gulp.task('test-create-rollup', (cb) => {
  const azure = require('./lib/azure');
  const keys = Object.keys(azure).filter((key) => { return key.startsWith('create') && !key.startsWith('createASM') && key.endsWith('Client') && key !== 'createSchedulerClient'; });
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
      } else if (key === 'createServiceFabricClient') {
        c = new Client();
      } else {
        c = new Client(creds, subId);
      }
      //console.dir(Object.keys(c));
    } catch (err) {
      console.dir(err);
    }
  });
});

// This task synchronizes the dependencies in package.json to the versions of relative service libraries inside lib/services directory.
// This should be done in the end to ensure that all the package dependencies have the correct version.
gulp.task('sync-deps-rollup', (cb) => {
  let packagePaths = glob.sync(path.join(azureSDKForNodeRepoRoot, './lib/services', '/**/package.json')).filter((packagePath) => {
    return packagePath.match(regexForExcludedServices) === null;
  });
  //console.log(packagePaths);
  console.log(`Total packages found under lib/services: ${packagePaths.length}`);
  let rollupPackage = require('./package.json');
  let rollupDependencies = rollupPackage.dependencies;
  rollupDependencies['ms-rest'] = '^2.2.2';
  rollupDependencies['ms-rest-azure'] = '^2.3.4';
  packagePaths.forEach((packagePath) => {
    const package = require(packagePath);
    //console.log(package);
    let packageName = package.name;
    let packageVersion = package.version;
    rollupDependencies[packageName] = packageVersion;
  });
  rollupPackage.dependencies = Object.keys(rollupDependencies).sort().reduce((r, k) => (r[k] = rollupDependencies[k], r), {});
  console.log(`Total number of dependencies in the rollup package: ${Object.keys(rollupPackage.dependencies).length}`);
  fs.writeFileSync('./package.json', JSON.stringify(rollupPackage, null, 2), { 'encoding': 'utf8' });
});

gulp.task('publish-packages', (cb) => {
  const nodejsReadmeFilePaths = findReadmeNodejsMdFilePaths(azureRestAPISpecsRoot);

  let errorPackages = 0;
  let upToDatePackages = 0;
  let publishedPackages = 0;

  for (let i = 0; i < nodejsReadmeFilePaths.length; ++i) {
    const nodejsReadmeFilePath = nodejsReadmeFilePaths[i];
    const nodejsReadmeFileContents = fs.readFileSync(nodejsReadmeFilePath, 'utf8');
    const relativeOutputFolderPath = nodejsReadmeFileContents.match(/output\-folder: \$\(node\-sdks\-folder\)\/(lib\/services\/\S+)/)[1];
    const packageFolderPath = path.resolve(azureSDKForNodeRepoRoot, relativeOutputFolderPath);
    if (!fs.existsSync(packageFolderPath)) {
      console.log(`ERROR: Package folder ${packageFolderPath} has not been generated.`);
      errorPackages++;
    }
    else {
      const packageJsonFilePath = `${packageFolderPath}/package.json`;
      if (!fs.existsSync(packageJsonFilePath)) {
        console.log(`ERROR: Package folder ${packageFolderPath} is missing its package.json file.`);
        errorPackages++;
      }
      else {
        const packageJson = require(packageJsonFilePath);
        const packageName = packageJson.name;
        const localPackageVersion = packageJson.version;
        if (!localPackageVersion) {
          console.log(`ERROR: "${packageJsonFilePath}" doesn't have a non-empty version property.`);
          errorPackages++;
        }
        else {
          let npmPackageVersion;
          try {
            const npmViewResult = JSON.parse(execSync(`npm view ${packageName} --json`, { stdio: ['pipe', 'pipe', 'ignore'] }));
            npmPackageVersion = npmViewResult['dist-tags']['latest'];
          }
          catch (error) {
            // This happens if the package doesn't exist in NPM.
          }

          if (localPackageVersion === npmPackageVersion) {
            upToDatePackages++;
          }
          else {
            console.log(`Publishing package "${packageName}" with version "${localPackageVersion}"...`);
            try {
              execSync(`npm publish`, { cwd: packageFolderPath });
              publishedPackages++;
            }
            catch (error) {
              errorPackages++;
            }
          }
        }
      }
    }
  }

  console.log();
  console.log(`Error packages:      ${errorPackages}`);
  console.log(`Up to date packages: ${upToDatePackages}`);
  console.log(`Published packages:  ${publishedPackages}`);
});