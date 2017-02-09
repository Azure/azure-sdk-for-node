let exec = require('child_process').exec;

// checks if there exists a valid installation of NodeJs on this machine
exports.isNodeInstalled = function isNodeInstalled() {
  var cmdString = "node -v";
  return new Promise(function (resolve, reject) {
    exec(cmdString, (error, stdout) => {
      if (error) {
        return reject(error);
      }
      if (stdout.startsWith('v')) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

// lists all globally installed npm packages.
exports.npmList = function npmList(path) {
    var global = false;
    if (!path) global = true;
    var cmdString = "npm ls --depth=0 " + (global ? "-g " : " ");
    return new Promise(function (resolve, reject) {
        exec(cmdString, { cwd: path ? path : "/" }, (error, stdout) => {
            if (error && !stdout) {
                return reject(error);
            }

            var packages = [];
            packages = stdout.split('\n');

            packages = packages.filter(function (item) {
                if (item.match(/^\+--.+/g) != null || item.match(/^├──.+/g) != null) {
                    return true;
                }
                if (item.match(/^`--.+/g) != null || item.match(/^└──.+/g) != null) {
                    return true;
                }
                return undefined;
            });

            packages = packages.map(function (item) {
                // windows
                if (item.match(/^\+--.+/g) != null) {
                    return item.replace(/^\+--\s/g, "");
                }
                if (item.match(/^`--.+/g) != null) {
                    return item.replace(/^`--\s/g, "");
                }
                // mac
                if (item.match(/^├──.+/g) != null) {
                    return item.replace(/^├──\s/g, "");
                }
                if (item.match(/^└──.+/g) != null) {
                    return item.replace(/^└──\s/g, "");
                }
            })
            resolve(packages);

        });
    });
};

// install given list of npm packages to the global location.
exports.npmInstall = function npmInstall(packages, opts) {
    if (packages.length == 0 || !packages || !packages.length) { Promise.reject("No packages found"); }
    if (typeof packages == "string") packages = [packages];
    if (!opts) opts = {};
    var cmdString = "npm install " + packages.join(" ") + " "
        + (opts.global ? " -g" : "")
        + (opts.save ? " --save" : "")
        + (opts.saveDev ? " --saveDev" : "");

    return new Promise(function (resolve, reject) {
        exec(cmdString, { cwd: opts.cwd ? opts.cwd : "/" }, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(true); // return success.
            }
        });
    });
};
