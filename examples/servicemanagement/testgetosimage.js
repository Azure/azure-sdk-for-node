
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

var auth = {
  keyfile: './certs/priv.pem',
  certfile: './certs/pub.pem'
}

var inputNames = {
  subscriptionId: '167a0c69-cb6f-4522-ba3e-d3bdc9c504e1',
  imageName: 'testjsImage'
};


var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.getOSImage(inputNames.imageName, function(rspobj) {
  if (rspobj.response && rspobj.response.isSuccessful && rspobj.response.body) {
    var rsp = rspobj.response.body;
    console.log('** named image information **');
    testCommon.showOSImage(rsp);
  } else {
    testCommon.showErrorResponse(rspobj);
  }
});

svcmgmt.listOSImage(function(rspobj) {
  if (rspobj.response && rspobj.response.isSuccessful && rspobj.response.body) {
    var rsp = rspobj.response.body;
    console.log('** List of Images **');
    if (rsp.OSImage) {
      if (rsp.OSImage instanceof Array) {
        for (var i = 0; i < rsp.OSImage.length; i++) {
          console.log('** Image **');
          testCommon.showOSImage(rsp.OSImage[i]);
        }
      } else {
        testCommon.showOSImage(rsp.OSImage);
      }
    }
  } else {
    testCommon.showErrorResponse(rspobj);
  }
});

