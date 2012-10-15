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

// Module dependencies.
var fs = require('fs');
if (!fs.existsSync) {
  fs.existsSync = require('path').existsSync;
}

var azure;
if (fs.existsSync('./../../lib/azure.js')) {
  azure = require('./../../lib/azure');
} else {
  azure = require('azure');
}

var express = require('express');
var uuid = require('node-uuid');
var Home = require('./home');
var ServiceClient = azure.ServiceClient;

var app = module.exports = express.createServer();
var client = azure.createTableService('UseDevelopmentStorage=true');

// table creation
client.createTableIfNotExists("tasks", function (res, created) {
  if (created) {
    var item = {
      name: 'Add readonly todo list',
      category: 'Site work',
      date: '12/01/2011',
      RowKey: uuid(),
      PartitionKey: 'partition1',
      completed: false
    };

    client.insertEntity("tasks", item, null, function () {
      setupApplication();
    });
  } else {
    setupApplication();
  }
});

function setupApplication() {
  // Configuration
  app.configure(function () {
    app.set('views', __dirname + '/views');

    // NOTE: Uncomment this line and comment next one to use ejs instead of jade
    // app.set('view engine', 'ejs');

    app.set('view engine', 'jade');

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });

  app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function() {
    app.use(express.errorHandler());
  });

  var home = new Home(client);

  // Routes

  app.get('/', home.showItems.bind(home));
  app.get('/home', home.showItems.bind(home));
  app.post('/home/newitem', home.newItem.bind(home));
  app.post('/home/completed', home.markCompleted.bind(home));

  app.listen(process.env.PORT || 1337);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}