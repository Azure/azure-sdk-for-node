var executeCmds = require('./executeCmds.js');

var cmds = [
  { cmd: 'npm install'},
  { cmd: 'npm install grunt-cli -g'},
  { cmd: 'grunt generateCode'},
];

executeCmds.execute(cmds);