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

var azure = require('azure'),
  uuid = require('uuid');
module.exports = EventService;

function EventService(tableClient, blobClient) {
  this.tableClient = tableClient;
  this.blobClient = blobClient;
};

EventService.prototype = {

  showEvents: function (req, res) {
    var self = this;
    this.getEvents(function (error, result, response) {
      self.showResults(res, result.entries);
    });
  },

  showEvent: function (req, res) {
    var self = this;
    this.getEvent(req.params.id, function (error, result, response) {
      if (!result) {
        res.render('error', {
          title: "Error",
          message: 'Event ' + req.params.id + ' not found.'
        });
      } else {
        res.render('detail', {
          title: result.name._,
          eventItem: result,
          imageUrl: self.blobClient.getUrl('photos', result.RowKey._),
        });
      }
    });
  },

  getEvents: function (callback) {
    var query = new azure.TableQuery();
    this.tableClient.queryEntities('events', query, null, callback);
  },

  getEvent: function (id, callback) {
    this.tableClient.retrieveEntity('events', 'myEvents', id, callback);
  },

  showResults: function (res, eventList) {
    res.render('index', {
      title: 'My Events',
      eventList: eventList
    });
  },

  newEvent: function (req, res) {
    var self = this;

    var createEvent = function (error, result, response) {
      var item = req.body.item;
      var eg = azure.TableUtilities.entityGenerator;
      var event = {
        RowKey: eg.String(uuid()),
        PartitionKey: eg.String('myEvents'),
        date: eg.String(item.date),
        description: eg.String(item.description),
        name: eg.String(item.name)
      };

      self.tableClient.insertEntity('events', event, function (error, result, response) {
        if (error) {
          console.log(error);
          throw error;
        }
        console.log('event created, uploading photo.');
        var file = req.files[0];
        var options = {
          contentType: file.mimetype,
          metadata: {
            fileName: event.RowKey._
          }
        };
        self.blobClient.createBlockBlobFromLocalFile('photos', event.RowKey._, file.path, options, function (error, result, response) {
          if (error) {
            throw error;
          } else {
            console.log(JSON.stringify(result));
            res.redirect('/');
          }
        });
      });
    };

    this.getEvents(createEvent);
  },
};
