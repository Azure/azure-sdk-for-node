
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
  roleInstance: 'testjsRole_IN_0',
};


if (process.argv.length < 3) {
  console.log('Pass either shutdown or restart on the command line');
  process.exit();
}

var reqid = process.argv[2];

var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

if (reqid.toLowerCase() == 'shutdown') {
  svcmgmt.shutdownRoleInstance(inputNames.serviceName,
                                inputNames.deploymentName,
                                inputNames.roleInstance,
                                function(rspobj) {
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
} else if (reqid.toLowerCase() == 'restart') {
  svcmgmt.restartRoleInstance(inputNames.serviceName,
                                inputNames.deploymentName,
                                inputNames.roleInstance,
                                function(rspobj) {
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
} else {
  console.log('Pass either shutdown or restart on the command line');
  process.exit();
}


