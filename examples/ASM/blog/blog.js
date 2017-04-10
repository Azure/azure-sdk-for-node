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

var azure;
try {
  fs.statsSync('./../../lib/azure.js');
  azure = require('./../../lib/azure');
} catch (error) {
  azure = require('azure');
}

var TableQuery = azure.TableQuery;
var TableBatch = azure.TableBatch;
var entityGenerator = azure.TableUtilities.entityGenerator;
var uuid = require('uuid');

var tableName = 'posts';
var partition = 'part1';

var Blog = function () {
  this.tableClient = azure.createTableService('UseDevelopmentStorage=true');
};

Blog.prototype.findAll = function (callback) {
  var tableQuery = new TableQuery()
    .select();

  this.tableClient.queryEntities(tableName, tableQuery, null, callback);
};

Blog.prototype.findById = function (id, callback) {
  this.tableClient.retrieveEntity(tableName, partition, id, callback);
};

Blog.prototype.destroy = function (id, callback) {
  var entity = {
    PartitionKey: entityGenerator.String(partition),
    RowKey: entityGenerator.String(id)
  };
  this.tableClient.deleteEntity(tableName, entity, callback);
};

Blog.prototype.save = function (posts, callback) {
  if (!Array.isArray(posts)) {
    posts = [posts];
  }

  this.savePosts(posts, callback);
};

// this could be implemented using batch but for the sake of using both methods use the individual requests + callback.
Blog.prototype.savePosts = function (posts, callback) {
  if (posts.length === 0) {
    callback();
  } else {
    var post = posts.pop();
    var now = new Date().toUTCString();
    var newPost = {
      PartitionKey: entityGenerator.String(partition),
      RowKey: entityGenerator.String(uuid.v4()),
      title: entityGenerator.String(post.title),
      body: entityGenerator.String(post.body),
      created_at: entityGenerator.String(now)
    }
    var provider = this;
    this.tableClient.insertEntity(tableName, newPost, function (error) {
      // Insert remaining posts recursively
      provider.savePosts(posts, callback);
    });
  }
};

Blog.prototype.init = function () {
  var provider = this;
  this.tableClient.createTableIfNotExists(tableName, function (err, created) {
    if (created) {
      console.log('Setting up demo data ...');
      var batch = new TableBatch();
      var now = new Date().toUTCString();
      batch.insertEntity({
        PartitionKey: entityGenerator.String(partition),
        RowKey: entityGenerator.String(uuid.v4()),
        title: entityGenerator.String('Post one'),
        body: entityGenerator.String('Body one'),
        created_at: entityGenerator.String(now)
      });
      batch.insertEntity({
        PartitionKey: entityGenerator.String(partition),
        RowKey: entityGenerator.String(uuid.v4()),
        title: entityGenerator.String('Post two'),
        body: entityGenerator.String('Body two'),
        created_at: entityGenerator.String(now)
      });
      batch.insertEntity({
        PartitionKey: entityGenerator.String(partition),
        RowKey: entityGenerator.String(uuid.v4()),
        title: entityGenerator.String('Post three'),
        body: entityGenerator.String('Body three'),
        created_at: entityGenerator.String(now)
      });
      batch.insertEntity({
        PartitionKey: entityGenerator.String(partition),
        RowKey: entityGenerator.String(uuid.v4()),
        title: entityGenerator.String('Post four'),
        body: entityGenerator.String('Body four'),
        created_at: entityGenerator.String(now)
      });

      provider.tableClient.executeBatch(tableName,
        batch,
        function (error, insertEntities, response) {
          console.log('Done');
        });
    }
  });
};

exports.Blog = Blog;
