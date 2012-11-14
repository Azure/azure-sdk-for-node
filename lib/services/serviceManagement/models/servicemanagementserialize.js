/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var util = require('util');
var xmlbuilder = require('xmlbuilder');
var RoleParser = require('./roleparser');
var roleSchema = require('./roleschema.json');

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
  this.roleParser = new RoleParser();
}

/**
* Create the message body for CreateHostedService
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName       The name of the service.
* @param {object} serviceOptions    The properties for the new service.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildCreateHostedService = function(serviceName, serviceOptions, client) {
  var encLabel = undefined;
  if (serviceOptions.Label) {
    encLabel = new Buffer(serviceOptions.Label).toString('base64');
  }

  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('CreateHostedService');
    _addDefinedValueXml(doc, 'ServiceName', serviceName);
    _addDefinedValueXml(doc, 'Label', encLabel);
    _addDefinedValueXml(doc, 'Description', serviceOptions.Description);
    _addDefinedValueXml(doc, 'Location', serviceOptions.Location);
    _addDefinedValueXml(doc, 'AffinityGroup', serviceOptions.AffinityGroup);

    return doc.toString();
  } else {
    var jdoc = {
      ServiceName: serviceName
    };

    if (encLabel) {
      jdoc.Label = encLabel;
    }

    if (serviceOptions.Description) {
      jdoc.Description = serviceOptions.Description;
    }

    if (serviceOptions.Location) {
      jdoc.Location = serviceOptions.Location;
    }

    if (serviceOptions.AffinityGroup) {
      jdoc.AffinityGroup = serviceOptions.AffinityGroup;
    }

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for CreateStorageAccount
*
* @param {string} serviceName       The name of the service.
* @param {object} serviceOptions    The properties for the new service.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildCreateStorageAccount = function(serviceName, serviceOptions, client) {
  var encLabel = undefined;
  if (serviceOptions.Label) {
    encLabel = new Buffer(serviceOptions.Label).toString('base64');
  }

  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('CreateStorageServiceInput');
    _addDefinedValueXml(doc, 'ServiceName', serviceName);
    _addDefinedValueXml(doc, 'Label', encLabel);
    _addDefinedValueXml(doc, 'Description', serviceOptions.Description);
    _addDefinedValueXml(doc, 'Location', serviceOptions.Location);
    _addDefinedValueXml(doc, 'AffinityGroup', serviceOptions.AffinityGroup);

    return doc.toString();
  } else {
    var jdoc = {
      ServiceName: serviceName
    };

    if (encLabel) {
      jdoc.Label = encLabel;
    }

    if (serviceOptions.Description) {
      jdoc.Description = serviceOptions.Description;
    }

    if (serviceOptions.Location) {
      jdoc.Location = serviceOptions.Location;
    }

    if (serviceOptions.AffinityGroup) {
      jdoc.AffinityGroup = serviceOptions.AffinityGroup;
    }

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for UpdateStorageAccount
*
* @param {string} serviceName       The name of the service.
* @param {object} serviceOptions    The properties for the new service.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildUpdateStorageAccount = function(serviceName, serviceOptions, client) {
  var encLabel = undefined;
  if (serviceOptions.Label) {
    encLabel = new Buffer(serviceOptions.Label).toString('base64');
  }

  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('UpdateStorageServiceInput');
    _addDefinedValueXml(doc, 'ServiceName', serviceName);

    if (encLabel) {
      _addDefinedValueXml(doc, 'Label', encLabel);
    }

    if (serviceOptions.Description) {
      _addDefinedValueXml(doc, 'Description', serviceOptions.Description);
    }

    if (serviceOptions.GeoReplicationEnabled) {
      _addDefinedValueXml(doc, 'GeoReplicationEnabled', serviceOptions.GeoReplicationEnabled);
    }

    return doc.toString();
  } else {
    var jdoc = {
      ServiceName: serviceName
    };

    if (encLabel) {
      jdoc.Label = encLabel;
    }

    if (serviceOptions.Description) {
      jdoc.Description = serviceOptions.Description;
    }

    if (serviceOptions.GeoReplicationEnabled) {
      jdoc.GeoReplicationEnabled = serviceOptions.GeoReplicationEnabled;
    }

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for RegenerateStorageKeys
*
* @param {string} serviceName       The name of the service.
* @param {string} keyType           The key type.
* @param {object} client        The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildRegenerateStorageKeys = function(serviceName, keyType, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('RegenerateKeys');
    doc.ele('KeyType').txt(keyType);

    return doc.toString();
  } else {
    var jdoc = {
      RegenerateKeys: {
        KeyType: keyType
      }
    };

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for CreateOSImage
* Use the specified serialization - for now only XML.
*
* @param {string} typeOs        Either 'Linux' or 'Windows'.
* @param {string} imageName     The name of the image.
* @param {string} mediaLink     The mediaLink value.
* @param {object} imageOptions  The optional properties for the new image.
* @param {object} client        The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildCreateOSImage = function(typeOs, imageName, mediaLink, imageOptions, client) {
  if (!imageOptions) {
    imageOptions = {};
  }

  if (!imageOptions.Label) {
    imageOptions.Label = imageName;
  }

  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('OSImage');

    // add required and optional elements in alpha order
    _addDefinedValueXml(doc, 'Label', imageOptions.Label);
    _addDefinedValueXml(doc, 'MediaLink', mediaLink);
    _addDefinedValueXml(doc, 'Name', imageName);
    _addDefinedValueXml(doc, 'OS', typeOs);

    return doc.toString();
  } else {
    var jdoc = {
      Label: imageOptions.Label,
      MediaLink: mediaLink,
      Name: imageName,
      OS: typeOs
    };

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for buildAddDisk
* Use the specified serialization - for now only XML.
*
* @param {string} diskName      The name of the disk.
* @param {string} mediaLink     The mediaLink value.
* @param {object} diskOptions   The optional properties for the new disk.
* @param {object} client        The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildAddDisk = function(diskName, mediaLink, diskOptions, client) {
  if (!diskOptions) {
    diskOptions = {};
  }

  if (!diskOptions.Label) {
    diskOptions.Label = diskName;
  }

  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('Disk');

    // add required and optional elements in alpha order
    _addDefinedValueXml(doc, 'HasOperatingSystem', diskOptions.HasOperatingSystem);
    _addDefinedValueXml(doc, 'OS', diskOptions.OS); // OS is ignored if it comes after Label
    _addDefinedValueXml(doc, 'Label', diskOptions.Label);
    _addDefinedValueXml(doc, 'MediaLink', mediaLink);
    _addDefinedValueXml(doc, 'Name', diskName);
    
    return doc.toString();
  } else {
    var jdoc = {
      Name: diskName,
      MediaLink: mediaLink
    };

    if (diskOptions.HasOperatingSystem) {
      jdoc.HasOperatingSystem = diskOptions.HasOperatingSystem;
    }

    if (diskOptions.Label) {
      jdoc.Label = diskOptions.Label;
    }

    if (diskOptions.OS) {
      jdoc.OS = diskOptions.OS;
    }

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for CreateDeployment
* Use the specified serialization - for now only XML.
*
* @param {string} serviceName         The name of the service.
* @param {string} deploymentName      The name of the deployment.
* @param {object} vmRole              The properties for the new role.
* @param {object} deploymentOptions   The optional properties for the new deployment.
* @param {object} client              The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildCreateDeployment = function(serviceName, deploymentName,
                                                    vmRole, deploymentOptions, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('Deployment');
    _addDefinedValueXml(doc, 'Name', deploymentName);
    _addDefinedValueXml(doc, 'DeploymentSlot', deploymentOptions.DeploymentSlot);
    _addDefinedValueXml(doc, 'Label', new Buffer(deploymentOptions.Label).toString('base64'));
    _addDefinedNumericXml(doc, 'UpgradeDomainCount', deploymentOptions.UpgradeDomainCount);
    // must have 1 role
    var child = doc.ele('RoleList').ele('Role');
    this.roleParser.parse(roleSchema, vmRole, 'XML', child);
    // this should go after RoleList
    if (deploymentOptions.VirtualNetworkName) {
      _addDefinedValueXml(doc, 'VirtualNetworkName', deploymentOptions.VirtualNetworkName);
    }
    
    return doc.toString();
  } else {
    var jdoc = {
      Name: deploymentName
    };

    if (deploymentOptions.DeploymentSlot) {
      jdoc.DeploymentSlot = deploymentOptions.DeploymentSlot;
    }

    if (deploymentOptions.Label) {
      jdoc.Label = new Buffer(deploymentOptions.Label).toString('base64');
    }

    if (deploymentOptions.UpgradeDomainCount) {
      jdoc.UpgradeDomainCount = deploymentOptions.UpgradeDomainCount;
    }

    if (deploymentOptions.virtualNetworkName) {
      jdoc.VirtualNetworkName = deploymentOptions.VirtualNetworkName;
    }

    jdoc.RoleList = [];
    jdoc.RoleList[0] = this._buildPersistentVMRoleJson(vmRole);

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for AddRole
* Use the specified serialization - for now only XML.
*
* @param {string} serviceName       The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {object} vmRole            The properties for the new role.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildAddRole = function(serviceName, deploymentName,
                                                        vmRole, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('PersistentVMRole');
    this.roleParser.parse(roleSchema, vmRole, 'XML', doc);
    return doc.toString();
  } else {
    var jdoc = this._buildPersistentVMRoleJson(vmRole);
    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for ModifyRole
* Use the specified serialization - for now only XML.
*
* @param {string} serviceName       The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleName          The name of the role.
* @param {object} VMRole            The properties for the updated role.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildModifyRole = function(serviceName, deploymentName,
                                                    roleName, vmRole, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('Role');
    this._buildPersistentVMRoleXml(vmRole, doc);

    return doc.toString();
  } else {
    var jdoc = this._buildPersistentVMRoleJson(vmRole);
    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for AddDataDisk
* Use the specified serialization - for now only XML.
*
* @param {string} serviceName       The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleName          The name of the role.
* @param {object} datadisk          The properties for the new disk.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildAddDataDisk = function(serviceName, deploymentName,
                                                    roleName, datadisk, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('DataVirtualHardDisk');
    this._buildDataDiskXml(datadisk, doc);

    return doc.toString();
  } else {
    var jdoc = this._buildDataDiskJson(datadisk);
    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for ModifyDataDisk
* Use the specified serialization - for now only XML.
*
* @param {string} serviceName       The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleName          The name of the role.
* @param {number} Lun               The number for the disk.
* @param {object} datadisk          The properties for the updated disk.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildModifyDataDisk = function(serviceName, deploymentName,
                                                    roleName, lun, datadisk, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('DataVirtualHardDisk');
    this._buildDataDiskXml(datadisk, doc);

    return doc.toString();
  } else {
    var jdoc = this._buildDataDiskJson(datadisk);
    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for ShutdownRole
* Use the specified serialization - for now only XML.
*
* @param {string} serviceName       The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleName          The name of the role.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildShutdownRole = function(serviceName, deploymentName,
                                                    roleName, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('ShutdownRoleOperation');
    doc.ele('OperationType').txt('ShutdownRoleOperation');
    return doc.toString();
  } else {
    var jdoc = {};
    jdoc.OperationType = 'ShutdownRoleOperation';

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for StartRole
* Use the specified serialization - for now only XML.
*
* @param {string} serviceName       The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleName          The name of the role.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildStartRole = function(serviceName, deploymentName,
                                                    roleName, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('StartRoleOperation');
    doc.ele('OperationType').txt('StartRoleOperation');
    return doc.toString();
  } else {
    var jdoc = {};
    jdoc.OperationType = 'StartRoleOperation';

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for RestartRole
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName       The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleName          The name of the role instance.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildRestartRole = function(serviceName, deploymentName,
                                                    roleName, client) {
  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('RestartRoleOperation');
    doc.ele('OperationType').txt('RestartRoleOperation');
    return doc.toString();
  } else {
    var jdoc = {};
    jdoc.OperationType = 'RestartRoleOperation';

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for CaptureRole
*   Use the specified serialization - for now only XML
*
* @param {string} serviceName       The name of the service.
* @param {string} deploymentName    The name of the deployment.
* @param {string} roleName          The name of the role.
* @param {object} captureOptions    The options for the capture operation.
* @param {object} client            The servicemanagement object.
*/
ServiceManagementSerialize.prototype.buildCaptureRole = function(serviceName, deploymentName,
                                                    roleName, captureOptions, client) {
  if (client.serializetype === 'XML') {

    var doc = _createXmlRoot('CaptureRoleOperation');
    doc.ele('OperationType').txt('CaptureRoleOperation');
    _addDefinedValueXml(doc, 'PostCaptureAction', captureOptions.PostCaptureAction);

    if (captureOptions.WindowsProvisioningConfigurationSet) {
      this._buildWindowsProvisioningConfigurationXml(captureOptions.WindowsProvisioningConfigurationSet, doc);
    } else if (captureOptions.LinuxProvisioningConfigurationSet) {
      this._buildLinuxProvisioningConfigurationXml(captureOptions.LinuxProvisioningConfigurationSet, doc);
    }

    _addDefinedValueXml(doc, 'TargetImageLabel', captureOptions.TargetImageLabel);
    _addDefinedValueXml(doc, 'TargetImageName', captureOptions.TargetImageName);

    return doc.toString();
  } else {
    var jdoc = {
      OperationType: 'CaptureRoleOperation'
    };

    if (captureOptions.PostCaptureAction) {
      jdoc.PostCaptureAction = captureOptions.PostCaptureAction;
    }

    if (captureOptions.WindowsProvisioningConfigurationSet) {
      jdoc.WindowsProvisioningConfigurationSet = this._buildWindowsProvisioningConfigurationJson(captureOptions.WindowsProvisioningConfigurationSet);
    } else if (captureOptions.LinuxProvisioningConfigurationSet) {
      jdoc.LinuxProvisioningConfigurationSet = this._buildLinuxProvisioningConfigurationJson(captureOptions.LinuxProvisioningConfigurationSet);
    }

    if (captureOptions.TargetImageLabel) {
      jdoc.TargetImageLabel = captureOptions.TargetImageLabel;
    }

    if (captureOptions.TargetImageName) {
      jdoc.TargetImageName = captureOptions.TargetImageName;
    }

    return JSON.stringify(jdoc);
  }
};

