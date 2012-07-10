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
var Constants = require('../../lib/util/constants');
var HttpResponseCodes = Constants.HttpConstants.HttpResponseCodes;
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

var svcmgmt = azure.createServiceManagementService(inp.subscriptionId, inp.auth, inp.hostopt);

var inputNames = {
  serviceName: 'testJSsvc',
  deploymentName: 'testJSdeploy',
  roleName: 'testjsRole'
};

// data disk
// One of DiskId, SourceMediaLink, or LogicalDiskSize must be specified for createDeployment
// DiskId - ref to Data Disk in User Image Repository
// SourceMediaLink may be used in Create to specifiy location of BLOB in XSTORE
// MediaLink location of BLOB - not required in create
// DiskName - friendly name - optional
// HostCaching - “None”, ”ReadOnly”, “ReadWrite”.  optional. Default ReadOnly
var dataDisk = {
  DiskLabel : 'testjsDiskLabel1',
  LogicalDiskSizeInGB : 10,
  Lun : 2,
  MediaLink: 'testmedia'
};

svcmgmt.addDataDisk(inputNames.serviceName, 
                    inputNames.deploymentName, 
                    inputNames.roleName,
                    dataDisk, function(error, response) {
  if (error) {
    testCommon.showErrorResponse(error);
  } else {
    if (response && response.isSuccessful) {
      if (response.statusCode == HttpResponseCodes.OK_CODE) {
        console.log('OK');
      } else {
        console.log('Pending');
        console.log('RequestID: ' + response.headers['x-ms-request-id']);
      }
    } else {
      console.log('Unexpected');
    }
  }
});

