
exports.showErrorResponse = showErrorResponse;
exports.showDeployment = showDeployment;
exports.showRole = showRole;
exports.showDataDisk = showDataDisk;
exports.showNetworkConfigEndpoints = showNetworkConfigEndpoints;
exports.showExternalEndpoint = showExternalEndpoint;
exports.showInputEndpoint = showInputEndpoint;
exports.showOSImage = showOSImage;
exports.showDisk = showDisk;


function showErrorResponse(rsp) {
  console.log('There was an error response from the service');
  console.log('status code=' + rsp.response.statusCode);
  console.log('Error Code=' + rsp.error.code);
  console.log('Error Message=' + rsp.error.message);
}

function showDeployment(rsp) {
  console.log('Name: ' + rsp.Name);
  console.log('DeploymentSlot:' + rsp.DeploymentSlot);
  console.log('Status: ' + rsp.Status);
  console.log('PrivateID: ' + rsp.PrivateID);
  console.log('Label: ' + rsp.Label);
  console.log('UpgradeDomainCount: ' + rsp.UpgradeDomainCount);
  console.log('SdkVersion: ' + rsp.SdkVersion);
  console.log('URL: ' + rsp.Url);
  console.log('Configuration: ' + rsp.Configuration);
  console.log('Locked: ' + rsp.Locked);
  console.log('RollbackAllowed: ' + rsp.RollbackAllowed);
  var roleinst = rsp.RoleInstanceList.RoleInstance;
  console.log('RoleInstance: ');
  console.log('  RoleName: ' + roleinst.RoleName);
  console.log('  InstanceName: ' + roleinst.InstanceName);
  console.log('  InstanceStatus: ' + roleinst.InstanceStatus);
  console.log('  InstanceUpgradeDomain: ' + roleinst.InstanceUpgradeDomain);
  console.log('  InstanceFaultDomain: ' + roleinst.InstanceFaultDomain);
  console.log('  InstanceSize: ' + roleinst.InstanceSize);
  console.log('  IpAddress: ' + roleinst.IpAddress);
  var role = rsp.RoleList.Role;
  console.log('Role: ');
  showRole(role);
  if (rsp.InputEndpointList) {
    console.log('  InputEndpointList: ');
    var endpoints = rsp.InputEndpointList
    if (endpoints.InputEndpoint instanceof Array) {
      var len = endpoints.InputEndpoint.length;
      for (var i = 0; i < len; i++) {
        showInputEndpoint(endpoints.InputEndpoint[i]);
      }
    } else if (endpoints) {
      showInputEndpoint(endpoints.InputEndpoint);
    }
  }
}

function showRole(role) {
  console.log('  RoleName: ' + role.RoleName);
  console.log('  RoleType: ' + role.RoleType);
  console.log('  RoleSize: ' + role.RoleSize);
  console.log('  OsVersion: ' + role.OsVersion);
  if (role.SubnetNames instanceof Array) {
    console.log('  SubnetNames: ');
    var len = role.SubnetNames.length;
    for (var i = 0; i < len; i++) {
      console.log('    SubnetName: ' + role.SubnetNames[i]);
    }
  }
  console.log('  ConfigurationSets:');
  if (role.ConfigurationSets.ConfigurationSet instanceof Array) {
    var len = role.ConfigurationSets.length;
    for (var i = 0; i < len; i++) {
      console.log('    ConfigurationSetType: ' + role.ConfigurationSets.ConfigurationSet[i].ConfigurationSetType);
      showNetworkConfigEndpoints(role.ConfigurationSets.ConfigurationSet[i]);
    }
  } else if (role.ConfigurationSets) {
    console.log('    ConfigurationSetType: ' + role.ConfigurationSets.ConfigurationSet.ConfigurationSetType);
    showNetworkConfigEndpoints(role.ConfigurationSets.ConfigurationSet);
  }
  if (role.DataDisks) {
    console.log('  DataDisks:');
    if (role.DataDisks.DataDisk instanceof Array) {
      var len = role.DataDisks.DataDisk.length;
      for (var i = 0; i < len; i++) {
        showDataDisk(role.DataDisks.DataDisk[i]);
      }
    } else if (role.DataDisks.DataDisk) {
      showDataDisk(role.DataDisks.DataDisk);
    }
  }
  console.log('  OSDisk: ');
  console.log('    DisableWriteCache: ' + role.OSDisk.DisableWriteCache);
  console.log('    DiskName: ' + role.OSDisk.DiskName);
  console.log('    MediaLink: ' + role.OSDisk.MediaLink);
  console.log('    SourceImageName: ' + role.OSDisk.SourceImageName);
}

function showDataDisk(datadisk) {
  console.log('    DataDisk:');
  console.log('      DisableReadCache: ' + datadisk.DisableReadCache);
  console.log('      DiskName: ' + datadisk.DiskName);
  console.log('      EnableWriteCache: ' + datadisk.EnableWriteCache);
  console.log('      LogicalDiskSizeInGB: ' + datadisk.LogicalDiskSizeInGB);
  console.log('      LUN: ' + datadisk.LUN);
  console.log('      MediaLink: ' + datadisk.MediaLink);
}

function showNetworkConfigEndpoints(configset) {
  if (configset.ConfigurationSetType == 'NetworkConfiguration') {
    var endpoints = configset.InputEndpoints;
    if (endpoints) {
      console.log('    InputEndpoints: ');
      if (endpoints.ExternalEndpoint instanceof Array) {
        var elen = endpoints.ExternalEndpoint.length;
        for (var e = 0; e < elen; e++) {
          showExternalEndpoint(endpoints.ExternalEndpoint[e]);
        }
      } else if (endpoints.ExternalEndpoint) {
        showExternalEndpoint(endpoints.ExternalEndpoint);
      }
    }
  }
}

function showExternalEndpoint(endpoint) {
  console.log('      ExternalEndpoint: ');
  console.log('        LocalPort: ' + endpoint.LocalPort);
  console.log('        Name: ' + endpoint.Name);
  console.log('        Port: ' + endpoint.Port);
  console.log('        Protocol: ' + endpoint.Protocol);
}

function showInputEndpoint(endpoint) {
  console.log('    InputEndpoint: ');
  console.log('      RoleName: ' + endpoint.RoleName);
  console.log('      Vip: ' + endpoint.Vip);
  console.log('      Port: ' + endpoint.Port);
}

function showOSImage(image) {
  console.log('  category = ' + image.Category);
  console.log('  label = ' + image.Label);
  console.log('  location = ' + image.Location);
  console.log('  mediaLink = ' + image.MediaLink);
  console.log('  name = ' + image.Name);
  console.log('  role size = ' + image.RoleSize);
  console.log('  SupportsStatelessDeployment = ' + image.SupportsStatelessDeployment);
}

function showDisk(disk) {
  if (disk.AttachedTo) {
    console.log('  AttachedTo');
    console.log('    DeploymentName = ' + disk.AttachedTo.DeploymentName);
    console.log('    HostedServiceName = ' + disk.AttachedTo.HostedServiceName);
    console.log('    RoleName = ' + disk.AttachedTo.RoleName);
  }
  console.log('  HasOperatingSystem = ' + disk.HasOperatingSystem);
  console.log('  Location = ' + disk.Location);
  console.log('  MediaLink = ' + disk.MediaLink);
  console.log('  Name = ' + disk.Name);
  console.log('  SourceImageName = ' + disk.SourceImageName);
}