/**
* Create the message body for addCertificate
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} data                  Certificate data. Required.
* @param {string} format                Certificate format. Requred.
* @param {string} password              Certificate password. Requred.
*/
ServiceManagementSerialize.prototype.buildAddCertificate = function(serviceName, data, format, password, client) {
  var encData = new Buffer(data).toString('base64');

  if (client.serializetype === 'XML') {
    var doc = _createXmlRoot('CertificateFile');
    _addDefinedValueXml(doc, 'Data', encData);
    _addDefinedValueXml(doc, 'CertificateFormat', format);

    if (password) {
      _addDefinedValueXml(doc, 'Password', password);
    }

    return doc.toString();
  } else {
    var jdoc = {
      Data: encData,
      CertificateFormat: format
    };

    if (password) {
      jdoc.Password = password;
    }

    return JSON.stringify(jdoc);
  }
};


/* functions after this build sections that may be inserted as part of a message body */


/**
* Add a VM Role node tree to the specifed node
*   returns xmlbuilder node object
*
* @param {object} vmRole    The Role object properties.
* @param {object} node      The XML parent node.
*/
ServiceManagementSerialize.prototype._buildPersistentVMRoleXml = function(vmRole, node) {
  var child;
  var cfgsets;
  var inst;
  var alen;
  var i;

  _addDefinedValueXml(node, 'RoleName', vmRole.RoleName);
  _addDefinedValueXml(node, 'RoleType', vmRole.RoleType);

  if (vmRole.ConfigurationSets) {
    cfgsets = node.ele('ConfigurationSets');
    for (i = 0; i < vmRole.ConfigurationSets.length; i++) {
      if (vmRole.ConfigurationSets[i].ConfigurationSetType === 'WindowsProvisioningConfiguration') {
        this._buildWindowsProvisioningConfigurationXml(vmRole.ConfigurationSets[i], cfgsets);
      }
      if (vmRole.ConfigurationSets[i].ConfigurationSetType === 'LinuxProvisioningConfiguration') {
        this._buildLinuxProvisioningConfigurationXml(vmRole.ConfigurationSets[i], cfgsets);
      }
      if (vmRole.ConfigurationSets[i].ConfigurationSetType === 'NetworkConfiguration') {
        this._buildNetworkConfigurationXml(vmRole.ConfigurationSets[i], cfgsets);
      }
    }
  }

  _addDefinedValueXml(node, 'AvailabilitySetName', vmRole.AvailabilitySetName);

  if (vmRole.DataVirtualHardDisks) {
    child = node.ele('DataVirtualHardDisks');
    alen = vmRole.DataVirtualHardDisks.length;

    for (i = 0; i < alen; i++) {
      inst = child.ele('DataVirtualHardDisk');
      this._buildDataDiskXml(vmRole.DataVirtualHardDisks[i], inst);
    }
  }

  if (vmRole.OSVirtualHardDisk) {
    child = node.ele('OSVirtualHardDisk');
    this._buildOSDiskXml(vmRole.OSVirtualHardDisk, child);
  }

  _addDefinedValueXml(node, 'RoleSize', vmRole.RoleSize);
};

