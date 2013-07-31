/*
* @copyright
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
var events = require('events');
var uuid = require('node-uuid');

var azureutil = require('../util/util');
var RuntimeKernel = require('./runtimekernel');
var Constants = require('../util/constants');
var ServiceRuntimeConstants = Constants.ServiceRuntimeConstants;

// Expose 'RoleEnvironment'.
exports = module.exports;
/**
* RoleEnvironment provides methos that allow you to interact with the machine environment
* where the current role is running.
*
* 
* __Note__: RoleEnvironment will only work if your code is running in a worker role
* inside the Azure emulator or in a Windows Azure Cloud Service!
* @exports RoleEnvironment
*
*/
var RoleEnvironment = exports;

// Validation error messages
RoleEnvironment.incorrectCallbackErr = 'Callback must be specified.';

RoleEnvironment.EnvironmentVariables = {
  VersionEndpointEnvironmentName: 'WaRuntimeEndpoint'
};

RoleEnvironment.VersionEndpointFixedPath = '\\\\.\\pipe\\WindowsAzureRuntime';

RoleEnvironment.clientId = uuid();
RoleEnvironment.runtimeClient = null;

/**
* Validates a callback function.
* @ignore
*
* @param {function} callback The callback function.
* @return {undefined}
*/
function validateCallback(callback) {
  if (!callback) {
    throw new Error(RoleEnvironment.incorrectCallbackErr);
  }
}

/**
* Validates the node version, throwing if the version is invalid.
* @ignore
*
* @return {undefined}
*/
function validateNodeVersion() {
  var version = process.version.replace('v', '').split('.');
  if (parseInt(version[0], 10) === 0 &&
      (parseInt(version[1], 10) < Constants.SERVICERUNTIME_MIN_VERSION_MAJOR ||
      (parseInt(version[1], 10) === Constants.SERVICERUNTIME_MIN_VERSION_MAJOR &&
      version.length > 2 && parseInt(version[2], 10) < Constants.SERVICERUNTIME_MIN_VERSION_MINOR))) {
    throw new Error('Service runtime need node version >= 0.' + Constants.SERVICERUNTIME_MIN_VERSION_MAJOR +
                    '.' + Constants.SERVICERUNTIME_MIN_VERSION_MINOR + ' to run');
  }
}

var currentGoalState = null;
var currentEnvironmentData = null;
var lastState = null;
var maxDateTime = new Date('9999-12-31T23:59:59.9999999');
var eventEmitter = new events.EventEmitter();

RoleEnvironment.on = function (event, callback) {
  validateNodeVersion();

  var kernel = RuntimeKernel.getKernel();
  kernel.protocol1RuntimeGoalStateClient.closeOnRead = false;

  eventEmitter.on(event, callback);
};

RoleEnvironment.addListener = function (event, listener) {
  validateNodeVersion();

  return eventEmitter.addListener(event, listener);
};

RoleEnvironment.once = function (event, listener) {
  validateNodeVersion();

  return eventEmitter.once(event, listener);
};

RoleEnvironment.removeListener = function (event, listener) {
  validateNodeVersion();

  return eventEmitter.removeListener(event, listener);
};

RoleEnvironment.removeAllListeners = function (event) {
  validateNodeVersion();

  return eventEmitter.removeAllListeners(event);
};

RoleEnvironment.setMaxListeners = function (n) {
  validateNodeVersion();

  return eventEmitter.setMaxListeners(n);
};

RoleEnvironment.listeners = function (event) {
  validateNodeVersion();

  return eventEmitter.listeners(event);
};

RoleEnvironment.emit = function () {
  validateNodeVersion();

  return eventEmitter.emit.apply(eventEmitter, arguments);
};

