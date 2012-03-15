/**
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

var azureutil = require('../util/util');
var RuntimeKernel = require('./runtimekernel');
var Constants = require('../util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

// Expose 'RoleEnvironment'.
exports = module.exports;

var RoleEnvironment = exports;

RoleEnvironment.EnvironmentVariables = {
  VersionEndpointEnvironmentName: 'WaRuntimeEndpoint'
};

RoleEnvironment.VersionEndpointFixedPath = '\\\\.\\pipe\\WindowsAzureRuntime';

RoleEnvironment.clientId = uuid();
RoleEnvironment.runtimeClient = null;

var currentGoalState = null;
var currentEnvironmentData = null;
var lastState = null;
var maxDateTime = new Date('9999-12-31T23:59:59.9999999');
var eventEmitter = new events.EventEmitter();

/**
* Returns a RoleInstance object that represents the role instance
* in which this code is currently executing.
* 
* @param {function(error, roleInstance)} callback          The callback function.
*/
RoleEnvironment.getCurrentRoleInstance = function (callback) {
  RoleEnvironment._initialize(function (error) {
    if (error) {
      callback(error);
    } else {
      callback(undefined, currentEnvironmentData.currentInstance);
    }
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
    if (error) {
      callback(error);
    } else {
      callback(undefined, currentEnvironmentData.id);
    }
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
      callback(initializeError, !azureutil.objectIsNull(RoleEnvironment.runtimeClient));
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
RoleEnvironment.isEmulated = function (callback) {
  RoleEnvironment._initialize(function (error) {
    if (error) {
      callback(error);
    } else {
      callback(undefined, currentEnvironmentData.id);
    }
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
    if (error) {
      callback(error);
    } else {
      callback(undefined, currentEnvironmentData.roles);
    }
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
    if (error) {
      callback(error);
    } else {
      callback(undefined, currentEnvironmentData.configurationSettings);
    }
  });
};

/**
* Retrieves the set of named local storage resources.
* 
* @param {function(error, localResources)} callback        The callback function.
*/
RoleEnvironment.getLocalResources = function (callback) {
  RoleEnvironment._initialize(function (error) {
    if (error) {
      callback(error);
    } else {
      callback(undefined, currentEnvironmentData.localResources);
    }
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
*
* @param {function(error)} callback The callback function.
*/
RoleEnvironment.requestRecycle = function (callback) {
  RoleEnvironment._initialize(function (error) {
    if (!error) {
      var newState = {
        clientId: RoleEnvironment.clientId,
        incarnation: currentGoalState.incarnation,
        status: ServiceRuntimeConstants.RoleStatus.RECYCLE,
        expiration: maxDateTime
      };

      RoleEnvironment.runtimeClient.setCurrentState(newState, callback);
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
* @param {function(error)} callback The callback function.
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
        clientId: RoleEnvironment.clientId,
        incarnation: currentGoalState.incarnation,
        status: currentStatus,
        expiration: expirationUtc
      };

      lastState = newState;

      RoleEnvironment.runtimeClient.setCurrentState(newState, callback);
    } else {
      callback(error);
    }
  });
};

/**
* Clears the status of the role instance.
* An instance may indicate that it has completed communicating status by calling this method.
*
* @param {function(error)} callback The callback function.
*/
RoleEnvironment.clearStatus = function (callback) {
  RoleEnvironment._initialize(function (error) {
    if (!error) {
      var newState = {
        clientId: RoleEnvironment.clientId
      };

      lastState = newState;

      RoleEnvironment.runtimeClient.setCurrentState(newState, callback);
    } else {
      callback(error);
    }
  });
};

// TODO: find a better way to hook eventing up
RoleEnvironment.on = function (event, callback) {
  eventEmitter.on(event, callback);
};

RoleEnvironment._initialize = function (callback) {
  var getCurrentGoalState = function (finalCallback) {
    RoleEnvironment.runtimeClient.getCurrentGoalState(function (error, goalState) {
      if (error) {
        callback(error);
      } else {
        currentGoalState = goalState;
        getCurrentEnvironmentData(goalState, finalCallback);
      }
    });
  };

  var getCurrentEnvironmentData = function (goalState, finalCallback) {
    RoleEnvironment.runtimeClient.getRoleEnvironmentData(function (getRoleEnvironmentDataError, environmentData) {
      if (getRoleEnvironmentDataError) {
        callback(getRoleEnvironmentDataError);
      } else {
        currentEnvironmentData = environmentData;

        finalCallback();
      }
    });
  };

  if (!RoleEnvironment.runtimeClient) {
    var endpoint = process.env[RoleEnvironment.EnvironmentVariables.VersionEndpointEnvironmentName];

    if (!endpoint) {
      endpoint = RoleEnvironment.VersionEndpointFixedPath;
    }

    var kernel = RuntimeKernel.getKernel();
    kernel.getRuntimeVersionManager().getRuntimeClient(endpoint, function (error, rtClient) {
      if (error) {
        callback(error);
      } else {
        RoleEnvironment.runtimeClient = rtClient;

        getCurrentGoalState(function (error) {
          if (error) {
            callback(error);
          } else {
            if (RoleEnvironment.runtimeClient.listeners(ServiceRuntimeConstants.CHANGED).length === 0) {
              RoleEnvironment.runtimeClient.on(ServiceRuntimeConstants.CHANGED, function (newGoalState) {
                switch (newGoalState.expectedState) {
                  case ServiceRuntimeConstants.RoleStatus.STARTED:
                    if (newGoalState.incarnation > currentGoalState.incarnation) {
                      RoleEnvironment._processGoalStateChange(newGoalState, function () { });
                    }

                    break;
                  case ServiceRuntimeConstants.RoleStatus.STOPPED:
                    RoleEnvironment._raiseStoppingEvent();

                    var stoppedState = {
                      clientId: RoleEnvironment.clientId,
                      incarnation: newGoalState.incarnation,
                      status: ServiceRuntimeConstants.RoleStatus.STOPPED,
                      expiration: maxDateTime
                    };

                    RoleEnvironment.runtimeClient.setCurrentState(stoppedState, function () { });
                    break;
                }
              });
            }

            callback();
          }
        });
      }
    });
  } else {
    getCurrentGoalState(callback);
  }
};

RoleEnvironment._processGoalStateChange = function (newGoalState, callback) {
  var last = lastState;

  RoleEnvironment._calculateChanges(function (error, changes) {
    if (!error) {
      if (changes.length === 0) {
        RoleEnvironment._acceptLatestIncarnation(newGoalState, last);
      } else {
        eventEmitter.emit(ServiceRuntimeConstants.CHANGING, changes);

        RoleEnvironment._acceptLatestIncarnation(newGoalState, last);

        RoleEnvironment.runtimeClient.getRoleEnvironmentData(function (getRoleEnvironmentDataError, environmentData) {
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
  var setGoalState = function () {
    currentGoalState = newGoalState;
  };

  if (last !== null && last.status !== null) {
    var acceptState = {
      clientId: RoleEnvironment.clientId,
      incarnation: newGoalState.incarnation,
      status: last.status,
      expiration: last.expiration
    };

    RoleEnvironment.runtimeClient.setCurrentState(acceptState, setGoalState);
  } else {
    setGoalState();
  }
};

RoleEnvironment._calculateChanges = function (callback) {
  var changes = [];

  var current = currentEnvironmentData;
  var newData;

  RoleEnvironment.runtimeClient.getRoleEnvironmentData(function (getRoleEnvironmentDataError, environmentData) {
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

              if (currentInstance.faultDomain === newInstance.faultDomain &&
                  currentInstance.updateDomain === newInstance.updateDomain) {

                for (endpoint in currentInstance.endpoints) {
                  if (newInstance.endpoints[endpoint]) {
                    currentEndpoint = currentInstance.endpoints[endpoint];
                    newEndpoint = newInstance.endpoints[endpoint];

                    if (currentEndpoint.protocol !== newEndpoint.protocol ||
                        currentEndpoint.address !== newEndpoint.address ||
                        currentEndpoint.port !== newEndpoint.port) {
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

              if (currentInstance.faultDomain === newInstance.faultDomain &&
                  currentInstance.updateDomain === currentInstance.updateDomain) {

                for (endpoint in newInstance.endpoints) {
                  if (currentInstance.endpoints[endpoint]) {
                    currentEndpoint = currentInstance.endpoints[endpoint];
                    newEndpoint = newInstance.endpoints[endpoint];

                    if (currentEndpoint.protocol !== newEndpoint.protocol ||
                        currentEndpoint.address !== newEndpoint.address ||
                        currentEndpoint.port !== newEndpoint.port) {
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

RoleEnvironment._raiseStoppingEvent = function () {
  eventEmitter.emit(ServiceRuntimeConstants.STOPPING);
};