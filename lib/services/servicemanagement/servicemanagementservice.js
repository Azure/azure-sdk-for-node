
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
* Get properties of specified OS Image.
*
* @param {string} imageName             The name of the image. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getOSImage = function(imageName, callback) {
  testStringArgument(imageName, 'imageName', 'getOSImage');
  testObjectArgument(callback, 'callback', 'getOSImage');

  var mypath = '/' + this.subscriptionId + '/images/' + imageName;
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

  var mypath = '/' + this.subscriptionId + '/images';
  var webres = WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Creates an image from blob storage data.
*
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
ServiceManagementService.prototype.createOSImage = function(imageName, mediaLink, imageOptions, callback) {
  if (!callback) {
    if (typeof imageOptions === 'function') {
      callback = imageOptions;
      imageOptions = null;
   }
  }
  testStringArgument(imageName, 'imageName', 'createOSImage');
  testStringArgument(mediaLink, 'mediaLink', 'createOSImage');
  testObjectArgument(callback, 'callback', 'createOSImage');
  if (!imageOptions) imageOptions = {};
  if (!imageOptions.Label) imageOptions.Label = imageName;

  var mypath = '/' + this.subscriptionId + '/images';
  var webres =  WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.OK_CODE, true);
  var self = this;
  var outbody = this.serialize.buildCreateOSImage(imageName, mediaLink, imageOptions, this);
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

  var mypath = '/' + this.subscriptionId + '/images/' + imageName;
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
* Gets list of disksin repository.
*
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listDisks = function(callback) {
  testObjectArgument(callback, 'callback', 'listDisks');

  var mypath = '/' + this.subscriptionId + '/disks';
  var webres = WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
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

  var mypath = '/' + this.subscriptionId + '/disks/' + diskName;
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

  var mypath = '/' + this.subscriptionId + '/disks/' + diskName;
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
*                                         Location: optional. Defaults to 'Windows Azure Preview'
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
  if (!serviceOptions.Location) {
    serviceOptions.Location = 'Windows Azure Preview';
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
  testObjectValue(VMRole.OSDisk, 'VMRole.OSDisk', 'createDeployment');
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
  testStringArgument(serviceName, 'serviceName', 'getDeployment');
  testStringArgument(deploymentName, 'deploymentName', 'getDeployment');
  testObjectArgument(callback, 'callback', 'getDeployment');

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
                                           '/Roles/' + roleName;
  var webres = WebResource.get(mypath);
  var self = this;
  this.performRequest(webres, null, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
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
  testObjectValue(VMRole.OSDisk, 'VMRole.OSDisk', 'addRole');
  testObjectArgument(callback, 'callback', 'addRole');

  if (!VMRole.RoleType) {
    VMRole.RoleType = 'PersistentVMRole';
  }

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/Roles';
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
  testObjectValue(VMRole.RoleName, 'VMRole.RoleName', 'modifyRole');
  testObjectArgument(callback, 'callback', 'modifyRole');

  if (!VMRole.RoleType) {
    VMRole.RoleType = 'PersistentVMRole';
  }

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/Roles/' +
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
                deploymentName + '/Roles/' +
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
  if (typeof datadisk.LUN != 'number') {
    throwMissingVal('datadisk.LUN', 'addDataDisk');
  }

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/Roles/' +
                roleName + '/DataDisks';
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
* @param {number} LUN                   The LUN of the disk. Required.
* @param {object} datadisk              The disk properties used for modification. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.modifyDataDisk = function(serviceName, deploymentName, roleName, LUN,
                                             datadisk, callback) {
  testStringArgument(serviceName, 'serviceName', 'modifyDataDisk');
  testStringArgument(deploymentName, 'deploymentName', 'modifyDataDisk');
  testStringArgument(roleName, 'roleName', 'modifyDataDisk');
  testObjectArgument(datadisk, 'datadisk', 'modifyDataDisk');
  testObjectArgument(callback, 'callback', 'modifyDataDisk');
  if (typeof datadisk.LUN != 'number') {
    throwMissingVal('datadisk.LUN', 'modifyDataDisk');
  }

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/Roles/' +
                roleName + '/DataDisks/' +
                LUN;
  var webres = WebResource.put(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildModifyDataDisk(serviceName, deploymentName,
                                                roleName, LUN, datadisk, this);

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
* @param {number} LUN                   The LUN of the disk. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.removeDataDisk = function(serviceName, deploymentName, roleName, LUN,
                                              callback) {
  testStringArgument(serviceName, 'serviceName', 'removeDataDisk');
  testStringArgument(deploymentName, 'deploymentName', 'removeDataDisk');
  testStringArgument(roleName, 'roleName', 'removeDataDisk');
  testObjectArgument(callback, 'callback', 'removeDataDisk');
  if (typeof LUN != 'number') {
    throwMissingVal('LUN', 'removeDataDisk');
  }

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/Roles/' +
                roleName + '/DataDisks/' +
                LUN;
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
* Request a shutdown on the specified instance
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleInstance          The name of the role instance. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.shutdownRoleInstance = function(serviceName, deploymentName,
                                                      roleInstance, callback) {
  testStringArgument(serviceName, 'serviceName', 'shutdownRoleInstance');
  testStringArgument(deploymentName, 'deploymentName', 'shutdownRoleInstance');
  testStringArgument(roleInstance, 'roleInstance', 'shutdownRoleInstance');
  testObjectArgument(callback, 'callback', 'shutdownRoleInstance');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/RoleInstances/' +
                roleInstance + '/Operations';
  var webres = WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildShutdownRoleInstance(serviceName, deploymentName,
                                                roleInstance, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Request a restart on the specified instance
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleInstance          The name of the role instance. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.restartRoleInstance = function(serviceName, deploymentName,
                                                      roleInstance, callback) {
  testStringArgument(serviceName, 'serviceName', 'restartRoleInstance');
  testStringArgument(deploymentName, 'deploymentName', 'restartRoleInstance');
  testStringArgument(roleInstance, 'roleInstance', 'restartRoleInstance');
  testObjectArgument(callback, 'callback', 'restartRoleInstance');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/RoleInstances/' +
                roleInstance + '/Operations';
  var webres = WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildRestartRoleInstance(serviceName, deploymentName,
                                                roleInstance, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
      callback(retobj.error, retobj.response);
    });
  });
};

/**
* Request a restart on the specified instance
*
* @param {string} serviceName           The name of the hosted service. Required.
* @param {string} deploymentName        The name of the deployment. Required.
* @param {string} roleInstance          The name of the role instance. Required.
* @param {object} captureOptions        Parameters for the capture operation. Required.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.captureRoleInstance = function(serviceName, deploymentName,
                                                    roleInstance, captureOptions, callback) {
  testStringArgument(serviceName, 'serviceName', 'captureRoleInstance');
  testStringArgument(deploymentName, 'deploymentName', 'captureRoleInstance');
  testStringArgument(roleInstance, 'roleInstance', 'captureRoleInstance');
  testObjectArgument(captureOptions, 'captureOptions', 'captureRoleInstance');
  testObjectArgument(callback, 'callback', 'captureRoleInstance');

  var mypath = '/' + this.subscriptionId + '/services/hostedservices/' +
                serviceName + '/deployments/' +
                deploymentName + '/RoleInstances/' +
                roleInstance + '/Operations';
  var webres = WebResource.post(mypath);
  webres.withOkCode(HttpConstants.HttpResponseCodes.ACCEPTED_CODE, true);
  var outbody = this.serialize.buildCaptureRoleInstance(serviceName, deploymentName,
                                                roleInstance, captureOptions, this);
  var self = this;
  this.performRequest(webres, outbody, {}, function(rspobj, next) {
    next(rspobj, function(retobj) {
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

