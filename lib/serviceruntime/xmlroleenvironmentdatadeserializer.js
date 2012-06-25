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

// Module dependencies.
var Constants = require('../util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

// Expose 'XmlRoleEnvironmentDataDeserializer'.
exports = module.exports = XmlRoleEnvironmentDataDeserializer;

function XmlRoleEnvironmentDataDeserializer() { }

XmlRoleEnvironmentDataDeserializer.prototype.deserialize = function (xml) {
  var configurationSettings = this._translateConfigurationSettings(xml);
  var localResources = this._translateLocalResources(xml);
  var currentInstance = this._translateCurrentInstance(xml);
  var isEmulated = xml[ServiceRuntimeConstants.DEPLOYMENT][Constants.XML_METADATA_MARKER][ServiceRuntimeConstants.EMULATED] === 'true';
  var deploymentId = xml[ServiceRuntimeConstants.DEPLOYMENT][Constants.XML_METADATA_MARKER][ServiceRuntimeConstants.DEPLOYMENT_ID];
  var roles = this._translateRoles(xml, currentInstance, currentInstance.roleName);

  var roleEnvironmentData = {
    id: deploymentId,
    isEmulated: isEmulated,
    configurationSettings: configurationSettings,
    localResources: localResources,
    currentInstance: currentInstance,
    roles: roles
  };

  return roleEnvironmentData;
};

XmlRoleEnvironmentDataDeserializer.prototype._translateConfigurationSettings = function (xml) {
  var configurationSettingsMap = {};

  if (xml[ServiceRuntimeConstants.CURRENT_INSTANCE] &&
      xml[ServiceRuntimeConstants.CURRENT_INSTANCE][ServiceRuntimeConstants.CONFIGURATION_SETTINGS] &&
      xml[ServiceRuntimeConstants.CURRENT_INSTANCE][ServiceRuntimeConstants.CONFIGURATION_SETTINGS][ServiceRuntimeConstants.CONFIGURATION_SETTING]) {

    var configurationSettings = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][ServiceRuntimeConstants.CONFIGURATION_SETTINGS][ServiceRuntimeConstants.CONFIGURATION_SETTING];
    if (!Array.isArray(configurationSettings)) {
      configurationSettings = [configurationSettings];
    }

    for (var configurationSetting in configurationSettings) {
      var currentConfigurationSetting = configurationSettings[configurationSetting];
      configurationSettingsMap[currentConfigurationSetting[Constants.XML_METADATA_MARKER].name] = currentConfigurationSetting[Constants.XML_METADATA_MARKER].value;
    }
  }

  return configurationSettingsMap;
};

XmlRoleEnvironmentDataDeserializer.prototype._translateLocalResources = function (xml) {
  var localResourcesMap = {};

  if (xml[ServiceRuntimeConstants.CURRENT_INSTANCE] &&
      xml[ServiceRuntimeConstants.CURRENT_INSTANCE][ServiceRuntimeConstants.LOCAL_RESOURCES] &&
      xml[ServiceRuntimeConstants.CURRENT_INSTANCE][ServiceRuntimeConstants.LOCAL_RESOURCES][ServiceRuntimeConstants.LOCAL_RESOURCE]) {

    var localResources = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][ServiceRuntimeConstants.LOCAL_RESOURCES][ServiceRuntimeConstants.LOCAL_RESOURCE];
    if (!Array.isArray(localResources)) {
      localResources = [localResources];
    }

    for (var localResource in localResources) {
      var currentLocalResource = localResources[localResource];
      var currentLocalResourceName = currentLocalResource[Constants.XML_METADATA_MARKER].name;

      localResourcesMap[currentLocalResourceName] = currentLocalResource[Constants.XML_METADATA_MARKER];
    }
  }

  return localResourcesMap;
};

