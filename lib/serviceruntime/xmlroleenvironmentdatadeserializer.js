// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

// Module dependencies.
var _ = require('underscore');

var azureCommon = require('azure-common');
var Constants = azureCommon.Constants;
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

function XmlRoleEnvironmentDataDeserializer() { }

XmlRoleEnvironmentDataDeserializer.prototype.deserialize = function (xml) {
  var configurationSettings = this._translateConfigurationSettings(xml[ServiceRuntimeConstants.ROLE_ENVIRONMENT]);
  var localResources = this._translateLocalResources(xml[ServiceRuntimeConstants.ROLE_ENVIRONMENT]);
  var currentInstance = this._translateCurrentInstance(xml[ServiceRuntimeConstants.ROLE_ENVIRONMENT]);
  var isEmulated = xml[ServiceRuntimeConstants.ROLE_ENVIRONMENT][ServiceRuntimeConstants.DEPLOYMENT][0][Constants.XML_METADATA_MARKER][ServiceRuntimeConstants.EMULATED] === 'true';
  var deploymentId = xml[ServiceRuntimeConstants.ROLE_ENVIRONMENT][ServiceRuntimeConstants.DEPLOYMENT][0][Constants.XML_METADATA_MARKER][ServiceRuntimeConstants.DEPLOYMENT_ID];
  var roles = this._translateRoles(xml[ServiceRuntimeConstants.ROLE_ENVIRONMENT], currentInstance, currentInstance.roleName);

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
      xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][ServiceRuntimeConstants.CONFIGURATION_SETTINGS] &&
      xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][ServiceRuntimeConstants.CONFIGURATION_SETTINGS][0][ServiceRuntimeConstants.CONFIGURATION_SETTING]) {

    var configurationSettings = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][ServiceRuntimeConstants.CONFIGURATION_SETTINGS][0][ServiceRuntimeConstants.CONFIGURATION_SETTING];
    _.each(configurationSettings, function (currentConfigurationSetting) {
      configurationSettingsMap[currentConfigurationSetting[Constants.XML_METADATA_MARKER].name] = currentConfigurationSetting[Constants.XML_METADATA_MARKER].value;
    });
  }

  return configurationSettingsMap;
};

XmlRoleEnvironmentDataDeserializer.prototype._translateLocalResources = function (xml) {
  var localResourcesMap = {};

  if (xml[ServiceRuntimeConstants.CURRENT_INSTANCE] &&
      xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][ServiceRuntimeConstants.LOCAL_RESOURCES] &&
      xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][ServiceRuntimeConstants.LOCAL_RESOURCES][0][ServiceRuntimeConstants.LOCAL_RESOURCE]) {

    var localResources = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][ServiceRuntimeConstants.LOCAL_RESOURCES][0][ServiceRuntimeConstants.LOCAL_RESOURCE];
    _.each(localResources, function (currentLocalResource) {
      var currentLocalResourceName = currentLocalResource[Constants.XML_METADATA_MARKER].name;

      localResourcesMap[currentLocalResourceName] = currentLocalResource[Constants.XML_METADATA_MARKER];
    });
  }

  return localResourcesMap;
};

XmlRoleEnvironmentDataDeserializer.prototype._translateCurrentInstance = function (xml) {
  var currentInstance = {};

  currentInstance.id = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][Constants.XML_METADATA_MARKER].id;
  currentInstance.roleName = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][Constants.XML_METADATA_MARKER].roleName;
  currentInstance.faultDomain = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][Constants.XML_METADATA_MARKER].faultDomain;
  currentInstance.updateDomain = xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][Constants.XML_METADATA_MARKER].updateDomain;

  if (xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][ServiceRuntimeConstants.ENDPOINTS]) {
    currentInstance.endpoints = this._translateRoleInstanceEndpoints(xml[ServiceRuntimeConstants.CURRENT_INSTANCE][0][ServiceRuntimeConstants.ENDPOINTS][0]);

    _.each(currentInstance.endpoints, function (currentEndpoint) {
      currentEndpoint.roleInstanceId = currentInstance.id;
    });
  } else {
    currentInstance.endpoints = {};
  }

  return currentInstance;
};

XmlRoleEnvironmentDataDeserializer.prototype._translateRoles = function (xml, currentInstance, currentRole) {
  var self = this;
  var rolesMap = {};
  var roleInstances;

  if (xml[ServiceRuntimeConstants.ROLES] &&
      xml[ServiceRuntimeConstants.ROLES][0][ServiceRuntimeConstants.ROLE]) {

    var roles = xml[ServiceRuntimeConstants.ROLES][0][ServiceRuntimeConstants.ROLE];
    _.each(roles, function (currentIterationRole) {
      var currentIterationRoleName = currentIterationRole[Constants.XML_METADATA_MARKER].name;
      roleInstances = self._translateRoleInstances(currentIterationRole);

      if (currentIterationRoleName === currentRole) {
        roleInstances[currentInstance.id] = currentInstance;
      }

      _.each(roleInstances, function (currentRoleInstance) {
        currentRoleInstance.roleName = currentIterationRoleName;
      });

      rolesMap[currentIterationRoleName] = {
        name: currentIterationRoleName,
        instances: roleInstances
      };
    });
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
  var self = this;
  var roleInstancesMap = {};

  if (xml[ServiceRuntimeConstants.INSTANCES] &&
      xml[ServiceRuntimeConstants.INSTANCES][0][ServiceRuntimeConstants.INSTANCE]) {

    var instances = xml[ServiceRuntimeConstants.INSTANCES][0][ServiceRuntimeConstants.INSTANCE];
    _.each(instances, function (currentIterationInstance) {
      var currentIterationInstanceId = currentIterationInstance[Constants.XML_METADATA_MARKER].id;

      var endpoints = self._translateRoleInstanceEndpoints(currentIterationInstance[ServiceRuntimeConstants.ENDPOINTS][0]);

      _.each(endpoints, function (currentEndpoint) {
        currentEndpoint.roleInstanceId = currentIterationInstanceId;
      });

      currentIterationInstance[Constants.XML_METADATA_MARKER].endpoints = endpoints;

      roleInstancesMap[currentIterationInstanceId] = currentIterationInstance[Constants.XML_METADATA_MARKER];
    });
  }

  return roleInstancesMap;
};

XmlRoleEnvironmentDataDeserializer.prototype._translateRoleInstanceEndpoints = function (endpointsXml) {
  var endpointsMap = {};

  if (endpointsXml &&
      endpointsXml[ServiceRuntimeConstants.ENDPOINT]) {

    var endpoints = endpointsXml[ServiceRuntimeConstants.ENDPOINT];
    _.each(endpoints, function (currentEndpoint) {
      var currentEndpointName = currentEndpoint[Constants.XML_METADATA_MARKER].name;

      endpointsMap[currentEndpointName] = currentEndpoint[Constants.XML_METADATA_MARKER];
    });
  }

  return endpointsMap;
};

module.exports = XmlRoleEnvironmentDataDeserializer;