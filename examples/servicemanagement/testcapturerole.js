
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
  roleInstance: 'testjsRole_IN_0',
}

var provisioningConfigurationSet = {
  ConfigurationSetType: 'ProvisioningConfiguration',
  AdminPassword: 'nodejsIaas',
  MachineName: 'NodejsMa',
  ResetPasswordOnFirstLogon: false
}

var captureOptions = {
  PostCaptureAction: 'Reprovision',
  TargetImageLabel: 'targetimagelabel',
  TargetImageName: 'Win2K8SP1.110809-2000.201108-01.en.us.30GB.vhd',
  ProvisioningConfiguration: provisioningConfigurationSet
}

var svcmgmt = azure.createServiceManagementService(inputNames.subscriptionId, auth);

svcmgmt.captureRoleInstance(inputNames.serviceName,
                              inputNames.deploymentName,
                              inputNames.roleInstance,
                              captureOptions,
                              function(error, response) {
  if (error) {
    testCommon.showErrorResponse(error);
  } else {
    if (response && response.isSuccessful) {
      if (response.statusCode == 200) {
        console.log('OK');
      } else {
        console.log('Pending');
        console.log('RequestID: ' + response.headers['x-ms-request-id']);
      }
    } else {
      console.log('Unexpected');
    }
  }
});

