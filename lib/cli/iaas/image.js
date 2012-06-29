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

/**
 * Common code to work OS or Disk image that implements vm disk * and vm image* commands
 */

var path = require('path');
var util = require('util');
var utils = require('../utils');
var blobUtils = require('../blobUtils');
var deleteImage = require('./deleteImage');
var uploadVMImage = require('./upload/uploadVMImage');

var DISK = exports.DISK = 0;
var OSIMAGE = exports.OSIMAGE = 1;

var whatAPI = ['Disk', 'OSImage'];
var whatLog = ['disk image', 'VM image'];
var whatLogs = ['disk images', 'VM images'];


exports.show = function(what, cli) {
  return function(name, options, callback) {
    var logger = cli.output;
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);
      
    var progress = cli.progress('Fetching ' + whatLog[what]);
    utils.doServiceManagementOperation(channel, 'get' + whatAPI[what], name, function(error, response) {
      progress.end();
      if (!error) {
        if (logger.format().json) {
          logger.json(response.body);
        } else {
          delete response.body['@']; // skip @ xmlns and @ xmlns:i
          utils.logLineFormat(response.body, logger.data);
        }
      }
      callback(error);
    });
  };
};

exports.list = function(what, cli) {
  function list(name, options, callback) {
    if (what === DISK) {
      if (name || options.dnsName) {
        // list disks for a specific VM name and/or dns name
        listDisks(cli, {
          subscription: options.subscription,
          name: name,
          dnsPrefix: utils.getDnsPrefix(options.dnsName, true)
        }, callback);
        return;
      }
    }
    var logger = cli.output;
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var progress = cli.progress('Fetching ' + whatLogs[what]);
    utils.doServiceManagementOperation(channel, ['listDisks', 'listOSImage'][what], function(error, response) {
      progress.end();
      if (!error) {
        if (response.body.length > 0) {
          logger.table(response.body, function (row, item) {
            row.cell('Name', item.Name);
            if (what === DISK) {
              row.cell('OS', item.OS || '');             
            } else { // OSIMAGE
              if (item.Category) {
                row.cell('Category', item.Category);
              }
              row.cell('OS', item.OS);              
            }
          });
        } else {
          if (logger.format().json) {
            logger.json([]);
          } else {
            logger.info('No ' + whatLogs[what] + ' found');
          }
        }
      }
      callback(error);
    });
  }
  // return 2 or 3-arg version of the function
  return what === DISK ? list : function(options, callback) {return list(undefined, options, callback);};
};

exports.imageDelete = function(what, cli) {
  return function(name, options, callback) {
    var logger = cli.output;
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);
    
    deleteImage.deleteImage(whatAPI[what], ['Disk', 'VM image'][what], logger, channel, name, null, cli.progress, options.blobDelete, callback);
  };
};

