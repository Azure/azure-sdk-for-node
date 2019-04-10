// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';

const adal = require('adal-node');
const async = require('async');
const fs = require('fs');
const msRest = require('ms-rest');
const azureConstants = require('./constants');
const AzureEnvironment = require('./azureEnvironment');
const ApplicationTokenCredentials = require('./credentials/applicationTokenCredentials');
const DeviceTokenCredentials = require('./credentials/deviceTokenCredentials');
const UserTokenCredentials = require('./credentials/userTokenCredentials');
const MSIVmTokenCredentials = require('./credentials/msiVmTokenCredentials');
const MSIAppServiceTokenCredentials = require('./credentials/msiAppServiceTokenCredentials');
const SubscriptionClient = require('./subscriptionManagement/subscriptionClient');

/**
 * @constant {Array<string>} managementPlaneTokenAudiences - Urls for management plane token audience across different azure environments.
 */
const managementPlaneTokenAudiences = [
  'https://management.core.windows.net/',
  'https://management.core.chinacloudapi.cn/',
  'https://management.core.usgovcloudapi.net/',
  'https://management.core.cloudapi.de/',
  'https://management.core.windows.net',
  'https://management.core.chinacloudapi.cn',
  'https://management.core.usgovcloudapi.net',
  'https://management.core.cloudapi.de',
];

// It will create a DeviceTokenCredentials object by default
function _createCredentials(parameters) {
  /* jshint validthis: true */
  let options = {};
  options.environment = this.environment;
  options.domain = this.domain;
  options.clientId = this.clientId;
  options.tokenCache = this.tokenCache;
  options.username = this.username;
  options.authorizationScheme = this.authorizationScheme;
  options.tokenAudience = this.tokenAudience;
  if (parameters) {
    if (parameters.domain) {
      options.domain = parameters.domain;
    }
    if (parameters.environment) {
      options.environment = parameters.environment;
    }
    if (parameters.userId) {
      options.username = parameters.userId;
    }
    if (parameters.tokenCache) {
      options.tokenCache = parameters.tokenCache;
    }
    if (parameters.tokenAudience) {
      options.tokenAudience = parameters.tokenAudience;
    }
  }
  let credentials;
  if (UserTokenCredentials.prototype.isPrototypeOf(this)) {
    credentials = new UserTokenCredentials(options.clientId, options.domain, options.username, this.password, options);
  } else if (ApplicationTokenCredentials.prototype.isPrototypeOf(this)) {
    credentials = new ApplicationTokenCredentials(options.clientId, options.domain, this.secret, options);
  } else {
    credentials = new DeviceTokenCredentials(options);
  }
  return credentials;
}

function buildTenantList(credentials, callback) {
  let tenants = [];
  if (credentials.domain && credentials.domain !== azureConstants.AAD_COMMON_TENANT) {
    return callback(null, [credentials.domain]);
  }
  let client = new SubscriptionClient(credentials, credentials.environment.resourceManagerEndpointUrl);
  client.tenants.list(function (err, result) {
    async.eachSeries(result, function (tenantInfo, cb) {
      tenants.push(tenantInfo.tenantId);
      cb(err);
    }, function (err) {
      callback(err, tenants);
    });
  });
}

function _getSubscriptionsFromTenants(tenantList, callback) {
  /* jshint validthis: true */
  let self = this;
  let subscriptions = [];
  let userType = 'user';
  let username = self.username;
  if (ApplicationTokenCredentials.prototype.isPrototypeOf(self)) {
    userType = 'servicePrincipal';
    username = self.clientId;
  }
  async.eachSeries(tenantList, function (tenant, cb) {
    // Getting subscriptions is a management plane call hence the token audience should always be set to the resource of that environment.
    let creds = _createCredentials.call(self, { domain: tenant, tokenAudience: self.environment.activeDirectoryResourceId });
    let client = new SubscriptionClient(creds, creds.environment.resourceManagerEndpointUrl);
    client.subscriptions.list(function (err, result) {
      if (!err) {
        if (result && result.length > 0) {
          subscriptions = subscriptions.concat(result.map(function (s) {
            s.tenantId = tenant;
            s.user = { name: username, type: userType };
            s.environmentName = creds.environment.name;
            s.name = s.displayName;
            s.id = s.subscriptionId;
            delete s.displayName;
            delete s.subscriptionId;
            delete s.subscriptionPolicies;
            return s;
          }));
        }
      }
      return cb(err);
    });
  }, function (err) {
    callback(err, subscriptions);
  });
}

