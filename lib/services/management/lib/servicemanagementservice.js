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
var util = require('util');
var querystring = require('querystring');
var _ = require('underscore');

var azureCommon = require('azure-common');
var ServiceManagementSettings = azureCommon.ServiceManagementSettings;
var ServiceManagementClient = azureCommon.ServiceManagementClient;
var WebResource = azureCommon.WebResource;
var ServiceManagementSerialize = require('./models/servicemanagementserialize');

var Constants = azureCommon.Constants;
var validate = azureCommon.validate;
var jsonTransformer = require('./jsontransform/jsontransformer');
var serviceManagementMeta = require('./jsontransform/servicemanagementmeta.json');

function attributeToKeyValue(object) {
  for(var key in object)
  {
    if (key === Constants.XML_METADATA_MARKER) {
      for (var atrKey in object[key]) {
        if (object[key].hasOwnProperty(atrKey)) {
          var newKey = atrKey[0].toUpperCase() + atrKey.substr(1);
          object[newKey] = object[key][atrKey];
        }
      }

      delete object[key];
    } else if (typeof(object[key]) == 'object') {
      attributeToKeyValue(object[key]);
    }
  }
}

function handleEmptyObject(param) {
  if (typeof(param) === 'object') {
    for (var key in param) {
      if (param.hasOwnProperty(key)) {
        if (typeof(param[key]) === 'object') {
          var keys = Object.keys(param[key]);
          if (keys.length === 1 && keys[0] === Constants.XML_METADATA_MARKER && param[key][Constants.XML_METADATA_MARKER]['i:nil']) {
            // empty object e.g. "Location": { Constants.XML_METADATA_MARKER: { 'i:nil': 'true' } }
            param[key] = null;
            continue;
          }
        }

        handleEmptyObject(param[key]);
      }
    }
  }
}

