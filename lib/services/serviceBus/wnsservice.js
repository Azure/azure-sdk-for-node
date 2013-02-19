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

var util = require('util');

var _ = require('underscore');
var wns = require('wns');

var azureutil = require('../../util/util');

/**
* Creates a new WnsService object.
*
* @constructor
*
* @param {NotificationHubService} [notificationHubService] The notification hub service.
*/
function WnsService(notificationHubService) {
  var self = this;

  this.notificationHubService = notificationHubService;

  Object.keys(wns).forEach(function (key) {
    if (_.isFunction(wns[key]) && azureutil.stringStartsWith(key, 'create') && !azureutil.stringEndsWith(key, 'Binding')) {
      var sendName = util.format('send%s', key.substr(6));

      self[sendName] = function (hub, tags) {
        console.log(wns['createTileSquarePeekImageAndText01'].toString());

        // Get arguments skipping the first two and without the final callback
        var args = Array.prototype.slice.call(arguments, 2, arguments.length - 1);
        
        console.log(arguments);
        var callback = arguments[arguments.length - 1];

        console.log(callback);

        var message = {
          'ServiceBusNotification-Tags': tags
        };

        self.notificationHubService.sendNotification(hub, message, callback);
      };
    }
  });

  this['sendTileSquarePeekImageAndText01'](
    'hub',
    'tag', {
      image1src: 'http://foobar.com/dog.jpg',
      image1alt: 'A dog',
      text1: 'This is a dog',
      text2: 'The dog is nice',
      text3: 'The dog bites',
      text4: 'Beware of dog'
    },
    function (error, result) {
      console.log('hi there');
    });
};

module.exports = WnsService;