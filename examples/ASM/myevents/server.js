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

var express = require('express'),
  expressEjsLayouts = require('express-ejs-layouts'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  multer = require('multer')({dest: './uploads'}),
  errorhandler = require('errorhandler'),
  path = require('path'),
  EventService = require('./eventService'),
  azure = require('azure'),
  ServiceClient = azure.ServiceClient;

var app = module.exports = express();


var tableClient = azure.createTableService('UseDevelopmentStorage=true');
var blobClient = azure.createBlobService('UseDevelopmentStorage=true')
  .withFilter(new azure.ExponentialRetryPolicyFilter());

// Create table and blob
tableClient.createTableIfNotExists('events', function (error, result, response) {
  if (error) {
    throw error;
  }
});
blobClient.createContainerIfNotExists('photos', { publicAccessLevel: 'blob' }, function (error, result, response) {
  if (error) {
    throw error;
  }
});


// Configuration
app.set('port', process.env.port || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '/public')));

if (app.get('env') == 'development') {
  app.use(errorhandler());
};

if (app.get('env') === 'production') {
  app.use(errorhandler());
};

// Routes

var eventService = new EventService(tableClient, blobClient);
app.get('/', eventService.showEvents.bind(eventService));
app.post('/events/create', multer.array('item[file]'), eventService.newEvent.bind(eventService));
app.get('/events/:id', eventService.showEvent.bind(eventService))

app.listen(app.get('port'), function() {;
  console.log("Express server listening on port %d in %s mode",
    app.get('port'),
    app.get('env'));
});
