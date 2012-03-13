﻿/**
* Copyright 2011 Microsoft Corporation
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
var events = require('events');
var uuid = require('node-uuid');

var RuntimeKernel = require('./runtimekernel');
var Constants = require('../util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

RoleEnvironment.EnvironmentVariables = {
  VersionEndpointEnvironmentName: 'WaRuntimeEndpoint'
};

RoleEnvironment.VersionEndpointFixedPath = '\\\\.\\pipe\\WindowsAzureRuntime';

// Expose 'RoleEnvironment'.
exports = module.exports = RoleEnvironment;

exports.clientId = uuid();

var runtimeClient = null;
var currentGoalState = null;
var currentEnvironmentData = null;
var lastState = null;
var maxDateTime = new Date('9999-12-31T23:59:59.9999999');
var eventEmitter = new events.EventEmitter();

function RoleEnvironment() { }

RoleEnvironment._initialize = function (callback) {
  var getCurrentGoalState = function (error, rtClient) {
    if (error) {
      callback(error);
    } else {
      runtimeClient = rtClient;
      currentGoalState = runtimeClient.getCurrentGoalState(getCurrentEnvironmentData);
    }
  };

  var getCurrentEnvironmentData = function (error, goalState) {
    if (error) {
      callback(error);
    } else {
      currentGoalState = goalState;
      runtimeClient.getRoleEnvironmentData(function (getRoleEnvironmentDataError, environmentData) {
        if (getRoleEnvironmentDataError) {
          callback(getRoleEnvironmentDataError);
        } else {
          currentEnvironmentData = environmentData;

          runtimeClient.on(ServiceRuntimeConstants.CHANGED, function (newGoalState) {
            switch (newGoalState.expectedState) {
              case ServiceRuntimeConstants.STARTED:
                if (newGoalState.incarnation > currentGoalState.incarnation) {
                  self._processGoalStateChange(newGoalState); // NOTE: do we need a callback here ?
                }
                break;
              case ServiceRuntimeConstants.STOPPED:
                /*
                raiseStoppingEvent();

                CurrentState stoppedState = new AcquireCurrentState(clientId,
                newGoalState.getIncarnation(), CurrentStatus.STOPPED, maxDateTime);

                runtimeClient.setCurrentState(stoppedState);*/
                break;
            }
          });

          callback();
        }
      });
    }
  };

  if (!runtimeClient) {
    var endpoint = process.env[RoleEnvironment.EnvironmentVariables.VersionEndpointEnvironmentName];

    if (!endpoint) {
      endpoint = RoleEnvironment.VersionEndpointFixedPath;
    }

    var kernel = RuntimeKernel.getKernel();
    kernel.getRuntimeVersionManager().getRuntimeClient(endpoint, getCurrentGoalState);
  } else {
    getCurrentGoalState(undefined, runtimeClient);
  }
};

/**
* Returns a RoleInstance object that represents the role instance
* in which this code is currently executing.
* 
* @param {function(error, roleInstance)} callback          The callback function.
*/
RoleEnvironment.getCurrentRoleInstance = function (callback) {
  RoleEnvironment._initialize(function (error) {
    var currentInstance = undefined;
    if (!error) {
      currentInstance = currentEnvironmentData.currentInstance;
    }

    callback(error, currentInstance);
  });
};

/**
* Returns the deployment ID that uniquely identifies the deployment in
* which this role instance is running.
* 
* @param {function(error, deploymentId)} callback          The callback function.
*/
RoleEnvironment.getDeploymentId = function (callback) {
  RoleEnvironment._initialize(function (error) {
    var id = undefined;
    if (!error) {
      id = currentEnvironmentData.id;
    }

    callback(error, id);
  });
};

/**
* Indicates whether the role instance is running in the Windows Azure
* environment.
* 
* @param {function(error, isAvailable)} callback           The callback function.
*/
RoleEnvironment.isAvailable = function (callback) {
  try {
    RoleEnvironment._initialize(function (initializeError) {
      callback(initializeError, runtimeClient != null);
    });
  } catch (error) {
    callback(error, false);
  }
};

/**
* Indicates whether the role instance is running in the development fabric.
* 
* @param {function(error, isEmulated)} callback            The callback function.
*/
RoleEnvironment.isEmulated = function(callback) {
  RoleEnvironment._initialize(function (error) {
    var isEmulated = undefined;
    if (!error) {
      isEmulated = currentEnvironmentData.isEmulated;
    }

    callback(error, isEmulated);
  });
};

