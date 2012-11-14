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
var util = require('util');
var querystring = require('querystring');

var ServiceManagementClient = require('../core/servicemanagementclient');
var WebResource = require('../../http/webresource');
var ServiceManagementSerialize = require('./models/servicemanagementserialize');

var Constants = require('../../util/constants');
var HttpConstants = Constants.HttpConstants;

// Expose 'ServiceManagementService'.
exports = module.exports = ServiceManagementService;

/**
* Creates a new ServiceManagementService object.
*
* @constructor
* @param {string} subscriptionId                    The subscription ID for the account or the connectionString.
* @param {string} authentication                    The authentication object for the client.
*                                                   {
*                                                     keyfile: 'path to .pem',
*                                                     certfile: 'path to .pem',
*                                                     keyvalue: privatekey value,
*                                                     certvalue: public cert value
*                                                   }
* @param {string} hostOptions                       The host options to override defaults.
*                                                   {
*                                                     host: 'management.core.windows.net',
*                                                     apiversion: '2012-03-01',
*                                                     serializetype: 'XML'
*                                                   }
*/
function ServiceManagementService(subscriptionId, authentication, hostOptions) {
  if (typeof subscriptionId != 'string' || subscriptionId.length === 0) {
    throw new Error('A subscriptionId or a connection string is required');
  }

  ServiceManagementService.super_.call(this, authentication, hostOptions);

  this.subscriptionId = subscriptionId;
  this.serialize = new ServiceManagementSerialize();
}

util.inherits(ServiceManagementService, ServiceManagementClient);