/**
* Get a VM Role object from input.
* May return same object or a modified object.
*
* @param {object} vmRole    The Role object properties.
*/
ServiceManagementSerialize.prototype._buildPersistentVMRoleJson = function(vmRole) {
  return vmRole;
};

/**
* Add OSDisk properties to the specifed node.
* returns xmlbuilder node object.
*
* @param {object} osDisk    The OSDisk object properties.
* @param {object} node      The XML parent node.
*/
ServiceManagementSerialize.prototype._buildOSDiskXml = function(osDisk, node) {
  _addDefinedValueXml(node, 'HostCaching', osDisk.HostCaching);
  _addDefinedValueXml(node, 'DiskLabel', osDisk.DiskLabel);
  _addDefinedValueXml(node, 'DiskName', osDisk.DiskName);
  _addDefinedValueXml(node, 'MediaLink', osDisk.MediaLink);
  _addDefinedValueXml(node, 'SourceImageName', osDisk.SourceImageName);

  return node;
};

/**
* Get OSDisk object from input.
* May return same object or a modified object.
*
* @param {object} osDisk    The OSDisk object properties.
*/
ServiceManagementSerialize.prototype._buildOSDiskJson = function(osDisk) {
  return osDisk;
};

/**
* Add DataDisk properties to the specifed node
*   returns xmlbuilder node object
*
* @param {object} dataDisk    The DataDisk object properties.
* @param {object} node        The XML parent node.
*/
ServiceManagementSerialize.prototype._buildDataDiskXml = function(dataDisk, node) {
  _addDefinedValueXml(node, 'HostCaching', dataDisk.HostCaching);
  _addDefinedValueXml(node, 'DiskLabel', dataDisk.DiskLabel);
  _addDefinedValueXml(node, 'DiskName', dataDisk.DiskName);
  _addDefinedNumericXml(node, 'Lun', dataDisk.Lun);
  _addDefinedValueXml(node, 'LogicalDiskSizeInGB', dataDisk.LogicalDiskSizeInGB);
  _addDefinedValueXml(node, 'MediaLink', dataDisk.MediaLink);
  _addDefinedValueXml(node, 'SourceMediaLink', dataDisk.SourceMediaLink);
  return node;
};

