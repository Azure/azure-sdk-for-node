
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

var auth = {
  keyfile: './certs/priv.pem',
  certfile: './certs/pub.pem'
}

var inputNames = {
  subscriptionId: '167a0c69-cb6f-4522-ba3e-d3bdc9c504e1',
  storageServicename: 'auxpreview181imagestore',
  badServicename: 'auxpreviewunknown'
};


var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.getStorageAccountKeys(inputNames.storageServicename, function(rspobj) {
  if (rspobj.response && rspobj.response.isSuccessful && rspobj.response.body) {
    var rsp = rspobj.response.body;
    console.log('URL = ' + rsp.Url);
    console.log('Primary = ' + rsp.StorageServiceKeys.Primary);
    console.log('Secondary = ' + rsp.StorageServiceKeys.Secondary);
  } else {
    testCommon.showErrorResponse(rspobj);
  }
});

svcmgmt.getStorageAccountKeys(inputNames.badServicename, function(rspobj) {
  if (rspobj.isSuccessful && rspobj.response) {
    console.log('Calling with bad storage service name: Unexpected success');
  } else {
    if (rspobj.error.Code == 'ResourceNotFound') {
      console.log('Calling with bad storage service name: Received expected failure code');
    }
  }
});