/**
* Returns the set of Role objects defined for your service.
* Roles are defined in the service definition file.
* 
* @param {function(error, roles)} callback                 The callback function.
*/
RoleEnvironment.getRoles = function (callback) {
  RoleEnvironment._initialize(function (error) {
    var roles = undefined;
    if (!error) {
      roles = currentEnvironmentData.roles;
    }

    callback(error, roles);
  });
};

/**
* Retrieves the settings in the service configuration file.
* A role's configuration settings are defined in the service definition file. Values for configuration settings are
* set in the service configuration file.
* 
* @param {function(error, configurationSettings)} callback The callback function.
*/
RoleEnvironment.getConfigurationSettings = function (callback) {
  RoleEnvironment._initialize(function (error) {
    var configurationSettings = undefined;
    if (!error) {
      configurationSettings = currentEnvironmentData.configurationSettings;
    }

    callback(error, configurationSettings);
  });
};

/**
* Retrieves the set of named local storage resources.
* 
* @param {function(error, localResources)} callback        The callback function.
*/
RoleEnvironment.getLocalResources = function (callback) {
  RoleEnvironment._initialize(function (error) {
    var localResources = undefined;
    if (!error) {
      localResources = currentEnvironmentData.localResources;
    }

    callback(error, localResources);
  });
};

/**
* Requests that the current role instance be stopped and restarted.
*
* Before the role instance is recycled, the Windows Azure load balancer takes the role instance out of rotation.
* This ensures that no new requests are routed to the instance while it is restarting.
* 
* A call to <code>RequestRecycle</code> initiates the normal shutdown cycle. Windows Azure raises the
* <code>Stopping</code> event and calls the <code>OnStop</code> method so that you can run the necessary code to
* prepare the instance to be recycled.
*/
RoleEnvironment.requestRecycle = function (callback) {
  RoleEnvironment._initialize(function (error) {
    if (!error) {
      var newState = {
        clientId: exports.clientId,
        incarnation: currentGoalState.incarnation,
        status: ServiceRuntimeConstants.RoleStatus.RECYCLE,
        expiration: maxDateTime
      };

      runtimeClient.setCurrentState(newState, callback);
    } else {
      callback(error);
    }
  });
};

/**
* Sets the status of the role instance.
*
* An instance may indicate that it is in one of two states: Ready or Busy. If an instance's state is Ready, it is
* prepared to receive requests from the load balancer. If the instance's state is Busy, it will not receive
* requests from the load balancer.
* 
* @param {string}  status           A value that indicates whether the instance is ready or busy.
* @param {date}    expiration_utc   A date value that specifies the expiration date and time of the status.
* 
*/
RoleEnvironment.setStatus = function (roleInstanceStatus, expirationUtc, callback) {
  RoleEnvironment._initialize(function (error) {
    if (!error) {
      var currentStatus = ServiceRuntimeConstants.RoleStatus.STARTED;

      switch (roleInstanceStatus) {
        case ServiceRuntimeConstants.RoleInstanceStatus.BUSY:
          currentStatus = ServiceRuntimeConstants.RoleStatus.BUSY;
          break;
        case ServiceRuntimeConstants.RoleInstanceStatus.READY:
          currentStatus = ServiceRuntimeConstants.RoleStatus.STARTED;
          break;
      }

      var newState = {
        clientId: exports.clientId,
        incarnation: currentGoalState.incarnation,
        status: currentStatus,
        expiration: expirationUtc
      };

      lastState = newState;

      runtimeClient.setCurrentState(newState, callback);
    } else {
      callback(error);
    }
  });
};

/**
* Clears the status of the role instance.
* An instance may indicate that it has completed communicating status by calling this method.
*/
RoleEnvironment.clearStatus = function (callback) {
  RoleEnvironment._initialize(function (error) {
    if (!error) {
      var newState = {
        clientId: exports.clientId
      };

      lastState = newState;

      runtimeClient.setCurrentState(newState, callback);
    } else {
      callback(error);
    }
  });
};

RoleEnvironment.on = function (event, callback) {
  eventEmitter.on(event, callback);
};

