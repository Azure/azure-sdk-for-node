let vscode = require('vscode');
let path = require('path');
let fs = require('fs');
let utils = require('./utils');

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
    var commandFilesPath = path.join(context.extensionPath, 'src', 'commands');
    fs.readdir(commandFilesPath, (err, files) => {
        files.forEach((file) => {
            context.subscriptions.push(
                require('./commands/' + path.basename(file, '.js')).createCommand()
            );
            console.log(path.basename(file, '.js') + ' command added');
        });
    });

    // Install dependencies.
    ensureDependenciesAreInstalled();
}

function ensureDependenciesAreInstalled() {
    // Download and install template generator package.
    var extensionName = 'Azure-Node-Essentials';
    var generatorPackageName = 'generator-azure-node';
    var generatorPackageVersion = '0.1.0'; // TODO: query npm and obtain latest version. That would mean updating package would not require an extension update.

    utils.isNodeInstalled().then(function (result) {
        if (!result) {
            vscode.window.showInformationMessage(`Please install NodeJS and then run ${extensionName} extension.`);
            return;
        }

        // check the npm cache on this machine and determine if our dependency is present.
        // if the dependency is present and is the latest version, there is nothing more to do.
        // if it is not present or is not the latest, install it from npm. 
        utils.npmList().then(function (listOfPackages) {
            var generatorPackage = listOfPackages.find(function (item) {
                return item.startsWith(generatorPackageName);
            });

            var packageInfo = { present: false, needsUpgrade: false };
            if (generatorPackage) {
                packageInfo.present = true;
                packageInfo.needsUpgrade = generatorPackage.split('@')[1] !== generatorPackageVersion;
            }

            return Promise.resolve(packageInfo);
        }).then(function (packageInfo) {
            if (!packageInfo.present || packageInfo.needsUpgrade) {
                var options = {
                    global: true
                };

                var actionPerformed;
                if (packageInfo.needsUpgrade) {
                    actionPerformed = 'upgrade';
                } else {
                    actionPerformed = 'install';
                    // indicate to the user that the extension needs to perform some one-time startup tasks
                    vscode.window.showInformationMessage(`${extensionName} is installing dependencies...`);
                }

                var installTask = utils.npmInstall([generatorPackageName], options);
                return installTask.then(
                    function onFulfilled(value) {
                        return { action: actionPerformed, status: value };
                    }
                );
            }
            else {
                var result = { action: 'pre-installed', status: true }; //  (pre-installed, nothing to do.)
                return Promise.resolve(result);
            }

        }).then(function (result) {
            if (result && result.status === true) {
                if (result.action === 'install') {
                    vscode.window.showInformationMessage(`${extensionName} successfully installed dependencies and is ready for use.`);
                } else if (result.action === 'upgrade') {
                    vscode.window.setStatusBarMessage(`${extensionName} successfully upgraded dependencies in the background.`);
                }
            }
        }).catch(function (err) {
            vscode.window.showInformationMessage(`An error occurred while ${extensionName} was installing dependencies. ${err}`);
        });
    });
}

exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;
