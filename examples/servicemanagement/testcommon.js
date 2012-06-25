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

exports.showErrorResponse = showErrorResponse;
exports.showDeployment = showDeployment;
exports.showRole = showRole;
exports.showDataDisk = showDataDisk;
exports.showNetworkConfigEndpoints = showNetworkConfigEndpoints;
exports.showExternalEndpoint = showExternalEndpoint;
exports.showInputEndpoint = showInputEndpoint;
exports.showOSImage = showOSImage;
exports.showDisk = showDisk;


function showErrorResponse(error) {
  console.log('There was an error response from the service');
  console.log('Error Code=' + error.code);
  console.log('Error Message=' + error.message);
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
  if (rsp.RoleInstanceList) {
    var roleinst = rsp.RoleInstanceList;
    if (rsp.RoleInstanceList instanceof Array) {
      roleinst = rsp.RoleInstanceList;
    } else if (rsp.RoleInstanceList.RoleInstance) {
      roleinst = rsp.RoleInstanceList.RoleInstance;
    }
    if (roleinst instanceof Array) {
      for (var ri = 0; ri < roleinst.length; ri++) {
        showRoleInst(roleinst[ri]);
      }
    } else {
      showRoleInst(roleinst);
    }
  }
  if (rsp.RoleList) {
    var role = rsp.RoleList.Role;
    if (rsp.RoleList instanceof Array) {
      role = rsp.RoleList;
    }
    if (role instanceof Array) {
      for (var r = 0; r < role.length; r++) {
        console.log('Role: ');
        showRole(role[r]);
      }
    } else {
      console.log('Role: ');
      showRole(role);
    }
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
}

function showRoleInst(roleinst) {
  console.log('RoleInstance: ');
  console.log('  RoleName: ' + roleinst.RoleName);
  console.log('  InstanceName: ' + roleinst.InstanceName);
  console.log('  InstanceStatus: ' + roleinst.InstanceStatus);
  console.log('  InstanceUpgradeDomain: ' + roleinst.InstanceUpgradeDomain);
  console.log('  InstanceFaultDomain: ' + roleinst.InstanceFaultDomain);
  console.log('  InstanceSize: ' + roleinst.InstanceSize);
  console.log('  IpAddress: ' + roleinst.IpAddress);
}

function showRole(role) {
  console.log('  RoleName: ' + role.RoleName);
  console.log('  RoleType: ' + role.RoleType);
  console.log('  RoleSize: ' + role.RoleSize);
  console.log('  OsVersion: ' + role.OsVersion);
  console.log('  ConfigurationSets:');
  var cfgsets = role.ConfigurationSets.ConfigurationSet;
  if (role.ConfigurationSets instanceof Array) {
    cfgsets = role.ConfigurationSets;
  }
  if (cfgsets instanceof Array) {
    var len = cfgsets.length;
    for (var i = 0; i < len; i++) {
      console.log('    ConfigurationSetType: ' + cfgsets[i].ConfigurationSetType);
      showNetworkConfigEndpoints(cfgsets[i]);
    }
  } else if (cfgsets) {
    console.log('    ConfigurationSetType: ' + cfgsets.ConfigurationSetType);
    showNetworkConfigEndpoints(cfgsets);
  }
  if (role.DataVirtualHardDisks) {
    var datadisks = role.DataVirtualHardDisks.DataVirtualHardDisk;
    console.log('  DataVirtualHardDisks:');
    if (role.DataVirtualHardDisks instanceof Array) {
      datadisks = role.DataVirtualHardDisks;
    }
    if (datadisks instanceof Array) {
      var len = datadisks.length;
      for (var i = 0; i < len; i++) {
        showDataDisk(datadisks[i]);
      }
    } else if (datadisks) {
      showDataDisk(datadisks);
    }
  }
  console.log('  OSVirtualHardDisk: ');
  console.log('    HostCaching: ' + role.OSVirtualHardDisk.HostCaching);
  console.log('    DiskName: ' + role.OSVirtualHardDisk.DiskName);
  console.log('    DiskLabel: ' + role.OSVirtualHardDisk.DiskLabel);
  console.log('    MediaLink: ' + role.OSVirtualHardDisk.MediaLink);
  console.log('    SourceImageName: ' + role.OSVirtualHardDisk.SourceImageName);
  console.log('    OS: ' + role.OSVirtualHardDisk.OS);
}

function showDataDisk(datadisk) {
  console.log('    DataVirtualHardDisk:');
  console.log('      HostCaching: ' + datadisk.HostCaching);
  console.log('      DiskName: ' + datadisk.DiskName);
  console.log('      DiskLabel: ' + datadisk.DiskLabel);
  console.log('      LogicalDiskSizeInGB: ' + datadisk.LogicalDiskSizeInGB);
  console.log('      Lun: ' + datadisk.Lun);
  console.log('      MediaLink: ' + datadisk.MediaLink);
}

function showNetworkConfigEndpoints(configset) {
  if (configset.ConfigurationSetType == 'NetworkConfiguration') {
    if (configset.SubnetNames instanceof Array) {
      console.log('  SubnetNames: ');
      var len = configset.SubnetNames.length;
      for (var i = 0; i < len; i++) {
        console.log('    SubnetName: ' + configset.SubnetNames[i]);
      }
    }
    var endpoints = configset.InputEndpoints;
    if (endpoints) {
      console.log('    InputEndpoints: ');
      if (endpoints instanceof Array) {
        var elen = endpoints.length;
        for (var e = 0; e < elen; e++) {
          showInputEndpoint(endpoints[e]);
        }
      } else if (endpoints) {
        showInputEndpoint(endpoints);
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
  console.log('        LocalPort: ' + endpoint.LocalPort);
  console.log('        Name: ' + endpoint.Name);
  console.log('        Port: ' + endpoint.Port);
  console.log('        Protocol: ' + endpoint.Protocol);
}

function showOSImage(image) {
  console.log('  affinityGroup = ' + image.AffinityGroup);
  console.log('  category = ' + image.Category);
  console.log('  label = ' + image.Label);
  console.log('  location = ' + image.Location);
  console.log('  LogicalSizeInGB = ' + image.LogicalSizeInGB);
  console.log('  mediaLink = ' + image.MediaLink);
  console.log('  name = ' + image.Name);
  console.log('  OS = ' + image.OS);
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