/**
* Get DataDisk object from input.
* May return same object or a modified object.
*
* @param {object} dataDisk    The DataDisk object properties.
*/
ServiceManagementSerialize.prototype._buildDataDiskJson = function(dataDisk) {
  return dataDisk;
};

/**
* Add WindowsProvisioningConfiguration properties to the specifed node.
*   returns xmlbuilder node object
*
* @param {object} cfgset    The WindowsProvisioningConfiguration object properties.
* @param {object} node      The XML parent node.
*/
ServiceManagementSerialize.prototype._buildWindowsProvisioningConfigurationXml = function(cfgset, node) {
  var child = node.ele('ConfigurationSet');
  child.ele('ConfigurationSetType').txt('WindowsProvisioningConfiguration');
  _addDefinedValueXml(child, 'ComputerName', cfgset.ComputerName);
  _addDefinedValueXml(child, 'AdminPassword', cfgset.AdminPassword);
  _addDefinedValueXml(child, 'ResetPasswordOnFirstLogon', cfgset.ResetPasswordOnFirstLogon);
  _addDefinedValueXml(child, 'EnableAutomaticUpdate', cfgset.EnableAutomaticUpdate);
  _addDefinedValueXml(child, 'TimeZone', cfgset.TimeZone);

  if (cfgset.DomainJoin) {
    var domj = child.ele('DomainJoin');

    if (cfgset.DomainJoin.Credentials) {
      var cred = domj.ele('Credentials');
      _addDefinedValueXml(cred, 'Domain', cfgset.DomainJoin.Credentials.Domain);
      _addDefinedValueXml(cred, 'Username', cfgset.DomainJoin.Credentials.Username);
      _addDefinedValueXml(cred, 'Password', cfgset.DomainJoin.Credentials.Password);
    }

    _addDefinedValueXml(domj, 'JoinDomain', cfgset.DomainJoin.JoinDomain);
    _addDefinedValueXml(domj, 'MachineObjectOU', cfgset.DomainJoin.MachineObjectOU);
  }

  if (cfgset.StoredCertificateSettings) {
    var cset = child.ele('StoredCertificateSettings');
    _addDefinedValueXml(cset, 'StoreLocation', cfgset.StoredCertificateSettings.StoreLocation);
    _addDefinedValueXml(cset, 'StoreName', cfgset.StoredCertificateSettings.StoreName);
    _addDefinedValueXml(cset, 'Thumbprint', cfgset.StoredCertificateSettings.Thumbprint);
  }
};

