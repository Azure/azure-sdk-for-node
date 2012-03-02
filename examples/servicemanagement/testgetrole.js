
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
  roleName: 'testjsRole',
};


var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.getRole(inputNames.serviceName, inputNames.deploymentName, inputNames.roleName, function(rspobj) {
  if (rspobj.response && rspobj.response.isSuccessful && rspobj.response.body) {
    var rsp = rspobj.response.body;
    testCommon.showRole(rsp);
  } else {
    testCommon.showErrorResponse(rspobj);
  }
});

