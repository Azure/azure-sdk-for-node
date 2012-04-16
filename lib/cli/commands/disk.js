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


var fs = require('fs');
var util = require('util');
var utils = require('../utils');
var path = require('path');
var url = require('url');
var blobUtils = require('../blobUtils');
var uploadVMImage = require('../iaas/upload/uploadVMImage');
var deleteImage = require('../iaas/deleteImage');

exports.init = function (cli) {
  var vm = cli.category('disk')
    .description('Commands to manage your Azure disk images');
   
  var logger = cli.output;
  
  vm.command('show <name>')
    .description('Show details about an Azure disk')
    .option('-i, --subscription <id>', 'use the subscription id')
    .execute(function(name, options, callback) {
      var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
        cli.category('account'), logger);
        
      var progress = cli.progress('Fetching disk');
      utils.doServiceManagementOperation(channel, 'getDisk', name, function(error, response) {
        progress.end();
        if (!error) {
          logger.json(response.body);
        }
        callback(error);
      });
    });

  vm.command('list')
    .description('List Azure disk images')
    .option('-i, --subscription <id>', 'use the subscription id')
    .execute(function(options, callback) {
      var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
        cli.category('account'), logger);

      var progress = cli.progress('Fetching disk images');
      utils.doServiceManagementOperation(channel, 'listDisks', function(error, response) {
        progress.end();
        if (!error) {
          if (options.json) {
            logger.json(response.body);
          } else {
            logger.table(response.body, function (row, item) {
              row.cell('Name', item.Name.length < 75 ? item.Name : 
                (item.Name.substring(0, 65)) + '...');
              row.cell('OS', item.OS || '');
            });
          }
        }
        callback(error);
      });
    });
    
  vm.command('delete <name>')
    .description('Delete Azure disk image from personal repository')
    .option('-i, --subscription <id>', 'use the subscription id')
    .option('-b, --blob-delete', 'delete underlying blob from storage')
    .execute(function(name, options, callback) {
      var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
        cli.category('account'), logger);
        
      deleteImage.deleteImage('Disk', 'Disk', logger, channel, name, null, cli.progress, options.blobDelete, callback);
  });
    
  vm.command('create <name> [source-path]')
    .usage('<name> [source-path]')
    .description('Upload and register Azure disk image')
    .option('-u, --blob-url <url>', 'target image blob url')
    .option('-l, --location <name>', 'location of the data center')
    .option('-a, --affinity-group <name>', 'affinity group')
    .option('-i, --subscription <id>', 'use the subscription id')
    .option('-o, --os [type]', 'operating system if any [linux|windows|none]')
    .option('-p, --parallel <number>', 'maximum number of parallel uploads [128]', 128)
    .option('-m, --md5-skip', 'skip MD5 hash computation')
    .option('-f, --force-overwrite', 'force overwrite of prior uploads')
    .option('-e, --label <about>', 'image label')
    .option('-d, --description <about>', 'image description')
    .option('-b, --base-vhd <blob>', 'base vhd blob url')
    .execute(function(name, sourcePath, options, callback) {
      var os = (undefined);
      if (typeof options.os === 'string') {
        var los = options.os.trim().toLowerCase();
        os = los[0].toUpperCase() + los.slice(1); // start with capital letter
      }

      if (os && os !== 'Windows' && os !== 'Linux' && os !== 'None') {
        callback('--os [type] must specify linux, windows or none');
      }

      var genBlobUrl;
      var force = options.forceOverwrite;
      var blobUrl = options.blobUrl;
      var location = options.location;
      var affinityGroup = options.affinityGroup;
      
      if (sourcePath) {
        if (!blobUrl && !location && !affinityGroup) {
          callback('--blob-url, --location, or --affinity-group must be specified');
        }
      } else {
        // When source-path is not specified, the user is attempting to register an
        // already uploaded disk.  In that case we need the blob-url.
        if (!blobUrl) {
          callback('--blob-url must be specified');
        }
      }
      
      if (blobUrl) {
        if (!url.parse(blobUrl).protocol) {
          // With partial urls, we need to know location/affinity group of the storage account.
          if (!location && !affinityGroup) {
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
      
      if (options.os) {
        var hasOS = os !== 'None';
        options2.imageOptions.HasOperatingSystem = hasOS;
        if (hasOS && os) {
          options2.imageOptions.OS = os;
        }
      }
      logger.silly('Disk options: ', options2.imageOptions);
      
      blobUtils.getBlobName(cli, channel, options.location, options.affinityGroup,
          path.basename(sourcePath), blobUrl, '/disks/',
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

      function upload() {
        if (sourcePath) { // uploading
          uploadVMImage.uploadPageBlobFromIaasClient(genBlobUrl, channel, sourcePath, 
              options2, function (error, finalBlobUrl) {
            if (error && !error.isSuccessful) {
              // do not delete incomplete blob
              logger.error('Couldn\'t upload blob ' + genBlobUrl);
              callback(error);
            }
            if (!error) { // final callback
              logger.info(finalBlobUrl + ' is uploaded successfully');
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
          logger.verbose('Creating OS image from ' + normUrl);
        }

        utils.doServiceManagementOperation(channel, 'addDisk', name, 
            normUrl,
            options2.imageOptions, function(error, response) {
          callback(error);
        });
      }
    });
};