function applyTransform(object, transform) {
  if (transform instanceof Array) {
    for (var i = 0; i < transform.length; i++) {
      applyTransform(object, transform[i]);
    }
  } else {
    for (var key in transform) {
      if (transform.hasOwnProperty(key)) {
        // CLI expect object[key] as a required list. The below check make
        // sure even if the server returns undefined/null/empty value we make it empty list.
        if (!object[key]) {
          object[key] = [];
        } else if (typeof(object[key]) === 'object') {
          if (Object.keys(object[key]).length !== 0) {
            var transform2 = transform[key];
            for (var key2 in transform2) {
              if (transform2.hasOwnProperty(key2)) {
                if (object[key][key2] instanceof Array) {
                  object[key] = object[key][key2];
                } else {
                  if (object[key][key2] === 'undefined') {
                    object[key] = [];
                  } else {
                    object[key] = [object[key][key2]];
                  }
                }

                // Not a leaf, continue applying the transformation
                if (transform2[key2] !== null) {
                  for (var j = 0; j < object[key].length; j++) {
                    applyTransform(object[key][j], transform2[key2]);
                  }
                }
                break;
              }
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
}

function applyTransformIfRequired(name, response, hasTopLevelList, ignoreContentType) {
  if (response && response.isSuccessful && (ignoreContentType || response.headers['content-type'].indexOf('application/xml') !== -1)) {
    if (hasTopLevelList) {
      // Requires special handling of json generated from xml where
      // the top level node expected to be collection.
      var keys = Object.keys(response.body);
      if (keys.length === 1) {
        // Top level xml is an empty collection
        if (keys[0] !== Constants.XML_METADATA_MARKER) {
          throw new Error('Empty collection should contain only namespace ' +
            name + ' but found non-namespace item');
        }

        response.body = [];
      } else if (keys.length === 2) {
        var listKey = (keys[0] === Constants.XML_METADATA_MARKER ? keys[1] : keys[0]);
        if (!(response.body[listKey] instanceof Array)) {
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

    var transformer = new jsonTransformer();
    if (name === 'getDeploymentBySlot' || name === 'getDeployment') {
      transformer.transform(response.body, serviceManagementMeta.GetDeployment);
      return;
    } else if (name === 'getRole') {
      transformer.transform(response.body, serviceManagementMeta.GetRole);
      return;
    } else if (name === 'getStorageAccountProperties') {
      var stgPropertiesTransform = {
        Endpoints: {
          Endpoint: null
        }
      };

      applyTransform(response.body.StorageServiceProperties, stgPropertiesTransform);
    } else if (name === 'listAffinityGroups') {
      handleEmptyObject(response.body);
    } else if (name === 'getNetworkConfig') {
      transformer.transform(response.body, serviceManagementMeta.getNetworkConfig);
      attributeToKeyValue(response.body.VirtualNetworkConfiguration);
      return;
    } else if (name === 'listVirtualNetworkSites') {
      transformer.transform(response.body, serviceManagementMeta.listVirtualNetworkSites);
      return;
    }
  }
}

/**
* Creates a new ServiceManagementService object.
* @class
* The ServiceManagementService allows you to perform management operations for
* Windows Azure Cloud Services and Virtual Machines.
* @constructor
* @param {string} subscriptionId                    The subscription ID for the account or the connectionString.
* @param {object} authentication                    The authentication object for the client.
*                                                   You must use either keyfile/certfile or keyvalue/certvalue
*                                                   to provide a management certificate to authenticate
*                                                   service requests.
* @param {string} [authentication.keyfile]          The path to a file that contains the PEM encoded key
* @param {string} [authentication.certfile]         The path to a file that contains the PEM encoded certificate
* @param {string} [authentication.keyvalue]         A string that contains the PEM encoded key
* @param {string} [authentication.certvalue]        A string that contains the PEM encoded certificate
* @param {object} [hostOptions]                     The host options to override defaults.
* @param {string} [hostOptions.host='management.core.windows.net']                The management endpoint.
* @param {string} [hostOptions.apiversion='2012-03-01']          The API vesion to be used.
*/
function ServiceManagementService(configOrSubscriptionId, authentication, hostOptions) {
  var settings = ServiceManagementSettings.createFromParameters(configOrSubscriptionId, authentication, hostOptions);

  ServiceManagementService['super_'].call(this, settings);
  // TODO: Remove below version setting and update 'ServiceManagementClient' to new version once all
  // commands having dependency on ServiceManagementClient updated to use newer version '2013-06-01'.
  this.apiversion = '2013-10-01';

  this.subscriptionId = settings._subscriptionId;
  this.serialize = new ServiceManagementSerialize();
  this.xml2jsSettings.explicitRoot = false;
}

util.inherits(ServiceManagementService, ServiceManagementClient);

/**
* Returns status of operation that returned 202 Accepted.
* 
* @function
* @param {string} requestid             The ms-request-id value. Required.
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getOperationStatus = function (requestid, callback) {
  validate.validateArgs('getOperationStatus', function (v) {
    v.string(requestid, 'requestid');
    v.callback(callback);
  });

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
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getSubscription = function (callback) {
  validate.validateArgs('getSubscription', function (v) {
    v.callback(callback);
  });

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
* @param {Function(error, response)} callback        `error` will contain information
*                                                    if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.listLocations = function (callback) {
  validate.validateArgs('listLocations', function (v) {
    v.callback(callback);
  });

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
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.listAffinityGroups = function (callback) {
  validate.validateArgs('listAffinityGroups', function (v) {
    v.callback(callback);
  });

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
* Creates a new affinity group.
*
* @param {string} affinityGroupName                              The name of the affinity group. Required.
* @param {object} [affinityGroupOptions]                         Object with properties for the affinity group.
* @param {string} [affinityGroupOptions.Label=affinityGroupName] The label for the affinity group.    
* @param {string} [affinityGroupOptions.Description]             The description of the affinity group.
* @param {string} affinityGroupOptions.Location                  The region that the affinity group will be created in.
* @param {Function(error, response)} callback                    `error` will contain information
*                                                                if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.createAffinityGroup = function (affinityGroupName, affinityGroupOptions, callback) {
  if (!callback) {
    if (typeof affinityGroupOptions === 'function') {
      callback = affinityGroupOptions;
      affinityGroupOptions = null;
    }
  }

  validate.validateArgs('createAffinityGroup', function (v) {
    v.string(affinityGroupName, 'affinityGroupName');
    v.callback(callback);
  });

  if (!affinityGroupOptions) {
    affinityGroupOptions = {};
  }

  if (!affinityGroupOptions.Label) {
    affinityGroupOptions.Label = affinityGroupName;
  }

  if (!affinityGroupOptions.Location) {
    throw new Error('affinityGroupOptions.Location must be specified');
  }

  var path = '/' + this.subscriptionId + '/affinitygroups';
  var webResource = WebResource.post(path);

  var outbody = this.serialize.buildCreateAffinityGroup(affinityGroupName, affinityGroupOptions, this);
  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Gets properties of specified affinity group.
*
* @param {string} affinityGroupName                   The name of the affinity group. Required.
* @param {Function(error, response)} callback         `error` will contain information
*                                                     if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getAffinityGroup = function (affinityGroupName, callback) {
  validate.validateArgs('getAffinityGroup', function (v) {
    v.string(affinityGroupName, 'affinityGroupName');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/affinitygroups/' + querystring.escape(affinityGroupName);
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes a specified affinity group.
*
* @param {string} affinityGroupName                   The name of the affinity group. Required.
* @param {Function(error, response)} callback         `error` will contain information
*                                                     if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.deleteAffinityGroup = function (affinityGroupName, callback) {
  validate.validateArgs('deleteAffinityGroup', function (v) {
    v.string(affinityGroupName, 'affinityGroupName');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/affinitygroups/' + querystring.escape(affinityGroupName);
  var webResource = WebResource.del(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Returns storage accounts for the subscription.
*
* @param {Function(error, response)} callback        `error` will contain information
*                                                    if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.listStorageAccounts = function (callback) {
  validate.validateArgs('listStorageAccounts', function (v) {
    v.callback(callback);
  });

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
* @param {string} imageName                         The name of the image.
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getOSImage = function (imageName, callback) {
  validate.validateArgs('getOSImage', function (v) {
    v.string(imageName, 'imageName');
    v.callback(callback);
  });

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
* @param {Function(error, response)} callback        `error` will contain information
*                                                    if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.listOSImage = function (callback) {
  validate.validateArgs('listOSImage', function (v) {
    v.callback(callback);
  });

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
* @param {string} typeOs                          Either 'Linux' or 'Windows'.
* @param {string} imageName                       The name of the image.
* @param {string} mediaLink                       The mediaLink URL. Required.
* @param {object} [imageOptions]                  Object with properties for the image.
* @param {string} [imageOptions.Label=imageName]  The label of the image.
* @param {string} [imageOptions.Category]         The category of the server.
*                                                 The default is set by the server.
* @param {string} [imageOptions.Location]         The region that the image will be located in.
*                                                 The default is set by the server.
* @param {string} [imageOptions.RoleSize]         The size of the role.
*                                                 The default is set by the server.
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.createOSImage = function (typeOs, imageName, mediaLink, imageOptions, callback) {
  if (!callback) {
    if (typeof imageOptions === 'function') {
      callback = imageOptions;
      imageOptions = null;
    }
  }

  validate.validateArgs('createOSImage', function (v) {
    v.string(typeOs, 'typeOs');
    v.string(imageName, 'imageName');
    v.string(mediaLink, 'mediaLink');
    v.callback(callback);
  });

  if (!imageOptions) {
    imageOptions = {};
  }

  if (!imageOptions.Label) {
    imageOptions.Label = imageName;
  }

  var path = '/' + this.subscriptionId + '/services/images';
  var webResource = WebResource.post(path);

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
* @param {string} imageName                        The name of the image.
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.deleteOSImage = function (imageName, callback) {
  validate.validateArgs('deleteOSImage', function (v) {
    v.string(imageName, 'imageName');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/images/' + imageName;
  var webResource = WebResource.del(path);

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
* @param {string} diskName                          The name to use for the disk.
* @param {string} mediaLink                         The mediaLink URL.
* @param {object} [diskOptions]                     Object with properties for the disk. Optional
* @param {string} [diskOptions.Label=diskName]      The label of the disk.
* @param {boolean} [diskOptions.HasOperatingSystem] `true` if the image contains a bootable operating system;
*                                                   otherwise, `false`. The default is set by the server.
* @param {string} [diskOptions.OS]                  'Linux' or 'Windows'.

* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.addDisk = function (diskName, mediaLink, diskOptions, callback) {
  if (!callback) {
    if (typeof diskOptions === 'function') {
      callback = diskOptions;
      diskOptions = null;
    }
  }

  validate.validateArgs('addDisk', function (v) {
    v.string(diskName, 'diskName');
    v.string(mediaLink, 'mediaLink');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/disks';
  var webResource = WebResource.post(path);

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
* @param {Function(error, response)} callback        `error` will contain information
*                                                    if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.listDisks = function (callback) {
  validate.validateArgs('listDisks', function (v) {
    v.callback(callback);
  });

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
* @param {string} diskName                        The name of the disk.
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getDisk = function (diskName, callback) {
  validate.validateArgs('getDisk', function (v) {
    v.string(diskName, 'diskName');
    v.callback(callback);
  });

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
* @param {string} diskName              The name of the disk.
* @param {Function(error, response)} callback            `error` will contain information
*                                       if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.deleteDisk = function (diskName, callback) {
  validate.validateArgs('deleteDisk', function (v) {
    v.string(diskName, 'diskName');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/disks/' + querystring.escape(diskName);
  var webResource = WebResource.del(path);

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
* @param {Function(error, response)} callback         `error` will contain information
*                                    if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.listHostedServices = function (callback) {
  validate.validateArgs('listHostedServices', function (v) {
    v.callback(callback);
  });

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
* @param {string} serviceName                        The name of the service.
* @param {Function(error, response)} callback        `error` will contain information
*                                                    if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getHostedService = function (serviceName, callback) {
  validate.validateArgs('getHostedService', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

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
* @param {string} serviceName                                  The name of the new service.
* @param {object} [serviceOptions]                             Object with properties for the service.
* @param {string} [serviceOptions.Description='Service Host']  The description of the service.
* @param {string} [serviceOptions.Location]                    The region that the hosted service will be located in.
*                                                              Optional if AffinityGroup is specified.
* @param {string} [serviceOptions.AffinityGroup]               The affinity group that the hosted service will be
*                                                              a member of.
* @param {string} [serviceOptions.Label=serviceName]           The label of the hosted service.
* @param {Function(error, response)} callback                  `error` will contain information
*                                                              if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.createHostedService = function (serviceName, serviceOptions, callback) {
  if (!callback) {
    if (typeof serviceOptions === 'function') {
      callback = serviceOptions;
      serviceOptions = null;
    }
  }

  validate.validateArgs('createHostedService', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

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
* @param {string} serviceName                      The name of the storage service.
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getHostedServiceProperties = function (serviceName, callback) {
  validate.validateArgs('getHostedServiceProperties', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

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
* @param {string} serviceName                     The name of the service.
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.deleteHostedService = function (serviceName, callback) {
  validate.validateArgs('deleteHostedService', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName;
  var webResource = WebResource.del(path);

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
* @param {string} serviceName                                    The name of the storage service.
* @param {object} [serviceOptions]                               Object with properties for the service.
* @param {string} [serviceOptions.Description='Storage Account'] The description of the storage account.
* @param {string} [serviceOptions.Location]                      The region that the storage account will be created in.
*                                                                Optional if AffinityGroup is specified.
* @param {string} [serviceOptions.AffinityGroup]                 The affinity group that the storage account
*                                                                will be a member of.
* @param {string} [serviceOptions.Label=serviceName]             The label of the storage account.
* @param {Function(error, response)} callback                    `error` will contain information
*                                                                if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.createStorageAccount = function (serviceName, serviceOptions, callback) {
  if (!callback) {
    if (typeof serviceOptions === 'function') {
      callback = serviceOptions;
      serviceOptions = null;
    }
  }

  validate.validateArgs('createStorageAccount', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

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
* @param {string} serviceName                             The name of the storage service.
* @param {object} [serviceOptions]                        Object with properties for the service.
* @param {string} [serviceOptions.Description]            The description of the storage account.
* @param {string} [serviceOptions.Label]                  The label of the storage account.
* @param {boolean} [serviceOptions.GeoReplicationEnabled] `true` to enable geo replication; otherwise, `false`.
* @param {Function(error, response)} callback             `error` will contain information
*                                                         if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.updateStorageAccount = function (serviceName, serviceOptions, callback) {
  if (!callback) {
    if (typeof serviceOptions === 'function') {
      callback = serviceOptions;
      serviceOptions = null;
    }
  }

  validate.validateArgs('updateStorageAccount', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/storageservices/' + serviceName;
  var webResource = WebResource.put(path);

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
* @param {string} serviceName                      The name of the storage service.
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getStorageAccountKeys = function (serviceName, callback) {
  validate.validateArgs('getStorageAccountKeys', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

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
* @param {string} serviceName                       The name of the storage service.
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getStorageAccountProperties = function (serviceName, callback) {
  validate.validateArgs('getStorageAccountProperties', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

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
* @param {string} serviceName                      The name of the hosted service.
* @param {string} keyType                          The storage key type (primary or secondary).
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.regenerateStorageAccountKeys = function (serviceName, keyType, callback) {
  validate.validateArgs('regenerateStorageAccountKeys', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

  if (keyType.toLowerCase() !== 'primary' && keyType.toLowerCase() !== 'secondary') {
    throw new Error('Invalid storage account type');
  }

  var path = '/' + this.subscriptionId + '/services/storageservices/' + serviceName + '/keys';
  var webResource = WebResource.post(path)
    .withQueryOption('action', 'regenerate');

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
* @param {string} serviceName                     The name of the hosted service.
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.deleteStorageAccount = function (serviceName, callback) {
  validate.validateArgs('deleteStorageAccount', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/storageservices/' + serviceName;
  var webResource = WebResource.del(path);

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
* @param {string} serviceName                     The name of the hosted service.
* @param {string} deploymentName                  The name of the deployment.
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getDeployment = function (serviceName, deploymentName, callback) {
  validate.validateArgs('getDeployment', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.callback(callback);
  });

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
* @param {string} serviceName                      The name of the hosted service.
* @param {string} deploymentSlot                   The name of the slot (Production or Staging).
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getDeploymentBySlot = function (serviceName, deploymentSlot, callback) {
  validate.validateArgs('getDeploymentBySlot', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentSlot, 'deploymentSlot');
    v.callback(callback);
  });

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
* @param {string} serviceName                                   The name of the hosted service.
* @param {string} deploymentName                                The name of the deployment.
* @param {object} VmRole                                        The PersistentVMRole object (need a typedef for this)
* @param {object} [deploymentOptions]                           Options for deployment creation
* @param {string} [deploymentOptions.DeploymentSlot='Staging']  'Staging' or 'Production'.
* @param {string} [deploymentOptions.Label=deploymentName]      The label of the deployment.
* @param {Function(error, response)} callback                   `error` will contain information
*                                                               if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.createDeployment = function (serviceName, deploymentName, vmRole,
                                                  deploymentOptions, callback) {
  if (!callback) {
    if (typeof deploymentOptions === 'function') {
      callback = deploymentOptions;
      deploymentOptions = null;
    }
  }

  validate.validateArgs('createDeployment', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.exists(vmRole, 'vmRole');
    v.value(vmRole.RoleName, 'vmRole.RoleName');
    v.callback(callback);
  });

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
* Creates a persistentVM in the hosted service
*
* @param {string} serviceName                                       The name of the hosted service.
* @param {string} deploymentSlot                                    The deployment slot.
* @param {object} [deploymentOptions]                               Options for deployment creation
* @param {string} [deploymentOptions.Name]                          The deployment name.
* @param {string} deploymentOptions.PackageUrl                      The url to the package to deploy.
* @param {string} [deploymentOptions.Label=deploymentName].         The deployment label.
* @param {object} deploymentOptions.Configuration                   The configuration.
* @param {boolean} deploymentOptions.Configuration.StartDeployment  `true` if the deployment should be started; otherwise, `false`.
* @param {Function(error, response)} callback                       `error` will contain information
*                                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.createDeploymentBySlot = function (serviceName, deploymentSlot,
                                                  deploymentOptions, callback) {
  if (!callback) {
    if (typeof deploymentOptions === 'function') {
      callback = deploymentOptions;
      deploymentOptions = null;
    }
  }

  validate.validateArgs('createDeploymentBySlot', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentSlot, 'deploymentSlot');
    v.object(deploymentOptions, 'deploymentOptions');
    v.callback(callback);
  });

  if (!deploymentOptions) {
    deploymentOptions = {};
  }

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deploymentslots/' + deploymentSlot;

  var webResource = WebResource.post(path);
  var outbody = this.serialize.buildCreateDeploymentBySlot(serviceName, deploymentOptions, this);
  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Upgrades a persistentVM in the hosted service
*
* @param {string} serviceName                      The name of the hosted service.
* @param {string} deploymentSlot                   The deployment slot.
* @param {object} deploymentOptions                Options for deployment upgrade
* @param {string} deploymentOptions.Mode           The deployment mode.
* @param {string} deploymentOptions.PackageUrl     The url to the package to deploy.
* @param {string} [deploymentOptions.Label]        The label of the deployment
* @param {string} deploymentOptions.Configuration  The configuration.
* @param {boolean} deploymentOptions.Force         `true` if the deployment upgrade should be forced; otherwise, `false`.
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.upgradeDeploymentBySlot = function (serviceName, deploymentSlot,
                                                  deploymentOptions, callback) {
  if (!callback) {
    if (typeof deploymentOptions === 'function') {
      callback = deploymentOptions;
      deploymentOptions = null;
    }
  }

  validate.validateArgs('upgradeDeploymentBySlot', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentSlot, 'deploymentSlot');
    v.object(deploymentOptions, 'deploymentOptions');
    v.callback(callback);
  });

  if (!deploymentOptions) {
    deploymentOptions = {};
  }

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deploymentslots/' + deploymentSlot + '/';

  var webResource = WebResource.post(path)
    .withQueryOption('comp', 'upgrade');

  var outbody = this.serialize.buildUpgradeDeploymentBySlot(serviceName, deploymentOptions, this);

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
* @param {string} serviceName                     The name of the hosted service.
* @param {string} deploymentName                  The name of the deployment.
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.deleteDeployment = function (serviceName, deploymentName, callback) {
  validate.validateArgs('deleteDeployment', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName +
                                   '/deployments/' + deploymentName;
  var webResource = WebResource.del(path);

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
* @param {string} serviceName                     The name of the hosted service.
* @param {string} deploymentName                  The name of the deployment.
* @param {string} roleName                        The name of the role.
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.getRole = function (serviceName, deploymentName, roleName, callback) {
  validate.validateArgs('getRole', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.string(roleName, 'roleName');
    v.callback(callback);
  });

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
* @param {string} serviceName                      The name of the hosted service.
* @param {string} deploymentName                   The name of the deployment.
* @param {object} VMRole                           The PersistentVMRole object. (need a typedef for this)
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.addRole = function (serviceName, deploymentName, vmRole,
                                                  callback) {
  validate.validateArgs('addRole', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.exists(vmRole, 'vmRole');
    v.value(vmRole.RoleName, 'vmRole.RoleName');
    v.callback(callback);
  });

  if (!vmRole.RoleType) {
    vmRole.RoleType = 'PersistentVMRole';
  }

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roles';

  var webResource = WebResource.post(path);
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
* @param {string} serviceName           The name of the hosted service.
* @param {string} deploymentName        The name of the deployment.
* @param {string} roleName              The name of the role.
* @param {object} VMRole                The PersistentVMRole object. (need a typedef for this)
* @param {Function} callback            `error` will contain information
*                                       if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.modifyRole = function (serviceName, deploymentName, roleName,
                                                  vmRole, callback) {
  validate.validateArgs('modifyRole', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.string(roleName, 'roleName');
    v.object(vmRole, 'vmRole');
    v.callback(callback);
  });

  if (!vmRole.RoleType) {
    vmRole.RoleType = 'PersistentVMRole';
  }

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roles/' +
             roleName;

  var webResource = WebResource.put(path);
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
* @param {string} serviceName                     The name of the hosted service.
* @param {string} deploymentName                  The name of the deployment.
* @param {string} roleName                        The name of the role.
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.deleteRole = function (serviceName, deploymentName, roleName,
                                                  callback) {
  validate.validateArgs('deleteRole', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.string(roleName, 'roleName');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roles/' +
             roleName;

  var webResource = WebResource.del(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Adds a data disk to a role in the deployment
*
*   Note: There are 3 modes supported with a single API call.
*         The mode is determined by which properties are specified
*         in the diskOptions - DiskName, SourceMediaLink, MediaLink
*
* @param {string} serviceName                     The name of the hosted service.
* @param {string} deploymentName                  The name of the deployment.
* @param {string} roleName                        The name of the role.
* @param {object} datadisk                        The disk properties used for creation. (need a typedef for this)
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.addDataDisk = function (serviceName, deploymentName, roleName,
                                             datadisk, callback) {
  validate.validateArgs('addDataDisk', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.string(roleName, 'roleName');
    v.object(datadisk, 'datadisk');
    v.test(function () { return typeof datadisk.Lun === 'number'; },
      'Required value datadisk.Lun for function addDataDisk is not defined or not a number');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roles/' +
             roleName + '/datadisks';

  var webResource = WebResource.post(path);

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
* @param {string} serviceName                     The name of the hosted service.
* @param {string} deploymentName                  The name of the deployment.
* @param {string} roleName                        The name of the role.
* @param {number} lun                             The Lun of the disk.
* @param {object} datadisk                        The disk properties used for modification. (need typedef for this)
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.modifyDataDisk = function (serviceName, deploymentName, roleName, lun,
                                             datadisk, callback) {

  validate.validateArgs('modifyDataDisk', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.string(roleName, 'roleName');
    v.object(datadisk, 'datadisk');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roles/' +
             roleName + '/datadisks/' +
             lun;

  var webResource = WebResource.put(path);

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
* @param {string} serviceName                       The name of the hosted service.
* @param {string} deploymentName                    The name of the deployment.
* @param {string} roleName                          The name of the role.
* @param {number} lun                               The lun of the disk.
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.removeDataDisk = function (serviceName, deploymentName, roleName, lun,
                                              callback) {

  validate.validateArgs('removeDataDisk', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.string(roleName, 'roleName');
    v.test(function () { return typeof lun === 'number'; },
      'required value lun for function removeDataDisk is not defined or not a number');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
               serviceName + '/deployments/' +
               deploymentName + '/roles/' +
               roleName + '/datadisks/' +
               lun;

  var webResource = WebResource.del(path);

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
* @param {string}  serviceName                      The name of the hosted service.
* @param {string}  deploymentName                   The name of the deployment.
* @param {string}  roleInst                         The role instance name.
* @param {boolean} stoppedDeallocated               The boolean value indicating whether to release the compute resources or not.
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.shutdownRole = function (serviceName, deploymentName,
                                                      roleInst, stoppedDeallocated, callback) {

  validate.validateArgs('shutdownRole', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.string(roleInst, 'roleInst');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roleinstances/' +
             roleInst + '/operations';

  var postShutdownAction = stoppedDeallocated ? 'StoppedDeallocated' : 'Stopped';
  var webResource = WebResource.post(path);
  var outbody = this.serialize.buildShutdownRole(postShutdownAction);

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
* @param {string} serviceName                      The name of the hosted service.
* @param {string} deploymentName                   The name of the deployment.
* @param {string} roleInst                         The role instance name.
* @param {Function(error, response)} callback      `error` will contain information
*                                                  if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.startRole = function (serviceName, deploymentName,
                                                      roleInst, callback) {

  validate.validateArgs('startRole', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.string(roleInst, 'roleInst');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
               serviceName + '/deployments/' +
               deploymentName + '/roleinstances/' +
               roleInst + '/operations';

  var webResource = WebResource.post(path);
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
* Request a reboot on the specified role
*
* @param {string} serviceName                       The name of the hosted service.
* @param {string} deploymentSlot                    The name of the slot (Production or Staging).
* @param {string} roleInst                          The role instance name.
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.rebootRole = function (serviceName, deploymentSlot,
                                                      roleInst, callback) {
  validate.validateArgs('rebootRole', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentSlot, 'deploymentSlot');
    v.string(roleInst, 'roleInst');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deploymentslots/' +
             deploymentSlot + '/roleinstances/' +
             roleInst + '?comp=reboot';

  var webResource = WebResource.post(path);
  var outbody = this.serialize.buildRebootRole(serviceName, deploymentSlot,
                                                roleInst, this);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Request a reimage on the specified role
*
* @param {string} serviceName                       The name of the hosted service.
* @param {string} deploymentSlot                    The name of the slot (Production or Staging).
* @param {string} roleInst                          The role instance name.
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.reimageRole = function (serviceName, deploymentSlot,
                                                      roleInst, callback) {
  validate.validateArgs('reimageRole', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentSlot, 'deploymentSlot');
    v.string(roleInst, 'roleInst');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deploymentslots/' +
             deploymentSlot + '/roleinstances/' +
             roleInst + '?comp=reimage';

  var webResource = WebResource.post(path);
  var outbody = this.serialize.buildReimageRole(serviceName, deploymentSlot,
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
* @param {string} serviceName                       The name of the hosted service.
* @param {string} deploymentName                    The name of the deployment.
* @param {string} roleInst                          The role instance name.
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.restartRole = function (serviceName, deploymentName,
                                                      roleInst, callback) {
  validate.validateArgs('restartRole', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.string(roleInst, 'roleInst');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roleinstances/' +
             roleInst + '/operations';

  var webResource = WebResource.post(path);
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
* @param {string} serviceName                       The name of the hosted service.
* @param {string} deploymentName                    The name of the deployment.
* @param {string} roleInst                          The role instance name.
* @param {object} captureOptions                    Parameters for the capture operation. (need typedef)
* @param {Function(error, response)} callback       `error` will contain information
*                                                   if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.captureRole = function (serviceName, deploymentName,
                                                    roleInst, captureOptions, callback) {

  validate.validateArgs('captureRole', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.string(roleInst, 'roleInstance');
    v.object(captureOptions, 'captureOptions');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '/roleinstances/' +
             roleInst + '/operations';

  var webResource = WebResource.post(path);
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
* @param {string} serviceName                        The name of the hosted service.
* @param {string} data                               Certificate data.
* @param {string} format                             Certificate format.
* @param {string} password                           Certificate password.
* @param {Function(error, response)} callback        `error` will contain information
*                                                    if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.addCertificate = function (serviceName, data, format, password, callback) {
  validate.validateArgs('addCertificate', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(format, 'format');
    v.exists(data, 'data');
    v.exists(format, 'format');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/certificates';

  var webResource = WebResource.post(path);
  var outbody = this.serialize.buildAddCertificate(serviceName, data, format, password);

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
* @param {string} serviceName                     The name of the hosted service.
* @param {string} algorithm                       Certificate thumbprint algorithm.
* @param {string} thumbprint                      Certificate thumbprint.
* @param {Function(error, response)} callback     `error` will contain information
*                                                 if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.deleteCertificate = function (serviceName, algorithm, thumbprint, callback) {
  validate.validateArgs('deleteCertificate', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(algorithm, 'algorithm');
    v.string(thumbprint, 'thumbprint');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' + serviceName +
             '/certificates/' + algorithm + '-' + thumbprint;

  var webResource = WebResource.del(path);
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
* @param {string} serviceName                        The name of the hosted service.
* @param {Function(error, response)} callback        `error` will contain information
*                                                    if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.listCertificates = function (serviceName, callback) {
  validate.validateArgs('listCertificates', function (v) {
    v.string(serviceName, 'serviceName');
    v.callback(callback);
  });

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

/**
* Register a resource provider with this subscription
*
* @param {string}   resource                     Resource to register with the account
* @param {Function(error, response)} callback    `error` will contain information
*                                                if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.registerResourceProvider = function (resource, callback) {
  validate.validateArgs('registerResourceProvider', function (v) {
    v.string(resource, 'resource');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services';
  var webResource = WebResource.put(path)
    .withQueryOption('service', resource)
    .withQueryOption('action', 'register');

  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Unregister a resource provider from this subscription
*
* @param {string}   resource                         Resource to register with the account
* @param {Function(error, response)} callback        `error` will contain information
*                                                    if an error occurs; otherwise `response` will contain information related to this operation.
*/
ServiceManagementService.prototype.unregisterResourceProvider = function (resource, callback) {
  validate.validateArgs('unregisterResourceProvider', function (v) {
    v.string(resource, 'resource');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services';
  var webResource = WebResource.put(path)
    .withQueryOption('service', resource)
    .withQueryOption('action', 'unregister');

  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
 * Get a list of the registered resource types for a subscription
 *
 * @param {array} resources                          The array of resource names to look for
 *
 * @param {Function(error, response)} callback       `error` will contain information
*                                                    if an error occurs; otherwise `response` will contain information related to this operation.
 */

ServiceManagementService.prototype.listResourceTypes = function(resources, callback) {
  validate.validateArgs('listResourceTypes', function (v) {
    v.nonEmptyArray(resources, 'resources');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/';

  var webResource = WebResource.get(path)
    .withQueryOption('servicelist', resources.join(','))
    .withQueryOption('expandlist', 'ServiceResource');

  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      var results = [];
      if (!returnObject.error) {
        var services = returnObject.response.body.Service;
        if (!_.isArray(services)) {
          services = [services];
        }
        services.forEach(function (serviceObj) {
          results.push({
            type: serviceObj.Type,
            state: serviceObj.State,
            isComplete: serviceObj.IsComplete
          });
        });
      }
      return callback(returnObject.error, results);
    };
    next(responseObject, finalCallback);
  });
};

/**
* Returns all virtual network sites for the subscription.
*
* @param {function} callback  The callback function called on completion. Required.
*/
ServiceManagementService.prototype.listVirtualNetworkSites = function (callback) {
  validate.validateArgs('listVirtualNetworkSites', function (v) {
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/networking/virtualnetwork';
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      applyTransformIfRequired('listVirtualNetworkSites',
        returnObject.response,
        true
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Returns network configuration for the subscription.
*
* @param {function} callback  The callback function called on completion. Required.
*/
ServiceManagementService.prototype.getNetworkConfig = function (callback) {
  validate.validateArgs('getNetworkConfig', function (v) {
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/networking/media';
  var webResource = WebResource.get(path);

  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      applyTransformIfRequired('getNetworkConfig',
        returnObject.response,
        false,
        true
      );
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Set network configuration for the current subscription
*
* @param {object} networkConfiguration  The NetworkConfiguration object.
* @param {function} callback            The callback function called on completion. Required.
*/
ServiceManagementService.prototype.setNetworkConfig = function (networkConfiguration, callback) {
  validate.validateArgs('setNetworkConfig', function (v) {
    v.object(networkConfiguration, 'networkConfiguration');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/networking/media';

  var webResource = WebResource.put(path)
    .withHeader(Constants.HeaderConstants.CONTENT_TYPE, 'text/plain');
  var outbody = this.serialize.buildNetworkConfiguration(networkConfiguration);

  this.performRequest(webResource, outbody, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

ServiceManagementService.prototype.updateLoadBalancedEndpointSet = function (serviceName, deploymentName,
                                                  LbEndpointSet, callback) {
  validate.validateArgs('updateLoadBalancedEndpointSet', function (v) {
    v.string(serviceName, 'serviceName');
    v.string(deploymentName, 'deploymentName');
    v.object(LbEndpointSet, 'LbEndpointSet');
    v.callback(callback);
  });

  var path = '/' + this.subscriptionId + '/services/hostedservices/' +
             serviceName + '/deployments/' +
             deploymentName + '?comp=UpdateLbSet';

  var webResource = WebResource.post(path);
  var outbody = this.serialize.buildUpdateLoadBalancedEndpointSet(serviceName, deploymentName,
                                                 LbEndpointSet, this);
  this.performRequest(webResource, outbody, null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

module.exports = ServiceManagementService;
