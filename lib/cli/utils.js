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

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var url = require('url');
var azure = require('../azure');
var blobUtils = require('./blobUtils');
var constants = require('./constants');
var _ = require('underscore');
_.mixin(require('underscore.string'));

var BEGIN_CERT = '-----BEGIN CERTIFICATE-----';
var END_CERT   = '-----END CERTIFICATE-----';

exports.createServiceManagementService = function(subscriptionId, account, logger) {
  var pem = account.managementCertificate();
  var managementEndpoint = url.parse(exports.getManagementEndpointUrl(account.managementEndpointUrl()));
  return azure.createServiceManagementService(subscriptionId, {
    keyvalue: pem.key,
    certvalue: pem.cert
  }, {
    host: managementEndpoint.hostname,
    port: managementEndpoint.port,
    serializetype: 'XML' // TODO switch back to JSON when enabled
  }).withFilter(new RequestLogFilter(logger));
};

var doServiceManagementOperation = exports.doServiceManagementOperation = function(channel, operation) {
  var callback = arguments[arguments.length - 1];

  function callback_(error, response) {
    if (error) {
      callback(error, response);
    } else {
      if (response.statusCode === 200) {
        callback(null, response);
      } else {
        // poll
        pollRequest(channel, response.headers['x-ms-request-id'], function(error, response) {
          if (error) {
            callback(error, response);
          } else {
            callback(null, response);
          }
        });
      }
    }
  };

  var args = Array.prototype.slice.call(arguments).slice(2, arguments.length - 1);
  args.push(callback_);
  if (!channel[operation]) {
    throw new Error('Incorrect service management operarion requested : ' + operation);
  }
  channel[operation].apply(channel, args);
};

function pollRequest(channel, reqid, callback) {
  channel.getOperationStatus(reqid, function(error, response) {
    if (error) {
      callback(error, { isSuccessful: false });
    } else {
      assert.ok(response.isSuccessful);
      var body = response.body;
      if (body.Status === 'InProgress') {
        setTimeout(function() {
          pollRequest(channel, reqid, callback);
        }, 1000);
      } else if (body.Status === 'Failed') {
        callback(body.Error, { isSuccessful: false,  statusCode: body.HttpStatusCode});
      } else {
        callback(null, { isSuccessful: true,  statusCode: body.HttpStatusCode});
      }
    }
  });
}

function RequestLogFilter(logger) {
  this.logger = logger;
}

RequestLogFilter.prototype.handle = function (requestOptions, next) {
  var self = this;
  this.logger.silly('requestOptions');
  this.logger.json('silly', requestOptions);
  if (next) {
    next(requestOptions, function (returnObject, finalCallback, nextPostCallback) {
      self.logger.silly('returnObject');
      self.logger.json('silly', returnObject);

      if (nextPostCallback) {
        nextPostCallback(returnObject);
      } else if (finalCallback) {
        finalCallback(returnObject);
      }
    });
  }
};

exports.isSha1Hash = function(str) {
  return (/\b([a-fA-F0-9]{40})\b/).test(str);
};

exports.getCertFingerprint = function(pem) {
  // Extract the base64 encoded cert out of pem file
  var beginCert = pem.indexOf(BEGIN_CERT) + BEGIN_CERT.length;
  if (pem[beginCert] === '\n') {
    beginCert = beginCert + 1;
  } else if (pem[beginCert] === '\r' && pem[beginCert + 1] === '\n') {
    beginCert = beginCert + 2;
  }
  
  var endCert = '\n' + pem.indexOf(END_CERT);
  if (endCert === -1) {
    endCert = '\r\n' + pem.indexOf(END_CERT);
  }

  var certBase64 = pem.substring(beginCert, endCert);
  
  // Calculate sha1 hash of the cert
  var cert = new Buffer(certBase64, 'base64');
  var sha1 = crypto.createHash('sha1');
  sha1.update(cert);
  return sha1.digest('hex');
};

exports.isPemCert = function(data) {
  return data.indexOf(BEGIN_CERT) !== -1 && data.indexOf(END_CERT) !== -1;
};

