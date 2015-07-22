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
    executeCmds.execute(cmds);
  }
);
