
var azure = require('../../lib/azure');
var testCommon = require('./testcommon');

var auth = {
  keyfile: './certs/priv.pem',
  certfile: './certs/pub.pem'
}

var inputNames = {
  subscriptionId: '167a0c69-cb6f-4522-ba3e-d3bdc9c504e1',
  serviceName: 'testjsService'
};


var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.setProxyUrl('http://itgproxy:80');
svcmgmt.getHostedService(inputNames.serviceName, function(rspobj) {
  if (rspobj.response && rspobj.response.isSuccessful && rspobj.response.body) {
    var rsp = rspobj.response.body;
    console.log('ServiceName: ' + rsp.ServiceName);
    console.log('Description: ' + rsp.HostedServiceProperties.Description);
    console.log('Location: ' + rsp.HostedServiceProperties.Location);
    console.log('AffinityGroup: ' + rsp.HostedServiceProperties.AffinityGroup);
    console.log('Label: ' + rsp.HostedServiceProperties.Label);
  } else {
    testCommon.showErrorResponse(rspobj);
  }
});

