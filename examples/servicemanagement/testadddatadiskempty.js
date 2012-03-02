
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
  roleName: 'testjsRole'
}

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
  LUN : 2,
  MediaLink: 'testmedia'
};

var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.addDataDisk(inputNames.serviceName, 
                    inputNames.deploymentName, 
                    inputNames.roleName,
                    dataDisk, function(rspobj) {
  if (rspobj.response && rspobj.response.isSuccessful) {
    if (rspobj.response.statusCode == 200) {
      console.log('OK');
    } else {
      console.log('Pending');
      console.log('RequestID: ' + rspobj.response.headers['x-ms-request-id']);
    }
  } else {
    testCommon.showErrorResponse(rspobj);
  }
});

