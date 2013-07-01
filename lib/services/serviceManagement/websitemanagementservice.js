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
var _ = require('underscore');
var js2xml = require('../../util/js2xml');

var ServiceManagementClient = require('../core/servicemanagementclient');
var WebResource = require('../../http/webresource');

var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

/**
*
* Creates a new WebsiteManagementService object.
*
* @constructor
* @param {string} subscriptionId   Subscription ID for the account or the connection string
* @param {object} authentication   The authentication object for the client.
*                                  {
*                                    keyfile: 'path to .pem',
*                                    certfile: 'path to .pem',
*                                    keyvalue: privatekey value,
*                                    certvalue: public cert value
*                                  }
* @param {object} hostOptions      The host options to override defaults.
*                                  {
*                                    host: 'management.core.windows.net',
*                                    apiversion: '2012-03-01',
*                                    serializetype: 'XML'
*                                  }
*/
function WebsiteManagementService(subscriptionId, authentication, hostOptions) {
  if (typeof subscriptionId != 'string' || subscriptionId.length === 0) {
    throw new Error('A subscriptionId or a connection string is required');
  }

  if (!hostOptions) {
    hostOptions = { };
  }

  hostOptions.serializetype = 'XML';
  WebsiteManagementService['super_'].call(this, authentication, hostOptions);

  this.apiversion = '2012-10-10';
  this.subscriptionId = subscriptionId;
}

util.inherits(WebsiteManagementService, ServiceManagementClient);

