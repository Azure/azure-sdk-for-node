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

var azure = require('./../../lib/azure')
  , uuid = require('node-uuid');
module.exports = EventService;

function EventService (tableClient, blobClient) {
    this.tableClient = tableClient;
    this.blobClient = blobClient;
};

EventService.prototype = {
	
	showEvents: function(req, res) {
		var self = this;
		this.getEvents(function (resp, eventList) {
            if (!eventList) {
                eventList = [];
            }			
            self.showResults(res, eventList);
        });
	},

    showEvent: function(req, res) {
        var self = this;
        this.getEvent(req.params.id, function(resp, eventItem) {
            if (!eventItem) {
                res.render('error', {
                   title: "Error",
                   message: 'Event ' + req.params.id + ' not found.' 
                });
            } else {
                res.render('detail', {
                    title: eventItem.name,
                    eventItem: eventItem,
                    imageUrl: self.blobClient.getBlobUrl('photos', eventItem.RowKey),
                });
            }
        });
    },

  	getEvents: function(callback) {
  		var query = azure.TableQuery
              .select()
              .from('events');

          this.tableClient.queryEntities(query, callback);
  	},

    getEvent: function(id, callback) {
        this.tableClient.queryEntity('events', 'myEvents', id, callback);
    },

    showResults: function (res, eventList) {
        res.render('index', { 
            title: 'My Events', 
            eventList: eventList 
        });
    },

    newEvent: function(req, res) {
        var self = this;

        var createEvent = function(resp, eventList) {
            if (!eventList) {
                eventList = [];
            }

            var count = eventList.length;

            var item = req.body.item;
            item.RowKey = uuid();
            item.PartitionKey = 'myEvents';
            
            self.tableClient.insertEntity('events', item, function(error) {
                if (error) {
                   console.log(error);
                   throw error;
                }  
                              
                console.log('event created, uploading photo.');

                var options = {
                  contentType: req.files.item.file.type,
                  metadata: { fileName: item.RowKey }
                };

                self.blobClient.createBlockBlobFromFile('photos', item.RowKey, req.files.item.file.path, options, function (error1, blockBlob, response) {
                  if (error1) {
                    throw error;
                  } else {
                    console.log(JSON.stringify(blockBlob));
                    res.redirect('/');
                  }
                });

               
            });
        };

        this.getEvents(createEvent);
    },
};
