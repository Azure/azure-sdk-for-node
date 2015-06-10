var path = require('path');
var eachService = require('./each-service');
var executeCmds = require('./executeCmds.js');

var cmds = [];
var sdkRootPath = path.join(__dirname, '..');

eachService(function(serviceData, next) {
    var relpath = path.relative(sdkRootPath, serviceData.path);
    if(serviceData.packageJson.name === 'azure-common') {
      cmds.push({cmd: 'npm install', path: relpath });
      cmds.push({ cmd: 'npm link ' + relpath });
    } else {
      cmds.push({ cmd: 'npm link ../../common/', path: relpath });
      cmds.push({ cmd: 'npm install', path: relpath });
      cmds.push({ cmd: 'npm link ' + relpath });
    }
    next();
  },
  function () {
    cmds.forEach(function (cmd) { console.log(cmd); });
    executeCmds.execute(cmds);
  }
);
