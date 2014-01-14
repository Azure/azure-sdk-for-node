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

/**
* Module dependencies
*/

var express = require('express');
var serviceController = require('./controllers/serviceController');

var app = module.exports = express.createServer();
var io;

// Configuration

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

// Routes
app.get('/setup', serviceController.setup);
app.post('/setupPOST', serviceController.setupPOST);
app.get('/', serviceController.showRoles);
app.get('/role/:id', serviceController.showRole);
app.get('/editRole/:id', serviceController.editRole);
app.post('/editRole', serviceController.editRolePost);

app.listen(process.env.PORT || 1337);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);