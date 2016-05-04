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

var fs = require('fs');
var path = require('path');
var util = require('util');
var azure;

try {
  fs.statSync('./../../lib/azure.js');
  azure = require('./../../lib/azure');
} catch (error) {
  azure = require('azure');
}

var express = require('express');
var expressEjsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var multer = require('multer')({ dest: './uploads' });
var helpers = require('./helpers.js');

var app = module.exports = express();
var blobClient = null;
var containerName = 'webpi';

//Configuration
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'development') {
  app.use(errorHandler());
};

if (app.get('env') === 'production') {
  app.use(errorHandler());
};

app.param('id', function (req, res, next, id) {
  next();
});

//Routes
app.get('/', function (req, res) {
  res.render('index.ejs', {
    title: 'Welcome'
  });
});

app.get('/Upload', function (req, res) {
  res.render('upload.ejs', {
    title: 'Upload File'
  });
});

app.get('/Display', function (req, res) {
  blobClient.listBlobsSegmented(containerName, null, {}, function (error, result, response) {
    // result {continuationToken, entries}
    res.render('display.ejs', {
      title: 'List of Blobs',
      serverBlobs: result.entries
    });
  });
});

app.get('/Download/:id', function (req, res) {
  blobClient.getBlobProperties(containerName, req.params.id, function (err, result, response) {
    if (!err) {
      res.header('content-type', result.contentType);
      res.header('content-disposition', 'attachment; filename=' + result.metadata.filename);
      blobClient.getBlobToStream(containerName, req.params.id, res, function () { });
    } else {
      helpers.renderError(res);
    }
  });
});

app.post('/uploadhandler', multer.array('uploadedFile'), function (req, res) {
  if (!req.body.itemName || !req.files || req.files.length === 0) {
    helpers.renderError(res);
  } else {
    var name = req.body.itemName;
    var file = req.files[0];
    var extension = path.extname(file.originalname);
    var newName = util.format('%s%s', req.body.itemName, extension);
    var options = {
      contentType: file.mimetype,
      metadata: {
        filename: newName
      }
    };
    blobClient.createBlockBlobFromLocalFile(containerName, name, file.path, options, function (error, result, response) {
      if (error) {
        helpers.renderError(res);
      } else {
        setSAS(containerName, name);
        res.redirect('/Display');
      }
    });
  }
});

app.post('/Delete/:id', function (req, res) {
  blobClient.deleteBlob(containerName, req.params.id, function (error, response) {
    if (error) {
      helpers.renderError(res);
    } else {
      res.redirect('/Display');
    }
  });
});

function setSAS(containerName, blobName) {
  var sharedAccessPolicy = {
    AccessPolicy: {
      Expiry: azure.date.minutesFromNow(3)
    }
  };
  var blobUrl = blobClient.getUrl(containerName, blobName, sharedAccessPolicy);
  console.log("access the blob at: %s", blobUrl);
}

app.listen(app.get('port'), function () {
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
  // Global request options, set the retryPolicy
  blobClient = azure.createBlobService('UseDevelopmentStorage=true')
    .withFilter(new azure.ExponentialRetryPolicyFilter());
  blobClient.createContainerIfNotExists(containerName, { publicAccessType: 'blob' },
    function (error, result, response) {
      if (error) {
        console.log(error);
      }
    });
});
