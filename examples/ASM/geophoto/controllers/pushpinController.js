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

var PushpinService = require('../services/pushpinService');

var initialized = false;
var pushpinService = null;

exports.io = null;

exports.setup = function (request, response) {
  response.render('setup', {
    title: 'Puspin Example: Setup',
    bingMapsCredentials: '',
    pushpins: []
  });
};

exports.setupPOST = function (request, response) {
  var showError = function (message) {
    // TODO: actually show the error message
    response.render('setup', {
      title: 'Puspin Example: Setup',
      bingMapsCredentials: '',
      pushpins: []
    });
  };

  if (request.body.account &&
    request.body.accessKey &&
    request.body.bingMapsCredentials) {

    nconf.set('AZURE_STORAGE_ACCOUNT', request.body.account);
    nconf.set('AZURE_STORAGE_ACCESS_KEY', request.body.accessKey);
    nconf.set('BING_MAPS_CREDENTIALS', request.body.bingMapsCredentials);

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

exports.showPushpins = function (request, response) {
  var action = function (error) {
    if (error) {
      renderPushpins(error);
    } else {
      initialized = true;
      pushpinService.listPushpins(renderPushpins);
    }
  };

  var renderPushpins = function (error, entities) {
    response.render('index', {
      title: 'Pushins Example',
      error: error,
      pushpins: pushpinService.unwrapEntities(entities.entries),
      bingMapsCredentials: nconf.get('BING_MAPS_CREDENTIALS')
    });
  };

  if (!exports.isConfigured()) {
    response.redirect('/setup');
  } else if (!initialized) {
    pushpinService = new PushpinService(nconf.get('AZURE_STORAGE_ACCOUNT'), nconf.get('AZURE_STORAGE_ACCESS_KEY'));
    pushpinService.initialize(action);
  } else {
    action();
  }
};

exports.createPushpin = function (request, response) {
  var action = function (error) {
    if (!error) {
      initialized = true;
    }

    var pushpinData = request.body;
    var pushpinImage = null;

    if (request.files && request.files.length > 0) {
      // this is a multer file object instance
      pushpinImage = request.files[0];
    }

    pushpinService.createPushpin(pushpinData, pushpinImage, function (createPushpinError) {
      if (createPushpinError) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end(JSON.stringify(util.inspect(createPushpinError)));
      } else {
        exports.io.sockets.emit('addPushpin', pushpinData);

        response.redirect('/');
      }
    });
  };

  if (!exports.isConfigured()) {
    response.redirect('/setup');
  } else if (!initialized) {
    pushpinService = new PushpinService(nconf.get('AZURE_STORAGE_ACCOUNT'), nconf.get('AZURE_STORAGE_ACCESS_KEY'));
    pushpinService.initialize(action);
  } else {
    action();
  }
};

exports.socketConnection = function (socket) {
  socket.on('removePushpin', function (pushpin) {

    pushpinService.removePushpin(pushpin, function (error) {
      if (!error) {
        socket.emit('removePushpin', pushpin);
      }
    });
  });

  socket.on('clearPushpins', function () {
    pushpinService.clearPushpins(function (error) {
      initialized = false;
      if (!error) {
        exports.io.sockets.emit('clearPushpins');
        socket.emit('clearPushpins');
      }
    });
  });
};

exports.isConfigured = function () {
  if (nconf.get('AZURE_STORAGE_ACCOUNT')) {
    return true;
  }
  return false;
};