function _turnOnLogging() {
  let log = adal.Logging;
  log.setLoggingOptions(
    {
      level: log.LOGGING_LEVEL.VERBOSE,
      log: function (level, message, error) {
        console.info(message);
        if (error) {
          console.error(error);
        }
      }
    });
}

if (process.env['AZURE_ADAL_LOGGING_ENABLED']) {
  _turnOnLogging();
}

function _crossCheckUserNameWithToken(usernameFromMethodCall, userIdFromToken) {
  //to maintain the casing consistency between 'azureprofile.json' and token cache. (RD 1996587)
  //use the 'userId' here, which should be the same with "username" except the casing.
  if (usernameFromMethodCall.toLowerCase() === userIdFromToken.toLowerCase()) {
    return userIdFromToken;
  } else {
    throw new Error(`The userId of "${userIdFromToken}" in access token doesn't match the username from method call "usernameFromMethodCall".`);
  }
}

function _interactive(options, callback) {
  /* jshint validthis: true */
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (!options.environment) {
    options.environment = AzureEnvironment.Azure;
  }

  if (!options.domain) {
    options.domain = azureConstants.AAD_COMMON_TENANT;
  }

  if (!options.clientId) {
    options.clientId = azureConstants.DEFAULT_ADAL_CLIENT_ID;
  }

  if (!options.tokenCache) {
    options.tokenCache = new adal.MemoryCache();
  }

  if (!options.language) {
    options.language = azureConstants.DEFAULT_LANGUAGE;
  }
  let interactiveOptions = {};
  interactiveOptions.tokenAudience = options.tokenAudience;
  interactiveOptions.environment = options.environment;
  interactiveOptions.domain = options.domain;
  interactiveOptions.clientId = options.clientId;
  interactiveOptions.tokenCache = options.tokenCache;
  interactiveOptions.language = options.language;
  interactiveOptions.userCodeResponseLogger = options.userCodeResponseLogger;
  let authorityUrl = interactiveOptions.environment.activeDirectoryEndpointUrl + interactiveOptions.domain;
  interactiveOptions.context = new adal.AuthenticationContext(authorityUrl, interactiveOptions.environment.validateAuthority, interactiveOptions.tokenCache);
  let tenantList = [];
  // will retry until a non-pending error is returned or credentials are returned.
  let tryAcquireToken = function (userCodeResponse, callback) {
    let resource = interactiveOptions.environment.activeDirectoryResourceId;
    if (interactiveOptions.tokenAudience) {
      resource = interactiveOptions.tokenAudience;
    }
    interactiveOptions.context.acquireTokenWithDeviceCode(resource, interactiveOptions.clientId, userCodeResponse, function (err, tokenResponse) {
      if (err) {
        if (err.error === 'authorization_pending') {
          setTimeout(() => {
            tryAcquireToken(userCodeResponse, callback);
          }, 1000);
        } else {
          return callback(err);
        }
      }
      interactiveOptions.username = tokenResponse.userId;
      interactiveOptions.authorizationScheme = tokenResponse.tokenType;
      return callback(null);
    });
  };

  //execute actions in sequence
  async.waterfall([
    //acquire usercode
    function (callback) {
      let resource = interactiveOptions.environment.activeDirectoryResourceId;
      if (interactiveOptions.tokenAudience) {
        resource = interactiveOptions.tokenAudience;
      }
      interactiveOptions.context.acquireUserCode(resource, interactiveOptions.clientId, interactiveOptions.language, function (err, userCodeResponse) {
        if (err) return callback(err);
        if (interactiveOptions.userCodeResponseLogger) {
          interactiveOptions.userCodeResponseLogger(userCodeResponse.message);
        } else {
          console.log(userCodeResponse.message);
        }
        return callback(null, userCodeResponse);
      });
    },
    //acquire token with device code and set the username to userId received from tokenResponse.
    tryAcquireToken,
    //get the list of tenants
    function (callback) {
      let credentials = _createCredentials.call(interactiveOptions);
      buildTenantList(credentials, callback);
    },
    //build the token cache by getting tokens for all the tenants. We will acquire token from adal only when a request is sent. This is good as we also need
    //to build the list of subscriptions across all tenants. So let's build both at the same time :).
    function (tenants, callback) {
      tenantList = tenants;
      if (interactiveOptions.tokenAudience && !managementPlaneTokenAudiences.some((item) => { return item === interactiveOptions.tokenAudience.toLowerCase(); })) {
        // we dont need to get the subscriptionList if the tokenAudience is graph or batch or resource of any other data plane client.
        return callback(null, []);
      } else {
        return _getSubscriptionsFromTenants.call(interactiveOptions, tenants, callback);
      }
    }
  ], function (err, subscriptions) {
    if (err) return callback(err);
    return callback(null, _createCredentials.call(interactiveOptions), subscriptions);
  });
}

