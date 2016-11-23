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
  fs.statSync('./../../lib/azure.js');
  azure = require('./../../lib/azure');
} catch (error) {
  azure = require('azure');
}

module.exports = Home;
var uuid = require('uuid');
var entityGen = azure.TableUtilities.entityGenerator;

function Home(client) {
  this.client = client;
};

Home.prototype = {
  showResults: function (res, taskList) {
    res.render('home', {
      title: 'Task list',
      taskList: taskList.entries
    });
  },

  getItems: function (allItems, callback) {
    var query = new azure.TableQuery()
      .select();
    if (!allItems) {
      query = query
        .where('completed eq ?', false);
    }
    this.client.queryEntities('tasks', query, null, callback);
  },

  showItems: function (req, res) {
    var self = this;
    this.getItems(false, function (resp, taskList) {
      if (!taskList) {
        self.taskList = [];
      }
      self.showResults(res, taskList);
    });
  },

  newItem: function (req, res) {
    var self = this;
    var createItem = function (resp, taskList) {
      if (!taskList) {
        self.taskList = [];
      }
      var item = {
        name: entityGen.String(req.body.item.name),
        category: entityGen.String(req.body.item.category),
        date: entityGen.String(req.body.item.date),
        RowKey: entityGen.String(uuid()),
        PartitionKey: entityGen.String('partition1'),
        completed: entityGen.Boolean(false)
      }

      self.client.insertEntity('tasks', item, function entityInserted(error) {
        res.redirect('/home');
      });
    };

    this.getItems(true, createItem);
  },

  markCompleted: function (req, res) {
    var self = this;

    var postedItems = req.body.completed;
    if (!postedItems) return res.redirect('/home');
    if (!postedItems.forEach) {
      postedItems = [postedItems];
    }

    var process = {
      processNextItem: function (err) {
        var itemRowKey = postedItems.pop();
        if (itemRowKey) {
          process.getItemToUpdate(itemRowKey);
        } else {
          res.redirect('/home');
        }
      },
      getItemToUpdate: function (itemRowKey) {
        self.client.retrieveEntity('tasks', 'partition1', itemRowKey, process.updateItem);
      },
      updateItem: function (resp, task) {
        if (task) {
          task.completed._ = true;
          self.client.updateEntity('tasks', task, process.processNextItem);
        }
      }
    };

    process.processNextItem();
  }
};