RoleEnvironment._processGoalStateChange = function (newGoalState, callback) {
  var self = this;
  var last = lastState;

  RoleEnvironment._calculateChanges(function (error, changes) {
    if (!error) {
      if (changes.length === 0) {
        self._acceptLatestIncarnation(newGoalState, last);
      } else {
        eventEmitter.emit(ServiceRuntimeConstants.CHANGING, changes);

        // TODO: check for canceled ?

        RoleEnvironment._acceptLatestIncarnation(newGoalState, last);

        runtimeClient.getRoleEnvironmentData(function (getRoleEnvironmentDataError, environmentData) {
          if (getRoleEnvironmentDataError) {
            callback(getRoleEnvironmentDataError);
          } else {
            currentEnvironmentData = environmentData;

            eventEmitter.emit(ServiceRuntimeConstants.CHANGED, changes);
            callback();
          }
        });
      }
    } else {
      callback(error);
    }
  });
};

RoleEnvironment._acceptLatestIncarnation = function (newGoalState, last) {
  // TODO: implement
};

RoleEnvironment._calculateChanges = function (callback) {
  var changes = [];

  var current = currentEnvironmentData;
  var newData;

  runtimeClient.getRoleEnvironmentData(function (getRoleEnvironmentDataError, environmentData) {
    if (!getRoleEnvironmentDataError) {
      newData = environmentData;

      var currentConfig = current.configurationSettings;
      var newConfig = newData.configurationSettings;
      var currentRoles = current.roles;
      var newRoles = newData.roles;

      var setting;
      for (setting in currentConfig) {
        if (!newConfig[setting] ||
            newConfig[setting] !== currentConfig[setting]) {
          changes.push({ type: 'ConfigurationSettingChange', name: setting });
        }
      }

      for (setting in newConfig) {
        if (!currentConfig[setting]) {
          changes.push({ type: 'ConfigurationSettingChange', name: setting });
        }
      }

      var changedRoleSet = [];
      var role;
      var currentRole;
      var newRole;
      var instance;
      var currentInstance;
      var newInstance;
      var endpoint;
      var currentEndpoint;
      var newEndpoint;

      for (role in currentRoles) {
        if (newRoles[role]) {
          currentRole = currentRoles[role];
          newRole = newRoles[role];

          for (instance in currentRole) {
            if (newRole[instance]) {
              currentInstance = currentRole[instance];
              newInstance = newRole[instance];

              if (currentInstance['faultDomain'] === newInstance['faultDomain'] &&
                  currentInstance['updateDomain'] === currentInstance['updateDomain']) {

                for (endpoint in currentInstance['endpoints']) {
                  if (newInstance['endpoints'][endpoint]) {
                    currentEndpoint = currentInstance['endpoints'][endpoint];
                    newEndpoint = newInstance['endpoints'][endpoint];

                    if (currentEndpoint['protocol'] !== newEndpoint['protocol'] ||
                        currentEndpoint['address'] !== newEndpoint['address'] ||
                        currentEndpoint['port'] !== newEndpoint['port']) {
                      changedRoleSet.push(role);
                    }
                  } else {
                    changedRoleSet.push(role);
                  }
                }
              } else {
                changedRoleSet.push(role);
              }
            } else {
              changedRoleSet.push(role);
            }
          }
        } else {
          changedRoleSet.push(role);
        }
      }

      for (role in newRoles) {
        if (currentRoles[role]) {
          currentRole = currentRoles[role];
          newRole = newRoles[role];

          for (instance in newRole) {
            if (currentRole[instance]) {
              currentInstance = currentRole[instance];
              newInstance = newRole[instance];

              if (currentInstance['faultDomain'] === newInstance['faultDomain'] &&
                  currentInstance['updateDomain'] === currentInstance['updateDomain']) {

                for (endpoint in newInstance['endpoints']) {
                  if (currentInstance['endpoints'][endpoint]) {
                    currentEndpoint = currentInstance['endpoints'][endpoint];
                    newEndpoint = newInstance['endpoints'][endpoint];

                    if (currentEndpoint['protocol'] !== newEndpoint['protocol'] ||
                        currentEndpoint['address'] !== newEndpoint['address'] ||
                        currentEndpoint['port'] !== newEndpoint['port']) {
                      changedRoleSet.push(role);
                    }
                  } else {
                    changedRoleSet.push(role);
                  }
                }
              } else {
                changedRoleSet.push(role);
              }
            } else {
              changedRoleSet.push(role);
            }
          }
        } else {
          changedRoleSet.push(role);
        }
      }

      for (var changedRole in changedRoleSet) {
        changes.push({ type: 'TopologyChange', name: changedRoleSet[changedRole] });
      }

      callback(undefined, changes);
    } else {
      callback(getRoleEnvironmentDataError);
    }
  });
};