/**
 * Provides a url and code that needs to be copy and pasted in a browser and authenticated over there. If successful, the user will get a 
 * DeviceTokenCredentials object and the list of subscriptions associated with that userId across all the applicable tenants.
 *
 * @param {object} [options] Object representing optional parameters.
 *
 * @param {string} [options.clientId] The active directory application client id.
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net} 
 * for an example.
 *
 * @param {string} [options.tokenAudience] The audience for which the token is requested. Valid values are 'graph', 'batch' or any other resource like 'https://vault.azure.com/'.
 * If tokenAudience is 'graph' then domain should also be provided and its value should not be the default 'common' tenant. It must be a string (preferrably in a guid format).
 *
 * @param {string} [options.domain] The domain or tenant id containing this application. Default value is 'common'.
 *
 * @param {AzureEnvironment} [options.environment] The azure environment to authenticate with. Default environment is "Public Azure".
 *
 * @param {object} [options.tokenCache] The token cache. Default value is the MemoryCache object from adal.
 *
 * @param {object} [options.language] The language code specifying how the message should be localized to. Default value 'en-us'.
 *
 * @param {object|function} [options.userCodeResponseLogger] A logger that logs the user code response message required for interactive login. When
 * this option is specified the usercode response message will not be logged to console.
 *
 * @param {function} [optionalCallback] The optional callback.
 *
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 * 
 *    {function} optionalCallback(err, credentials)
 *                 {Error}  [err]                           - The Error object if an error occurred, null otherwise.
 *                 {DeviceTokenCredentials} [credentials]   - The DeviceTokenCredentials object.
 *                 {Array}                [subscriptions]   - List of associated subscriptions across all the applicable tenants.
 *    {Promise} A promise is returned.
 *             @resolve {DeviceTokenCredentials} The DeviceTokenCredentials object.
 *             @reject {Error} - The error object.
 */
exports.interactive = function interactive(options, optionalCallback) {
  if (!optionalCallback && typeof options === 'function') {
    optionalCallback = options;
    options = {};
  }
  if (!options) options = {};
  if (!optionalCallback) {
    return new Promise((resolve, reject) => {
      _interactive(options, (err, credentials) => {
        if (err) { reject(err); }
        else { resolve(credentials); }
        return;
      });
    });
  } else {
    return _interactive(options, optionalCallback);
  }
};

exports.interactiveWithAuthResponse = function interactiveWithAuthResponse(options) {
  if (!options) options = {};
  return new Promise((resolve, reject) => {
    _interactive(options, (err, credentials, subscriptions) => {
      if (err) { reject(err); }
      else {
        let authResponse = { credentials: credentials, subscriptions: subscriptions };
        resolve(authResponse);
      }
      return;
    });
  });
};


function _withUsernamePassword(username, password, options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (!options.domain) {
    options.domain = azureConstants.AAD_COMMON_TENANT;
  }

  if (!options.clientId) {
    options.clientId = azureConstants.DEFAULT_ADAL_CLIENT_ID;
  }
  let creds;
  let tenantList = [];
  try {
    creds = new UserTokenCredentials(options.clientId, options.domain, username, password, options);
  } catch (err) {
    return callback(err);
  }
  creds.getToken(function (err, result) {
    if (err) return callback(err);
    creds.username = _crossCheckUserNameWithToken(username, result.userId);
    async.waterfall([
      function (callback) {
        buildTenantList(creds, callback);
      },
      function (tenants, callback) {
        tenantList = tenants;
        if (options.tokenAudience && !managementPlaneTokenAudiences.some((item) => { return item === options.tokenAudience.toLowerCase(); })) {
          // we dont need to get the subscriptionList if the tokenAudience is graph or batch or resource of any other data plane client.
          return callback(null, []);
        } else {
          return _getSubscriptionsFromTenants.call(options, tenants, callback);
        }
      },
    ], function (err, subscriptions) {
      return callback(null, creds, subscriptions);
    });
  });
}