/**
* Returns status of operation that returned 202 Accepted.
*
* @param {string} requestid             The ms-request-id value. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getOperationStatus = function (requestid, callback) {
  validateStringArgument(requestid, 'requestid', 'getOperationStatus');
  validateObjectArgument(callback, 'callback', 'getOperationStatus');

  var path = '/' + this.subscriptionId + '/operations/' + requestid;
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Gets information about subscription
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getSubscription = function (callback) {
  validateObjectArgument(callback, 'callback', 'getSubscription');

  var path = '/' + this.subscriptionId;
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Returns data center locations for the subscription.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listLocations = function (callback) {
  validateObjectArgument(callback, 'callback', 'listLocations');

  var path = '/' + this.subscriptionId + '/locations';
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      applyTransformIfRequired('listLocations',
        returnObject.response,
        true
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Returns affinity groups for the subscription.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listAffinityGroups = function (callback) {
  validateObjectArgument(callback, 'callback', 'listAffinityGroups');

  var path = '/' + this.subscriptionId + '/affinitygroups';
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      applyTransformIfRequired('listAffinityGroups',
        returnObject.response,
        true
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Returns storage accounts for the subscription.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listStorageAccounts = function (callback) {
  validateObjectArgument(callback, 'callback', 'listLocations');

  var path = '/' + this.subscriptionId + '/services/storageservices';
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      applyTransformIfRequired('listStorageAccounts',
        returnObject.response,
        true
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Get properties of specified OS Image.
*
* @param {string} imageName             The name of the image. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getOSImage = function (imageName, callback) {
  validateStringArgument(imageName, 'imageName', 'getOSImage');
  validateObjectArgument(callback, 'callback', 'getOSImage');

  var path = '/' + this.subscriptionId + '/services/images/' + imageName;
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Gets properties of specified OS Image.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listOSImage = function (callback) {
  validateObjectArgument(callback, 'callback', 'listOSImage');

  var path = '/' + this.subscriptionId + '/services/images';
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      applyTransformIfRequired('listOSImage',
        returnObject.response,
        true
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates an image from blob storage data.
*
* @param {string} typeOs                Either 'Linux' or 'Windows'.
* @param {string} imageName             The name of the image. Required.
* @param {string} mediaLink             The mediaLink URL. Required.
* @param {string} imageOptions          Object with properties for the image. Optional
*                                       {
*                                         Label: optional. Defaults to imageName
*                                         Category: optional. Default by server
*                                         Location: optional. Default by server
*                                         RoleSize: optional Default by server
*                                       }
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.createOSImage = function (typeOs, imageName, mediaLink, imageOptions, callback) {
  if (!callback) {
    if (typeof imageOptions === 'function') {
      callback = imageOptions;
      imageOptions = null;
    }
  }

  validateStringArgument(typeOs, 'typeOS', 'createOSImage');
  validateStringArgument(imageName, 'imageName', 'createOSImage');
  validateStringArgument(mediaLink, 'mediaLink', 'createOSImage');
  validateObjectArgument(callback, 'callback', 'createOSImage');

  if (!imageOptions) {
    imageOptions = {};
  }

  if (!imageOptions.Label) {
    imageOptions.Label = imageName;
  }

  var path = '/' + this.subscriptionId + '/services/images';
  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);

  var outbody = this.serialize.buildCreateOSImage(typeOs, imageName, mediaLink, imageOptions, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes a specified OS Image.
*
* @param {string} imageName             The name of the image. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.deleteOSImage = function (imageName, callback) {
  validateStringArgument(imageName, 'imageName', 'deleteOSImage');
  validateObjectArgument(callback, 'callback', 'deleteOSImage');

  var path = '/' + this.subscriptionId + '/services/images/' + imageName;
  var webResource = WebResource.del(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Create a disk in repository.
*
* @param {string} diskName              The name to use for the disk. Required.
* @param {string} mediaLink             The mediaLink URL. Required.
* @param {string} disk Options          Object with properties for the disk. Optional
*                                       {
*                                         Label: optional. Defaults to diskName
*                                         HasOperatingSystem: optional. Default by server
*                                         OS: optional. Either Linux or Windows
*                                       }
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.addDisk = function (diskName, mediaLink, diskOptions, callback) {
  if (!callback) {
    if (typeof diskOptions === 'function') {
      callback = diskOptions;
      diskOptions = null;
    }
  }

  validateStringArgument(diskName, 'diskName', 'addDisk');
  validateStringArgument(mediaLink, 'mediaLink', 'addDisk');
  validateObjectArgument(callback, 'callback', 'addDisk');

  var path = '/' + this.subscriptionId + '/services/disks';
  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);

  var outbody = this.serialize.buildAddDisk(diskName, mediaLink, diskOptions, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Gets list of disks in repository.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listDisks = function (callback) {
  validateObjectArgument(callback, 'callback', 'listDisks');

  var path = '/' + this.subscriptionId + '/services/disks';
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      applyTransformIfRequired('listDisks',
        returnObject.response,
        true
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Gets properties of specified Disk.
*
* @param {string} diskName              The name of the disk. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getDisk = function (diskName, callback) {
  validateStringArgument(diskName, 'diskName', 'getDisk');
  validateObjectArgument(callback, 'callback', 'getDisk');

  var path = '/' + this.subscriptionId + '/services/disks/' + querystring.escape(diskName);
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes specified Disk.
*
* @param {string} diskName              The name of the disk. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.deleteDisk = function(diskName, callback) {
  validateStringArgument(diskName, 'diskName', 'deleteDisk');
  validateObjectArgument(callback, 'callback', 'deleteDisk');

  var path = '/' + this.subscriptionId + '/services/disks/' + querystring.escape(diskName);
  var webResource = WebResource.del(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};


/**
* Gets list of hosted services.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listHostedServices = function(callback) {
  validateObjectArgument(callback, 'callback', 'listHostedServices');

  var path = '/' + this.subscriptionId + '/services/hostedservices';
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      applyTransformIfRequired('listHostedServices',
        returnObject.response,
        true
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Gets properties of a named hosted service.
*
* @param {string} serviceName           The name of the service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getHostedService = function(serviceName, callback) {
  validateStringArgument(serviceName, 'serviceName', 'getHostedService');
  validateObjectArgument(callback, 'callback', 'getHostedService');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName;
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a hosted service for the subscription
*
* @param {string} serviceName           The name of the new service. Required.
* @param {string} serviceOptions        Object with properties for the service. Optional
*                                       {
*                                         Description: optional. Defaults to 'Service host'
*                                         Location: optional if AffinityGroup is specified.
*                                         AffinityGroup: optional if Location is specified.
*                                         Label: optional. Defaults to serviceName
*                                       }
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.createHostedService = function(serviceName, serviceOptions, callback) {
  if (!callback) {
    if (typeof serviceOptions === 'function') {
      callback = serviceOptions;
      serviceOptions = null;
    }
  }

  validateStringArgument(serviceName, 'serviceName', 'createHostedService');
  validateObjectArgument(callback, 'callback', 'createHostedService');

  if (!serviceOptions) {
    serviceOptions = {};
  }

  if (!serviceOptions.Label) {
    serviceOptions.Label = serviceName;
  }

  if (!serviceOptions.Description) {
    serviceOptions.Description = 'Service host';
  }

  if (!serviceOptions.Location && !serviceOptions.AffinityGroup) {
    throw new Error('serviceOptions.Location or serviceOptions.AffinityGroup must be specified');
  }

  if (serviceOptions.Location && serviceOptions.AffinityGroup) {
    throw new Error('Only one of serviceOptions.Location or serviceOptions.AffinityGroup needs to be specified');
  }

  var path = '/' + this.subscriptionId + '/services/hostedservices';
  var webResource = WebResource.post(path);
  var outbody = this.serialize.buildCreateHostedService(serviceName, serviceOptions, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Returns the properties of specified hosted service.
*
* @param {string} serviceName           The name of the storage service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getHostedServiceProperties = function(serviceName, callback) {
  validateStringArgument(serviceName, 'serviceName', 'getHostedServiceProperties');
  validateObjectArgument(callback, 'callback', 'getHostedServiceProperties');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName;
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes named hosted service.
*
* @param {string} serviceName           The name of the service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.deleteHostedService = function(serviceName, callback) {
  validateStringArgument(serviceName, 'serviceName', 'deleteHostedService');
  validateObjectArgument(callback, 'callback', 'deleteHostedService');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName;
  var webResource = WebResource.del(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a new storage account.
*
* @param {string} serviceName           The name of the storage service. Required.
* @param {string} serviceOptions        Object with properties for the service. Optional
*                                       {
*                                         Description: optional. Defaults to 'Service host'
*                                         Location: optional if AffinityGroup is specified.
*                                         AffinityGroup: optional if Location is specified.
*                                         Label: optional. Defaults to serviceName
*                                       }
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.createStorageAccount = function(serviceName, serviceOptions, callback) {
  if (!callback) {
    if (typeof serviceOptions === 'function') {
      callback = serviceOptions;
      serviceOptions = null;
    }
  }

  validateStringArgument(serviceName, 'serviceName', 'createStorageAccount');
  validateObjectArgument(callback, 'callback', 'createStorageAccount');
  
  if (!serviceOptions) {
    serviceOptions = {};
  }

  if (!serviceOptions.Label) {
    serviceOptions.Label = serviceName;
  }

  if (!serviceOptions.Description) {
    serviceOptions.Description = 'Storage account';
  }

  if (!serviceOptions.Location && !serviceOptions.AffinityGroup) {
    throw new Error('serviceOptions.Location or serviceOptions.AffinityGroup must be specified');
  }

  if (serviceOptions.Location && serviceOptions.AffinityGroup) {
    throw new Error('Only one of serviceOptions.Location or serviceOptions.AffinityGroup needs to be specified');
  }

  var path = '/' + this.subscriptionId + '/services/storageservices';
  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);

  var outbody = this.serialize.buildCreateStorageAccount(serviceName, serviceOptions, this);
  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Updates a storage account.
*
* @param {string} serviceName           The name of the storage service. Required.
* @param {string} serviceOptions        Object with properties for the service. Optional
*                                       {
*                                         Description: optional. Defaults to 'Service host'
*                                         Label: optional. Defaults to serviceName
*                                         GeoReplicationEnabled: optional. Indicates if the geo replication is enabled.
*                                       }
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.updateStorageAccount = function(serviceName, serviceOptions, callback) {
  if (!callback) {
    if (typeof serviceOptions === 'function') {
      callback = serviceOptions;
      serviceOptions = null;
    }
  }

  validateStringArgument(serviceName, 'serviceName', 'updateStorageAccount');
  validateObjectArgument(callback, 'callback', 'updateStorageAccount');

  var path = '/' + this.subscriptionId + '/services/storageservices/' + serviceName;
  var webResource = WebResource.put(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);

  var outbody = this.serialize.buildUpdateStorageAccount(serviceName, serviceOptions, this);
  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Returns keys of specified storage account.
*
* @param {string} serviceName           The name of the storage service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getStorageAccountKeys = function(serviceName, callback) {
  validateStringArgument(serviceName, 'serviceName', 'getStorageAccountKeys');
  validateObjectArgument(callback, 'callback', 'getStorageAccountKeys');

  var path = '/' + this.subscriptionId + '/services/storageservices/' + serviceName + 
                                           '/keys';
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Returns the properties of specified storage account.
*
* @param {string} serviceName           The name of the storage service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getStorageAccountProperties = function(serviceName, callback) {
  validateStringArgument(serviceName, 'serviceName', 'getStorageAccountProperties');
  validateObjectArgument(callback, 'callback', 'getStorageAccountProperties');

  var path = '/' + this.subscriptionId + '/services/storageservices/' + serviceName;
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      applyTransformIfRequired('getStorageAccountProperties',
        returnObject.response,
        false
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Regenerates a storage account's keys
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} keyType               The storage key type (primary or secondary). Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.regenerateStorageAccountKeys = function(serviceName, keyType, callback) {
  validateStringArgument(serviceName, 'serviceName', 'deleteDeployment');
  validateObjectArgument(callback, 'callback', 'deleteDeployment');

  if (keyType.toLowerCase() !== 'primary' && keyType.toLowerCase() !== 'secondary') {
    throw new Error('Invalid storage account type');
  }

  var path = '/' + this.subscriptionId + '/services/storageservices/' + serviceName + '/keys?action=regenerate';
  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);
  var outbody = this.serialize.buildRegenerateStorageKeys(serviceName, keyType, this);



  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes a storage account
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.deleteStorageAccount = function(serviceName, callback) {
  validateStringArgument(serviceName, 'serviceName', 'deleteDeployment');
  validateObjectArgument(callback, 'callback', 'deleteDeployment');

  var path = '/' + this.subscriptionId + '/services/storageservices/' + serviceName;
  var webResource = WebResource.del(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Gets deployment properties for named deployment
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getDeployment = function(serviceName, deploymentName, callback) {
  validateStringArgument(serviceName, 'serviceName', 'getDeployment');
  validateStringArgument(deploymentName, 'deploymentName', 'getDeployment');
  validateObjectArgument(callback, 'callback', 'getDeployment');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName + 
                                   '/deployments/' + deploymentName;
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      applyTransformIfRequired('getDeployment',
        returnObject.response,
        false
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Gets deployment properties for specified slot
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentSlot        The name of the slot (Production or Staging). Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getDeploymentBySlot = function(serviceName, deploymentSlot, callback) {
  validateStringArgument(serviceName, 'serviceName', 'getDeploymentBySlot');
  validateStringArgument(deploymentSlot, 'deploymentSlot', 'getDeploymentBySlot');
  validateObjectArgument(callback, 'callback', 'getDeploymentBySlot');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName + 
                                   '/deploymentslots/' + deploymentSlot;
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      applyTransformIfRequired('getDeploymentBySlot',
        returnObject.response,
        false
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a persistentVM in the hosted service
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {object} VmRole                The PersistentVMRole object
* @param {object} deploymentOptions     Options for deployment creation
*                                       {
*                                         DeploymentSlot: optional. Defaults to 'Staging'
*                                         Label: optional. Defaults to deploymentName
*                                       }
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.createDeployment = function(serviceName, deploymentName, vmRole,
                                                  deploymentOptions, callback) {
  if (!callback) {
    if (typeof deploymentOptions === 'function') {
      callback = deploymentOptions;
      deploymentOptions = null;
    }
  }

  validateStringArgument(serviceName, 'serviceName', 'createDeployment');
  validateStringArgument(deploymentName, 'deploymentName', 'createDeployment');
  validateObjectArgument(vmRole, 'VMRole', 'createDeployment');
  validateObjectValue(vmRole.RoleName, 'VMRole.RoleName', 'createDeployment');
  validateObjectArgument(callback, 'callback', 'createDeployment');

  if (!vmRole.RoleType) {
    vmRole.RoleType = 'PersistentVMRole';
  }

  if (!deploymentOptions) {
    deploymentOptions = {};
  }

  if (!deploymentOptions.Label) {
    deploymentOptions.Label = deploymentName;
  }

  if (!deploymentOptions.DeploymentSlot) {
    deploymentOptions.DeploymentSlot = 'Production';
  }

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments';

  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildCreateDeployment(serviceName, deploymentName, 
                                                     vmRole, deploymentOptions, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes a named deployment
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.deleteDeployment = function(serviceName, deploymentName, callback) {
  validateStringArgument(serviceName, 'serviceName', 'deleteDeployment');
  validateStringArgument(deploymentName, 'deploymentName', 'deleteDeployment');
  validateObjectArgument(callback, 'callback', 'deleteDeployment');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName +
                                   '/deployments/' + deploymentName;
  var webResource = WebResource.del(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Gets role properties for named role in deployment
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleName              The name of the role. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getRole = function(serviceName, deploymentName, roleName, callback) {
  validateStringArgument(serviceName, 'serviceName', 'getRole');
  validateStringArgument(deploymentName, 'deploymentName', 'getRole');
  validateStringArgument(roleName, 'roleName', 'getRole');
  validateObjectArgument(callback, 'callback', 'getRole');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName +
                                   '/deployments/' + deploymentName +
                                   '/roles/' + roleName;
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      applyTransformIfRequired('getRole',
        returnObject.response,
        false
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a persistent role from image in the hosted service
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {object} VMRole                The PersistentVMRole object
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.addRole = function(serviceName, deploymentName, vmRole,
                                                  callback) {
  validateStringArgument(serviceName, 'serviceName', 'addRole');
  validateStringArgument(deploymentName, 'deploymentName', 'addRole');
  validateObjectArgument(vmRole, 'VMRole', 'addRole');
  validateObjectValue(vmRole.RoleName, 'VMRole.RoleName', 'addRole');
  validateObjectArgument(callback, 'callback', 'addRole');

  if (!vmRole.RoleType) {
    vmRole.RoleType = 'PersistentVMRole';
  }

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roles';

  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildAddRole(serviceName, deploymentName,
                                                        vmRole, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Updates a persistent role from image in the hosted service
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleName              The name of the role. Required.
* @param {object} VMRole                The PersistentVMRole object
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.modifyRole = function(serviceName, deploymentName, roleName,
                                                  vmRole, callback) {
  validateStringArgument(serviceName, 'serviceName', 'modifyRole');
  validateStringArgument(deploymentName, 'deploymentName', 'modifyRole');
  validateStringArgument(roleName, 'roleName', 'modifyRole');
  validateObjectArgument(vmRole, 'VMRole', 'modifyRole');
  validateObjectArgument(callback, 'callback', 'modifyRole');

  if (!vmRole.RoleType) {
    vmRole.RoleType = 'PersistentVMRole';
  }

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roles/' +
             roleName;

  var webResource = WebResource.put(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildModifyRole(serviceName, deploymentName,
                                                 roleName, vmRole, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes a role from deplyment in the hosted service
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleName              The name of the role. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.deleteRole = function(serviceName, deploymentName, roleName,
                                                  callback) {
  validateStringArgument(serviceName, 'serviceName', 'deleteRole');
  validateStringArgument(deploymentName, 'deploymentName', 'deleteRole');
  validateStringArgument(roleName, 'roleName', 'deleteRole');
  validateObjectArgument(callback, 'callback', 'deleteRole');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roles/' +
             roleName;

  var webResource = WebResource.del(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Adds a data disk to a role in the deployment
*   Note: There are 3 modes supported with a single API call.
*         The mode is determined by which properties are specified
*         in the diskOptions - DiskName, SourceMediaLink, MediaLink
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleName              The name of the role. Required.
* @param {object} datadisk              The disk properties used for creation. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.addDataDisk = function(serviceName, deploymentName, roleName,
                                             datadisk, callback) {
  validateStringArgument(serviceName, 'serviceName', 'addDataDisk');
  validateStringArgument(deploymentName, 'deploymentName', 'addDataDisk');
  validateStringArgument(roleName, 'roleName', 'addDataDisk');
  validateObjectArgument(datadisk, 'datadisk', 'addDataDisk');
  validateObjectArgument(callback, 'callback', 'addDataDisk');

  if (typeof datadisk.Lun != 'number') {
    throwMissingValue('datadisk.Lun', 'addDataDisk');
  }

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roles/' +
             roleName + '/datadisks';

  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);

  var outbody = this.serialize.buildAddDataDisk(serviceName, deploymentName,
                                                roleName, datadisk, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Modifies a data disk properties in the deployment
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleName              The name of the role. Required.
* @param {number} lun                   The Lun of the disk. Required.
* @param {object} datadisk              The disk properties used for modification. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.modifyDataDisk = function(serviceName, deploymentName, roleName, lun,
                                             datadisk, callback) {
  validateStringArgument(serviceName, 'serviceName', 'modifyDataDisk');
  validateStringArgument(deploymentName, 'deploymentName', 'modifyDataDisk');
  validateStringArgument(roleName, 'roleName', 'modifyDataDisk');
  validateObjectArgument(datadisk, 'datadisk', 'modifyDataDisk');
  validateObjectArgument(callback, 'callback', 'modifyDataDisk');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roles/' +
             roleName + '/datadisks/' +
             lun;

  var webResource = WebResource.put(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);

  var outbody = this.serialize.buildModifyDataDisk(serviceName, deploymentName,
                                                roleName, lun, datadisk, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Removes a data disk from the deployment
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleName              The name of the role. Required.
* @param {number} lun                   The lun of the disk. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.removeDataDisk = function(serviceName, deploymentName, roleName, lun,
                                              callback) {
  validateStringArgument(serviceName, 'serviceName', 'removeDataDisk');
  validateStringArgument(deploymentName, 'deploymentName', 'removeDataDisk');
  validateStringArgument(roleName, 'roleName', 'removeDataDisk');
  validateObjectArgument(callback, 'callback', 'removeDataDisk');

  if (typeof lun != 'number') {
    throwMissingValue('lun', 'removeDataDisk');
  }

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
               serviceName + '/deployments/' +
               deploymentName + '/roles/' +
               roleName + '/datadisks/' +
               lun;

  var webResource = WebResource.del(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Request a shutdown on the role
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleInst              The role instance name. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.shutdownRole = function(serviceName, deploymentName,
                                                      roleInst, callback) {
  validateStringArgument(serviceName, 'serviceName', 'shutdownRole');
  validateStringArgument(deploymentName, 'deploymentName', 'shutdownRole');
  validateStringArgument(roleInst, 'roleInst', 'shutdownRole');
  validateObjectArgument(callback, 'callback', 'shutdownRole');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roleinstances/' +
             roleInst + '/operations';

  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildShutdownRole(serviceName, deploymentName,
                                                roleInst, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Request a start on the specified role
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleInst              The role instance name. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.startRole = function(serviceName, deploymentName,
                                                      roleInst, callback) {
  validateStringArgument(serviceName, 'serviceName', 'startRole');
  validateStringArgument(deploymentName, 'deploymentName', 'startRole');
  validateStringArgument(roleInst, 'roleInst', 'startRole');
  validateObjectArgument(callback, 'callback', 'startRole');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
               serviceName + '/deployments/' +
               deploymentName + '/roleinstances/' +
               roleInst + '/operations';

  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildStartRole(serviceName, deploymentName,
                                                roleInst, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Request a restart on the specified role
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleInst              The role instance name. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.restartRole = function(serviceName, deploymentName,
                                                      roleInst, callback) {
  validateStringArgument(serviceName, 'serviceName', 'restartRole');
  validateStringArgument(deploymentName, 'deploymentName', 'restartRole');
  validateStringArgument(roleInst, 'roleInst', 'restartRole');
  validateObjectArgument(callback, 'callback', 'restartRole');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roleinstances/' +
             roleInst + '/operations';

  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildRestartRole(serviceName, deploymentName,
                                                roleInst, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Request a capture on the specified role
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleInst              The role instance name. Required.
* @param {object} captureOptions        Parameters for the capture operation. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.captureRole = function(serviceName, deploymentName,
                                                    roleInst, captureOptions, callback) {
  validateStringArgument(serviceName, 'serviceName', 'captureRoleInstance');
  validateStringArgument(deploymentName, 'deploymentName', 'captureRoleInstance');
  validateStringArgument(roleInst, 'roleInstance', 'captureRoleInstance');
  validateObjectArgument(captureOptions, 'captureOptions', 'captureRoleInstance');
  validateObjectArgument(callback, 'callback', 'captureRoleInstance');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roleinstances/' +
             roleInst + '/operations';

  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildCaptureRole(serviceName, deploymentName,
                                                roleInst, captureOptions, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Adds a certificate to the hosted service
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} data                  Certificate data. Required.
* @param {string} format                Certificate format. Requred.
* @param {string} password              Certificate password. Requred.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.addCertificate = function(serviceName, data, format, password, callback) {
  validateStringArgument(serviceName, 'serviceName', 'addCertificate');
  validateStringArgument(format, 'format', 'addCertificate');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/certificates';

  var webResource = WebResource.post(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildAddCertificate(serviceName, data, 
                                                        format, password, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes a specified certificate.
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} serviceName           Certificate thumbprint algorithm. Required.
* @param {string} serviceName           Certificate thumbprint. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.deleteCertificate = function(serviceName, algorithm, thumbprint, callback) {
  validateStringArgument(serviceName, 'serviceName', 'deleteCertificate');
  validateStringArgument(algorithm, 'algorithm', 'deleteCertificate');
  validateStringArgument(thumbprint, 'thumbprint', 'deleteCertificate');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName +
             '/certificates/' + algorithm + '-' + thumbprint;

  var webResource = WebResource.del(path);
  webResource.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);

  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Returns certificates of specified storage account.
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listCertificates = function(serviceName, callback) {
  validateStringArgument(serviceName, 'serviceName', 'listCertificates');
  validateObjectArgument(callback, 'callback', 'listCertificates');

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName +
               '/certificates';

  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      applyTransformIfRequired('listCertificates',
        returnObject.response,
        true
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/*
* Sets proxy object from a proxy url.
*
* @param {string}   proxyurl     url of proxy server. ex: http:corpproxy:80
*                                if null or undefined, clears proxy
*/
ServiceManagementService.prototype.setProxyUrl = function(proxyurl) {
  this._setProxyUrl(proxyurl);
};