exports.getOrCreateBlobStorage = function(cli, svcMgmtChannel, location, affinityGroup, name, callback) {
  var progress;
  
  function callback_(error, blobStorageUrl) {
    progress.end();
    callback(error, blobStorageUrl);
  }

  progress = cli.progress('Retrieving storage accounts');
  cli.output.verbose('Getting list of available storage accounts');
  doServiceManagementOperation(svcMgmtChannel, 'listStorageAccounts', function(error, response) {
    if (error) {
      callback_(error);
    } else {
      var storageAccounts = response.body;
      cli.output.verbose('storage accounts:');
      cli.output.json('verbose', storageAccounts);
      
      if (storageAccounts.length > 0) {
        var i = 0;
        checkNextStorageAccount_();
        
        function checkNextStorageAccount_() {
          cli.output.verbose('Getting properties for \'' + storageAccounts[i].ServiceName + '\' storage account');
          doServiceManagementOperation(svcMgmtChannel, 'getStorageAccountProperties', storageAccounts[i].ServiceName, 
            function(error, response) {
              if (error) {
                callback_(error);
              } else {
                  if ((location && response.body.StorageServiceProperties.Location && response.body.StorageServiceProperties.Location.toLowerCase() === location.toLowerCase()) ||
                       affinityGroup && response.body.StorageServiceProperties.AffinityGroup && response.body.StorageServiceProperties.AffinityGroup.toLowerCase() === affinityGroup.toLowerCase()) {
                  var blobStorageUrl = response.body.StorageServiceProperties.Endpoints[0];
                  if (blobStorageUrl.slice(-1) === '/') {
                    blobStorageUrl = blobStorageUrl.slice(0, -1);
                  }

                  callback_(null, blobStorageUrl);
                  return;
                } else {
                  i = i + 1;
                  if (i < storageAccounts.length) {
                    checkNextStorageAccount_();
                  } else {
                    // Didn't find a storage account that matched location/affinityGroup.  Create a new one.
                    createNewStorageAccount_();
                  }
                }
              }
            }
          );
        }
      } else {
        createNewStorageAccount_();
      }
      
      function createNewStorageAccount_() {
        var storageAccountName = blobUtils.normalizeServiceName(name + (new Date()).getTime().toString());
        cli.output.verbose('Creating a new storage account \'' + storageAccountName + '\'');
        var options = {
          Location: location,
          AffinityGroup: affinityGroup
        };
        
        doServiceManagementOperation(svcMgmtChannel, 'createStorageAccount', storageAccountName, options,
            function(error, response) {
          if (error) {
            callback_(error);
          } else {
            cli.output.verbose('createStorageAccount succeeded');
            cli.output.verbose('Getting properties for \'' + storageAccountName + '\' storage account');
            
            doServiceManagementOperation(svcMgmtChannel, 'getStorageAccountProperties', storageAccountName, 
              function(error, response) {
                if (error) {
                  callback_(error);
                } else {
                  var blobStorageUrl = response.body.StorageServiceProperties.Endpoints[0];
                  if (blobStorageUrl.slice(-1) === '/') {
                    blobStorageUrl = blobStorageUrl.slice(0, -1);
                  }

                  callback_(null, blobStorageUrl);
                }
              }
            );
          }
        });
      }
    }
  });
};


exports.writeFileSyncMode = function writeFileSyncMode(path, data, encoding, mode) {
  mode = mode || 0600; // maximum protection by default
  var fd = fs.openSync(path, 'w', mode);
  try {
    if (typeof data === 'string') {
      fs.writeSync(fd, data, 0, encoding);    
    } else {
      fs.writeSync(fd, data, 0, data.length, 0);
    }
  } finally {
    fs.closeSync(fd);
  }
};

var getDnsPrefix = exports.getDnsPrefix = function(dnsName, allowEmpty) {
  if (dnsName) {
    // remove protocol if any, take the last element
    dnsName = dnsName.split('://').slice(-1)[0];
    // take first element
    dnsName = dnsName.split('.', 1)[0];
  }
  if (!dnsName && !allowEmpty) {
    throw new Error('Missing or invalid dns-name');
  }
  return dnsName;
};

exports.enumDeployments = function(channel, options, callback) {
  // get deployment by slot. Checks which slots to query.
  options.dnsPrefix = options.dnsPrefix || getDnsPrefix(options.dnsName, true);
  var getDeploymentSlot = function() {
    var dnsPrefix = options.dnsPrefix;
    options.pending++;
    doServiceManagementOperation(channel, 'getDeploymentBySlot', options.dnsPrefix, 'Production', function(error, response) {
      options.pending--;
      if (error) {
        options.errs.push(error);
      } else if (response.isSuccessful && response.body) {
        options.rsps.push({ svc: dnsPrefix, deploy: response.body });
      } else {
        options.errs.push(response.error);
      }
      if (options.pending === 0) {
        callback();
      }
    });
  };

  options.rsps = [];
  options.errs = [];
  options.pending = 0;

  if (options.dnsPrefix) {
    getDeploymentSlot();
  } else {
    doServiceManagementOperation(channel, 'listHostedServices', function(error, response) {
      if (error) {
        options.errs.push(error);
        callback();
        return;
      }
      
      var hostedServices = response.body;
      if (hostedServices.length === 0) {
        callback();
        return;
      }

      for (var i = 0; i < hostedServices.length; i++) {
        options.dnsPrefix = hostedServices[i].ServiceName;
        getDeploymentSlot();
      }
    });
  }
};