/**
 * Provides a UserTokenCredentials object and the list of subscriptions associated with that userId across all the applicable tenants. 
 * This method is applicable only for organizational ids that are not 2FA enabled otherwise please use interactive login.
 *
 * @param {string} username The user name for the Organization Id account.
 * @param {string} password The password for the Organization Id account.
 * @param {object} [options] Object representing optional parameters.
 * @param {string} [options.clientId] The active directory application client id. 
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net} 
 * for an example.
 * @param {string} [options.tokenAudience] The audience for which the token is requested. Valid values are 'graph', 'batch' or any other resource like 'https://vault.azure.com/'.
 * If tokenAudience is 'graph' then domain should also be provided and its value should not be the default 'common' tenant. It must be a string (preferrably in a guid format).
 * @param {string} [options.domain] The domain or tenant id containing this application. Default value 'common'.
 * @param {AzureEnvironment} [options.environment] The azure environment to authenticate with.
 * @param {string} [options.authorizationScheme] The authorization scheme. Default value is 'bearer'.
 * @param {object} [options.tokenCache] The token cache. Default value is the MemoryCache object from adal.
 * @param {function} [optionalCallback] The optional callback.
 *
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 * 
 *    {function} optionalCallback(err, credentials)
 *                 {Error}  [err]                         - The Error object if an error occurred, null otherwise.
 *                 {UserTokenCredentials} [credentials]   - The UserTokenCredentials object.
 *                 {Array}                [subscriptions] - List of associated subscriptions across all the applicable tenants.
 *    {Promise} A promise is returned.
 *             @resolve {UserTokenCredentials} The UserTokenCredentials object.
 *             @reject {Error} - The error object.
 */
exports.withUsernamePassword = function withUsernamePassword(username, password, options, optionalCallback) {
  if (!optionalCallback && typeof options === 'function') {
    optionalCallback = options;
    options = {};
  }
  if (!options) options = {};
  if (!optionalCallback) {
    return new Promise((resolve, reject) => {
      _withUsernamePassword(username, password, options, (err, credentials) => {
        if (err) { reject(err); }
        else { resolve(credentials); }
        return;
      });
    });
  } else {
    return _withUsernamePassword(username, password, options, optionalCallback);
  }
};

exports.withUsernamePasswordWithAuthResponse = function withUsernamePasswordWithAuthResponse(username, password, options) {
  if (!options) options = {};
  return new Promise((resolve, reject) => {
    _withUsernamePassword(username, password, options, (err, credentials, subscriptions) => {
      if (err) { reject(err); }
      else {
        let authResponse = { credentials: credentials, subscriptions: subscriptions };
        resolve(authResponse);
      }
      return;
    });
  });
};

function _withServicePrincipalSecret(clientId, secret, domain, options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }
  let creds;
  try {
    creds = new ApplicationTokenCredentials(clientId, domain, secret, options);
  } catch (err) {
    return callback(err);
  }
  creds.getToken(function (err) {
    if (err) return callback(err);
    if (options.tokenAudience && !managementPlaneTokenAudiences.some((item) => { return item === options.tokenAudience.toLowerCase(); })) {
      // we dont need to get the subscriptionList if the tokenAudience is graph or batch or resource of any other data plane client.
      return callback(null, creds, []);
    } else {
      _getSubscriptionsFromTenants.call(creds, [domain], function (err, subscriptions) {
        if (err) return callback(err);
        return callback(null, creds, subscriptions);
      });
    }
  });
}

