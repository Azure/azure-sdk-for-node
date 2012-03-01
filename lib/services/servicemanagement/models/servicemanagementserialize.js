//
// Build request body from parameters and parse response body
// 

var util = require('util');
var xmlbuilder = require('xmlbuilder');

// Expose 'ServiceManagementSerialize'.
exports = module.exports = ServiceManagementSerialize;

/**
* Error message if serialize type is not supported.
*/
ServiceManagementSerialize.invalidContentType = 'The response content type is invalid';

/**
* Creates a new ServiceManagementSerialize object.
*
* @constructor
*/
function ServiceManagementSerialize() {
}


/**
* Create the message body for CreateHostedService
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName    The name of the service.
* @param {object} serviceOptions    The properties for the new service.
* @param {object} client    The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildCreateHostedService = function(serviceName, serviceOptions, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('CreateHostedService');
    _addDefinedValueXml(doc, 'ServiceName', serviceName);
    var encLabel;
    if (serviceOptions.Label) {
      encLabel = new Buffer(serviceOptions.Label).toString('base64');
    }
    _addDefinedValueXml(doc, 'Label', encLabel);
    _addDefinedValueXml(doc, 'Description', serviceOptions.Description);
    _addDefinedValueXml(doc, 'Location', serviceOptions.Location);

    return doc.toString();
  } else {
    // JSON not supported yet
    throw new Error(ServiceManagementSerialize.invalidContentType);
  }
};

/**
* Create the message body for CreateOSImage
*   Use the specified serialization - for now only XML
*
* @param {string} imageName    The name of the image.
* @param {string} mediaLink    The mediaLink value.
* @param {object} imageOptions    The optional properties for the new image.
* @param {object} client    The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildCreateOSImage = function(imageName, mediaLink, imageOptions, client) {
  if (!imageOptions) {
    imageOptions = {};
  }
  if (!imageOptions.Label) {
    imageOptions.Label = imageName;
  }
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('OSImage');
    // add required and optional elements in alpha order
    _addDefinedValueXml(doc, 'Category', imageOptions.Category);
    _addDefinedValueXml(doc, 'Label', imageOptions.Label);
    _addDefinedValueXml(doc, 'Location', imageOptions.Location);
    _addDefinedValueXml(doc, 'MediaLink', mediaLink);
    _addDefinedValueXml(doc, 'Name', imageName);
    _addDefinedValueXml(doc, 'RoleSize', imageOptions.RoleSize);
    return doc.toString();
  } else {
    // JSON not supported yet
    throw new Error(ServiceManagementSerialize.invalidContentType);
  }
};

/**
* Create the message body for CreateDeployment
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName    The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {object} VMRole    The properties for the new role.
* @param {object} deploymentOptions    The optional properties for the new deployment.
* @param {object} client    The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildCreateDeployment = function(serviceName, deploymentName,
                                                    VMRole, deploymentOptions, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('Deployment');
    _addDefinedValueXml(doc, 'Name', deploymentName);
    _addDefinedValueXml(doc, 'DeploymentSlot', deploymentOptions.DeploymentSlot);
    _addDefinedValueXml(doc, 'Label', new Buffer(deploymentOptions.Label).toString('base64'));
    _addDefinedNumericXml(doc, 'UpgradeDomainCount', deploymentOptions.UpgradeDomainCount);

    // must have 1 role
    var child = doc.ele('RoleList').ele('Role');
    this._buildPersistentVMRoleXml(VMRole, child);

    return doc.toString();
  } else {
    // JSON not supported yet
    throw new Error(ServiceManagementSerialize.invalidContentType);
  }
};

/**
* Create the message body for AddRole
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName    The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {object} VMRole    The properties for the new role.
* @param {object} client    The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildAddRole = function(serviceName, deploymentName,
                                                        VMRole, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('Role');
    this._buildPersistentVMRoleXml(VMRole, doc);

    return doc.toString();
  } else {
    // JSON not supported yet
    throw new Error(ServiceManagementSerialize.invalidContentType);
  }
};

/**
* Create the message body for ModifyRole
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName    The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleName    The name of the role.
* @param {object} VMRole    The properties for the updated role.
* @param {object} client    The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildModifyRole = function(serviceName, deploymentName,
                                                    roleName, VMRole, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('Role');
    this._buildPersistentVMRoleXml(VMRole, doc);

    return doc.toString();
  } else {
    // JSON not supported yet
    throw new Error(ServiceManagementSerialize.invalidContentType);
  }
};

/**
* Create the message body for AddDataDisk
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName    The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleName    The name of the role.
* @param {object} datadisk    The properties for the new disk.
* @param {object} client    The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildAddDataDisk = function(serviceName, deploymentName,
                                                    roleName, datadisk, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('DataDisk');
    this._buildDataDiskXml(datadisk, doc);

    return doc.toString();
  } else {
    // JSON not supported yet
    throw new Error(ServiceManagementSerialize.invalidContentType);
  }
};

/**
* Create the message body for ModifyDataDisk
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName    The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleName    The name of the role.
* @param {number} LUN    The number for the disk.
* @param {object} datadisk    The properties for the updated disk.
* @param {object} client    The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildModifyDataDisk = function(serviceName, deploymentName,
                                                    roleName, LUN, datadisk, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('DataDisk');
    this._buildDataDiskXml(datadisk, doc);

    return doc.toString();
  } else {
    // JSON not supported yet
    throw new Error(ServiceManagementSerialize.invalidContentType);
  }
};

/**
* Create the message body for ShutdownRoleInstance
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName    The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleInstance    The name of the role instance.
* @param {object} client    The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildShutdownRoleInstance = function(serviceName, deploymentName,
                                                    roleInstance, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('ShutdownRoleOperation');
    return doc.toString();
  } else {
    // JSON not supported yet
    throw new Error(ServiceManagementSerialize.invalidContentType);
  }
};

/**
* Create the message body for RestartRoleInstance
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName    The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleInstance    The name of the role instance.
* @param {object} client    The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildRestartRoleInstance = function(serviceName, deploymentName,
                                                    roleInstance, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('RestartRoleOperation');
    return doc.toString();
  } else {
    // JSON not supported yet
    throw new Error(ServiceManagementSerialize.invalidContentType);
  }
};

/**
* Create the message body for CaptureRoleInstance
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName    The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleInstance    The name of the role instance.
* @param {object} captureOptions    The options for the capture operation.
* @param {object} client    The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildCaptureRoleInstance = function(serviceName, deploymentName,
                                                    roleInstance, captureOptions, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('CaptureRoleOperation');
    _addDefinedValueXml(doc, 'PostCaptureAction', captureOptions.PostCaptureAction);
    if (captureOptions.ProvisioningConfiguration) {
      var inst = doc.ele('ProvisioningConfiguration');
      this._buildProvisioningConfigurationXml(captureOptions.ProvisioningConfiguration, inst);
    }
    _addDefinedValueXml(doc, 'SupportsStatelessDeployment', captureOptions.SupportsStatelessDeployment);
    _addDefinedValueXml(doc, 'TargetImageLabel', captureOptions.TargetImageLabel);
    _addDefinedValueXml(doc, 'TargetImageName', captureOptions.TargetImageName);
    return doc.toString();
  } else {
    // JSON not supported yet
    throw new Error(ServiceManagementSerialize.invalidContentType);
  }
};


/**
* Create root node with specified name and common namespaces
*   returns xmlbuilder node object
*
* @param {string} rootName    The XML root element name.
*/
function _createXmlRoot(rootName) {
  var doc = xmlbuilder.create();
  return doc.begin(rootName, { 'version': '1.0', 'encoding': 'utf-8' })
              .att('xmlns', 'http://schemas.microsoft.com/windowsazure')
              .att('xmlns:i', 'http://www.w3.org/2001/XMLSchema-instance');
}