XmlRoleEnvironmentDataDeserializer.prototype._translateCurrentInstance = function (xml) {
  var currentInstance = {};

  currentInstance.id = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][Constants.XML_METADATA_MARKER].id;
  currentInstance.roleName = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][Constants.XML_METADATA_MARKER].roleName;
  currentInstance.faultDomain = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][Constants.XML_METADATA_MARKER].faultDomain;
  currentInstance.updateDomain = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][Constants.XML_METADATA_MARKER].updateDomain;

  if (xml[ServiceRuntimeConstants.CURRENT_INSTANCE][ServiceRuntimeConstants.ENDPOINTS]) {
    currentInstance.endpoints = this._translateRoleInstanceEndpoints(xml[ServiceRuntimeConstants.CURRENT_INSTANCE][ServiceRuntimeConstants.ENDPOINTS]);

    for (var endpoint in currentInstance.endpoints) {
      currentInstance.endpoints[endpoint].roleInstanceId = currentInstance.id;
    }
  } else {
    currentInstance.endpoints = {};
  }

  return currentInstance;
};

XmlRoleEnvironmentDataDeserializer.prototype._translateRoles = function (xml, currentInstance, currentRole) {
  var rolesMap = {};
  var roleInstances;

  if (xml[ServiceRuntimeConstants.ROLES] &&
      xml[ServiceRuntimeConstants.ROLES][ServiceRuntimeConstants.ROLE]) {

    var roles = xml[ServiceRuntimeConstants.ROLES][ServiceRuntimeConstants.ROLE];
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    for (var role in roles) {
      var currentIterationRole = roles[role];
      var currentIterationRoleName = currentIterationRole[Constants.XML_METADATA_MARKER].name;
      roleInstances = this._translateRoleInstances(currentIterationRole);

      if (currentIterationRoleName === currentRole) {
        roleInstances[currentInstance.id] = currentInstance;
      }

      for (var roleInstance in roleInstances) {
        roleInstances[roleInstance].roleName = currentIterationRoleName;
      }

      rolesMap[currentIterationRoleName] = {
        name: currentIterationRoleName,
        instances: roleInstances
      };
    }
  }

  if (!rolesMap[currentRole]) {
    roleInstances = {};

    roleInstances[currentInstance.id] = currentInstance;

    currentInstance.roleName = currentRole;

    rolesMap[currentRole] = {
      name: currentRole,
      instances: roleInstances
    };
  }

  return rolesMap;
};

XmlRoleEnvironmentDataDeserializer.prototype._translateRoleInstances = function (xml) {
  var roleInstancesMap = {};

  if (xml[ServiceRuntimeConstants.INSTANCES] &&
      xml[ServiceRuntimeConstants.INSTANCES][ServiceRuntimeConstants.INSTANCE]) {

    var instances = xml[ServiceRuntimeConstants.INSTANCES][ServiceRuntimeConstants.INSTANCE];
    if (!Array.isArray(instances)) {
      instances = [instances];
    }

    for (var instance in instances) {
      var currentIterationInstance = instances[instance];
      var currentIterationInstanceId = currentIterationInstance[Constants.XML_METADATA_MARKER].id;

      var endpoints = this._translateRoleInstanceEndpoints(currentIterationInstance[ServiceRuntimeConstants.ENDPOINTS]);

      for (var endpoint in endpoints) {
        endpoints[endpoint].roleInstanceId = currentIterationInstanceId;
      }

      currentIterationInstance[Constants.XML_METADATA_MARKER].endpoints = endpoints;

      roleInstancesMap[currentIterationInstanceId] = currentIterationInstance[Constants.XML_METADATA_MARKER];
    }
  }

  return roleInstancesMap;
};

XmlRoleEnvironmentDataDeserializer.prototype._translateRoleInstanceEndpoints = function (endpointsXml) {
  var endpointsMap = {};

  if (endpointsXml &&
      endpointsXml[ServiceRuntimeConstants.ENDPOINT]) {

    var endpoints = endpointsXml[ServiceRuntimeConstants.ENDPOINT];
    if (!Array.isArray(endpoints)) {
      endpoints = [endpoints];
    }

    for (var endpoint in endpoints) {
      var currentEndpoint = endpoints[endpoint];
      var currentEndpointName = currentEndpoint[Constants.XML_METADATA_MARKER].name;

      endpointsMap[currentEndpointName] = currentEndpoint[Constants.XML_METADATA_MARKER];
    }
  }

  return endpointsMap;
};