/**
 * Provides an ApplicationTokenCredentials object and the list of subscriptions associated with that servicePrinicpalId/clientId across all the applicable tenants.
 *
 * @param {string} clientId The active directory application client id also known as the SPN (ServicePrincipal Name). 
 * See {@link https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-dotnet/ Active Directory Quickstart for .Net} 
 * for an example.
 * @param {string} secret The application secret for the service principal.
 * @param {string} domain The domain or tenant id containing this application.
 * @param {object} [options] Object representing optional parameters.
 * @param {string} [options.tokenAudience] The audience for which the token is requested. Valid values are 'graph', 'batch' or any other resource like 'https://vault.azure.com/'.
 * If tokenAudience is 'graph' then domain should also be provided and its value should not be the default 'common' tenant. It must be a string (preferrably in a guid format).
 * @param {AzureEnvironment} [options.environment] The azure environment to authenticate with.
 * @param {string} [options.authorizationScheme] The authorization scheme. Default value is 'bearer'.
 * @param {object} [options.tokenCache] The token cache. Default value is the MemoryCache object from adal.
 * @param {function} [optionalCallback] The optional callback.
 * 
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 * 
 *    {function} optionalCallback(err, credentials)
 *                 {Error}  [err]                               - The Error object if an error occurred, null otherwise.
 *                 {ApplicationTokenCredentials} [credentials]  - The ApplicationTokenCredentials object.
 *                 {Array}                [subscriptions]       - List of associated subscriptions across all the applicable tenants.
 *    {Promise} A promise is returned.
 *             @resolve {ApplicationTokenCredentials} The ApplicationTokenCredentials object.
 *             @reject {Error} - The error object.
 */
exports.withServicePrincipalSecret = function withServicePrincipalSecret(clientId, secret, domain, options, optionalCallback) {
  if (!optionalCallback && typeof options === 'function') {
    optionalCallback = options;
    options = {};
  }
  if (!options) options = {};
  if (!optionalCallback) {
    return new Promise((resolve, reject) => {
      _withServicePrincipalSecret(clientId, secret, domain, options, (err, credentials) => {
        if (err) { reject(err); }
        else { resolve(credentials); }
        return;
      });
    });
  } else {
    return _withServicePrincipalSecret(clientId, secret, domain, options, optionalCallback);
  }
};

exports.withServicePrincipalSecretWithAuthResponse = function withServicePrincipalSecretWithAuthResponse(clientId, secret, domain, options) {
  if (!options) options = {};
  return new Promise((resolve, reject) => {
    _withServicePrincipalSecret(clientId, secret, domain, options, (err, credentials, subscriptions) => {
      if (err) { reject(err); }
      else {
        let authResponse = { credentials: credentials, subscriptions: subscriptions };
        resolve(authResponse);
      }
      return;
    });
  });
};

function _validateAuthFileContent(credsObj, filePath) {
  if (!credsObj) {
    throw new Error('Please provide a credsObj to validate.');
  }
  if (!filePath) {
    throw new Error('Please provide a filePath.');
  }
  if (!credsObj.clientId) {
    throw new Error(`"clientId" is missing from the auth file: ${filePath}.`);
  }
  if (!credsObj.clientSecret) {
    throw new Error(`"clientSecret" is missing from the auth file: ${filePath}.`);
  }
  if (!credsObj.subscriptionId) {
    throw new Error(`"subscriptionId" is missing from the auth file: ${filePath}.`);
  }
  if (!credsObj.tenantId) {
    throw new Error(`"tenantId" is missing from the auth file: ${filePath}.`);
  }
  if (!credsObj.activeDirectoryEndpointUrl) {
    throw new Error(`"activeDirectoryEndpointUrl" is missing from the auth file: ${filePath}.`);
  }
  if (!credsObj.resourceManagerEndpointUrl) {
    throw new Error(`"resourceManagerEndpointUrl" is missing from the auth file: ${filePath}.`);
  }
  if (!credsObj.activeDirectoryGraphResourceId) {
    throw new Error(`"activeDirectoryGraphResourceId" is missing from the auth file: ${filePath}.`);
  }
  if (!credsObj.sqlManagementEndpointUrl) {
    throw new Error(`"sqlManagementEndpointUrl" is missing from the auth file: ${filePath}.`);
  }
}

function _foundManagementEndpointUrl(authFileUrl, envUrl) {
  if (!authFileUrl || (authFileUrl && typeof authFileUrl.valueOf() !== 'string')) {
    throw new Error('authFileUrl cannot be null or undefined and must be of type string.');
  }

  if (!envUrl || (envUrl && typeof envUrl.valueOf() !== 'string')) {
    throw new Error('envUrl cannot be null or undefined and must be of type string.');
  }

  authFileUrl = authFileUrl.endsWith('/') ? authFileUrl.slice(0, -1) : authFileUrl;
  envUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  return (authFileUrl.toLowerCase() === envUrl.toLowerCase());
}

