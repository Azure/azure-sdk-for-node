var os = require('os');
var executeCmds = require('./executeCmds.js');

if (os.platform() !== 'win32') {
  throw new Error('The script can only run on windows platform');
}

var cmds = [
  { cmd: 'chcp 850' },//to avoid https://github.com/npm/npm/issues/6438
  { cmd: 'npm install'},
  { cmd: 'npm install grunt-cli -g'},
  { cmd: 'grunt generateCode'},
];

var updatePackageVersion = process.argv[2] && (process.argv[2].indexOf('updatePackageVersion') === 0);
var clearSpecPackages = process.argv[3] && (process.argv[3].indexOf('clearSpecPackages') === 0);

console.log('***********');
console.log('*Info: Make sure spec version was updated in <repository-root>\\packages.config');
if (updatePackageVersion) {
  console.log('*Info: Make sure the version was updated in <repository-root>\\gruntfile.js');
}
console.log('*After you commit changs to remote, you can access tarball using link such as ' +
            'https://github.com/Azure/azure-sdk-for-node/tarball/dev/lib/services/computeManagement/');
console.log('***********');

if (updatePackageVersion) {
  cmds.push({ cmd: 'grunt updateVersions' });
}

if (clearSpecPackages) {
  cmds.unshift({ cmd: 'rmdir /s /q "' + __dirname + '\\..\\packages' + '"' });
}

executeCmds.execute(cmds);