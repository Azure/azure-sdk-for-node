
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

var auth = {
  keyfile : './certs/priv.pem',
  certfile : './certs/pub.pem'
}

var inputNames = {
  subscriptionId: '167a0c69-cb6f-4522-ba3e-d3bdc9c504e1'
};

var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.listHostedServices(function(error, response) {
  if (error) {
    testCommon.showErrorResponse(error);
  } else {
    if (response && response.isSuccessful && response.body) {
      var rsp = response.body;
      if (rsp.HostedService instanceof Array) {
        var len = rsp.HostedService.length;
        console.log('Number of hosted services: ' + len);
        for (var i = 0; i < len; i++) {
          console.log('# ' + i +'  ServiceName: ' + rsp.HostedService[i].ServiceName);
        }
      } else if (rsp.HostedService) {
        console.log('Number of hosted services: 1');
        console.log('ServiceName: ' + rsp.HostedService.ServiceName);
      } else {
        console.log('Number of hosted services: 0');
      }
    } else {
      console.log('Unexpected');
    }
  }
});