/**
 * Authenticates using the service principal information provided in the auth file. This method will set 
 * the subscriptionId from the auth file to the user provided environment variable in the options 
 * parameter or the default AZURE_SUBSCRIPTION_ID.
 * @param {object} [options] - Optional parameters
 * @param {string} [options.filePath] - Absolute file path to the auth file. If not provided 
 * then please set the environment variable AZURE_AUTH_LOCATION.
 * @param {string} [options.subscriptionEnvVariableName] - The subscriptionId environment variable 
 * name. Default is 'AZURE_SUBSCRIPTION_ID'.
 * @param {function} callback - The callback
 */
function _withAuthFile(options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (!options) options = { filePath: '' };
  if (!callback) {
    throw new Error('callback cannot be null or undefined.');
  }

  let filePath = options.filePath || process.env[azureConstants.AZURE_AUTH_LOCATION];
  let subscriptionEnvVariableName = options.subscriptionEnvVariableName || 'AZURE_SUBSCRIPTION_ID';
  if (!filePath) {
    let msg = `Either provide an absolute file path to the auth file or set/export the environment variable - ${azureConstants.AZURE_AUTH_LOCATION}.`;
    return callback(new Error(msg));
  }
  //expand ~ to user's home directory.
  if (filePath.startsWith('~')) {
    filePath = msRest.homeDir(filePath.slice(1));
  }

  let content = null, credsObj = {}, optionsForSpSecret = {};
  try {
    content = fs.readFileSync(filePath, { encoding: 'utf8' });
    credsObj = JSON.parse(content);
    _validateAuthFileContent(credsObj, filePath);
  } catch (err) {
    return callback(err);
  }

  if (!credsObj.managementEndpointUrl) {
    credsObj.managementEndpointUrl = credsObj.resourceManagerEndpointUrl;
  }
  //setting the subscriptionId from auth file to the environment variable
  process.env[subscriptionEnvVariableName] = credsObj.subscriptionId;
  //get the AzureEnvironment or create a new AzureEnvironment based on the info provided in the auth file
  let envFound = {
    name: ''
  };
  let envNames = Object.keys(Object.getPrototypeOf(AzureEnvironment)).slice(1);
  for (let i = 0; i < envNames.length; i++) {
    let env = envNames[i];
    let environmentObj = AzureEnvironment[env];
    if (environmentObj &&
      environmentObj.managementEndpointUrl &&
      _foundManagementEndpointUrl(credsObj.managementEndpointUrl, environmentObj.managementEndpointUrl)) {
      envFound.name = environmentObj.name;
      break;
    }
  }
  if (envFound.name) {
    optionsForSpSecret.environment = AzureEnvironment[envFound.name];
  } else {
    //create a new environment with provided info.
    let envParams = {
      //try to find a logical name or set the filepath as the env name.
      name: credsObj.managementEndpointUrl.match(/.*management\.core\.(.*)\..*/i)[1] || filePath
    };
    let keys = Object.keys(credsObj);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (key.match(/^(clientId|clientSecret|subscriptionId|tenantId)$/ig) === null) {
        if (key === 'activeDirectoryEndpointUrl' && !key.endsWith('/')) {
          envParams[key] = credsObj[key] + '/';
        } else {
          envParams[key] = credsObj[key];
        }
      }
    }
    if (!envParams.activeDirectoryResourceId) {
      envParams.activeDirectoryResourceId = credsObj.managementEndpointUrl;
    }
    if (!envParams.portalUrl) {
      envParams.portalUrl = 'https://portal.azure.com';
    }
    optionsForSpSecret.environment = AzureEnvironment.add(envParams);
  }
  return exports.withServicePrincipalSecret(credsObj.clientId, credsObj.clientSecret, credsObj.tenantId, optionsForSpSecret, callback);
}

