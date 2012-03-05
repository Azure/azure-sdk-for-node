
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

var auth = {
  keyfile : './certs/priv.pem',
  certfile : './certs/pub.pem'
}

var inputNames = {
  subscriptionId: '167a0c69-cb6f-4522-ba3e-d3bdc9c504e1',
};


if (process.argv.length < 3) {
  console.log('Pass the request id on the command line');
  process.exit();
}
var reqid = process.argv[2];

var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.getOperationStatus(reqid, function(error, response) {
  if (error) {
    testCommon.showErrorResponse(error);
  } else {
    if (response && response.isSuccessful && response.body) {
      var rsp = response.body;
      console.log(rsp.Status);
      if (rsp.HttpStatusCode) console.log('HTTP Status: ' + rsp.HttpStatusCode);
      if (rsp.Error) {
        console.log('Error code: ' + rsp.Error.Code);
        console.log('Error Message: ' + rsp.Error.Message);
      }
    } else {
      console.log('Unexpected');
    }
  }
});

