
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

var auth = {
  keyfile: './certs/priv.pem',
  certfile: './certs/pub.pem'
}

var inputNames = {
  subscriptionId: '167a0c69-cb6f-4522-ba3e-d3bdc9c504e1',
  serviceName: 'testjsService',
  deploymentName: 'testjsDeployment',
  roleName: 'testjsRole',
  LUN: 0
}


// data disk
// One of DiskName, SourceMediaLink, or LogicalDiskSize must be specified for createDeployment
// DiskName - ref to Data Disk in User Image Repository
// SourceMediaLink may be used in Create to specifiy location of BLOB in XSTORE
// MediaLink location of BLOB - not required in create
// DiskLabel - friendly name - optional
// HostCaching - “None”, ”ReadOnly”, “ReadWrite”.  optional. Default ReadOnly
var dataDisk = {
  LUN : 0,
  LogicalDiskSizeInGB : 10,
  DiskLabel: 'disklabel',
  MediaLink: 'http://sergei.blob.core.azure-preview.com/vhdstore/ImageCopy.vhd'
};


var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.modifyDataDisk(inputNames.serviceName, 
                    inputNames.deploymentName, 
                    inputNames.roleName,
                    inputNames.LUN,
                    dataDisk, function(error, response) {
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

