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

var crypto = require('crypto');
var fs = require('fs');
var assert = require('assert');
var azure = require('../azure');
var blobUtils = require('./blobUtils');

var BEGIN_CERT = '-----BEGIN CERTIFICATE-----';
var END_CERT   = '-----END CERTIFICATE-----';

exports.createServiceManagementService = function(subscriptionId, account, logger) {
  var pem = account.managementCertificate();
  return azure.createServiceManagementService(subscriptionId, {
    keyvalue: pem.key,
    certvalue: pem.cert
  }, {
    host: process.env.AZURE_ENDPOINT_HOST || 'management-preview.core.windows-int.net',
    port: process.env.AZURE_ENDPOINT_PORT || 443,
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

exports.enumDeployments = function(channel, options, callback) {
  // get deployment by slot. Checks which slots to query.
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
      } else {
        var hostedServices = response.body;
        for (var i = 0; i < hostedServices.length; i++) {
          options.dnsPrefix = hostedServices[i].ServiceName;
          getDeploymentSlot();
        }
      }
    });
  }
};