/**
* Add an element to the node if the value exists
*   returns xmlbuilder node object
*
* @param {object} node    The XML parent node.
* @param {string} elename    The XML element name.
* @param {string} value    The value for the new node.
*/
function _addDefinedValueXml(node, elename, value) {
  if (value) node.ele(elename).txt(value);
}

/**
* Add an element to the node if the value is a number
*   returns xmlbuilder node object
*   note: using _addDefinedValueXml will fail if value is 0
*
* @param {object} node    The XML parent node.
* @param {string} elename    The XML element name.
* @param {string} value    The value for the new node.
*/
function _addDefinedNumericXml(node, elename, value) {
  if (typeof value === 'number') node.ele(elename).txt(value);
}

/**
* Add a VM Role node tree to the specifed node
*   returns xmlbuilder node object
*
* @param {object} VMRole    The Role object properties.
* @param {object} node    The XML parent node.
*/
ServiceManagementSerialize.prototype._buildPersistentVMRoleXml = function(VMRole, node) {
  var child;
  var inst;
  var alen;
  var i;
  _addDefinedValueXml(node, 'RoleName', VMRole.RoleName);
  _addDefinedValueXml(node, 'RoleType', VMRole.RoleType);
  _addDefinedValueXml(node, 'AvailabilitySetName', VMRole.AvailabilitySetName);
  if (VMRole.ConfigurationSets) {
    child = node.ele('ConfigurationSets');
    alen = VMRole.ConfigurationSets.length;
    for (i = 0; i < alen; i++) {
      inst = child.ele('ConfigurationSet');
      if (VMRole.ConfigurationSets[i].ConfigurationSetType === 'ProvisioningConfiguration') {
        this._buildProvisioningConfigurationXml(VMRole.ConfigurationSets[i], inst);
      } else if (VMRole.ConfigurationSets[i].ConfigurationSetType === 'NetworkConfiguration') {
        this._buildNetworkConfigurationXml(VMRole.ConfigurationSets[i], inst);
      } else {
        throw new Error(ServiceManagementSerialize.unknownConfigsetType +
                       VMRole.ConfigurationSets[i].ConfigurationSetType);
      }
    }
  }
  if (VMRole.OSDisk) {
    child = node.ele('OSDisk');
    this._buildOSDiskXml(VMRole.OSDisk, child);
  }
  if (VMRole.DataDisks) {
    child = node.ele('DataDisks');
    alen = VMRole.DataDisks.length;
    for (i = 0; i < alen; i++) {
      inst = child.ele('DataDisk');
      this._buildDataDiskXml(VMRole.DataDisks[i], inst);
    }
  }
  _addDefinedValueXml(node, 'RoleSize', VMRole.RoleSize);
};

