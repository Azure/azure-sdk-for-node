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

var ServiceClient = azure.ServiceClient;
var TableQuery = azure.TableQuery;
var uuid = require('node-uuid');

var tableName = 'posts';
var partition = 'part1';

Blog = function () {
  this.tableClient = azure.createTableService('UseDevelopmentStorage=true');
};

Blog.prototype.findAll = function (callback) {
  var tableQuery = TableQuery.select()
    .from(tableName);

  this.tableClient.queryEntities(tableQuery, callback);
};

Blog.prototype.findById = function (id, callback) {
  this.tableClient.queryEntity(tableName, partition, id, callback);
};

Blog.prototype.destroy = function (id, callback) {
  var entity = { PartitionKey: partition, RowKey: id };
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
  }
  else {
    var post = posts.pop();
    post.created_at = new Date();

    if (post.comments === undefined)
      post.comments = [];

    for (var j = 0; j < post.comments.length; j++) {
      post.comments[j].created_at = new Date();
    }

    post.PartitionKey = partition;
    post.RowKey = uuid();

    var provider = this;
    this.tableClient.insertEntity(tableName, post, function () {
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

      provider.tableClient.beginBatch();

      var now = new Date().toUTCString();
      provider.tableClient.insertEntity(tableName, { PartitionKey: partition, RowKey: uuid(), title: 'Post one', body: 'Body one', created_at: now });
      provider.tableClient.insertEntity(tableName, { PartitionKey: partition, RowKey: uuid(), title: 'Post two', body: 'Body two', created_at: now });
      provider.tableClient.insertEntity(tableName, { PartitionKey: partition, RowKey: uuid(), title: 'Post three', body: 'Body three', created_at: now });
      provider.tableClient.insertEntity(tableName, { PartitionKey: partition, RowKey: uuid(), title: 'Post four', body: 'Body four', created_at: now });

      provider.tableClient.commitBatch(function () {
        console.log('Done');
      });
    }
  });
};

exports.Blog = Blog;