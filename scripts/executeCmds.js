var path = require('path');
var exec = require('child_process').exec;

exports.execute = function execute (cmds) {
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
        execute(cmds);
      }
    });
  }
};