/**
* Returns a RoleInstance object that represents the role instance
* in which this code is currently executing.
*
* @param {Function(error, instance)} callback   `error` will contain information
*                                                      if an error occurs; otherwise, `instance`
*                                                      will contain the role instance information.
*
* @example
* var azure = require('azure');
* azure.RoleEnvironment.getCurrentRoleInstance(function(error, instance) {
*   if (!error && instance['endpoints']) {
*     // You can get information about "endpoint1" such as its address and port via
*     // instance['endpoints']['endpoint1']['address']
*     // and instance['endpoints']['endpoint1']['port']
*   }
* });
*/
RoleEnvironment.getCurrentRoleInstance = function (callback) {
  validateNodeVersion();
  validateCallback(callback);

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
* @param {Function(error, id)} callback      `error` will contain information
*                                            if an error occurs; otherwise, `id`
*                                            will contain the deployment ID.
*/
RoleEnvironment.getDeploymentId = function (callback) {
  validateNodeVersion();
  validateCallback(callback);

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
* environment.  It is good practice to enclose any code that uses 
* service runtime in the isAvailable callback.
*
* @param {Function(error, available)} callback      `error` will contain information
*                                                   if an error occurs; otherwise, `available`
*                                                   will be `true` or `false`.
*
* @example
* var azure = require('azure');
* azure.RoleEnvironment.isAvailable(function(error, available) {
*   if (available) { 
*     // Place your calls to service runtime here
*   }
*  });
*/
RoleEnvironment.isAvailable = function (callback) {
  validateNodeVersion();
  validateCallback(callback);

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
* @param {Function(error, emulated)} callback      `error` will contain information
*                                                  if an error occurs; otherwise, `emulated`
*                                                  will be `true` or `false`.
*/
RoleEnvironment.isEmulated = function (callback) {
  validateNodeVersion();
  validateCallback(callback);

  RoleEnvironment._initialize(function (error) {
    if (error) {
      callback(error);
    } else {
      callback(undefined, currentEnvironmentData.isEmulated);
    }
  });
};


/**
* Returns the set of Role objects defined for your service.
* Roles are defined in the service definition file.
*
* @param {Function(error, roles)} callback      `error` will contain information
*                                               if an error occurs; otherwise, `roles`
*                                               will contain the roles defined for 
*                                               the service.
*
* @example
* var azure = require('azure');
* azure.RoleEnvironment.getRoles(function(error, roles) {
*   if(!error) {
*     // You can get information about "instance1" of "role1" via roles['role1']['instance1']
*   }
* });
*/
RoleEnvironment.getRoles = function (callback) {
  validateNodeVersion();
  validateCallback(callback);

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
*
*
* A role's configuration settings are defined in the service definition file.
* Values for configuration settings are set in the service configuration file.
* For more information on configuration settings, see the [Service Definition Schema](http://msdn.microsoft.com/en-us/library/windowsazure/ee758711.aspx)
* and [Service Configuration Schema](http://msdn.microsoft.com/en-us/library/windowsazure/ee758710.aspx).
*
* @param {Function(string, settings)} callback      `error` will contain information
*                                                   if an error occurs; otherwise, `settings`
*                                                   will contain the service configuration settings for 
*                                                   the service.
*
* @example
* var azure = require('azure');
* azure.RoleEnvironment.getConfigurationSettings(function(error, settings) {
*   if (!error) {
*     // You can get the value of setting "setting1" via settings['setting1']
*   }
* });
*/
RoleEnvironment.getConfigurationSettings = function (callback) {
  validateNodeVersion();
  validateCallback(callback);

  RoleEnvironment._initialize(function (error) {
    if (error) {
      callback(error);
    } else {
      callback(undefined, currentEnvironmentData.configurationSettings);
    }
  });
};

/**
* Retrieves the set of named local storage resources, along with the path.
* For example, the DiagnosticStore resource which is defined for every role
* provides a location for runtime diagnostics and logs.
*
* @param {Function(error, resources)} callback      `error` will contain information
*                                                   if an error occurs; otherwise, `resources`
*                                                   will contain the local storage resources information for 
*                                                   the service.
*
* @example
* var azure = require('azure');
* azure.RoleEnvironment.getLocalResources(function(error, resources) {
*   if(!error) {
*     // You can get the path to the role's diagnostics store via
*     // resources['DiagnosticStore']['path']
*   }
* });
*/
RoleEnvironment.getLocalResources = function (callback) {
  validateNodeVersion();
  validateCallback(callback);

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
* A call to `RequestRecycle` initiates the normal shutdown cycle. Windows Azure raises the
* `Stopping` event and calls the `OnStop` method so that you can run the necessary code to
* prepare the instance to be recycled.
*
* @param {Function(error)} callback       `error` will contain information
                                          if an error occurs.
*/
RoleEnvironment.requestRecycle = function (callback) {
  validateNodeVersion();
  validateCallback(callback);

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
* @param {string}  status               A value that indicates whether the instance is ready or busy.
* @param {date}    expiration_utc       A date value that specifies the expiration date and time of the status.
* @param {Function(error)} callback     `error` will contain information
                                        if an error occurs.
*
*/
RoleEnvironment.setStatus = function (roleInstanceStatus, expirationUtc, callback) {
  validateNodeVersion();
  validateCallback(callback);

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
* @param {Function(error)} callback      `error` will contain information
*                                        if an error occurs.
*/
RoleEnvironment.clearStatus = function (callback) {
  validateNodeVersion();
  validateCallback(callback);

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

        getCurrentGoalState(function (errorGetCurrentGoalState) {
          if (errorGetCurrentGoalState) {
            callback(errorGetCurrentGoalState);
          } else {
            if (RoleEnvironment.runtimeClient.listeners(ServiceRuntimeConstants.CHANGED).length === 0) {
              RoleEnvironment.runtimeClient.on(ServiceRuntimeConstants.CHANGED, function (newGoalState) {
                switch (newGoalState.expectedState) {
                case ServiceRuntimeConstants.RoleStatus.STARTED:
                  if (newGoalState.incarnation > currentGoalState.incarnation) {
                    RoleEnvironment._processGoalStateChange(newGoalState);
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

                  RoleEnvironment.runtimeClient.setCurrentState(stoppedState);
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
  var optionalCallback = function (error) {
    if (callback) {
      callback(error);
    }
  };

  RoleEnvironment._calculateChanges(function (error, changes) {
    if (!error) {
      if (changes.length === 0) {
        RoleEnvironment._acceptLatestIncarnation(newGoalState, last);
      } else {
        // attach cancel handler
        changes.cancel = function () {
          changes.cancelled = true;

          RoleEnvironment.requestRecycle(optionalCallback);
        };

        RoleEnvironment.emit(ServiceRuntimeConstants.CHANGING, changes);

        if (!changes.cancelled) {
          RoleEnvironment._acceptLatestIncarnation(newGoalState, last);

          RoleEnvironment.runtimeClient.getRoleEnvironmentData(function (getRoleEnvironmentDataError, environmentData) {
            if (getRoleEnvironmentDataError) {
              optionalCallback(getRoleEnvironmentDataError);
            } else {
              currentEnvironmentData = environmentData;

              RoleEnvironment.emit(ServiceRuntimeConstants.CHANGED, changes);
              optionalCallback();
            }
          });
        }
      }
    } else {
      optionalCallback(error);
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

          for (instance in currentRole.instances) {
            if (newRole.instances[instance]) {
              currentInstance = currentRole.instances[instance];
              newInstance = newRole.instances[instance];

              if (currentInstance.faultDomain === newInstance.faultDomain &&
                  currentInstance.updateDomain === newInstance.updateDomain) {

                for (endpoint in currentInstance.endpoints) {
                  if (newInstance.endpoints[endpoint]) {
                    currentEndpoint = currentInstance.endpoints[endpoint];
                    newEndpoint = newInstance.endpoints[endpoint];

                    if (currentEndpoint.protocol !== newEndpoint.protocol ||
                        currentEndpoint.address !== newEndpoint.address ||
                        currentEndpoint.port !== newEndpoint.port) {
                      changedRoleSet[role] = role;
                    }
                  } else {
                    changedRoleSet[role] = role;
                  }
                }
              } else {
                changedRoleSet[role] = role;
              }
            } else {
              changedRoleSet[role] = role;
            }
          }
        } else {
          changedRoleSet[role] = role;
        }
      }

      for (role in newRoles) {
        if (currentRoles[role]) {
          currentRole = currentRoles[role];
          newRole = newRoles[role];

          for (instance in newRole.instances) {
            if (currentRole.instances[instance]) {
              currentInstance = currentRole.instances[instance];
              newInstance = newRole.instances[instance];

              if (currentInstance.faultDomain === newInstance.faultDomain &&
                  currentInstance.updateDomain === currentInstance.updateDomain) {

                for (endpoint in newInstance.endpoints) {
                  if (currentInstance.endpoints[endpoint]) {
                    currentEndpoint = currentInstance.endpoints[endpoint];
                    newEndpoint = newInstance.endpoints[endpoint];

                    if (currentEndpoint.protocol !== newEndpoint.protocol ||
                        currentEndpoint.address !== newEndpoint.address ||
                        currentEndpoint.port !== newEndpoint.port) {
                      changedRoleSet[role] = role;
                    }
                  } else {
                    changedRoleSet[role] = role;
                  }
                }
              } else {
                changedRoleSet[role] = role;
              }
            } else {
              changedRoleSet[role] = role;
            }
          }
        } else {
          changedRoleSet[role] = role;
        }
      }

      Object.keys(changedRoleSet).forEach(function (changedRole) {
        changes.push({ type: 'TopologyChange', name: changedRoleSet[changedRole] });
      });

      callback(undefined, changes);
    } else {
      callback(getRoleEnvironmentDataError);
    }
  });
};

RoleEnvironment._raiseStoppingEvent = function () {
  RoleEnvironment.emit(ServiceRuntimeConstants.STOPPING);
};