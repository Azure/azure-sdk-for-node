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

var svcmgmt = azure.createServiceManagementService(inp.subscriptionId, inp.auth);

var diskName = 'testJSDisk';

svcmgmt.getDisk(diskName, function(error, response) {
  if (error) {
    testCommon.showErrorResponse(error);
  } else {
    if (response && response.isSuccessful && response.body) {
      var rsp = response.body;
      console.log('** named disk information **');
      testCommon.showDisk(rsp);
    } else {
      console.log('Unexpected');
    }
  }
});

svcmgmt.listDisks(function(error, response) {
  if (error) {
    testCommon.showErrorResponse(error);
  } else {
    if (response && response.isSuccessful && response.body) {
      var rsp = response.body;
      var rspdata;
      // depending on serialization, there may be a Disk object or not.
      if (rsp.Disk) {
        rspdata = rsp.Disk;
      } else {
        rspdata = rsp;
      }
      console.log('** List of Disks **');
      if (rspdata) {
        if (rspdata instanceof Array) {
          for (var i = 0; i < rspdata.length; i++) {
            console.log('** Disk **');
            testCommon.showDisk(rspdata[i]);
          }
        } else {
          testCommon.showDisk(rspdata);
        }
      } else {
        console.log('No disks found');
      }
    } else {
      console.log('Unexpected');
    }
  }
});

