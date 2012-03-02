
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
  deploymentSlot: 'Staging'
};


var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.getDeploymentBySlot(inputNames.serviceName, inputNames.deploymentSlot, function(rspobj) {
  if (rspobj.response && rspobj.response.isSuccessful && rspobj.response.body) {
    var rsp = rspobj.response.body;
    console.log('*** Deployments By Slot results ***');
    testCommon.showDeployment(rsp);
  } else {
    testCommon.showErrorResponse(rspobj);
  }
});

svcmgmt.getDeployment(inputNames.serviceName, inputNames.deploymentName, function(rspobj) {
  if (rspobj.response && rspobj.response.isSuccessful && rspobj.response.body) {
    var rsp = rspobj.response.body;
    console.log('*** Deployments By Name results ***');
    testCommon.showDeployment(rsp);
  } else {
    testCommon.showErrorResponse(rspobj);
  }
});

