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
var util = require('util');
var _ = require('underscore');
var js2xml = require('../../util/js2xml');

var ServiceManagementClient = require('../core/servicemanagementclient');
var ServiceManagementSettings = require('../core/servicemanagementsettings');
var WebResource = require('../../http/webresource');

var Constants = require('../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

/**
*
* Creates a new WebsiteManagementService object.
* @class
* The WebsiteManagementService object allows you to perform management operations on Windows Azure Web Sites.
* @constructor
*
* @param {string} configOrSubscriptionId   Configuration information, subscription ID for the account or the connection string
* @param {object} authentication                                       The authentication object for the client.
*                                                                      You must use either keyfile/certfile or keyvalue/certvalue
*                                                                      to provide a management certificate to authenticate
*                                                                      service requests.
* @param {string} [authentication.keyfile]                             The path to a file that contains the PEM encoded key
* @param {string} [authentication.certfile]                            The path to a file that contains the PEM encoded certificate
* @param {string} [authentication.keyvalue]                            A string that contains the PEM encoded key
* @param {string} [authentication.certvalue]                           A string that contains the PEM encoded certificate
* @param {object} [hostOptions]                                        The host options to override defaults.
* @param {string} [hostOptions.host='management.core.windows.net']     The management endpoint.
* @param {string} [hostOptions.apiversion='2012-03-01']                The API vesion to be used.
*/
function WebsiteManagementService(configOrSubscriptionId, authentication, hostOptions) {
  var settings = ServiceManagementSettings.createFromParameters(configOrSubscriptionId, authentication, hostOptions);

  WebsiteManagementService['super_'].call(this, settings);

  this.apiversion = '2012-10-10';
  this.subscriptionId = settings._subscriptionId;
}

util.inherits(WebsiteManagementService, ServiceManagementClient);

/**
* Lists the available webspaces.
*
* @this {WebsiteManagementService}
* @param {Function(error, results, response)} callback  `error` will contain information
*                                                       if an error occurs; otherwise `results` will contain
*                                                       the list of webspaces.
*                                                       `response` will contain information related to this operation.
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
* Lists the available geographic regions that are available for hosting web sites.
*
* @this {WebsiteManagementService}
* @param {Function(error, results, response)} callback `error` will contain information
*                                                       if an error occurs; otherwise `results` will contain
*                                                       the list of regions.
*                                                       `response` will contain information related to this operation.
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
* @param {Function(error, results, response)} callback `error` will contain information
*                                                       if an error occurs; otherwise `results` will contain
*                                                       the list of users.
*                                                       `response` will contain information related to this operation.
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
* lists the DNS suffix.
*
* @this {WebsiteManagementService}
* @param {Function(error, results, response)} callback `error` will contain information
*                                                       if an error occurs; otherwise `results` will contain
*                                                       the DNS suffix information.
*                                                       `response` will contain information related to this operation.
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
* @param {string}             password                  The publishing user password.
* @param {object}             [options]                 The options.
* @param {int}                [options.name]            The publishing user name.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise `response` will contain information related to this operation.
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
* @param {string}             webspaceName                    The webspace name.
* @param {object}             [options]                       The options.
* @param {array}              [options.propertiesToInclude]   The properties to include.
* @param {Function(error, results, response)} callback        `error` will contain information
*                                                             if an error occurs; otherwise `results` will contain
*                                                             the list of web sites.
*                                                             `response` will contain information related to this operation.
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
* Retrieves the existing web site.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName                              The webspace name.
* @param {string}             siteName                                  The site name.
* @param {object}             [options]                                 The options.
* @param {array}              [options.propertiesToInclude]             The properties to include.
* @param {Function(error, results, response)} callback                  `error` will contain information
*                                                                       if an error occurs; otherwise `results` will contain
*                                                                       the the web site information.
*                                                                       `response` will contain information related to this operation.
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
* @param {string}             webspaceName                    The webspace name.
* @param {string}             siteName                        The site name.
* @param {object}             [options]                       The options.
* @param {array}              [options.propertiesToInclude]   The properties to include.
* @param {Function(error, results, response)} callback        `error` will contain information
*                                                             if an error occurs; otherwise `results` will contain
*                                                             the new site information.
*                                                             `response` will contain information related to this operation.
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
* Deletes a website.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName       The webspace name.
* @param {string}             siteName           The site name.
* @param {object}             [options]          The options.
* @param {Function(error, response)} callback    `error` will contain information
*                                                if an error occurs; otherwise `response` will contain information related to this operation.
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
* Updates an existing web site.
*
* @this {WebsiteManagementService}
* @param {string}             webspaceName                    The webspace name.
* @param {string}             siteName                        The site name.
* @param {object}             [options]                       The options.
* @param {array}              [options.propertiesToInclude]   The properties to include.
* @param {Function(error, results, response)} callback        `error` will contain information
*                                                             if an error occurs; otherwise `results` will contain
*                                                             the updated web site information.
*                                                             `response` will contain information related to this operation.
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
* @param {object}             [options]                 The options.
* @param {Function(error, results, response)} callback  `error` will contain information
*                                                       if an error occurs; otherwise `results` will contain
*                                                       the site configuration.
*                                                       `response` will contain information related to this operation.
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
* @param {object}             [options]                 The options.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise `response` will contain information related to this operation.
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
* @param {object}             [options]                 The options.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise `response` will contain information related to this operation.
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
* @param {object}             [options]                 The options.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise `response` will contain information related to this operation.
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
* @param {object}             [options]                 The options.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise `response` will contain information related to this operation.
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
* @param {object}             [options]                 The options.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise `response` will contain information related to this operation.
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
* @param {object}             [options]                 The options.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise `response` will contain information related to this operation.
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
* @param {object}             [options]                 The options.
* @param {Function(error, response)} callback           `error` will contain information
*                                                       if an error occurs; otherwise `response` will contain information related to this operation.
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