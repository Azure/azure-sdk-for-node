var exec = require('child_process').exec;

var cmds = [
  { cmd: 'cd ../azure-sdk-for-node' },
  { cmd: 'npm test' },
  { cmd: 'cd ../azure-sdk-tools-xplat' },
  { cmd: 'npm run unit' },
  { cmd: 'node bin/azure config mode arm' },
  { cmd: 'npm run unit-arm' }
];

function executeCmds(cmds) {
  if (cmds.length > 0) {
    var current = cmds.shift();

    exec(current.cmd, function (err, stdout, stderr) {
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