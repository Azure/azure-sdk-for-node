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
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

if (!fs.existsSync) {
  fs.existsSync = require('path').existsSync;
}

if (fs.existsSync('./testhost.json')) {
  inp = JSON.parse(fs.readFileSync('./testhost.json'));
} else {
  console.log('The file testhost.json was not found.\n' +
              'This is required and must specify the host, the subscription id, and the certificate file locations');
}
inp.hostopt.serializetype = 'JSON';
var svcmgmt = azure.createServiceManagementService(inp.subscriptionId, inp.auth, inp.hostopt);

svcmgmt.listHostedServices(function(error, response) {
  if (error) {
    testCommon.showErrorResponse(error);
  } else {
    if (response && response.isSuccessful && response.body) {
      var rsp = response.body;
      var rspdata;
      // depending on serialization, there may be a HostedService object or not.
      if (rsp.HostedService) {
        rspdata = rsp.HostedService;
      } else {
        // JSON data does not have name for top level object
        rspdata = rsp;
      }
      if (rspdata instanceof Array) {
        var len = rspdata.length;
        console.log('Number of hosted services: ' + len);
        for (var i = 0; i < len; i++) {
          console.log('# ' + i + '  ServiceName: ' + rspdata[i].ServiceName);
        }
      } else if (rspdata) {
        console.log('Number of hosted services: 1');
        console.log('ServiceName: ' + rspdata.ServiceName);
      } else {
        console.log('Number of hosted services: 0');
      }
    } else {
      console.log('Unexpected');
    }
  }
});

