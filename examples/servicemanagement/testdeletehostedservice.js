
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

var auth = {
  keyfile : './certs/priv.pem',
  certfile : './certs/pub.pem'
}

var inputNames = {
  subscriptionId: '167a0c69-cb6f-4522-ba3e-d3bdc9c504e1',
  serviceName: 'testjsService',
};

var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.deleteHostedService(inputNames.serviceName, function(rspobj) {
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

