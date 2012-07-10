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
  serviceName: 'testjsSvc',
  deploymentName: 'testjsDeploy',
};

// data for VM Role

// OS Disk for VM role
// One of DiskId, SourceImageID, or MediaLink must be specified for createDeployment
// DiskId - guid reference to User Image Repository
// SourceImageId - reference to PlatformStockImage or UserImage Repository
// MediaLink - location of physical BLOB backing OS disk. Blob in customer storage account
// DiskLabel - friendly name - optional
// HostCaching - ”ReadOnly”, “ReadWrite”.  optional. Default ReadWrite
var osDisk = {
  SourceImageName : 'DiskTest-test-23586'
};


var linuxProvisioningConfigurationSet = {
  ConfigurationSetType: 'LinuxProvisioningConfiguration',
  HostName: 'testJSlinux',
  UserName: 'rduser',
  UserPassword: 'Abc123',
  DisablePasswordAuthentication: 'false'
};

var endpointLinux = {
  Name: 'endpnameL2',
  Protocol: 'tcp',
  Port: '59913',
  LocalPort: '3394'
};

// network configuration set
// Type maybe 'VirtualnetworkConfiguration' - doc ambiguous
var networkConfigurationSet = {
  ConfigurationSetType: 'NetworkConfiguration',
  InputEndpoints: [endpointLinux]
};

// VMRole is required
// may also have AvailabilitySetName
// RoleSize is optional
// RoleType must be 'PersistentVMRole'. Filled in automatically
var VMRole = {
  RoleName: 'testjsRole2',
  RoleSize: 'Small',
  OSVirtualHardDisk: osDisk,
  DataVirtualHardDisks: [],
  ConfigurationSets: [linuxProvisioningConfigurationSet]
}


svcmgmt.addRole(inputNames.serviceName, 
                         inputNames.deploymentName,
                         VMRole, function(error, response) {
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