/**
* Lists the available webspaces.
*
* @this {WebsiteManagementService}
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.listWebspaces = function (callback) {
  var webResource = WebResource.get(this._makePath('webspaces/'));

  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.webspaces = [];
      if (responseObject.response.body.WebSpaces && responseObject.response.body.WebSpaces.WebSpace) {
        responseObject.webspaces = responseObject.response.body.WebSpaces.WebSpace;
        if (!_.isArray(responseObject.webspaces)) {
          responseObject.webspaces = [ responseObject.webspaces ];
        }
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.webspaces, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Lists the available georegions.
*
* @this {WebsiteManagementService}
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.listGeoRegions = function (callback) {
  var webResource = WebResource.get(this._makePath('webspaces/'))
    .withQueryOption('properties', 'georegions');

  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.georegions = [];
      if (responseObject.response.body.GeoRegions && responseObject.response.body.GeoRegions.GeoRegion) {
        responseObject.georegions = responseObject.response.body.GeoRegions.GeoRegion;
        if (!_.isArray(responseObject.georegions)) {
          responseObject.georegions = [ responseObject.georegions ];
        }
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.georegions, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Lists the available publishing users.
*
* @this {WebsiteManagementService}
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.listPublishingUsers = function (callback) {
  var webResource = WebResource.get(this._makePath('webspaces/'))
    .withQueryOption('properties', 'publishingUsers');

  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.users = [];
      if (responseObject.response.body.ArrayOfstring && responseObject.response.body.ArrayOfstring.string) {
        responseObject.users = responseObject.response.body.ArrayOfstring.string;
        if (!_.isArray(responseObject.users)) {
          responseObject.users = [ responseObject.users ];
        }
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.users, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a new publishing user.
*
* @this {WebsiteManagementService}
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.listDNSSuffix = function (callback) {
  var webResource = WebResource.get(this._makePath('webspaces/'))
    .withQueryOption('properties', 'dnssuffix');

  this.performRequest(webResource, null, null, function (responseObject, next) {
    responseObject.dnsSuffix = null;
    if (!responseObject.error) {
      responseObject.dnsSuffix = responseObject.response.body.string['_'];
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, responseObject.dnsSuffix, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a new publishing user.
*
* @this {WebsiteManagementService}
* @param {string}             username                  The publishing user username.
* @param {object}             password                  The publishing user password.
* @param {object|function}    [optionsOrCallback]       The create options or callback function.
* @param {int}                [optionsOrCallback.name]  The publishing user name.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.createPublishingUser = function (username, password, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var publishingUser = {
    User: {
      '$': {
        xmlns: 'http://schemas.microsoft.com/windowsazure',
        'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
      },
      Name: { '$': { 'nil': true } },
      PublishingPassword: password,
      PublishingUserName: username
    }
  };

  if (options.name) {
    publishingUser.User.Name = options.name;
  }

  var publishingUserXml = js2xml.serialize(publishingUser);

  var webResource = WebResource.put(this._makePath('webspaces/'))
    .withQueryOption('properties', 'publishingCredentials')
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(publishingUserXml, 'utf8'))
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/atom+xml;charset="utf-8"');

  this.performRequest(webResource, publishingUserXml, null, function (responseObject, next) {
    // TODO: temporary workaround for an invalid return code
    if (responseObject.error.code === 'Unauthorized') {
      responseObject.error = null;
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Retrieves the existing websites.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName                              The webspace name.
* @param {object|function}    [optionsOrCallback]                       The create options or callback function.
* @param {array}              [optionsOrCallback.propertiesToInclude]   The properties to include.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.listSites = function (webspaceName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var webResource = WebResource.get(this._makePath('webspaces/' + webspaceName + '/sites/'));

  if (options && options.propertiesToInclude) {
    webResource.withQueryOption('propertiesToInclude', options.propertiesToInclude.join(','));
  }

  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.sites = [];

      if (responseObject.response.body.Sites && responseObject.response.body.Sites.Site) {
        responseObject.sites = responseObject.response.body.Sites.Site;
        if (!_.isArray(responseObject.sites)) {
          responseObject.sites = [ responseObject.sites ];
        }
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.sites, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Retrieves the existing website.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName                              The webspace name.
* @param {string}             siteName                                  The site name.
* @param {object|function}    [optionsOrCallback]                       The create options or callback function.
* @param {array}              [optionsOrCallback.propertiesToInclude]   The properties to include.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.getSite = function (webspaceName, siteName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var webResource = WebResource.get(this._makePath('webspaces/' + webspaceName + '/sites/' + siteName));

  if (options && options.propertiesToInclude) {
    webResource.withQueryOption('propertiesToInclude', options.propertiesToInclude.join(','));
  }

  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.site = null;

      if (responseObject.response.body.Site) {
        responseObject.site = responseObject.response.body.Site;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.site, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a new website.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName                              The webspace name.
* @param {string}             siteName                                  The site name.
* @param {object|function}    [optionsOrCallback]                       The create options or callback function.
* @param {array}              [optionsOrCallback.propertiesToInclude]   The properties to include.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.createSite = function (webspaceName, siteName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  options['$'] = {
    xmlns: 'http://schemas.microsoft.com/windowsazure',
    'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
  };

  options.Name = siteName;
  var siteXml = js2xml.serialize({ Site: options });

  var webResource = WebResource.post(this._makePath('webspaces/' + webspaceName + '/sites'));

  this.performRequest(webResource, siteXml, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.site = null;

      if (responseObject.response.body.Site) {
        responseObject.site = responseObject.response.body.Site;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.site, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deltes a website.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName                              The webspace name.
* @param {string}             siteName                                  The site name.
* @param {object|function}    [optionsOrCallback]                       The create options or callback function.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.deleteSite = function (webspaceName, siteName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var webResource = WebResource.del(this._makePath('webspaces/' + webspaceName + '/sites/' + siteName));

  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Updates an existing website.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName                              The webspace name.
* @param {string}             siteName                                  The site name.
* @param {object|function}    [optionsOrCallback]                       The create options or callback function.
* @param {array}              [optionsOrCallback.propertiesToInclude]   The properties to include.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.updateSite = function (webspaceName, siteName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  options['$'] = {
    xmlns: 'http://schemas.microsoft.com/windowsazure',
    'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
  };

  options.Name = siteName;
  var siteXml = js2xml.serialize({ Site: options });

  var webResource = WebResource.put(this._makePath('webspaces/' + webspaceName + '/sites/' + siteName));

  this.performRequest(webResource, siteXml, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.site = null;

      if (responseObject.response.body.Site) {
        responseObject.site = responseObject.response.body.Site;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.site, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Retrieves a site configuration.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName              The webspace name.
* @param {string}             siteName                  The site name.
* @param {object|function}    [optionsOrCallback]       The create options or callback function.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.getSiteConfiguration = function (webspaceName, siteName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var webResource = WebResource.get(this._makePath('webspaces/' + webspaceName + '/sites/' + siteName + '/config'));
  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.config = null;

      if (responseObject.response.body.SiteConfig) {
        responseObject.config = responseObject.response.body.SiteConfig;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.config, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Updates a site configuration.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName              The webspace name.
* @param {string}             siteName                  The site name.
* @param {object|function}    [optionsOrCallback]       The create options or callback function.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.updateSiteConfiguration = function (webspaceName, siteName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  options['$'] = {
    xmlns: 'http://schemas.microsoft.com/windowsazure',
    'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
  };

  var website = {
    SiteConfig: options
  };

  var websiteXml = js2xml.serialize(website);

  var webResource = WebResource.put(this._makePath('webspaces/' + webspaceName + '/sites/' + siteName + '/config'))
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(websiteXml, 'utf8'))
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/xml;charset="utf-8"');

  this.performRequest(webResource, websiteXml, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a new server farm.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName              The webspace name.
* @param {string}             serverFarmName            The server farm name.
* @param {string}             numberOfWorkers           The number of workers.
* @param {string}             workerSize                The worker size.
* @param {object|function}    [optionsOrCallback]       The create options or callback function.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.createServerFarm = function (webspaceName, serverFarmName, numberOfWorkers, workerSize, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var serverFarm = {
    ServerFarm: {
      '$': {
        xmlns: 'http://schemas.microsoft.com/windowsazure',
        'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
      },
      Name: serverFarmName,
      NumberOfWorkers: numberOfWorkers,
      WorkerSize: workerSize
    }
  };

  var serverFarmXml = js2xml.serialize(serverFarm);

  var webResource = WebResource.post(this._makePath('webspaces/' + webspaceName + '/serverfarms'))
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(serverFarmXml, 'utf8'))
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/xml;charset="utf-8"');

  this.performRequest(webResource, serverFarmXml, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Updates a server farm.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName              The webspace name.
* @param {string}             serverFarmName            The server farm name.
* @param {string}             numberOfWorkers           The number of workers.
* @param {string}             workerSize                The worker size.
* @param {object|function}    [optionsOrCallback]       The create options or callback function.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.updateServerFarm = function (webspaceName, serverFarmName, numberOfWorkers, workerSize, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var serverFarm = {
    ServerFarm: {
      '$': {
        xmlns: 'http://schemas.microsoft.com/windowsazure',
        'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance'
      },
      Name: serverFarmName,
      NumberOfWorkers: numberOfWorkers,
      WorkerSize: workerSize
    }
  };

  var serverFarmXml = js2xml.serialize(serverFarm);

  var webResource = WebResource.put(this._makePath('webspaces/' + webspaceName + '/serverfarms/' + serverFarmName))
    .withHeader(HeaderConstants.CONTENT_LENGTH, Buffer.byteLength(serverFarmXml, 'utf8'))
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/xml;charset="utf-8"');

  this.performRequest(webResource, serverFarmXml, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Retrieves a server farm.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName              The webspace name.
* @param {string}             serverFarmName            The server farm name.
* @param {object|function}    [optionsOrCallback]       The create options or callback function.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.getServerFarm = function (webspaceName, serverFarmName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var webResource = WebResource.get(this._makePath('webspaces/' + webspaceName + '/serverfarms/' + serverFarmName));
  this.performRequest(webResource, null, null, function (responseObject, next) {
    if (!responseObject.error) {
      responseObject.serverFarm = null;

      if (responseObject.response.body.ServerFarm) {
        responseObject.serverFarm = responseObject.response.body.ServerFarm;
      }
    }

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Creates a website repository.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName              The webspace name.
* @param {string}             siteName                  The site name.
* @param {object|function}    [optionsOrCallback]       The create options or callback function.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.createSiteRepository = function (webspaceName, siteName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var webResource = WebResource.post(this._makePath('webspaces/' + webspaceName + '/sites/' + siteName + '/repository'))
    .withHeader(HeaderConstants.CONTENT_LENGTH, 0)
    .withHeader(HeaderConstants.CONTENT_TYPE, 'application/xml;charset="utf-8"');

  this.performRequest(webResource, '', null, function (responseObject, next) {

    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Deletes a website repository.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName              The webspace name.
* @param {string}             siteName                  The site name.
* @param {object|function}    [optionsOrCallback]       The create options or callback function.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.deleteSiteRepository = function (webspaceName, siteName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var webResource = WebResource.del(this._makePath('webspaces/' + webspaceName + '/sites/' + siteName + '/repository'));
  this.performRequest(webResource, null, null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

/**
* Sync a website repository.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName              The webspace name.
* @param {string}             siteName                  The site name.
* @param {object|function}    [optionsOrCallback]       The create options or callback function.
* @param {function} callback function (err, results, response) The callback function called on completion. Required.
*/
WebsiteManagementService.prototype.syncSiteRepository = function (webspaceName, siteName, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (_.isFunction(optionsOrCallback)) {
    callback = optionsOrCallback;
    options = {};
  }

  var webResource = WebResource.post(this._makePath('webspaces/' + webspaceName + '/sites/' + siteName + '/repository?action=sync'))
                                                   .withHeader(HeaderConstants.CONTENT_LENGTH, 0);

  this.performRequest(webResource, '', null, function (responseObject, next) {
    var finalCallback = function (returnObject) {
      callback(returnObject.error, returnObject.response);
    };

    next(responseObject, finalCallback);
  });
};

WebsiteManagementService.prototype._makePath = function (operationName) {
  return '/' + this.subscriptionId + '/services/' + operationName;
};

module.exports = WebsiteManagementService;