/**
 * Resolve location name if 'name' is location display name.
 *
 * @param {string}   name       The display name or location name. Required
 * @param {function} callback   The callback function called on completion. Required.
 */
exports.resolveLocationName = function(channel, name, callback) {
  doServiceManagementOperation(channel, 'listLocations', function(error, response) {
    if (!error) {
      if (response.body.length > 0) {
        var resolvedName = null;
        for (var i = 0; i < response.body.length; i++) {
          locationInfo = response.body[i];
          if (locationInfo.Name === name) {
            callback(null, name);
            return;
          } else if(!resolvedName && (locationInfo.DisplayName === name)) {
            // This is the first matched display name save the corresponding location
            // We ignore further matched display name, but will continue with location
            // matching
            resolvedName = locationInfo.Name;
          }
        }

        if(resolvedName) {
          callback(null, resolvedName);
        } else {
          callback({message : 'No location found which has DisplayName or Name same as value of --location', code: 'Not Found'}, name);
        }
      } else {
        // Return a valid error
        callback({message : 'Server returns empty location list', code: 'Not Found'}, name);
      }
    } else {
      callback(error, name);
    }
  });
};

exports.parseInt = function(value) {
  var intValue = parseInt(value, 10);
  if (intValue != value || value >= 65536 * 65536) { // just some limits
    return NaN;
  }
  return intValue; 
};

exports.getUTCTimeStamp = function() {
  var now = new Date();
  return (now.getUTCFullYear() + '-' +
    ('0'+(now.getUTCMonth()+1)).slice(-2) + '-' +
    ('0'+now.getUTCDate()).slice(-2) + ' ' +
    ('0'+now.getUTCHours()).slice(-2) + ':' +
    ('0'+now.getUTCMinutes()).slice(-2));
};

var logLineFormat = exports.logLineFormat = function logLineFormat(object, logFunc, prefix) {
  prefix = prefix || '';
  switch (typeof object) {
  case 'object':
    for (var i in object) {
      logLineFormat(object[i], logFunc, prefix + i + ' ');
    }
    return;
  case 'string':
    logFunc(prefix.cyan + ('"' + object + '"').green);
    return;
  case 'number':
    logFunc(prefix.cyan + object.toString().green);
    return;
  case 'undefined':
    return;  
  default:
    logFunc(prefix.cyan + '?' + object + '?'); // unknown type
  }
};

exports.validateEndpoint = function (endpoint) {
  if(!_.startsWith(endpoint, 'http://') &&
     !_.startsWith(endpoint, 'https://')) {
    // Default to https
    endpoint = 'https://' + endpoint;
  }

  var parts = url.parse(endpoint);
  if (!parts.hostname) {
    throw new Error('Invalid endpoint format.');
  }

  parts.port = (parts.port && parseInt(parts.port, 10)) || (/https/i.test(parts.protocol)
    ? constants.DEFAULT_HTTPS_PORT
    : constants.DEFAULT_HTTP_PORT);

  return url.format(parts);
};

exports.ignoreCaseEquals = function (a, b) {
  return (!a && !b) || (a.toLowerCase() === b.toLowerCase());
};

function homeFolder() {
  if (process.env.HOME !== undefined) {
    return process.env.HOME;
  }

  if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
    return process.env.HOMEDRIVE + process.env.HOMEPATH;
  }

  throw new Error('No HOME path available');
};

exports.azureDir = function () {
  var dir = process.env.AZURE_CONFIG_DIR
         || path.join(homeFolder(), '.azure');

  if (!path.existsSync(dir)) {
    fs.mkdirSync(dir, 502); // 0766
  }

  return dir;
};

exports.getPortalUrl = function () {
  return process.env.AZURE_PORTAL_URL
    || constants.DEFAULT_PORTAL_URL;
};

exports.getPublishingProfileUrl = function () {
  return process.env.AZURE_PUBLISHINGPROFILE_URL
    || constants.DEFAULT_PUBLISHINGPROFILE_URL;
};

exports.getManagementEndpointUrl = function (accountManagementEndpointUrl) {
  return process.env.AZURE_MANAGEMENTENDPOINT_URL
    || accountManagementEndpointUrl
    || constants.DEFAULT_MANAGEMENTENDPOINT_URL;
};

exports.getHostNameSuffix = function () {
  return process.env.AZURE_HOSTNAME_SUFFIX
    || constants.DEFAULT_HOSTNAME_SUFFIX;
};