exports.create = function(what, cli) {
  return function(name, sourcePath, options, callback) {
    var logger = cli.output;
    var os = (undefined);
    if (typeof options.os === 'string') {
      var los = options.os.trim().toLowerCase();
      os = los[0].toUpperCase() + los.slice(1); // start with capital letter
    }

    if (what === DISK) {
      if (os && os !== 'Windows' && os !== 'Linux' && os !== 'None') {
        callback('--os [type] must specify linux, windows or none');
      }
      // @"^[a-zA-Z_][^\\\/\:\*\?\""\<\>\|\`\'\^%\#]*(?<![\.\s])$" in C# syntax
      if (!name.match(/^[a-zA-Z_][^\\\/\:\*\?\"\<\>\|\`\'\^%\#]*$/) || name.slice(-1).match(/[\.\s]/)) {
        callback('Invalid image name. Disk image name should start with a Latin letter or underscore (_), cannot contain any of the following characters:\n\\/:*?\"<>|`\'%#^\nIt cannot end with a period (.) or space character.');
      }
    } else {
      if (os !== 'Windows' && os !== 'Linux') {
        callback('--os <type> must specify linux or windows');
      }
      // @"^[A-Za-z0-9\-\.]{1,512}(?<!\-)$" in C# syntax 
      if (!name.match(/^[A-Za-z0-9\-\.]{0,511}[A-Za-z0-9\.]$/)) {
        callback('Invalid image name. OS image name can only contain Latin letters, digits, \'.\' and \'-\'. It cannot end with \'-\' or be longer than 512 chars.');
      }
    }

    var genBlobUrl = '';
    var force = options.forceOverwrite;
    var blobUrl = options.blobUrl;
    var location = options.location;
    var affinityGroup = options.affinityGroup;
    
    if (sourcePath) {
      if (!blobUrl && !location && !affinityGroup) {
        logger.error('--blob-url, --location, or --affinity-group must be specified');
        logger.help('following commands show available locations and affinity groups:');
        logger.help('    azure vm location list');
        logger.help('    azure account affinity-group list');
        callback(' ');
      }
    } else {
      // When source-path is not specified, the user is attempting to register an
      // already uploaded disk or OS blob.  In that case we need the blob-url.
      if (!blobUrl) {
        callback('--blob-url must be specified if sourcePath is not specified');
      }
    }
    
    if (blobUrl) {
      if (blobUrl[0] === '/') {
        // With partial urls, we need to know location/affinity group of the storage account.
        if (!location && !affinityGroup) {
          logger.error('location or affinity group is required if no full URL is specified');
          logger.help('following commands show available locations and affinity groups:');
          logger.help('    azure vm location list');
          logger.help('    azure account affinity-group list');
          callback('--location, or --affinity-group must be specified');
        }
      } else {
        if (location) {
          logger.warn('--location option will be ignored');
        }
        
        if (affinityGroup) {
          logger.warn('--affinity-group option will be ignored');
        }
      }
    }

    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);
    
    var options2 = {
      imageOptions : {
        Label : options.label
      },
      verbose : cli.verbose || 
        logger.format().level === 'verbose' || 
        logger.format().level === 'silly',
      skipMd5 : options.md5Skip,
      force : force,
      vhd : true,
      threads : options.parallel,
      parentBlob : options.baseVhd,
      exitWithError : callback,
      logger : logger
    };
    
    if (what === DISK && options.os) {
      var hasOS = os !== 'None';
      options2.imageOptions.HasOperatingSystem = hasOS;
      if (hasOS && os) {
        options2.imageOptions.OS = os;
      }
    }
    
    logger.silly('Options: ', options2.imageOptions);

    if (location) {
      logger.verbose('Resolving the location \'' + location + '\'');
      utils.resolveLocationName(channel, location, function(error, resolvedName) {
        if(!error) {
          location = resolvedName;
          logger.verbose('Location resolved to \'' + location + '\'');
          getBlobNameAndUpload();
        } else {
          callback(error);
        }
      });
    } else {
      getBlobNameAndUpload();
    }

    function getBlobNameAndUpload() {
      blobUtils.getBlobName(cli, channel, location, affinityGroup,
          path.basename(sourcePath), blobUrl, ['/disks/', '/vm-images/'][what],
          sourcePath, function(error, url) {
        if (error) {
          logger.error('Unable to retrieve storage account.');
          callback(error);
        } else {
          genBlobUrl = url;
          logger.verbose('Blob url: ' + genBlobUrl);
          upload();
        }
      });
    }
    
    function upload() {
      if (sourcePath) { // uploading
        if (/^https?\:\/\//i.test(sourcePath)) {
          logger.verbose('Copying blob from ' + sourcePath + ' to ' + genBlobUrl);
          if (options.md5Skip || options.parallel !== 96 || options.baseVhd) {
            logger.warn('--md5-skip, --parallel and/or --base-vhd options will be ignored');
          }
          if (!options.forceOverwrite) {
            logger.warn('Any existing blob will be overwritten' + (blobUrl ?  ' at ' + blobUrl : ''));
          }
          var progress = cli.progress('Copying blob');
          uploadVMImage.copyBlobFromIaasClient(channel, sourcePath, options.sourceKey, genBlobUrl,
              options2, function (error, blob, response, newDestUri) {
            progress.end();
            logger.silly(util.inspect(response, null, null, true));
            if (!error) {
              var status = response.copyStatus;
              (status === 'success' ? logger.silly : logger.warn)('Status : ' + status);
              createImage(newDestUri);
            } else {
              logger.error('Couldn\'t copy blob ' + sourcePath + ' to ' + newDestUri);
              callback(error);
            }
          });
          return;
        }
        
        uploadVMImage.uploadPageBlobFromIaasClient(genBlobUrl, channel, sourcePath, 
            options2, function (error, finalBlobUrl, alreadyExisted) {
          if (error && !error.isSuccessful) {
            // do not delete incomplete blob
            logger.error('Couldn\'t upload blob ' + genBlobUrl);
            callback(error);
          }
          if (!error) { // final callback
            logger.info(finalBlobUrl + (alreadyExisted ? ' is already uploaded' : ' is uploaded successfully'));
            createImage(finalBlobUrl);
          }
        });
      } else {
        // not uploading
        createImage();
      }
    }
    
    function createImage(finalBlobUrl) {
      finalBlobUrl = finalBlobUrl || genBlobUrl;
      var normUrl = blobUtils.normalizeBlobUri(finalBlobUrl, true);
      if (normUrl !== genBlobUrl) {
        logger.verbose('Creating image from ' + normUrl);
      }

      if (what === DISK) {
        utils.doServiceManagementOperation(channel, 'addDisk', name, 
            normUrl,
            options2.imageOptions, function(error, response) {
          callback(error);
        });
      } else {
        utils.doServiceManagementOperation(channel, 'createOSImage', os, name, 
            normUrl,
            options2.imageOptions, function(error, response) {
          callback(error);
        });        
      }
    }
  };
};

function listDisks(cli, options, cmdCallback) {
  var logger = cli.output;
  var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
    cli.category('account'), logger);

  var progress = cli.progress('Fetching VM');

  utils.enumDeployments(channel, options, function() {
    if (options.rsps.length === 0 && options.errs.length > 0) {
      cmdCallback(options.errs[0]);
    } else if (options.rsps.length > 0) {
      var found = null;
      var foundDisks = null;

      for (var i = 0; i < options.rsps.length; i++) {
        var roles = options.rsps[i].deploy.RoleList;
        if (roles) {
          for (var j = 0; j < roles.length; j++) {
            if (roles[j].RoleType === 'PersistentVMRole' &&
                (!options.name || roles[j].RoleName === options.name)) {
              if (found) {
                // found duplicates
                progress.end();
                cmdCallback('VM name is not unique');
              }
              found = options.rsps[i];
              foundDisks = [roles[j].OSVirtualHardDisk].concat(roles[j].DataVirtualHardDisks);
            }
          }
        }
      }

      // got unique role under a deployment and service, list the disks
      if (found) {
        var osDiskName = foundDisks[0].DiskName;
        logger.verbose('Getting info for OS disk ' + osDiskName);
        utils.doServiceManagementOperation(channel, 'getDisk', osDiskName, function(error, response) {
          progress.end();
          foundDisks[0].LogicalDiskSizeInGB = 
            error ? 'Error' : response.body.LogicalDiskSizeInGB;
          logger.table(foundDisks, function (row, item) {
            row.cell('Lun', (item === foundDisks[0]) ? '' : (item.Lun || 0));
            row.cell('Size(GB)', item.LogicalDiskSizeInGB);
            var mediaLink = item.MediaLink.split('/');
            row.cell('Blob-Name', mediaLink[mediaLink.length - 1]);
          });
          cmdCallback(error);
        });
        return
      }
    }

    progress.end();
    cmdCallback('VM ' + options.name + ' not found');
  });
}

