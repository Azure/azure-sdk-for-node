/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

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