/**
* Get WindowsProvisioningConfiguration object from input.
* May return same object or a modified object.
*
* @param {object} cfgset    The WindowsProvisioningConfiguration object properties.
*/
ServiceManagementSerialize.prototype._buildWindowsProvisioningConfigurationJson = function(cfgset) {
  return cfgset;
};

/**
* Add LinuxProvisioningConfiguration properties to the specifed node.
*   returns xmlbuilder node object
*
* @param {object} cfgset    The LinuxProvisioningConfiguration object properties.
* @param {object} node    The XML parent node.
*/
ServiceManagementSerialize.prototype._buildLinuxProvisioningConfigurationXml = function(cfgset, node) {
  var alen;
  var i;
  var child = node.ele('ConfigurationSet');
  child.ele('ConfigurationSetType').txt('LinuxProvisioningConfiguration');
  _addDefinedValueXml(child, 'HostName', cfgset.HostName);
  _addDefinedValueXml(child, 'UserName', cfgset.UserName);
  _addDefinedValueXml(child, 'UserPassword', cfgset.UserPassword);

  if (cfgset.DisableSshPasswordAuthentication === true) {
    _addDefinedValueXml(child, 'DisableSshPasswordAuthentication', 'true');
  } else if (cfgset.DisableSshPasswordAuthentication === false) {
    _addDefinedValueXml(child, 'DisableSshPasswordAuthentication', 'false');
  }

  if (cfgset.SSH) {
    var ssh = child.ele('SSH');
    if (cfgset.SSH.PublicKeys) {
      var pubks = ssh.ele('PublicKeys');
      alen = cfgset.SSH.PublicKeys.length;

      for (i = 0; i < alen; i++) {
        var pubk = pubks.ele('PublicKey');
        _addDefinedValueXml(pubk, 'Fingerprint', cfgset.SSH.PublicKeys[i].Fingerprint);
        _addDefinedValueXml(pubk, 'Path', cfgset.SSH.PublicKeys[i].Path);
      }
    }

    if (cfgset.SSH.KeyPairs) {
      var keypairs = ssh.ele('KeyPairs');
      alen = cfgset.SSH.KeyPairs.length;

      for (i = 0; i < alen; i++) {
        var keyp = keypairs.ele('KeyPair');
        _addDefinedValueXml(keyp, 'Fingerprint', cfgset.SSH.KeyPairs[i].Fingerprint);
        _addDefinedValueXml(keyp, 'Path', cfgset.SSH.KeyPairs[i].Path);
      }
    }
  }
};

