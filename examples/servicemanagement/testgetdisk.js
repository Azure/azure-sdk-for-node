
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

var auth = {
  keyfile: './certs/priv.pem',
  certfile: './certs/pub.pem'
}

var inputNames = {
  subscriptionId: '167a0c69-cb6f-4522-ba3e-d3bdc9c504e1',
  diskName: 'EduardK-20120201195834'
};


var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);


svcmgmt.getDisk(inputNames.diskName, function(rspobj) {
  if (rspobj.response && rspobj.response.isSuccessful && rspobj.response.body) {
    var rsp = rspobj.response.body;
    console.log('** named disk information **');
    testCommon.showDisk(rsp);
  } else {
    testCommon.showErrorResponse(rspobj);
  }
});

svcmgmt.listDisks(function(rspobj) {
  if (rspobj.response && rspobj.response.isSuccessful && rspobj.response.body) {
    var rsp = rspobj.response.body;
    console.log('** List of Disks **');
    if (rsp.Disk) {
      if (rsp.Disk instanceof Array) {
        for (var i = 0; i < rsp.Disk.length; i++) {
          console.log('** Disk **');
          testCommon.showDisk(rsp.Disk[i]);
        }
      } else {
        testCommon.showDisk(rsp.Disk);
      }
    }
  } else {
    testCommon.showErrorResponse(rspobj);
  }
});

