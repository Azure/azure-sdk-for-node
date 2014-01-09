var path = require('path');
var exec = require('child_process').exec;

var cmds = [
  { cmd: 'npm install', path: 'lib/common/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/computeManagement/' },
  { cmd: 'npm install', path: 'lib/services/computeManagement/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/management/' },
  { cmd: 'npm install', path: 'lib/services/management/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/networkManagement/' },
  { cmd: 'npm install', path: 'lib/services/networkManagement/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/scheduler/' },
  { cmd: 'npm install', path: 'lib/services/scheduler/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/schedulerManagement/' },
  { cmd: 'npm install', path: 'lib/services/schedulerManagement/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/serviceBusManagement/' },
  { cmd: 'npm install', path: 'lib/services/serviceBusManagement/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/sqlManagement/' },
  { cmd: 'npm install', path: 'lib/services/sqlManagement/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/storageManagement/' },
  { cmd: 'npm install', path: 'lib/services/storageManagement/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/storeManagement/' },
  { cmd: 'npm install', path: 'lib/services/storeManagement/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/subscriptionManagement/' },
  { cmd: 'npm install', path: 'lib/services/subscriptionManagement/' },
  { cmd: 'npm link ../../common/', path: 'lib/services/webSiteManagement/' },
  { cmd: 'npm install', path: 'lib/services/webSiteManagement/' },
  { cmd: 'npm link lib/common/' },
  { cmd: 'npm link lib/services/computeManagement/' },
  { cmd: 'npm link lib/services/management/' },
  { cmd: 'npm link lib/services/networkManagement/' },
  { cmd: 'npm link lib/services/scheduler/' },
  { cmd: 'npm link lib/services/schedulerManagement/' },
  { cmd: 'npm link lib/services/serviceBusManagement/' },
  { cmd: 'npm link lib/services/sqlManagement/' },
  { cmd: 'npm link lib/services/storageManagement/' },
  { cmd: 'npm link lib/services/storeManagement/' },
  { cmd: 'npm link lib/services/subscriptionManagement/' },
  { cmd: 'npm link lib/services/webSiteManagement/' }
];

function executeCmds(cmds) {
  if (cmds.length > 0) {
    var current = cmds.shift();
    var cwd;
    if (current.path) {
      cwd = path.join(__dirname, '/../', current.path);
    } else {
      cwd = path.join(__dirname, '/../');
    }

    exec(current.cmd, { cwd: cwd }, function (err, stdout, stderr) {
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.log(stderr);
      }

      if (err) {
        console.log(err);
      } else {
        executeCmds(cmds);
      }
    });
  }
}

executeCmds(cmds);