/**
* Get LinuxProvisioningConfiguration object from input
*   May return same object or a modified object
*
* @param {object} cfgset    The LinuxProvisioningConfiguration object properties.
*/
ServiceManagementSerialize.prototype._buildLinuxProvisioningConfigurationJson = function(cfgset) {
  return cfgset;
};

/**
* Add NetworkConfiguration properties to the specifed node
*   returns xmlbuilder node object
*
* @param {object} cfgset    The NetworkConfiguration object properties.
* @param {object} node      The XML parent node.
*/
ServiceManagementSerialize.prototype._buildNetworkConfigurationXml = function(cfgset, node) {
  var child = node.ele('ConfigurationSet');
  child.ele('ConfigurationSetType').txt('NetworkConfiguration');
  if (cfgset.InputEndpoints) {
    var ends = child.ele('InputEndpoints');
    this._buildInputEndpointsXml(cfgset, ends);
  }

  if (cfgset.SubnetNames) {
    var subs = node.ele('SubnetNames');
    var alen = cfgset.SubnetNames.length;

    for (var i = 0; i < alen; i++) {
      _addDefinedValueXml(subs, 'string', cfgset.SubnetNames[i].string);
    }
  }
};

/**
* Get NetworkConfiguration object from input
*   May return same object or a modified object
*
* @param {object} cfgset    The NetworkConfiguration object properties.
*/
ServiceManagementSerialize.prototype._buildNetworkConfigurationJson = function(cfgset) {
  return cfgset;
};