/**
 * Before using this method please install az cli from https://github.com/Azure/azure-cli/releases. Then execute `az ad sp create-for-rbac --sdk-auth > ${yourFilename.json}`.
 * If you want to create the sp for a different cloud/environment then please execute:
 * 1. az cloud list
 * 2. az cloud set –n <name of the environment>
 * 3. az ad sp create-for-rbac --sdk-auth > auth.json
 * 
 * If the service principal is already created then login with service principal info:
 * 3. az login --service-principal -u <clientId> -p <clientSecret> -t <tenantId>
 * 4. az account show --sdk-auth > auth.json 
 * 
 * Authenticates using the service principal information provided in the auth file. This method will set 
 * the subscriptionId from the auth file to the user provided environment variable in the options 
 * parameter or the default 'AZURE_SUBSCRIPTION_ID'.
 * 
 * @param {object} [options] - Optional parameters
 * @param {string} [options.filePath] - Absolute file path to the auth file. If not provided 
 * then please set the environment variable AZURE_AUTH_LOCATION.
 * @param {string} [options.subscriptionEnvVariableName] - The subscriptionId environment variable 
 * name. Default is 'AZURE_SUBSCRIPTION_ID'.
 * @param {function} [optionalCallback] The optional callback.
 * 
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 * 
 *    {function} optionalCallback(err, credentials)
 *                 {Error}  [err]                               - The Error object if an error occurred, null otherwise.
 *                 {ApplicationTokenCredentials} [credentials]  - The ApplicationTokenCredentials object.
 *                 {Array}                [subscriptions]       - List of associated subscriptions across all the applicable tenants.
 *    {Promise} A promise is returned.
 *             @resolve {ApplicationTokenCredentials} The ApplicationTokenCredentials object.
 *             @reject {Error} - The error object.
 */
exports.withAuthFile = function withAuthFile(options, optionalCallback) {
  if (!optionalCallback && typeof options === 'function') {
    optionalCallback = options;
    options = {};
  }
  if (!optionalCallback) {
    return new Promise((resolve, reject) => {
      _withAuthFile(options, (err, credentials) => {
        if (err) { reject(err); }
        else { resolve(credentials); }
        return;
      });
    });
  } else {
    return _withAuthFile(options, optionalCallback);
  }
};

/**
 * Before using this method please install az cli from https://github.com/Azure/azure-cli/releases. Then execute `az ad sp create-for-rbac --sdk-auth > ${yourFilename.json}`.
 * If you want to create the sp for a different cloud/environment then please execute:
 * 1. az cloud list
 * 2. az cloud set –n <name of the environment>
 * 3. az ad sp create-for-rbac --sdk-auth > auth.json
 * 
 * If the service principal is already created then login with service principal info:
 * 3. az login --service-principal -u <clientId> -p <clientSecret> -t <tenantId>
 * 4. az account show --sdk-auth > auth.json 
 * 
 * Authenticates using the service principal information provided in the auth file. This method will set 
 * the subscriptionId from the auth file to the user provided environment variable in the options 
 * parameter or the default 'AZURE_SUBSCRIPTION_ID'.
 * 
 * @param {object} [options] - Optional parameters
 * @param {string} [options.filePath] - Absolute file path to the auth file. If not provided 
 * then please set the environment variable AZURE_AUTH_LOCATION.
 * @param {string} [options.subscriptionEnvVariableName] - The subscriptionId environment variable 
 * name. Default is 'AZURE_SUBSCRIPTION_ID'.
 * 
 * @returns {Promise} A promise is returned.
 *   @resolve {{credentials: ApplicationTokenCredentials, subscriptions: subscriptions[]}} An object with credentials and associated subscription info.
 *   @reject {Error} - The error object.
 */
exports.withAuthFileWithAuthResponse = function withAuthFileWithAuthResponse(options) {
  return new Promise((resolve, reject) => {
    _withAuthFile(options, (err, credentials, subscriptions) => {
      if (err) { reject(err); }
      else {
        let authResponse = { credentials: credentials, subscriptions: subscriptions };
        resolve(authResponse);
      }
      return;
    });
  });
};

/**
 * private helper for MSI auth. Initializes MSITokenCredentials class and calls getToken and returns a token response.
 *
 * @param {object} options -- Optional parameters
 * @param {string} [options.port] - port on which the MSI service is running on the host VM. Default port is 50342
 * @param {string} [options.resource] - The resource uri or token audience for which the token is needed.
 * @param {any} callback - the callback function.
 */
function _withMSI(options, callback) {
  if (!callback) {
    throw new Error('callback cannot be null or undefined.');
  }
  const creds = new MSIVmTokenCredentials(options);
  creds.getToken(function (err) {
    if (err) return callback(err);
    return callback(null, creds);
  });
}