/**
* Add OSDisk properties to the specifed node
*   returns xmlbuilder node object
*
* @param {object} OSDisk    The OSDisk object properties.
* @param {object} node    The XML parent node.
*/
ServiceManagementSerialize.prototype._buildOSDiskXml = function(OSDisk, node) {
  _addDefinedValueXml(node, 'DisableWriteCache', OSDisk.DisableWriteCache);
  _addDefinedValueXml(node, 'DiskLabel', OSDisk.DiskLabel);
  _addDefinedValueXml(node, 'DiskName', OSDisk.DiskName);
  _addDefinedValueXml(node, 'MediaLink', OSDisk.MediaLink);
  _addDefinedValueXml(node, 'SourceImageName', OSDisk.SourceImageName);
  return node;
};

/**
* Add DataDisk properties to the specifed node
*   returns xmlbuilder node object
*
* @param {object} DataDisk    The DataDisk object properties.
* @param {object} node    The XML parent node.
*/
ServiceManagementSerialize.prototype._buildDataDiskXml = function(DataDisk, node) {
  _addDefinedValueXml(node, 'DiskName', DataDisk.DiskName);
  _addDefinedNumericXml(node, 'LUN', DataDisk.LUN);
  _addDefinedValueXml(node, 'DisableReadCache', DataDisk.DisableReadCache);
  _addDefinedValueXml(node, 'DiskLabel', DataDisk.DiskLabel);
  _addDefinedValueXml(node, 'EnableWriteCache', DataDisk.EnableWriteCache);
  _addDefinedValueXml(node, 'LogicalDiskSizeInGB', DataDisk.LogicalDiskSizeInGB);
  _addDefinedValueXml(node, 'MediaLink', DataDisk.MediaLink);
  _addDefinedValueXml(node, 'SourceMediaLink', DataDisk.SourceMediaLink);
  return node;
};

