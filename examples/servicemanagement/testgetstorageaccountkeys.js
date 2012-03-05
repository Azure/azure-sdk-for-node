
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

svcmgmt.getStorageAccountKeys(inputNames.storageServicename, function(error, response) {
  if (error) {
    testCommon.showErrorResponse(error);
  } else {
    if (response && response.isSuccessful && response.body) {
      var rsp = response.body;
      console.log('URL = ' + rsp.Url);
      console.log('Primary = ' + rsp.StorageServiceKeys.Primary);
      console.log('Secondary = ' + rsp.StorageServiceKeys.Secondary);
    } else {
      console.log('Unexpected');
    }
  }
});

svcmgmt.getStorageAccountKeys(inputNames.badServicename, function(error, response) {
  if (error) {
    if (error.Code == 'ResourceNotFound') {
      console.log('Calling with bad storage service name: Received expected failure code');
    }
  } else {
    if (response && response.isSuccessful) {
      console.log('Calling with bad storage service name: Unexpected success');
    }
  }
});


