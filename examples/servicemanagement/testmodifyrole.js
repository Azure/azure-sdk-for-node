
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

var auth = {
  keyfile : './certs/priv.pem',
  certfile : './certs/pub.pem'
}

var inputNames = {
  subscriptionId: '167a0c69-cb6f-4522-ba3e-d3bdc9c504e1',
  serviceName: 'testjsService',
  deploymentName: 'testjsDeployment',
  roleName: 'testjsRole'
}


// data for VM Role

// OS Disk for VM role
// One of DiskId, SourceImageID, or MediaLink must be specified for createDeployment
// DiskId - guid reference to User Image Repository
// SourceImageId - reference to PlatformStockImage or UserImage Repository
// MediaLink - location of physical BLOB backing OS disk. Blob in customer storage account
// DiskLabel - friendly name - optional
// HostCaching - ”ReadOnly”, “ReadWrite”.  optional. Default ReadWrite
var osDisk = {
  SourceImageName : 'Win2K8SP1.110809-2000.201108-01.en.us.30GB.vhd',
};

// data disk
// One of DiskId, SourceMediaLink, or LogicalDiskSize must be specified for createDeployment
// DiskId - ref to Data Disk in User Image Repository
// SourceMediaLink may be used in Create to specifiy location of BLOB in XSTORE
// MediaLink location of BLOB - not required in create
// DiskName - friendly name - optional
// HostCaching - “None”, ”ReadOnly”, “ReadWrite”.  optional. Default ReadOnly
var dataDisk2 = {
  LogicalDiskSizeInGB : 10,
  LUN : 1
};


// Defines network endpoint
var externalEndpoint1 = {
  Name: 'endpname1',
  Protocol: 'tcp',
  Port: '59919',
  LocalPort: '3395'
};

// network configuration set
// Type maybe 'VirtualnetworkConfiguration' - doc ambiguous
var networkConfigurationSet = {
  ConfigurationSetType: 'NetworkConfiguration',
  InputEndpoints: [externalEndpoint1]
};

// VMRole is required
// RoleSize is optional
// RoleType must be 'PersistentVMRole'. Filled in automatically
// For Modify Role do not include provisioningConfigurationSet
var VMRole = {
  RoleName: inputNames.roleName,
  RoleSize: 'Medium',
  ConfigurationSets: [networkConfigurationSet]
}


var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.modifyRole(inputNames.serviceName, 
                    inputNames.deploymentName, 
                    inputNames.roleName,
                    VMRole, function(error, response) {
  if (error) {
    testCommon.showErrorResponse(error);
  } else {
    if (response && response.isSuccessful) {
      if (response.statusCode == 200) {
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


