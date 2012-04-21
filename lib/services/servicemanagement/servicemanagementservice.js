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
var util = require('util');
var url = require('url');
var ServiceManagementClient = require('../core/servicemanagementclient');
var Constants = require('../../util/constants');
var WebResource = require('../../http/webresource');
var ServiceManagementSerialize = require('./models/servicemanagementserialize');
var HttpConstants = Constants.HttpConstants;


// Expose 'ServiceManagementService'.
exports = module.exports = ServiceManagementService;


/**
* Creates a new ServiceManagementService object.
*
* @constructor
* @param {string} subscriptionId          The subscription ID for the account.
* @param {string} authentication          The authentication object for the client.
*                                         {
*                                            keyfile: 'path to .pem',
*                                            certfile: 'path to .pem',
*                                            keyvalue: privatekey value,
*                                            certvalue: public cert value
*                                         }
* @param {string} hostOptions             The host options to override defaults.
*                                         {
*                                            host: 'management.core.windows.net',
*                                            apiversion: '2012-03-01',
*                                            serializetype: 'XML'
*                                         }
*/
function ServiceManagementService(subscriptionId, authentication, hostOptions) {
  if (typeof subscriptionId != 'string' || subscriptionId.length === 0) {
    throw new Error('SubscriptionId is required');
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
ServiceManagementService.prototype.getOperationStatus = function(requestid, callback) {
  testStringArgument(requestid, 'requestid', 'getOperationStatus');
  testObjectArgument(callback, 'callback', 'getOperationStatus');

  var mypath = '/' + this.subscriptionId + '/operations/' + requestid;
  var webres = WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Gets information about subscription
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getSubscription = function(callback) {
  testObjectArgument(callback, 'callback', 'getSubscription');

  var mypath = '/' + this.subscriptionId;
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Returns data center locations for the subscription.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listLocations = function(callback) {
  testObjectArgument(callback, 'callback', 'listLocations');

  var mypath = '/' + this.subscriptionId + '/locations';
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      applyTransformIfRequired('listLocations',
        retobj.response,
        true
      );
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Returns affinity groups for the subscription.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listAffinityGroups = function(callback) {
  testObjectArgument(callback, 'callback', 'listAffinityGroups');

  var mypath = '/' + this.subscriptionId + '/affinitygroups';
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      applyTransformIfRequired('listAffinityGroups',
        retobj.response,
        true
      );
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Returns storage accounts for the subscription.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listStorageAccounts = function(callback) {
  testObjectArgument(callback, 'callback', 'listStorageAccounts');

  var mypath = '/' + this.subscriptionId + '/services/storageservices';
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      applyTransformIfRequired('listStorageAccounts',
        retobj.response,
        true
      );
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Get properties of specified OS Image.
*
* @param {string} imageName             The name of the image. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getOSImage = function(imageName, callback) {
  testStringArgument(imageName, 'imageName', 'getOSImage');
  testObjectArgument(callback, 'callback', 'getOSImage');

  var mypath = '/' + this.subscriptionId + '/services/images/' + imageName;
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Gets properties of specified OS Image.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listOSImage = function(callback) {
  testObjectArgument(callback, 'callback', 'listOSImage');

  var mypath = '/' + this.subscriptionId + '/services/images';
  var webres = WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      applyTransformIfRequired('listOSImage',
        retobj.response,
        true
      );
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Creates an image from blob storage data.
*
* @param {string} typeOS                Either 'Linux' or 'Windows'.
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
ServiceManagementService.prototype.createOSImage = function(typeOS, imageName, mediaLink, imageOptions, callback) {
  if (!callback) {
    if (typeof imageOptions === 'function') {
      callback = imageOptions;
      imageOptions = null;
   }
  }
  testStringArgument(imageName, 'typeOS', 'createOSImage');
  testStringArgument(imageName, 'imageName', 'createOSImage');
  testStringArgument(mediaLink, 'mediaLink', 'createOSImage');
  testObjectArgument(callback, 'callback', 'createOSImage');
  if (!imageOptions) imageOptions = {};
  if (!imageOptions.Label) imageOptions.Label = imageName;

  var mypath = '/' + this.subscriptionId + '/services/images';
  var webres =  WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);
  var self = this;
  var outbody = this.serialize.buildCreateOSImage(typeOS, imageName, mediaLink, imageOptions, this);
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Deletes a specified OS Image.
*
* @param {string} imageName             The name of the image. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.deleteOSImage = function(imageName, callback) {
  testStringArgument(imageName, 'imageName', 'deleteOSImage');
  testObjectArgument(callback, 'callback', 'deleteOSImage');

  var mypath = '/' + this.subscriptionId + '/services/images/' + imageName;
  var webres = WebResource.del(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
ServiceManagementService.prototype.addDisk = function(diskName, mediaLink, diskOptions, callback) {
  if (!callback) {
    if (typeof diskOptions === 'function') {
      callback = diskOptions;
      diskOptions = null;
    }
  }
  testObjectArgument(callback, 'callback', 'addDisk');

  testStringArgument(diskName, 'diskName', 'addDisk');
  testStringArgument(mediaLink, 'mediaLink', 'addDisk');
  var mypath = '/' + this.subscriptionId + '/services/disks';
  var webres = WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);
  var self = this;
  var outbody = this.serialize.buildAddDisk(diskName, mediaLink, diskOptions, this);
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Gets list of disks in repository.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listDisks = function(callback) {
  testObjectArgument(callback, 'callback', 'listDisks');

  var mypath = '/' + this.subscriptionId + '/services/disks';
  var webres = WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      applyTransformIfRequired('listDisks',
        retobj.response,
        true
      );
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Gets properties of specified Disk.
*
* @param {string} diskName              The name of the disk. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getDisk = function(diskName, callback) {
  testStringArgument(diskName, 'diskName', 'getDisk');
  testObjectArgument(callback, 'callback', 'getDisk');

  var mypath = '/' + this.subscriptionId + '/services/disks/' + diskName;
  var webres = WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Deletes specified Disk.
*
* @param {string} diskName              The name of the disk. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.deleteDisk = function(diskName, callback) {
  testStringArgument(diskName, 'diskName', 'deleteDisk');
  testObjectArgument(callback, 'callback', 'deleteDisk');

  var mypath = '/' + this.subscriptionId + '/services/disks/' + diskName;
  var webres = WebResource.del(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};


/**
* Gets list of hosted services.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listHostedServices = function(callback) {
  testObjectArgument(callback, 'callback', 'listHostedServices');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices';
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      applyTransformIfRequired('listHostedServices',
        retobj.response,
        true
      );
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Gets properties of a named hosted service.
*
* @param {string} serviceName           The name of the service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getHostedService = function(serviceName, callback) {
  testStringArgument(serviceName, 'serviceName', 'getHostedService');
  testObjectArgument(callback, 'callback', 'getHostedService');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName;
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'createHostedService');
  testObjectArgument(callback, 'callback', 'createHostedService');
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

  var mypath = '/' + this.subscriptionId + '/services/hostedservices';
  var webres =  WebResource.post(mypath);
  var outbody = this.serialize.buildCreateHostedService(serviceName, serviceOptions, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Returns the properties of specified hosted service.
*
* @param {string} serviceName           The name of the storage service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getHostedServiceProperties = function(serviceName, callback) {
  testStringArgument(serviceName, 'serviceName', 'getHostedServiceProperties');
  testObjectArgument(callback, 'callback', 'getHostedServiceProperties');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName;

  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Deletes named hosted service.
*
* @param {string} serviceName           The name of the service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.deleteHostedService = function(serviceName, callback) {
  testStringArgument(serviceName, 'serviceName', 'deleteHostedService');
  testObjectArgument(callback, 'callback', 'deleteHostedService');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName;
  var webres = WebResource.del(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Returns keys of specified storage account.
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

  testStringArgument(serviceName, 'serviceName', 'createStorageAccount');
  testObjectArgument(callback, 'callback', 'createStorageAccount');
  
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

  var mypath = '/' + this.subscriptionId + '/services/storageservices';
  var webres =  WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);
  var self = this;
  var outbody = this.serialize.buildCreateStorageAccount(serviceName, serviceOptions, this);
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Returns keys of specified storage account.
*
* @param {string} serviceName           The name of the storage service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getStorageAccountKeys = function(serviceName, callback) {
  testStringArgument(serviceName, 'serviceName', 'getStorageAccountKeys');
  testObjectArgument(callback, 'callback', 'getStorageAccountKeys');

  var mypath = '/' + this.subscriptionId + '/services/storageservices/' + serviceName + 
                                           '/keys';
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Returns the properties of specified storage account.
*
* @param {string} serviceName           The name of the storage service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getStorageAccountProperties = function(serviceName, callback) {
  testStringArgument(serviceName, 'serviceName', 'getStorageAccountProperties');
  testObjectArgument(callback, 'callback', 'getStorageAccountProperties');

  var mypath = '/' + this.subscriptionId + '/services/storageservices/' + serviceName;

  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      applyTransformIfRequired('getStorageAccountProperties',
        retobj.response,
        false
      );
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'getDeployment');
  testStringArgument(deploymentName, 'deploymentName', 'getDeployment');
  testObjectArgument(callback, 'callback', 'getDeployment');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName + 
                                           '/deployments/' + deploymentName;
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'getDeploymentBySlot');
  testStringArgument(deploymentSlot, 'deploymentSlot', 'getDeploymentBySlot');
  testObjectArgument(callback, 'callback', 'getDeploymentBySlot');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName + 
                                           '/deploymentslots/' + deploymentSlot;
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      applyTransformIfRequired('getDeploymentBySlot',
        retobj.response,
        false
      );
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Creates a persistentVM in the hosted service
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {object} VMRole                The PersistentVMRole object
* @param {object} deploymentOptions     Options for deployment creation
*                                       {
*                                         DeploymentSlot: optional. Defaults to 'Staging'
*                                         Label: optional. Defaults to deploymentName
*                                       }
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.createDeployment = function(serviceName, deploymentName, VMRole, 
                                                  deploymentOptions, callback) {
  if (!callback) {
    if (typeof deploymentOptions === 'function') {
      callback = deploymentOptions;
      deploymentOptions = null;
   }
  }
  testStringArgument(serviceName, 'serviceName', 'createDeployment');
  testStringArgument(deploymentName, 'deploymentName', 'createDeployment');
  testObjectArgument(VMRole, 'VMRole', 'createDeployment');
  testObjectValue(VMRole.RoleName, 'VMRole.RoleName', 'createDeployment');
  testObjectArgument(callback, 'callback', 'createDeployment');

  if (!VMRole.RoleType) {
    VMRole.RoleType = 'PersistentVMRole';
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

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments';
  var webres =  WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildCreateDeployment(serviceName, deploymentName, 
                                                        VMRole, deploymentOptions, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'deleteDeployment');
  testStringArgument(deploymentName, 'deploymentName', 'deleteDeployment');
  testObjectArgument(callback, 'callback', 'deleteDeployment');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName +
                                           '/deployments/' + deploymentName;
  var webres = WebResource.del(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'getRole');
  testStringArgument(deploymentName, 'deploymentName', 'getRole');
  testStringArgument(roleName, 'roleName', 'getRole');
  testObjectArgument(callback, 'callback', 'getRole');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName +
                                           '/deployments/' + deploymentName +
                                           '/roles/' + roleName;
  var webres = WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      applyTransformIfRequired('getRole',
        retobj.response,
        false
      );
      callback(retobj.error, retobj.response);
    });
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
ServiceManagementService.prototype.addRole = function(serviceName, deploymentName, VMRole,
                                                  callback) {
  testStringArgument(serviceName, 'serviceName', 'addRole');
  testStringArgument(deploymentName, 'deploymentName', 'addRole');
  testObjectArgument(VMRole, 'VMRole', 'addRole');
  testObjectValue(VMRole.RoleName, 'VMRole.RoleName', 'addRole');
  testObjectArgument(callback, 'callback', 'addRole');

  if (!VMRole.RoleType) {
    VMRole.RoleType = 'PersistentVMRole';
  }

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/roles';
  var webres = WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildAddRole(serviceName, deploymentName,
                                                        VMRole, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
                                                  VMRole, callback) {
  testStringArgument(serviceName, 'serviceName', 'modifyRole');
  testStringArgument(deploymentName, 'deploymentName', 'modifyRole');
  testStringArgument(roleName, 'roleName', 'modifyRole');
  testObjectArgument(VMRole, 'VMRole', 'modifyRole');
  testObjectArgument(callback, 'callback', 'modifyRole');

  if (!VMRole.RoleType) {
    VMRole.RoleType = 'PersistentVMRole';
  }

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/roles/' +
                roleName;
  var webres = WebResource.put(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildModifyRole(serviceName, deploymentName,
                                                 roleName, VMRole, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'deleteRole');
  testStringArgument(deploymentName, 'deploymentName', 'deleteRole');
  testStringArgument(roleName, 'roleName', 'deleteRole');
  testObjectArgument(callback, 'callback', 'deleteRole');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/roles/' +
                roleName;
  var webres = WebResource.del(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'addDataDisk');
  testStringArgument(deploymentName, 'deploymentName', 'addDataDisk');
  testStringArgument(roleName, 'roleName', 'addDataDisk');
  testObjectArgument(datadisk, 'datadisk', 'addDataDisk');
  testObjectArgument(callback, 'callback', 'addDataDisk');
  if (typeof datadisk.Lun != 'number') {
    throwMissingVal('datadisk.Lun', 'addDataDisk');
  }

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/roles/' +
                roleName + '/datadisks';
  var webres = WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildAddDataDisk(serviceName, deploymentName,
                                                roleName, datadisk, this);

  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'modifyDataDisk');
  testStringArgument(deploymentName, 'deploymentName', 'modifyDataDisk');
  testStringArgument(roleName, 'roleName', 'modifyDataDisk');
  testObjectArgument(datadisk, 'datadisk', 'modifyDataDisk');
  testObjectArgument(callback, 'callback', 'modifyDataDisk');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/roles/' +
                roleName + '/datadisks/' +
                lun;
  var webres = WebResource.put(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildModifyDataDisk(serviceName, deploymentName,
                                                roleName, lun, datadisk, this);

  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'removeDataDisk');
  testStringArgument(deploymentName, 'deploymentName', 'removeDataDisk');
  testStringArgument(roleName, 'roleName', 'removeDataDisk');
  testObjectArgument(callback, 'callback', 'removeDataDisk');
  if (typeof lun != 'number') {
    throwMissingVal('lun', 'removeDataDisk');
  }

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/roles/' +
                roleName + '/datadisks/' +
                lun;
  var webres = WebResource.del(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);

  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'shutdownRole');
  testStringArgument(deploymentName, 'deploymentName', 'shutdownRole');
  testStringArgument(roleInst, 'roleInst', 'shutdownRole');
  testObjectArgument(callback, 'callback', 'shutdownRole');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/roleinstances/' +
                roleInst + '/operations';
  var webres = WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildShutdownRole(serviceName, deploymentName,
                                                roleInst, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'startRole');
  testStringArgument(deploymentName, 'deploymentName', 'startRole');
  testStringArgument(roleInst, 'roleInst', 'startRole');
  testObjectArgument(callback, 'callback', 'startRole');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/roleinstances/' +
                roleInst + '/operations';
  var webres = WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildStartRole(serviceName, deploymentName,
                                                roleInst, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'restartRole');
  testStringArgument(deploymentName, 'deploymentName', 'restartRole');
  testStringArgument(roleInst, 'roleInst', 'restartRole');
  testObjectArgument(callback, 'callback', 'restartRole');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/roleinstances/' +
                roleInst + '/operations';
  var webres = WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildRestartRole(serviceName, deploymentName,
                                                roleInst, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'captureRoleInstance');
  testStringArgument(deploymentName, 'deploymentName', 'captureRoleInstance');
  testStringArgument(roleInst, 'roleInstance', 'captureRoleInstance');
  testObjectArgument(captureOptions, 'captureOptions', 'captureRoleInstance');
  testObjectArgument(callback, 'callback', 'captureRoleInstance');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/roleinstances/' +
                roleInst + '/operations';
  var webres = WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildCaptureRole(serviceName, deploymentName,
                                                roleInst, captureOptions, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'addCertificate');
  testStringArgument(format, 'format', 'addCertificate');
  //testStringArgument(password, 'password', 'addCertificate');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/certificates';
  var webres =  WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildAddCertificate(serviceName, data, 
                                                        format, password, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
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
  testStringArgument(serviceName, 'serviceName', 'deleteCertificate');
  testStringArgument(algorithm, 'algorithm', 'deleteCertificate');
  testStringArgument(thumbprint, 'thumbprint', 'deleteCertificate');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName + 
                                           '/certificates/' + algorithm + '-' + thumbprint;
  var webres = WebResource.del(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Returns certificates of specified storage account.
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listCertificates = function(serviceName, callback) {
  testStringArgument(serviceName, 'serviceName', 'listCertificates');
  testObjectArgument(callback, 'callback', 'listCertificates');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName + 
                                           '/certificates';
  var webres =  WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      applyTransformIfRequired('listCertificates',
        retobj.response,
        true
      );
      callback(retobj.error, retobj.response);
    });
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
* @param {bool}     isHTTPS     true - use https to proxy. Otherwise use http.
*/
ServiceManagementService.prototype.setProxy = function(proxy, isHTTPS) {
  this._setProxy(proxy, isHTTPS);
};


// common functions for validating arguments
function throwMissingArg(name, func) {
  throw new Error('Required argument ' + name + ' for function ' + func + ' is not defined');
}

function testStringArgument(val, name, func) {
  if (typeof val != 'string' || val.length === 0) {
    throwMissingArg(name, func);
  }
}

function testObjectArgument(val, name, func) {
  if (!val) {
    throwMissingArg(name, func);
  }
}

function testObjectValue(val, name, func) {
  if (!val) {
    throwMissingArg(name, func);
  }
}

function applyTransformIfRequired(name, response, hasTopLevelList) {
  if(response.isSuccessful && response.headers['content-type'].indexOf('application/xml') !== -1) {
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

    if(name === 'getDeploymentBySlot') {
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
    } else if (name === 'getRole') {
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
    } else if (name === 'getStorageAccountProperties') {
      var stgPropertiesTransform = {
          Endpoints: {
            Endpoint: null
          }
      };

      applyTransform(response.body.StorageServiceProperties, stgPropertiesTransform);
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
