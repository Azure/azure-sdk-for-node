// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

var util = require('util');
var fs = require('fs');
var nconf = require('nconf');

nconf.file({ file: 'config.json' });

var roleEnvironmentService = require('../services/roleEnvironmentService');

exports.setup = function (request, response) {
  response.render('setup');
};

exports.setupPOST = function (request, response) {
  var showError = function (message) {
    // TODO: actually show the error message
    response.render('setup');
  };

  if (request.body.account &&
      request.body.accessKey &&
      request.body.WaRuntimeEndpoint) {

    nconf.set('AZURE_STORAGE_ACCOUNT', request.body.account);
    nconf.set('AZURE_STORAGE_ACCESS_KEY', request.body.accessKey);
    nconf.set('WaRuntimeEndpoint', request.body.WaRuntimeEndpoint);

    nconf.save(function (error) {
      if (error) {
        showError(error);
      } else {
        response.redirect('/');
      }
    });
  } else {
    showError();
  }
};

exports.showRoles = function (request, response) {
  var action = function () {
    roleEnvironmentService.getRoles(function (error, roles) {
      response.render('index', {
        locals: {
          error: error,
          roles: roles
        }
      });
    });
  };

  if (!exports.isConfigured()) {
    response.redirect('/setup');
  } else {
    action();
  }
};

exports.showRole = function (request, response) {
  var action = function () {
    roleEnvironmentService.getRole(request.params.id, function (error, role) {
      response.render('role', {
        locals: {
          error: error,
          role: role
        }
      });
    });
  };

  if (!exports.isConfigured()) {
    response.redirect('/setup');
  } else {
    action();
  }
};

exports.editRole = function (request, response) {
  var action = function () {
    roleEnvironmentService.getRole(request.params.id, function (error, role) {
      response.render('editRole', {
        locals: {
          error: error,
          role: role
        }
      });
    });
  };

  if (!exports.isConfigured()) {
    response.redirect('/setup');
  } else {
    action();
  }
};

exports.editRolePost = function (request, response) {
  var roleData = request.body;
  var roleImage = null;

  if (request.files && request.files.image && request.files.image.size > 0) {
    roleImage = request.files.image;
  }

  roleEnvironmentService.createOrEditRole(roleData, roleImage, function (createOrEditRoleError) {
    if (createOrEditRoleError) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end(JSON.stringify(util.inspect(createOrEditRoleError)));
    } else {
      response.redirect('/');
    }
  });
};

exports.isConfigured = function () {
  if (nconf.get('AZURE_STORAGE_ACCOUNT')) {
    return true;
  }

  return false;
};