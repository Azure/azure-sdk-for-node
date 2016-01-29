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
* Module dependencies.
*/

var express = require('express'),
  bodyParser = require('body-parser'),
  errorHandler = require('errorhandler'),
  expressEjsLayouts = require('express-ejs-layouts'),
  io = require('socket.io'),
  methodOverride = require('method-override'),
  multer = require('multer')({ dest: './uploads' }),
  pushpinController = require('./controllers/pushpinController'),
  socketio = require('socket.io'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();

// Configuration

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '/public')));

if ('development' === app.get('env')) {
  app.use(errorHandler());
}

if ('production' === app.get('env')) {
  app.use(errorHandler());
}

// Routes
app.get('/', pushpinController.showPushpins);
app.get('/setup', pushpinController.setup);
app.post('/setupPOST', pushpinController.setupPOST);
app.post('/createPushpin', multer.array('image'), pushpinController.createPushpin);

var server = app.listen(app.get('port'), function () {
  console.log("Express server listening on port %d in %s mode",
    app.get('port'),
    app.get('env'));
});
// Setup socket.io
pushpinController.io = io(server);
pushpinController.io.on('connection', pushpinController.socketConnection);