/**
* Add ProvisioningConfiguration properties to the specifed node
*   returns xmlbuilder node object
*
* @param {object} cfgset    The ProvisioningConfiguration object properties.
* @param {object} node    The XML parent node.
*/
ServiceManagementSerialize.prototype._buildProvisioningConfigurationXml = function(cfgset, node) {
  _addDefinedValueXml(node, 'ConfigurationSetType', cfgset.ConfigurationSetType);
  _addDefinedValueXml(node, 'AdminPassword', cfgset.AdminPassword);
  _addDefinedValueXml(node, 'MachineName', cfgset.MachineName);
  _addDefinedValueXml(node, 'ProvisioningMediaLink', cfgset.ProvisioningMediaLink);
  _addDefinedValueXml(node, 'ResetPasswordOnFirstLogon', cfgset.ResetPasswordOnFirstLogon);
  if (cfgset.StoredCertificateSettings) {
    var cset = node.ele('StoredCertificateSettings');
    _addDefinedValueXml(cset, 'StoreName', cfgset.StoredCertificateSettings.StoreName);
    _addDefinedValueXml(cset, 'StoreLocation', cfgset.StoredCertificateSettings.StoreLocation);
    _addDefinedValueXml(cset, 'Thumbprint', cfgset.StoredCertificateSettings.Thumbprint);
  }
};

/**
* Add NetworkConfiguration properties to the specifed node
*   returns xmlbuilder node object
*
* @param {object} cfgset    The NetworkConfiguration object properties.
* @param {object} node    The XML parent node.
*/
ServiceManagementSerialize.prototype._buildNetworkConfigurationXml = function(cfgset, node) {
  _addDefinedValueXml(node, 'ConfigurationSetType', cfgset.ConfigurationSetType);
  if (cfgset.InputEndpoints) {
    var child = node.ele('InputEndpoints');
    this._buildExternalEndpoints(cfgset, child);
  }
};

/**
* Add ExternalEndpoints properties to the specifed node
*   returns xmlbuilder node object
*
* @param {object} cfgset    An array of ExternalEndpoints object properties.
* @param {object} node    The XML parent node.
*/
ServiceManagementSerialize.prototype._buildExternalEndpoints = function(cfgset, node) {
  var alen = cfgset.InputEndpoints.length;
  for (var i = 0; i < alen; i++) {
    var external = cfgset.InputEndpoints[i];
    var child = node.ele('ExternalEndpoint');
    _addDefinedValueXml(child, 'LoadBalancedEndpointSetName', external.LoadBalancedEndpointSetName);
    if (external.LoadBalancerProbe) {
      var probe = child.ele('LoadBalancerProbe');
      _addDefinedValueXml(probe, 'Port', external.LoadBalancerProbe.Port);
      _addDefinedValueXml(probe, 'Protocol', external.LoadBalancerProbe.Protocol);
      _addDefinedValueXml(probe, 'RelativeUri', external.LoadBalancerProbe.RelativeUri);
    }
    _addDefinedValueXml(child, 'LocalPort', external.LocalPort);
    _addDefinedValueXml(child, 'Name', external.Name);
    _addDefinedValueXml(child, 'Port', external.Port);
    _addDefinedValueXml(child, 'Protocol', external.Protocol);
  }
};
