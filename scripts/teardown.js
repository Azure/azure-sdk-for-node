//
// Helper script that tears down the symlinks created by the
// setup.js script in this folder.
//

var npm = require('npm');
var eachService = require('./each-service');

npm.load({global: true}, function (err, npm) {
  if (err) {
    console.log('Unable to initialize npm:', err);
    return;
  }

  console.log('npm is running against', npm.dir);
  console.log('Uninstalling azure modules');

  eachService(function (serviceData, next) {
    npm.commands.uninstall(serviceData.packageJson.name, function (err) {
      if (err) {
        console.log('Package', serviceData.packageJson.name, 'failed to uninstall, err =', err);
      }
      next(err);
    });
  },
  function (err) {
    console.log('Package uninstall complete');
  });
});