/*
* Sets proxy object as specified by caller.
*
* @param {object}   proxy       proxy to use for tunneling
*                               {
*                                host: hostname
*                                port: port number
*                                proxyAuth: 'user:password' for basic auth
*                                headers: {...} headers for proxy server
*                                key: key for proxy server
*                                cert: cert for proxy server
*                                ca: ca for proxy server
*                               }
*                               if null or undefined, clears proxy
* @param {bool}     isHttps     true - use https to proxy. Otherwise use http.
*/
ServiceManagementService.prototype.setProxy = function(proxy, isHttps) {
  this._setProxy(proxy, isHttps);
};

// common functions for validating arguments
function throwMissingArgument(name, func) {
  throw new Error('Required argument ' + name + ' for function ' + func + ' is not defined');
}

function throwMissingValue(name, func) {
  throw new Error('Required value ' + name + ' for function ' + func + ' is not defined');
}

function validateStringArgument(val, name, func) {
  if (typeof val != 'string' || val.length === 0) {
    throwMissingArgument(name, func);
  }
}

function validateObjectArgument(val, name, func) {
  if (!val) {
    throwMissingArgument(name, func);
  }
}

function validateObjectValue(val, name, func) {
  if (!val) {
    throwMissingArgument(name, func);
  }
}

function applyTransformIfRequired(name, response, hasTopLevelList) {
  if(response && response.isSuccessful && response.headers['content-type'].indexOf('application/xml') !== -1) {
    if(hasTopLevelList) {
      // Requires special handling of json generated from xml where
      // the top level node expected to be collection.
      var keys = Object.keys(response.body);
      if(keys.length === 1) {
        // Top level xml is an empty collection
        if(keys[0] !== '@') {
          throw new Error('Empty collection should contain only namespace ' +
            name + ' but found non-namespace item');
        }

        response.body = [];
      } else if(keys.length === 2) {
          var listKey = (keys[0] === '@' ? keys[1] : keys[0]);
          if(!(response.body[listKey] instanceof Array)) {
            // Top level xml is single item collection
            response.body = [response.body[listKey]];
          } else {
            // Top level xml is multiple item collection
            response.body = response.body[listKey];
          }
      } else {
        throw new Error('Expecting a response with list in the top level for ' +
          name + ' but found more than two keys');
      }
    }

    if(name === 'getDeploymentBySlot' || name === 'getDeployment') {
      var deploymentTransform = [
             {
               RoleInstanceList : {
                 RoleInstance: {
                   InstanceEndpoints: {
                     InstanceEndpoint: null
                   }
                 }
               }
             },

             {
             RoleList : {
               Role :
               [
                 {
                   ConfigurationSets: {
                     ConfigurationSet:
                     [
                       {
                         InputEndpoints: {
                           InputEndpoint: null
                         }
                       },
                       {
                         SubnetNames: {
                           SubnetName: null
                         }
                       }
                     ]
                   }
                 },
                 {
                   DataVirtualHardDisks: {
                     DataVirtualHardDisk: null
                   }
                 }
               ]
             }
           }
         ];

      applyTransform(response.body, deploymentTransform);
    } else if(name === 'getRole') {
        var roleTransform = [
              {
                ConfigurationSets:
                {
                  ConfigurationSet:
                  [
                    {
                      InputEndpoints: {
                        InputEndpoint: null
                      }
                    },
                    {
                      SubnetNames: {
                        SubnetName: null
                      }
                    }
                  ]
                }
              },
              {
                DataVirtualHardDisks: {
                  DataVirtualHardDisk: null
              }
            }
          ];

      applyTransform(response.body, roleTransform);
    } else if(name === 'getStorageAccountProperties') {
      var stgPropertiesTransform = {
          Endpoints: {
            Endpoint: null
          }
      };

      applyTransform(response.body.StorageServiceProperties, stgPropertiesTransform);
    } else if(name === 'listAffinityGroups') {
      handleEmptyObject(response.body);
    }
  }
}

