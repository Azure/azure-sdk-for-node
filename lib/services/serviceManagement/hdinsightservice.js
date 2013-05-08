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

// Module dependencies.
var util = require('util');
var _ = require('underscore');

var ServiceManagementClient = require('../core/servicemanagementclient');

// var js2xml = require('../../util/js2xml');
// var Constants = require('../../util/constants');

/**
*
* Creates a new HDInsightService object
*
* @constructor
* @param {string} subscriptionId   Subscription ID for the account or the connection string
* @param {object} authentication                    The authentication object for the client.
*                                                   {
*                                                     keyfile: 'path to .pem',
*                                                     certfile: 'path to .pem',
*                                                     keyvalue: privatekey value,
*                                                     certvalue: public cert value
*                                                   }
* @param {object} hostOptions                       The host options to override defaults.
*                                                   {
*                                                     host: 'management.core.windows.net',
*                                                     apiversion: '2012-03-01',
*                                                     serializetype: 'XML'
*                                                   }
*/
function HDInsightService(subscriptionId, authentication, hostOptions) {
  if (typeof subscriptionId != 'string' || subscriptionId.length === 0) {
    throw new Error('A subscriptionId or a connection string is required');
  }

  if (!hostOptions) {
    hostOptions = { };
  }

  hostOptions.serializetype = 'XML';
  HDInsightService['super_'].call(this, authentication, hostOptions);

  this.subscriptionId = subscriptionId;
}

util.inherits(HDInsightService, ServiceManagementClient);

var WebResource = require('../../http/webresource');

HDInsightService.prototype.listClusters = function (callback) {
  var path = '/' + this.subscriptionId + '/cloudservices';
  var webResource = WebResource.get(path);
  webResource.withHeader('x-ms-version', '2011-08-18');
  webResource.withHeader('accept', 'application/xml');

  this.performRequest(webResource, null, null, function (responseObject , next)  {
    var cloudServices = [];
    if (!responseObject.error) {
      if (responseObject.response && responseObject.response.body &&
          responseObject.response.body.CloudServices && responseObject.response.body.CloudServices.CloudService) {

        if (!_.isArray(responseObject.response.body.CloudServices.CloudService)) {
          responseObject.response.body.CloudServices.CloudService = [ responseObject.response.body.CloudServices.CloudService ];
        }

        var cloudService = responseObject.response.body.CloudServices.CloudService;

        for (var i = 0; i < cloudService.length; i++) {
          if (cloudService[i].Name &&
              cloudService[i].Name.indexOf('hdinsight') === 0) {
            var resources = [];

            if (cloudService[i].Resources && cloudService[i].Resources.Resource) {
              if (!_.isArray(cloudService[i].Resources.Resource)) {
                cloudService[i].Resources.Resource = [ cloudService[i].Resources.Resource ];
              }

              var resource = cloudService[i].Resources.Resource;
              for (var j = 0; j < resource.length; j++) {
                if (resource[j].ResourceProviderNamespace == 'hdinsight') {
                  resources.push(resource[j]);
                }
              }
              cloudService[i].Resources.Resource = resources;
            }

            cloudServices.push (cloudService[i]);
          }

          responseObject.response.body.CloudServices.CloudService = cloudServices;
        }

      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);

  });
};

module.exports = HDInsightService;