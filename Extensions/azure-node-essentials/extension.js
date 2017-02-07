let vscode = require('vscode');
let exec = require('child_process').exec;
let path = require('path');
let fs = require('fs');

// TODO: find a way to have the extension auto update the package dependency, instead of having an update to VSCode extension.
// TODO: try to optimize time spent in this method.
// instead of enumerating all the installed npm packages every time on activation. drop a file to this extension's install path
// after installing dependencies. after the first time, just check for the presence of that sentinel file and bail.
// that does not ensure the dependency will always exist though. 
// TODO: check for package version updates and re-install if necessary.

// Called once to activate the extension.
// The only thing this extension needs to do is to ensure that a certain npm package is installed globally.
// Ideally this should be done during install time, but VSCode does not support install time tasks.
// So, we do this on activation. Ideally, this is a one time task.
function activate(context) {

    // Register commands.
    var commandFilesPath = path.join(context.extensionPath, 'commands');
    fs.readdir(commandFilesPath, (err, files) => {
        files.forEach((file) => {
            context.subscriptions.push(
                require('./commands/' + path.basename(file, '.js')).createCommand()
            );
            console.log(path.basename(file, '.js') + ' command added');
        });
    });

    ensureDependenciesAreInstalled();
}

function ensureDependenciesAreInstalled() {

    // Download and install template generator package.
    var extensionName = 'Azure-NodeJS-Essentials';
    var generatorPackageName = 'generator-azure-node';

    isNodeInstalled().then(function (result) {
        if (!result) {
            vscode.window.showInformationMessage(`Please install NodeJS and then run ${extensionName} extension.`);
            return;
        }

        // check the npm cache on this machine and determine if our dependency is present.
        // if the dependency is present, there is nothing more to do.
        // if it is not present, install it from npm. 
        npmList().then(function (listOfPackages) {
            var present = listOfPackages.some(function (item) {
                if (item.startsWith(generatorPackageName)) {
                    return true;
                }
                return false;
            });

            return Promise.resolve(present);
        }).then(function (present) {
            if (!present) {
                var options = {
                    global: true
                };

                // indicate to the user that the extension needs to perform some one-time startup tasks
                vscode.window.showInformationMessage(`${extensionName} is installing dependencies. This is a one time, long running operation. We will notify you when it is done.`);

                return npmInstall([generatorPackageName], options);
            }
            else {
                return Promise.resolve(1); // return success. statusCode 1 (pre-installed, nothing to do.)
            }
        }).then(function (statusCode) {
            if (statusCode === 0) {
                vscode.window.showInformationMessage(`${extensionName} has finished installing dependencies and is ready for use.`);
            }
        }).catch(function (err) {
            vscode.window.showInformationMessage(`An error occurred while ${extensionName} was installing dependencies. ${err}`);
        });
    });
}

// helpers

// checks if there exists a valid installation of NodeJs on this machine
function isNodeInstalled() {
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
}

// lists all globally installed npm packages.
function npmList(path) {
    var global = false;
    if (!path) global = true;
    var cmdString = "npm ls --depth=0 " + (global ? "-g " : " ");
    return new Promise(function (resolve, reject) {
        exec(cmdString, { cwd: path ? path : "/" }, (error, stdout) => {
            if (error) {
                return reject(error);
            }

            var packages = [];
            packages = stdout.split('\n');

            packages = packages.filter(function (item) {
                if (item.match(/^\+--.+/g) != null) {
                    return true;
                }
                if (item.match(/^`--.+/g) != null) {
                    return true;
                }
                return undefined;
            });

            packages = packages.map(function (item) {
                if (item.match(/^\+--.+/g) != null) {
                    return item.replace(/^\+--\s/g, "");
                }
                if (item.match(/^`--.+/g) != null) {
                    return item.replace(/^`--\s/g, "");
                }
            })
            resolve(packages);

        });
    });
}

// install given list of npm packages to the global location.
function npmInstall(packages, opts) {
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
                resolve(0); // return success. statusCode 0 (installation successful)
            }
        });
    });
}

exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;