function applyTransform(object, transform) {
  if(transform instanceof Array) {
    for(var i = 0; i < transform.length; i++) {
      applyTransform(object, transform[i]);
    }
  } else {
    for(var key in transform) {
      // CLI expect object[key] as a required list. The 1st and 2nd check make
      // sure even if the server returns undefined/null value we make it empty list.
      if((object[key] === 'undefined') || (object[key] === null)) {
        object[key] = [];
      } else if (typeof(object[key]) === 'object') {
        if(Object.keys(object[key]).length !== 0) {
          var transform2 = transform[key];
          for(var key2 in transform2) {
            if(object[key][key2] instanceof Array) {
              object[key] = object[key][key2];
            } else {
              if(object[key][key2] === 'undefined') {
                object[key] = [];
              } else {
                object[key] = [object[key][key2]];
              }
            }

            // Not a leaf, continue applying the transformation
            if(transform2[key2] !== null) {
              for(var j = 0; j < object[key].length; j++) {
                applyTransform(object[key][j], transform2[key2]);
              }
            }
            break;
          }
        } else {
          object[key] = [];
        }
      }
      // If transform is not an array then it will be an object with one key 'transform::key'
      break;
    }
  }
}

function handleEmptyObject(param) {
  if(typeof(param) === 'object') {
    for(var key in param) {
      if(typeof(param[key]) === 'object') {
        var keys = Object.keys(param[key]);
        if (keys.length === 1 && keys[0] === '@' && param[key]['@']['i:nil']) {
          // empty object e.g. "Location": { '@': { 'i:nil': 'true' } }
          param[key] = null;
          continue;
        }
      }

      handleEmptyObject(param[key]);
    }
  }
}