/**
* Add InputEndpoints properties to the specifed node
*   returns xmlbuilder node object
*
* @param {object} cfgset    An array of InputEndpoints object properties.
* @param {object} node      The XML parent node.
*/
ServiceManagementSerialize.prototype._buildInputEndpointsXml = function(cfgset, node) {
  var alen = cfgset.InputEndpoints.length;

  for (var i = 0; i < alen; i++) {
    var endp = cfgset.InputEndpoints[i];
    var child = node.ele('InputEndpoint');
    _addDefinedValueXml(child, 'EnableDirectServerReturn', endp.EnableDirectServerReturn);
    _addDefinedValueXml(child, 'LoadBalancedEndpointSetName', endp.LoadBalancedEndpointSetName);
    _addDefinedValueXml(child, 'LocalPort', endp.LocalPort);
    _addDefinedValueXml(child, 'Name', endp.Name);
    _addDefinedValueXml(child, 'Port', endp.Port);

    if (endp.LoadBalancerProbe) {
      var probe = child.ele('LoadBalancerProbe');
      _addDefinedValueXml(probe, 'Path', endp.LoadBalancerProbe.Path);
      _addDefinedValueXml(probe, 'Port', endp.LoadBalancerProbe.Port);
      _addDefinedValueXml(probe, 'Protocol', endp.LoadBalancerProbe.Protocol);
    }
    _addDefinedValueXml(child, 'Protocol', endp.Protocol);
  }
};

/**
* Add InputEndpoints properties to the specifed node
* Get InputEndpoints object from input
*   May return same object or a modified object
*
* @param {object} cfgset    An array of InputEndpoints object properties.
*/
ServiceManagementSerialize.prototype._buildInputEndpointsJson = function(cfgset) {
  return cfgset;
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
*
* @param {object} node        The XML parent node.
* @param {string} elename     The XML element name.
* @param {string} value       The value for the new node.
*/
function _addDefinedValueXml(node, elename, value) {
  if (value) {
    node.ele(elename).txt(value);
  }
}

/**
* Add an element to the node if the value is a number
*   note: using _addDefinedValueXml will fail if value is 0
*
* @param {object} node        The XML parent node.
* @param {string} elename     The XML element name.
* @param {string} value       The value for the new node.
*/
function _addDefinedNumericXml(node, elename, value) {
  if (typeof value === 'number') {
    node.ele(elename).txt(value);
  }
}