/**
 * Before using this method please install az cli from https://github.com/Azure/azure-cli/releases.
 * If you have an Azure virtual machine provisioned with az cli and has MSI enabled,
 * you can then use this method to get auth tokens from the VM.
 * 
 * To create a new VM, enable MSI, please execute this command:
 * az vm create -g <resource_group_name> -n <vm_name> --assign-identity --image <os_image_name>
 * Note: the above command enables a service endpoint on the host, with a default port 50342
 * 
 * To enable MSI on a already provisioned VM, execute the following command:
 * az vm --assign-identity -g <resource_group_name> -n <vm_name> --port <custom_port_number>
 * 
 * To know more about this command, please execute:
 * az vm --assign-identity -h
 * 
 * Authenticates using the identity service running on an Azure virtual machine.
 * This method makes a request to the authentication service hosted on the VM
 * and gets back an access token.
 * 
 * @param {object} [options] - Optional parameters
 * @param {string} [options.port] - port on which the MSI service is running on the host VM. Default port is 50342
 * @param {string} [options.resource] - The resource uri or token audience for which the token is needed.
 * For e.g. it can be:
 * - resourcemanagement endpoint "https://management.azure.com"(default) 
 * - management endpoint "https://management.core.windows.net/"
 * @param {function} [optionalCallback] The optional callback.
 * 
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 * 
 *    {function} optionalCallback(err, credentials)
 *                 {Error}  [err]                               - The Error object if an error occurred, null otherwise.
 *                 {object} [tokenResponse]                     - The tokenResponse (token_type and access_token are the two important properties)
 *    {Promise} A promise is returned.
 *             @resolve {object} - tokenResponse.
 *             @reject {Error} - error object.
 */
exports.withMSI = function withMSI(options, optionalCallback) {
  if (!optionalCallback && typeof options === 'function') {
    optionalCallback = options;
    options = {};
  }
  if (!optionalCallback) {
    return new Promise((resolve, reject) => {
      _withMSI(options, (err, credentials) => {
        if (err) { reject(err); }
        else { resolve(credentials); }
        return;
      });
    });
  } else {
    return _withMSI(options, optionalCallback);
  }
};

/**
 * Private method
 */
function _withAppServiceMSI(options, callback) {
  if (!callback) {
    throw new Error('callback cannot be null or undefined.');
  }
  let creds;
  try {
    creds = new MSIAppServiceTokenCredentials(options);
  } catch (err) {
    return callback(err);
  }
  creds.getToken(function (err) {
    if (err) return callback(err);
    return callback(null, creds);
  });
}

/**
 * Authenticate using the App Service MSI.
 * @param {object} [options] - Optional parameters
 * @param {string} [options.msiEndpoint] - The local URL from which your app can request tokens.
 * Either provide this parameter or set the environment varaible `MSI_ENDPOINT`.
 * For example: `MSI_ENDPOINT="http://127.0.0.1:41741/MSI/token/"`
 * @param {string} [options.msiSecret] - The secret used in communication between your code and the local MSI agent.
 * Either provide this parameter or set the environment varaible `MSI_SECRET`.
 * For example: `MSI_SECRET="69418689F1E342DD946CB82994CDA3CB"`
 * @param {string} [options.resource] - The resource uri or token audience for which the token is needed.
 * For example, it can be:
 * - resourcemanagement endpoint "https://management.azure.com"(default) 
 * - management endpoint "https://management.core.windows.net/"
 * @param {string} [options.msiApiVersion] - The api-version of the local MSI agent. Default value is "2017-09-01".
 * @param {function} [optionalCallback] -  The optional callback.
 * @returns {function | Promise} If a callback was passed as the last parameter then it returns the callback else returns a Promise.
 * 
 *    {function} optionalCallback(err, credentials)
 *                 {Error}  [err]                               - The Error object if an error occurred, null otherwise.
 *                 {object} [tokenResponse]                     - The tokenResponse (token_type and access_token are the two important properties)
 *    {Promise} A promise is returned.
 *             @resolve {object} - tokenResponse.
 *             @reject {Error} - error object.
 */
exports.withAppServiceMSI = function withAppServiceMSI(options, optionalCallback) {
  if (!optionalCallback && typeof options === 'function') {
    optionalCallback = options;
    options = {};
  }
  if (!optionalCallback) {
    return new Promise((resolve, reject) => {
      _withAppServiceMSI(options, (err, credentials) => {
        if (err) { reject(err); }
        else { resolve(credentials); }
        return;
      });
    });
  } else {
    return _withAppServiceMSI(options, optionalCallback);
  }
};

exports = module.exports;