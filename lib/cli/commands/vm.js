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

var assert = require('assert');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var url = require('url');
var util = require('util');
var utils = require('../utils');
var blobUtils = require('../blobUtils');
var image = require('../iaas/image');
var deleteImage = require('../iaas/deleteImage');
var pageBlob = require('../iaas/upload/pageBlob');
var common = require('../common');

var enumDeployments = utils.enumDeployments;

exports.init = function(cli) {
  var vm = cli.category('vm')
    .description('Commands to manage your Azure virtual machines');

  var logger = cli.output;

  vm.command('create <dns-name> <image> <user-name> [password]')
    .whiteListPowershell()
    .usage('<dns-name> <image> <userName> [password]')
    .description('Create a new Azure VM')
    .option('-c, --connect', 'connect to existing VMs')
    .option('-l, --location <name>', 'location of the data center')
    .option('-a, --affinity-group <name>', 'affinity group')
    .option('-u, --blob-url <url>', 'blob url for OS disk')
    .option('-z, --vm-size <size>', 'VM size [small]\n    extrasmall, small, medium, large, extralarge')
    .option('-n, --vm-name <name>', 'VM name')
    .option('-e, --ssh [port]', 'enable SSH [22]')
    .option('-t, --ssh-cert <pem-file|fingerprint>', 'SSH certificate')
    .option('-r, --rdp [port]', 'enable RDP [3389]')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-w, --virtual-network-name <name>', 'virtual network name')
    .option('-b, --subnet-names <list>', 'comma-delimited subnet names')    
    .execute(function(dnsName, image, userName, password, options, callback) {
      var dnsPrefix = utils.getDnsPrefix(dnsName);
      var vmSize;
      if (options.vmSize) {
        vmSize = options.vmSize.trim().toLowerCase();
        
        if (vmSize === 'medium') {
          vmSize = 'Medium';
        } else {
          vmSize = vmSize[0].toUpperCase() + vmSize.slice(1, 5) + 
                   (vmSize.length > 5 ? (vmSize[5].toUpperCase() + vmSize.slice(6)) : '');
        }

        if (vmSize !== 'ExtraSmall' && vmSize !== 'Small' && vmSize !== 'Medium' &&
            vmSize !== 'Large' && vmSize !== 'ExtraLarge') {
          logger.help('--vm-size <size> must specify one of the following:');
          logger.help('  extrasmall, small, medium, large, extralarge');
          callback('invalid <size> specified with --vm-size');
        }
      } else {
        // Default to small
        vmSize = 'Small';
      }
      
      if (options.rdp) {
        if (typeof options.rdp === "boolean") {
          options.rdp = 3389;
        } else if ((options.rdp != parseInt(options.rdp, 10)) || (options.rdp > 65535)) {
          callback('--rdp [port] must be an integer less than or equal to 65535');
        }
      }
      
      if (options.ssh) {
        if (typeof options.ssh === "boolean") {
          options.ssh = 22;
        } else if ((options.ssh != parseInt(options.ssh, 10)) || (options.ssh > 65535)) {
          callback('--ssh [port] must be an integer less than or equal to 65535');
        }
      }
      
      createVM({
        dnsPrefix: dnsPrefix,
        imageName: image,
        password: password,
        userName: userName,
        subscription: options.subscription,
        size: vmSize,
        location: options.location,
        affinityGroup: options.affinityGroup,
        imageTarget: options.blobUrl,
        ssh: options.ssh,
        sshCert: options.sshCert,
        rdp: options.rdp,
        connect: options.connect,
        vmName: options.vmName,
        virtualNetworkName: options.virtualNetworkName,
        subnetNames: options.subnetNames
      }, callback);
    });

  vm.command('create-from <dns-name> <role-file>')
    .whiteListPowershell()
    .usage('<dns-name> <role-file>')
    .description('Create a new Azure VM from json role file')
    .option('-c, --connect', 'connect to existing VMs')
    .option('-l, --location <name>', 'location of the data center')
    .option('-a, --affinity-group <name>', 'affinity group')
    .option('-t, --ssh-cert <pem-file>', 'Upload SSH certificate')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(function(dnsName, roleFile, options, callback) {

      function stripBOM(content) {
        // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
        // because the buffer-to-string conversion in `fs.readFileSync()`
        // translates it to FEFF, the UTF-16 BOM.
        if (content.charCodeAt(0) === 0xFEFF) {
          content = content.slice(1);
        }
        return content;
      }

      var dnsPrefix = utils.getDnsPrefix(dnsName);
      logger.verbose('Loading role file: ' + roleFile);
      var jsonFile = fs.readFileSync(roleFile, 'utf8');
      var role = JSON.parse(stripBOM(jsonFile));

      createVM({
        subscription: options.subscription,
        location: options.location,
        dnsPrefix: dnsPrefix,
        connect: options.connect,
        role: role,
        sshCert: options.sshCert
      }, callback);
    });

  vm.command('list')
    .whiteListPowershell()
    .description('List Azure VMs')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(function(options, callback) {
      listVMs(options, callback);
    });

  vm.command('show <name>')
    .whiteListPowershell()
    .description('Show details about Azure VM')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(function(name, options, callback) {
      showVM(name, options, callback);
    });

  vm.command('delete <name>')
    .whiteListPowershell()
    .description('Delete Azure VM')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .option('-b, --blob-delete', 'remove image and disk blobs')
    .execute(function(name, options, callback) {
      deleteVM(name, options, callback);
    });

  vm.command('start <name>')
    .whiteListPowershell()
    .description('Start Azure VM')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(function(name, options, callback) {
      startVM(name, options, callback);
    });

  vm.command('restart <name>')
    .whiteListPowershell()
    .description('Restart Azure VM')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(function(name, options, callback) {
      restartVM(name, options, callback);
    });

  vm.command('shutdown <name>')
    .whiteListPowershell()
    .description('Shutdown Azure VM')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(function(name, options, callback) {
      shutdownVM(name, options, callback);
    });

  vm.command('capture <vm-name> <target-image-name>')
    .whiteListPowershell()
    .usage('<vm-name> <target-image-name>')
    .description('Capture Azure VM image')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .option('-e, --label <label>', 'target image friendly name')
    .option('-t, --delete', 'delete VM after successful capture')
    .execute(function(vmName, targetImageName, options, callback) {
      if (!options['delete']) {
        // Using this option will warn the user that the machine will be deleted
        logger.help('Reprovisioning a captured VM is not yet supported');
        callback('required --delete option is missing');
      }
      captureVM(vmName, targetImageName, options, callback);
    });
  
  vm.command('portal') // possible TODO: portal [name] [--dns-name <dns-name>] [--subscription <id>]
    .whiteListPowershell()
    .description('Opens the portal in a browser to manage your VMs')
    .execute(function(options) {

      var url = utils.getPortalUrl() + '#Workspace/VirtualMachineExtension/vms';

      common.launchBrowser(url);
    });

  var location = vm.category('location')
        .description('Commands to manage your Azure locations');

  location.command('list')
        .description('List locations available for your account')
        .execute(function (options, callback) {
          cli.category('account').listLAG('Locations', options, callback);
        });

  var endpoint = vm.category('endpoint')
    .description('Commands to manage your Azure virtual machine endpoints');

  endpoint.command('create <vm-name> <lb-port> [vm-port]')
    .whiteListPowershell()
    .usage('<vm-name> <lb-port> [vm-port]')
    .description('Create a new azure VM endpoint')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .option('-n, --endpoint-name <name>', 'specify endpoint name')
    .option('-b, --lb-set-name <name>', 'specify load-balancer set name')
    .option('-t, --probe-port <port>', 'VM port to use to inspect the role availability status')
    .option('-r, --probe-protocol <protocol>', 'protocol to use to inspect the role availability status')
    .option('-p, --probe-path <path>', 'relative path to inspect the role availability status')
    .execute(function(vmName, lbport, vmport, options, callback) {

      var lbPortAsInt = parseInt(lbport, 10);
      if ((lbport != lbPortAsInt) || (lbPortAsInt > 65535)) {
        callback('lb-port must be an integer less than or equal to 65535');
      }

      var vmportAsInt = -1;
      if (typeof vmport === 'undefined') {
        vmportAsInt = lbPortAsInt;
      } else {
        vmportAsInt = parseInt(vmport, 10);
        if ((vmport != vmportAsInt) || (vmportAsInt > 65535)) {
          callback('vm-port must be an integer less than or equal to 65535');
        }
      }

      var probeportAsInt = -1;
      var probe = options.probePort !== undefined || options.probeProtocol !== undefined || options.probePath !== undefined;
      if (probe) {
        if (!options.lbSetName) {
          callback('The optional argument --lb-set-name is required to enable probing');
        }

        if (!options.probePort || !options.probeProtocol) {
          callback('The optional arguments --probe-port and --probe-protocol are required to enable probing');
        }

        probeportAsInt = parseInt(options.probePort, 10);
        if ((options.probePort != probeportAsInt) || (probeportAsInt > 65535)) {
          callback('--probe-port must be an integer less than or equal to 65535');
        }

        options.probeProtocol = options.probeProtocol.toLowerCase();
        if (options.probeProtocol === 'tcp') {
          if (options.probePath) {
            options.probePath = undefined;
            logger.warn('--probe-path option will be ignored when --probe-protocol is tcp');
          }
        } else if (options.probeProtocol === 'http') {
          if (!options.probePath) {
            options.probePath = '/';
          }
        } else {
          callback('Possible values for --probe-protocol are tcp and http');
        }
      }

      endpointCreateDelete({
        subscription: options.subscription,
        name: vmName,
        endpointName : options.endpointName,
        dnsPrefix: utils.getDnsPrefix(options.dnsName, true),
        lbport: lbPortAsInt,
        vmport: vmportAsInt,
        lbsetname: options.lbSetName,
        probeport: probeportAsInt,
        probeprotocol: options.probeProtocol,
        probepath: options.probePath,
        create: true
      }, callback);
    });

  endpoint.command('delete <vm-name> <vm-port>')
    .whiteListPowershell()
    .usage('<vm-name> <vm-port>')
    .description('Delete an azure VM endpoint')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(function(vmName, vmport, options, callback) {

      var vmPortAsInt = parseInt(vmport, 10);
      if ((vmport != vmPortAsInt) || (vmPortAsInt > 65535)) {
        callback('vm-port must be an integer less than or equal to 65535');
      }

      endpointCreateDelete({
        subscription: options.subscription,
        name: vmName,
        dnsPrefix: utils.getDnsPrefix(options.dnsName, true),
        lbport: -1,
        vmport: vmPortAsInt,
        create: false
      }, callback);
    });

  endpoint.command('list <vm-name>')
    .whiteListPowershell()
    .usage('<vm-name>')
    .description('List endpoints of an azure VM')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(function(name, options, callback) {

      listEndpoints({
        subscription: options.subscription,
        name: name,
        dnsPrefix: utils.getDnsPrefix(options.dnsName, true),
      }, callback);
    });
  
  var osImage = vm.category('image')
    .description('Commands to manage your Azure VM images');
  
  osImage.command('show <name>')
    .whiteListPowershell()
    .description('Show details about a VM image')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(image.show(image.OSIMAGE, cli));

  osImage.command('list')
    .whiteListPowershell()
    .description('List Azure VM images')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(image.list(image.OSIMAGE, cli));
  
  osImage.command('delete <name>')
    .whiteListPowershell()
    .description('Delete Azure VM image from personal repository')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-b, --blob-delete', 'delete underlying blob from storage')
    .execute(image.imageDelete(image.OSIMAGE, cli));
  
  osImage.command('create <name> [source-path]')
    .whiteListPowershell()
    .usage('<name> [source-path]')
    .description('Upload and register Azure VM image')
    .option('-u, --blob-url <url>', 'target image blob url')
    .option('-l, --location <name>', 'location of the data center')
    .option('-a, --affinity-group <name>', 'affinity group')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-o, --os <type>', 'operating system [linux|windows]')
    .option('-p, --parallel <number>', 'maximum number of parallel uploads [96]', 96)
    .option('-m, --md5-skip', 'skip MD5 hash computation')
    .option('-f, --force-overwrite', 'force overwrite of prior uploads')
    .option('-e, --label <about>', 'image label')
    .option('-d, --description <about>', 'image description')
    .option('-b, --base-vhd <blob>', 'base vhd blob url')
    .option('-k, --source-key <key>', 'source storage key if source-path\n' +
    		'                             is a Windows Azure private blob url')
    .execute(image.create(image.OSIMAGE, cli));
      
  var disk = vm.category('disk')
    .description('Commands to manage your Azure virtual machine data disks');
  
  disk.command('show <name>')
    .whiteListPowershell()
    .description('Show details about an Azure disk')
    .option('-s, --subscription <id>', 'use the subscription id')
    .execute(image.show(image.DISK, cli));
  
  disk.command('list [vm-name]')
    .whiteListPowershell()
    .description('List Azure disk images, or disks attached to a specified VM')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(image.list(image.DISK, cli));

  disk.command('delete <name>')
    .whiteListPowershell()
    .description('Delete Azure disk image from personal repository')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-b, --blob-delete', 'delete underlying blob from storage')
    .execute(image.imageDelete(image.DISK, cli));
  
  disk.command('create <name> [source-path]')
    .whiteListPowershell()
    .usage('<name> [source-path]')
    .description('Upload and register Azure disk image')
    .option('-u, --blob-url <url>', 'target image blob url')
    .option('-l, --location <name>', 'location of the data center')
    .option('-a, --affinity-group <name>', 'affinity group')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-o, --os [type]', 'operating system if any [linux|windows|none]')
    .option('-p, --parallel <number>', 'maximum number of parallel uploads [96]', 96)
    .option('-m, --md5-skip', 'skip MD5 hash computation')
    .option('-f, --force-overwrite', 'force overwrite of prior uploads')
    .option('-e, --label <about>', 'image label')
    .option('-d, --description <about>', 'image description')
    .option('-b, --base-vhd <blob>', 'base vhd blob url')
    .option('-k, --source-key <key>', 'source storage key if source-path\n' +
    		'                             is a Windows Azure private blob url')    
    .execute(image.create(image.DISK, cli));
  
  disk.command('upload <source-path> <blob-url> <storage-account-key>')
    .whiteListPowershell()
    .usage('<source-path> <blob-url> <storage-account-key>')
    .description('Upload a VHD to an Azure storage account')
    .option('-p, --parallel <number>', 'maximum number of parallel uploads [96]', 96)
    .option('-m, --md5-skip', 'skip MD5 hash computation')
    .option('-f, --force-overwrite', 'force overwrite of prior uploads')
    .option('-b, --base-vhd <blob>', 'base vhd blob url')
    .option('-k, --source-key <key>', 'source storage key if source-path\n' +
    		'                         is a Windows Azure private blob url')
    .execute(function(sourcePath, blobUrl, storageAccountKey, options, callback) {
    	if (/^https?\:\/\//i.test(sourcePath)) {
    	  logger.verbose('Copying blob from ' + sourcePath);
    	  if (options.md5Skip || options.parallel !== 96  || options.baseVhd) {
    	    logger.warn('--md5-skip, --parallel and/or --base-vhd options will be ignored');
    	  }
    	  if (!options.forceOverwrite) {
    	    logger.warn('Any existing blob will be overwritten' + (blobUrl ?  ' at ' + blobUrl : ''));
    	  }
    	  var progress = cli.progress('Copying blob'); 
         pageBlob.copyBlob(sourcePath, options.sourceKey, blobUrl, storageAccountKey, function(error, blob, response) {
    	    progress.end();
    	    logger.silly(util.inspect(response, null, null, true));
    	    if (!error) {
    	      logger.silly('Status : ' + response.copyStatus);
    	    }
    	    callback(error);
    	  });
    	} else {
      var uploadOptions = {
          verbose : cli.verbose || 
            logger.format().level === 'verbose' || 
            logger.format().level === 'silly',
          skipMd5 : options.md5Skip,
          force : options.forceOverwrite,
          vhd : true,
          threads : options.parallel,
          parentBlob : options.baseVhd,
          exitWithError : callback,
          logger : logger
        };
        pageBlob.uploadPageBlob(blobUrl, storageAccountKey, sourcePath, uploadOptions, callback);
    	}
    });
  
  disk.command('attach <vm-name> <disk-image-name>')
    .whiteListPowershell()
    .usage('<vm-name> <disk-image-name>')
    .description('Attaches data-disk to Azure VM')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(function(name, diskImageName, options, callback) {

      diskAttachDetach({
        subscription: options.subscription,
        name: name,
        dnsName: options.dnsName,
        size: null,
        isDiskImage: true,
        url: diskImageName,
        attach: true
      }, callback);
    });

  disk.command('attach-new <vm-name> <size-in-gb> [blob-url]')
    .whiteListPowershell()
    .usage('<vm-name> <size-in-gb> [blob-url]')
    .description('Attaches data-disk to Azure VM')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(function(name, size, blobUrl, options, callback) {

      var sizeAsInt = utils.parseInt(size);
      if (isNaN(sizeAsInt)) {
        callback('size-in-gb must be an integer');
      }

      diskAttachDetach({
        subscription: options.subscription,
        name: name,
        dnsName: options.dnsName,
        size: sizeAsInt,
        isDiskImage: false,
        url: blobUrl,
        attach: true
      }, callback);
    });

  disk.command('detach <vm-name> <lun>')
    .whiteListPowershell()
    .usage('<vm-name> <lun>')
    .description('Detaches a data-disk attached to an Azure VM')
    .option('-s, --subscription <id>', 'use the subscription id')
    .option('-d, --dns-name <name>', 'only show VMs for this DNS name')
    .execute(function(name, lun, options, callback) {

      var lunAsInt = utils.parseInt(lun);
      if (isNaN(lunAsInt)) {
        callback('lun must be an integer');
      }

      diskAttachDetach({
        subscription: options.subscription,
        name: name,
        dnsName: options.dnsName,
        lun: lunAsInt,
        attach: false
      }, callback);
    });

  // default service options.
  var svcopts = {
    Label: '',
    Description: 'Implicitly created hosted service'
  };

  function createVM(options, cmdCallback) {
    var deployOptions = {
      DeploymentSlot: options.deploySlot,
      VirtualNetworkName: options.virtualNetworkName
    };

    var role;
    var image;
    var pemSshCert;
    var sshFingerprint;
    var provisioningConfig;
    var progress;
    var dnsPrefix;
    var location;
    var affinityGroup;
    var hostedServiceCreated = false;
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    dnsPrefix = options.dnsPrefix;
    // Load the roleFile if provided
    if (options.role) {
      role = options.role;
      logger.silly('role', role);

      if (options.sshCert) {
        // verify that the pem file exists and is valid before creating anything
        loadSshCert();
      }
      
      doSvcMgmtRoleCreate();
    } else {
      // find the provided image
      logger.verbose('looking for image ' + options.imageName);
      
      progress = cli.progress('Looking up image');
      // $TODO: Current RDFE contains a bug where getOsImage doesn't work for platform images.
      //        In order to work around the bug, we do listOsImages and find the specified image.
      utils.doServiceManagementOperation(channel, 'listOSImage', function(error, response) {
        progress.end();
        if (!error) {
          var images = response.body;
          for (var i = 0; i < images.length; i++) {
            if (images[i].Name === options.imageName) {
              image = images[i];
              break;
            }
          }

          if (!image) {
            cmdCallback('Image \'' + options.imageName + '\' not found');
          }

          logger.silly('image:');
          logger.json('silly', image);
          doSvcMgmtRoleCreate();
        } else {
          cmdCallback(error);
        }
      });
    }

    function loadSshCert() {
      logger.silly('trying to open SSH cert: ' + options.sshCert);
      pemSshCert = fs.readFileSync(options.sshCert);
      var pemSshCertStr = pemSshCert.toString();
      if (!utils.isPemCert(pemSshCertStr)) {
        cmdCallback('Specified SSH certificate is not in PEM format');
      }
                
      sshFingerprint = utils.getCertFingerprint(pemSshCertStr);
    }
    
    function createDefaultRole(name, callback) {
      var inputEndPoints = [];
      logger.verbose('Creating default role');
      var vmName = options.vmName || name || dnsPrefix;
      role = {
        RoleName: vmName,
        RoleSize: options.size,
        OSVirtualHardDisk: {
          SourceImageName: image.Name
        }
      };
      
      function createDefaultRoleWithPassword_() {
        var configureSshCert = false;
        if (image.OS.toLowerCase() === 'linux') {
          logger.verbose('Using Linux ProvisioningConfiguration');

          provisioningConfig = {
            ConfigurationSetType: 'LinuxProvisioningConfiguration',
            HostName: vmName,
            UserName: options.userName,
            UserPassword: options.password
          };
          
          if (options.ssh) {
            logger.verbose('SSH is enabled on port ' + options.ssh);

            inputEndPoints.push({
              Name: 'ssh',
              Protocol: 'tcp',
              Port: options.ssh,
              LocalPort: '22'
            });

            if (options.sshCert) {
              if (utils.isSha1Hash(options.sshCert)) {
                sshFingerprint = options.sshCert;
              } else {
                loadSshCert();
              }
              
              sshFingerprint = sshFingerprint.toUpperCase();
              logger.verbose('using SSH fingerprint: ' + sshFingerprint);

              // Configure the cert for cloud service
              configureSshCert = true;
            } else {
              provisioningConfig.DisableSshPasswordAuthentication = false;
            }
          }
        } else {
          logger.verbose('Using Windows ProvisioningConfiguration');
          if (options.userName && options.userName.toLowerCase() !== 'administrator') {
            logger.warn('Only Administrator is allowed as Windows username. You specified a different value: "' + 
                options.userName + '". It will be ignored, and Administrator will be used.');
          }
          
          provisioningConfig = {
            ConfigurationSetType: 'WindowsProvisioningConfiguration',
            ComputerName: vmName,
            AdminPassword: options.password,
            ResetPasswordOnFirstLogon: false
          };

          if (options.rdp) {
            logger.verbose('RDP is enabled on port ' + options.rdp);
            inputEndPoints.push({
              Name: 'rdp',
              Protocol: 'tcp',
              Port: options.rdp,
              LocalPort: '3389'
            });
          }
        }

        role.ConfigurationSets = [provisioningConfig];

        if (inputEndPoints.length || options.subnetNames) {
          role.ConfigurationSets.push({
            ConfigurationSetType: 'NetworkConfiguration',
            InputEndpoints: inputEndPoints,
            SubnetNames: options.subnetNames ? options.subnetNames.split(',') : []
          });
        }

        if(configureSshCert) {
          progress = cli.progress('Configuring certificate');
          configureCert(dnsPrefix, function() {
            progress.end();
            logger.verbose('role:');
            logger.json('verbose', role);
            callback();
          });
        } else {
          logger.verbose('role:');
          logger.json('verbose', role);
          callback();
        }
      }

      function createDefaultRoleEnsurePassword_() {        
        // Prompt for password if not specified
        if (typeof options.password === 'undefined') {
          cli.password('Enter VM \'' + options.userName + '\' password: ', '*', function(pass) {
            process.stdin.pause();
            options.password = pass;
            createDefaultRoleWithPassword_();
          });
        } else {
          createDefaultRoleWithPassword_();
        }
      }

      if (options.imageTarget || image.Category !== 'User') {
        blobUtils.getBlobName(cli, channel, location, affinityGroup, dnsPrefix, options.imageTarget, 
          '/vhd-store/', vmName + '-' + crypto.randomBytes(8).toString('hex') + '.vhd',
          function(error, imageTargetUrl) {
            if (error) {
              logger.error('Unable to retrieve storage account.');
              cleanupHostedServiceAndExit(error);
            } else {
              imageTargetUrl = blobUtils.normalizeBlobUri(imageTargetUrl, false);
              logger.verbose('image MediaLink: ' + imageTargetUrl);
              role.OSVirtualHardDisk.MediaLink = imageTargetUrl;
              createDefaultRoleEnsurePassword_();
            }
          }
        );
      } else {
        createDefaultRoleEnsurePassword_();
      }
    }

    function configureCert(service, callback) {
      if (provisioningConfig) {
        provisioningConfig.SSH = {
          PublicKeys: [ {
              Fingerprint: sshFingerprint,
              Path: '/home/' + options.userName + '/.ssh/authorized_keys'
            }
          ]
        };

        logger.silly('provisioningConfig with SSH:');
        logger.silly(JSON.stringify(provisioningConfig));
      }

      if (pemSshCert) {
        logger.verbose('uploading cert');
        utils.doServiceManagementOperation(channel, 'addCertificate', service, pemSshCert, 'pfx', null, function(error, response) {
          if (!error) {
            logger.verbose('uploading cert succeeded');
            callback();
          } else {
            cleanupHostedServiceAndExit(error);
          }
        });
      } else {
        callback();
      }
    }

    function createDeploymentInExistingHostedService() {
      if (options.location) {
        logger.warn('--location option will be ignored');
      }
      if (options.affinityGroup) {
        logger.warn('--affinity-group option will be ignored');
      }

      // Get cloud service properties
      progress = cli.progress('Getting cloud service properties');
      utils.doServiceManagementOperation(channel, 'getHostedServiceProperties', dnsPrefix, function(error, response) {
        progress.end();
        if (error) {
          cmdCallback(error);
        } else {
          logger.verbose('Cloud service properties:');
          logger.json('verbose', response.body);
          location = response.body.HostedServiceProperties.Location;
          affinityGroup = response.body.HostedServiceProperties.AffinityGroup;

          // Check for existing production deployment
          progress = cli.progress('Looking up deployment');
          utils.doServiceManagementOperation(channel, 'getDeploymentBySlot', dnsPrefix, 'Production', function(error, response) {
            progress.end();

            if (error) {
              if (response && response.statusCode === 404) {          
                // There's no production deployment.  Create a new deployment.
                function createDeployment_() {
                  progress = cli.progress('Creating VM');
                  utils.doServiceManagementOperation(channel, 'createDeployment', dnsPrefix, dnsPrefix,
                      role, deployOptions, function(error, response) {
                    progress.end();
                    if (!error) {
                      logger.info('OK');
                    } else {
                      cmdCallback(error);
                    }
                  });
                }

                if (!role) {
                  createDefaultRole(null, createDeployment_);
                } else {
                  createDeployment_();
                }
              } else {
                cmdCallback(error);
              }
            } else {
              // There's existing production deployment.  Add a new role if --connect was specified.
              if (!options.connect) {
                logger.help('Specify --connect option to connect the new VM to an existing VM');
                cmdCallback('A VM with dns prefix \'' + dnsPrefix + '\' already exists');
              }
              
              function addRole_() {
                logger.verbose('Adding a VM to existing deployment');
                progress = cli.progress('Creating VM');
                utils.doServiceManagementOperation(channel, 'addRole', dnsPrefix, response.body.Name, role, function(error, response) {
                  progress.end();
                  cmdCallback(error);
                });
              }
              
              var roleList = response.body.RoleList;
              var maxNum = 1;
              for (var i = 0; i < roleList.length; i++) {
                var numSplit = roleList[i].RoleName.split('-');
                if (numSplit.length > 1) {
                  // did it start with dnsPrefix? If not, ignore.
                  var leftSplit = numSplit.slice(0, -1).join('-');
                  if (leftSplit === dnsPrefix.slice(0, leftSplit.length)) {
                    var num = parseInt(numSplit[numSplit.length - 1], 10);
                    if (!isNaN(num) && num !== num + 1 && num > maxNum) { // number that is not too big
                      maxNum = num;
                    }
                  }
                }
              }
              var tag = '-' + (maxNum + 1);
              var vmName = image.OS.toLowerCase() === 'linux' ? dnsPrefix : dnsPrefix.slice(0, 15 - tag.length);
              vmName += tag;
              if (!role) {
                createDefaultRole(vmName, addRole_);
              } else {
                addRole_();
              }
            } 
          });
        }
      });
    }

    function createDeployment() {
      function createDeployment_() {
        progress = cli.progress('Creating VM');
        utils.doServiceManagementOperation(channel, 'createDeployment', dnsPrefix, dnsPrefix,
            role, deployOptions, function(error, response) {
          progress.end();
          if (!error) {
            cmdCallback();
          } else {
            cleanupHostedServiceAndExit(error);
          }
        });
      }
    
      if (!role) {
        createDefaultRole(null, createDeployment_);
      } else {
        if (options.sshCert && pemSshCert) {
          progress = cli.progress('Configuring certificate');
          configureCert(dnsPrefix, function() {
            progress.end();
            createDeployment_();
          });          
        } else {
          createDeployment_();          
        }
      }
    }
    
    function cleanupHostedServiceAndExit(error) {
      logger.verbose('Error occured.  Deleting ' + options.dnsPrefix + ' cloud service');
      if (hostedServiceCreated) {
        progress = cli.progress('Deleting cloud service');
        utils.doServiceManagementOperation(channel, 'deleteHostedService', options.dnsPrefix, function(err, response) {
          progress.end();
          if (err) {
            logger.warn('Error deleting ' + options.dnsPrefix + ' cloud service');
            logger.json('verbose', error);
          } else {
            logger.verbose(options.dnsPrefix + ' cloud service deleted');
          }
          cmdCallback(error);
        });
      } else {
        cmdCallback(error);
      }
    }

    function doSvcMgmtRoleCreate() {
      // test if the cloud service exists for specified dns name
      logger.verbose('Checking for existence of ' + options.dnsPrefix + ' cloud service');
      progress = cli.progress('Looking up cloud service');
      utils.doServiceManagementOperation(channel, 'listHostedServices', function(error, response) {
        progress.end();
        if (error) {
          cmdCallback(error);
        } else {
          var service = null;
          var services = response.body;
          for (var i = 0; i < services.length; i++) {
            if (services[i].ServiceName.toLowerCase() === dnsPrefix.toLowerCase()) {
              service = services[i];
              break;
            }
          }
          
          if (service) {
            logger.verbose('Found existing cloud service ' + service.ServiceName);
            return createDeploymentInExistingHostedService();
          } else {
            if (!options.location && !options.affinityGroup) {
              logger.error('location or affinity group is required for a new cloud service');
              logger.error('please specify --location or --affinity-group');
              logger.help('following commands show available locations and affinity groups:');
              logger.help('    azure vm location list');
              logger.help('    azure account affinity-group list');
              cmdCallback(' ');
            }

            if (options.location && options.affinityGroup) {
              cmdCallback('both --location and --affinitygroup options are specified');
            }
            
            location = options.location;
            affinityGroup = options.affinityGroup;
            if (location) {
              logger.verbose('Resolving the location \'' + location + '\'');
              utils.resolveLocationName(channel, location, function(error, resolvedName) {
                if(!error) {
                  location = resolvedName;
                  logger.verbose('Location resolved to \'' + location + '\'');
                  _svcMgmtRoleCreateInternal();
                } else {
                  cmdCallback(error);
                }
              });
            } else {
              _svcMgmtRoleCreateInternal();
            }

            function _svcMgmtRoleCreateInternal() {
              svcopts.Location = location;
              svcopts.AffinityGroup = options.affinityGroup;
              svcopts.Label = dnsPrefix;
              progress = cli.progress('Creating cloud service');
              utils.doServiceManagementOperation(channel, 'createHostedService', dnsPrefix, svcopts, function(error, response) {
                progress.end();
                if (error) {
                  cmdCallback(error);
                } else {
                  hostedServiceCreated = true;
                  createDeployment();
                }
              });
            }
          }
        }
      });
    }
    
    
  }

  function listVMs(options, cmdCallback) {
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var progress = cli.progress('Fetching VMs');

    // $TODO: make the callback return list of deployments and/or errors
    enumDeployments(channel, options, function() {
      progress.end();
      if (options.rsps.length === 0 && options.errs.length > 0) {
        // ignore 'ResourceNotFound' error - return no VMs in this cases. Otherwise return the error. 
        if (options.errs[0].code !== 'ResourceNotFound' || 
            options.errs[0].message !== 'No deployments were found.') {
          cmdCallback(options.errs[0]);
          return;
        }
      } 
      if (options.rsps.length > 0) {
        var vms = [];
        for (var i = 0; i < options.rsps.length; i++) {
          var roles = options.rsps[i].deploy.RoleList;
          if (roles) {
            for (var j = 0; j < roles.length; j++) {
              if (roles[j].RoleType === 'PersistentVMRole') {
                vms.push(createPrettyVMView(roles[j], options.rsps[i].deploy));
              }
            }
          }
        }
        
        if (vms.length > 0) {
          logger.table(vms, function(row, item) {
            row.cell('DNS Name', item.DNSName);
            row.cell('VM Name', item.VMName);
            row.cell('Status', item.InstanceStatus);
          });
          return;
        }
      }

      if (logger.format().json) {
        logger.json([]);
      } else {
        logger.info('No VMs found');
      }
      cmdCallback();
    });
  }

  function deleteVM(name, options, cmdCallback) {
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var p = cli.progress('Finding VM');

    enumDeployments(channel, options, function() {
      p.end();
      if (options.rsps.length === 0 && options.errs.length > 0) {
        cmdCallback(options.errs[0]);
      } else if (options.rsps.length > 0) {
        var found = null;
        var role = null;

        for (var i = 0; i < options.rsps.length; i++) {
          var roles = options.rsps[i].deploy.RoleList;
          if (roles) {
            for (var j = 0; j < roles.length; j++) {
              if (roles[j].RoleType === 'PersistentVMRole' &&
                  roles[j].RoleName === name) {
                if (found) {
                  // found duplicates
                  cmdCallback('VM name is not unique');
                }
                found = options.rsps[i];
                role = roles[j];
              }
            }
          }
        }

        // got unique role, delete it
        if (found) {
          var progress = cli.progress('Deleting VM');
          deleteRoleOrDeployment(channel, found.svc, found.deploy, name, function(error) {
            progress.end();

            if (!error) {
              if (!options.blobDelete) {
                cmdCallback();
                return;
              }

              var dataDiskCount = role.DataVirtualHardDisks.length;
              logger.verbose('Deleting blob' + (dataDiskCount ? 's' : ''));
              var doneCount = 0;
              var errorCount = 0;
              var allCount = dataDiskCount + 1;
              
              var k = -2;
              toNext();
              
              function toNext() {
                k++;
                if (k === dataDiskCount) {
                  done();
                  return;
                }
                var diskInfo = k < 0 ? role.OSVirtualHardDisk : role.DataVirtualHardDisks[k];
                var diskName = diskInfo.DiskName;
                var mediaLink = diskInfo.MediaLink;
                logger.verbose('Deleting disk ' + diskName + ' @ ' + mediaLink);
                deleteImage.deleteImage('Disk', 'Disk', logger, channel, diskName, mediaLink, 
                    cli.progress, true, function(error) {
                  doneCount++;
                  logger.silly((error ? 'Error' : 'Finished') + ' deleting disk ' + doneCount + ' of ' + allCount);
                  if (error) {
                    logger.error(util.inspect(error));
                    errorCount++;
                  }
                  
                  toNext();
                });
              }
              
              function done() {                
                progress.end();
                if (errorCount) {
                  cmdCallback('While VM was deleted successfully, deletion of ' + errorCount + 
                      ' of its ' + allCount + ' disk(s) failed');
                }
                logger.verbose('All ' + allCount + 
                    ' disk(s) were successfuly deleted from disk registry and blob storage');
                cmdCallback();
              }
              
            } else {
              cmdCallback(error);
            }
          });
        } else {
          logger.warn('No VMs found');
          cmdCallback();
        }
      }
    });
  }

  function showVM(name, options, cmdCallback) {
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var progress = cli.progress('Fetching VM');

    enumDeployments(channel, options, function() {
      progress.end();
      if (options.rsps.length === 0 && options.errs.length > 0) {
        cmdCallback(options.errs[0]);
      } else if (options.rsps.length > 0) {
        var vms = [];
        for (var i = 0; i < options.rsps.length; i++) {
          var roles = options.rsps[i].deploy.RoleList;
          if (roles) {
            for (var j = 0; j < roles.length; j++) {
              if (roles[j].RoleType === 'PersistentVMRole' &&
                  roles[j].RoleName === name) {
                vms.push(createPrettyVMView(roles[j], options.rsps[i].deploy));
              }
            }
          }
        }

        // got unique role, delete it
        if (vms.length > 0) {
          var vmOut = vms.length === 1 ? vms[0] : vms;
          if (logger.format().json) {
            logger.json(vmOut);
          } else {
            utils.logLineFormat(vmOut, logger.data);
          }
        } else {
          return cmdCallback('No VMs found');
        }
        
        cmdCallback();
      }
    });
  }

  function startVM(name, options, cmdCallback) {
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var p = cli.progress('Fetching VM');

    enumDeployments(channel, options, function() {
      p.end();
      if (options.rsps.length === 0 && options.errs.length > 0) {
        cmdCallback(options.errs[0]);
      } else if (options.rsps.length > 0) {
        var found = null;

        for (var i = 0; i < options.rsps.length; i++) {
          var roles = options.rsps[i].deploy.RoleList;
          if (roles) {
            for (var j = 0; j < roles.length; j++) {
              if (roles[j].RoleType === 'PersistentVMRole' &&
                  roles[j].RoleName === name) {
                if (found) {
                  // found duplicates
                  cmdCallback('VM name is not unique');
                }
                found = options.rsps[i];
                found.roleInstance = getRoleInstance(roles[j].RoleName, options.rsps[i].deploy);
              }
            }
          }
        }

        // got unique role, delete it
        if (found) {
          var progress = cli.progress('Starting VM');
          utils.doServiceManagementOperation(channel, 'startRole', found.svc,
              found.deploy.Name, found.roleInstance.InstanceName, function(error, response) {
            progress.end();
            cmdCallback(error);
          });
        } else {
          logger.warn('No VMs found');
          cmdCallback();
        }
      }
    });
  }

  function restartVM(name, options, cmdCallback) {
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var progress = cli.progress('Fetching VMs');

    enumDeployments(channel, options, function() {
      progress.end();
      if (options.rsps.length === 0 && options.errs.length > 0) {
        cmdCallback(options.errs[0]);
      } else if (options.rsps.length > 0) {
        var found = null;

        for (var i = 0; i < options.rsps.length; i++) {
          var roles = options.rsps[i].deploy.RoleList;
          if (roles) {
            for (var j = 0; j < roles.length; j++) {
              if (roles[j].RoleType === 'PersistentVMRole' &&
                  roles[j].RoleName === name) {
                if (found) {
                  // found duplicates
                  cmdCallback('VM name is not unique');
                }
                found = options.rsps[i];
                found.roleInstance = getRoleInstance(roles[j].RoleName, options.rsps[i].deploy);
              }
            }
          }
        }

        // got unique role, delete it
        if (found) {
          progress = cli.progress('Restarting VM');
          utils.doServiceManagementOperation(channel, 'restartRole', found.svc,
              found.deploy.Name, found.roleInstance.InstanceName, function(error, response) {
            progress.end();
            cmdCallback(error);
          });
        } else {
          logger.warn('No VMs found');
          cmdCallback();
        }
      }
    });
  }

  function shutdownVM(name, options, cmdCallback) {
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var progress = cli.progress('Fetching VMs');

    enumDeployments(channel, options, function() {
      progress.end();
      if (options.rsps.length === 0 && options.errs.length > 0) {
        cmdCallback(options.errs[0]);
      } else if (options.rsps.length > 0) {
        var found = null;

        for (var i = 0; i < options.rsps.length; i++) {
          var roles = options.rsps[i].deploy.RoleList;
          if (roles) {
            for (var j = 0; j < roles.length; j++) {
              if (roles[j].RoleType === 'PersistentVMRole' &&
                  roles[j].RoleName === name) {
                if (found) {
                  // found duplicates
                  cmdCallback('VM name is not unique');
                }
                found = options.rsps[i];
                found.roleInstance = getRoleInstance(roles[j].RoleName, options.rsps[i].deploy);
              }
            }
          }
        }

        // got unique role, delete it
        if (found) {
          progress = cli.progress('Shutting down VM');
          utils.doServiceManagementOperation(channel, 'shutdownRole', found.svc,
              found.deploy.Name, found.roleInstance.InstanceName, function(error, response) {
            progress.end();
            cmdCallback(error);
          });
        } else {
          logger.warn('No VMs found');
          cmdCallback();
        }
      }
    });
  }

  function captureVM(name, targetImageName, options, cmdCallback) {
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var progress = cli.progress('Fetching VMs');

    enumDeployments(channel, options, function() {
      progress.end();
      if (options.rsps.length === 0 && options.errs.length > 0) {
        cmdCallback(options.errs[0]);
      } else if (options.rsps.length > 0) {
        var found = null;

        for (var i = 0; i < options.rsps.length; i++) {
          var roles = options.rsps[i].deploy.RoleList;
          if (roles) {
            for (var j = 0; j < roles.length; j++) {
              if (roles[j].RoleType === 'PersistentVMRole' &&
                  roles[j].RoleName === name) {
                if (found) {
                  // found duplicates
                  cmdCallback('VM name is not unique');
                }
                found = options.rsps[i];
                found.roleInstance = getRoleInstance(roles[j].RoleName, options.rsps[i].deploy);
              }
            }
          }
        }

        // got unique role, delete it
        if (found) {
          progress = cli.progress('Capturing VM');
          var captureOptions = {
            PostCaptureAction : 'Delete',
            TargetImageName : targetImageName,
            TargetImageLabel : options.label || targetImageName // does not work without label
          };
          utils.doServiceManagementOperation(channel, 'captureRole', found.svc,
              found.deploy.Name, found.roleInstance.InstanceName, 
              captureOptions, function(error, response) {
            progress.end();
            cmdCallback(error);
          });
        } else {
          logger.warn('No VMs found');
          cmdCallback();
        }
      }
    });
  }

  function endpointCreateDelete(options, cmdCallback) {
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var progress = cli.progress('Fetching VM');

    enumDeployments(channel, options, function() {
      progress.end();
      if (options.rsps.length === 0 && options.errs.length > 0) {
        cmdCallback(options.errs[0]);
      } else if (options.rsps.length > 0) {
        var found = null;

        for (var i = 0; i < options.rsps.length; i++) {
          var roles = options.rsps[i].deploy.RoleList;
          if (roles) {
            for (var j = 0; j < roles.length; j++) {
              if (roles[j].RoleType === 'PersistentVMRole' &&
                  roles[j].RoleName === options.name) {
                if (found) {
                  // found duplicates
                  cmdCallback('VM name is not unique');
                }
                found = options.rsps[i];
                found.roleInstance = getRoleInstance(roles[j].RoleName, options.rsps[i].deploy);
              }
            }
          }
        }

        // got unique role under a deployment and service, update the network configuration
        if (found) {
          progress.end();
          progress = cli.progress('Reading network configuration');
          utils.doServiceManagementOperation(channel, 'getRole', found.svc, found.deploy.Name, options.name, function(error, response) {
            if (!error) {
              var role = response.body;
              var configurationSets = role.ConfigurationSets;
              var k = 0;
              // Locate the NetworkConfiguration Set
              for (; k < configurationSets.length; k++) {
                if (configurationSets[k].ConfigurationSetType === 'NetworkConfiguration') {
                  break;
                }
              }

              if (!configurationSets[k].InputEndpoints) {
                configurationSets[k].InputEndpoints = [];
              }
              
              var endpointCount = configurationSets[k].InputEndpoints.length;
              var m = 0;
              var message = null;
              // Check for the existance of endpoint
              for (; m < endpointCount; m++) {
                var lbPortAsInt = parseInt(configurationSets[k].InputEndpoints[m].Port, 10);
                if (!options.lbsetname && (lbPortAsInt === options.lbport)) {
                  message = 'The port ' + options.lbport + ' of load-balancer is already mapped to port ' +
                    configurationSets[k].InputEndpoints[m].LocalPort + ' of VM';
                  break;
                }

                var vmPortAsInt = parseInt(configurationSets[k].InputEndpoints[m].LocalPort, 10);
                if (vmPortAsInt === options.vmport) {
                  message = 'The port ' + options.vmport + ' of VM is already mapped to port ' +
                    configurationSets[k].InputEndpoints[m].Port + ' of load-balancer';
                  break;
                }
              }

              if (m !== endpointCount) {
                if (options.create) {
                  progress.end();
                  cmdCallback(message);
                } else {
                  configurationSets[k].InputEndpoints.splice(m, 1);
                }
              } else {
                if (options.create) {
                  var inputEndPoint = {
                    Name: options.endpointName || 'endpname-' + options.lbport + '-' + options.vmport,
                    Protocol: 'tcp',
                    Port: options.lbport,
                    LocalPort: options.vmport
                  };

                  if (options.lbsetname) {
                    inputEndPoint.LoadBalancedEndpointSetName = options.lbsetname;
                    if (options.probeport !== -1) {
                      inputEndPoint.LoadBalancerProbe = {
                          Port: options.probeport,
                          Protocol: options.probeprotocol
                      };

                      if (options.probepath) {
                        inputEndPoint.LoadBalancerProbe.Path = options.probepath;
                      }
                    }
                  }

                  configurationSets[k].InputEndpoints.push(inputEndPoint);
                } else {
                  progress.end();
                  cmdCallback('Endpoint not found in the network configuration');
                }
              }

              progress.end();
              var vmRole = {
                ConfigurationSets: configurationSets
              };

              progress = cli.progress('Updating network configuration');
              utils.doServiceManagementOperation(channel, 'modifyRole', found.svc, found.deploy.Name,
                  options.name, vmRole, function(error, response) {
                progress.end();
                cmdCallback(error);
              });
            } else {
              progress.end();
              cmdCallback(error);
            }
          });
        } else {
          progress.end();
          cmdCallback('No VMs found');
        }
      }
    });
  }

  function listEndpoints(options, cmdCallback) {
    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var progress = cli.progress('Fetching VM');

    enumDeployments(channel, options, function() {
      progress.end();
      if (options.rsps.length === 0 && options.errs.length > 0) {
        cmdCallback(options.errs[0]);
      } else if (options.rsps.length > 0) {
        var found = null;

        for (var i = 0; i < options.rsps.length; i++) {
          var roles = options.rsps[i].deploy.RoleList;
          if (roles) {
            for (var j = 0; j < roles.length; j++) {
              if (roles[j].RoleType === 'PersistentVMRole' &&
                  roles[j].RoleName === options.name) {
                if (found) {
                  // found duplicates
                  cmdCallback('VM name is not unique');
                }
                found = options.rsps[i];
                found.roleInstance = getRoleInstance(roles[j].RoleName, options.rsps[i].deploy);
              }
            }
          }
        }

        // got unique role under a deployment and service, list the endpoints
        if (found) {
          if (!found.roleInstance.InstanceEndpoints || found.roleInstance.InstanceEndpoints.length === 0) {
            if (logger.format().json) {
              logger.json([]);
            } else {
              logger.info('No endpoints found');
            }
          } else {
            logger.table(found.roleInstance.InstanceEndpoints, function(row, item) {
              row.cell('Name', item.Name);
              row.cell('External Port', item.PublicPort);
              row.cell('Local Port', item.LocalPort);
            });
          }
        } else {
          return cmdCallback('No VMs found');
        }
        cmdCallback();
      }
    });
  }

  function diskAttachDetach(options, cmdCallback) {
    var progress;
    var lookupOsDiskUrl = false;

    var channel = utils.createServiceManagementService(cli.category('account').lookupSubscriptionId(options.subscription),
      cli.category('account'), logger);

    var diskInfo = {};
    if (!options.isDiskImage) {
      if (!options.url || !url.parse(options.url).protocol) {
        // If the blob url is not provide or partially provided, we need see
        // what storage account is used by VM's OS disk.
        lookupOsDiskUrl = true;
      } else {
        diskInfo.MediaLink = options.url;
      }
    } else {
      diskInfo.DiskName = options.url;
    }
    
    progress = cli.progress('Fetching VM');
    enumDeployments(channel, options, function() {
      progress.end();
      if (options.rsps.length === 0 && options.errs.length > 0) {
        cmdCallback(options.errs[0]);
      } else if (options.rsps.length > 0) {
        var found = null;

        for (var i = 0; i < options.rsps.length; i++) {
          var roles = options.rsps[i].deploy.RoleList;
          if (roles) {
            for (var j = 0; j < roles.length; j++) {
              if (roles[j].RoleType === 'PersistentVMRole' &&
              roles[j].RoleName === options.name) {
                if (found) {
                  // found duplicates
                  cmdCallback('VM name is not unique');
                }
                found = options.rsps[i];
                found.dataVirtualHardDisks = roles[j].DataVirtualHardDisks;
                found.osDisk = roles[j].OSVirtualHardDisk;
              }
            }
          }
        }

        // got unique role under a deployment and service, add-disk
        if (found) {
          if (options.attach) {
            // Check if we need to set the disk url based on the VM OS disk
            if (lookupOsDiskUrl) {
              if (options.url) {
                var parsed = url.parse(found.osDisk.MediaLink);
                diskInfo.MediaLink = parsed.protocol + '//' + parsed.host + '/' +options.url;
              } else {
                diskInfo.MediaLink = found.osDisk.MediaLink.slice(0, found.osDisk.MediaLink.lastIndexOf('/')) + 
                  '/' + options.name + '-' + crypto.randomBytes(8).toString('hex') + '.vhd';
              }
              logger.verbose("Disk MediaLink: " + diskInfo.MediaLink);
            }

            var maxLun = -1;
            for (var k = 0; k < found.dataVirtualHardDisks.length; k++) {
              var lun = found.dataVirtualHardDisks[k].Lun ? parseInt(found.dataVirtualHardDisks[k].Lun, 10) : 0;
              maxLun = Math.max(maxLun, lun);
            }

            var nextLun = maxLun + 1;
            diskInfo.Lun = nextLun;
            if (options.size) {
              diskInfo.LogicalDiskSizeInGB = options.size;
            }
            diskInfo.DiskLabel = found.svc + '-' + found.deploy.Name + '-' + options.name + '-' + nextLun;
            logger.verbose("Disk Lun: " + nextLun);
            logger.verbose("Disk Label: " + diskInfo.DiskLabel);
            progress = cli.progress('Adding Data-Disk');
            utils.doServiceManagementOperation(channel, 'addDataDisk', found.svc, found.deploy.Name, options.name, diskInfo, function(error, response) {
              progress.end();
              cmdCallback(error);
            });
          } else {
            progress = cli.progress('Removing Data-Disk');
            utils.doServiceManagementOperation(channel, 'removeDataDisk', found.svc, found.deploy.Name, options.name, options.lun, function(error, response) {
              progress.end();
              cmdCallback(error);
            });
          }
        } else {
          progress.end();
          logger.warn('No VMs found');
          cmdCallback();
        }
      }
    });
  }

  function deleteRoleOrDeployment(channel, svcname, deployment, vmname, callback) {
    // if more than 1 role in deployment, then delete role, else delete deployment
    if (deployment.RoleList.length > 1) {
      utils.doServiceManagementOperation(channel, 'deleteRole', svcname, deployment.Name, vmname, function(error, response) {
        if (!error) {
          callback();
        } else {
          callback(error);
        }
      });
    } else {
      utils.doServiceManagementOperation(channel, 'deleteDeployment', svcname, deployment.Name, function(error, response) {
        if (!error) {
          deleteAppIfEmptyAndImplicit(channel, svcname, callback);
        } else {
          callback(error);
        }
      });
    }
  }

  // check if cloud service is implicit and has no deployments
  function deleteAppIfEmptyAndImplicit(channel, dnsPrefix, callback) {
    utils.doServiceManagementOperation(channel, 'getHostedService', dnsPrefix, function(error, response) {
      if (!error) {
        if (response.body.HostedServiceProperties.Description === 'Implicitly created hosted service') {
          var options = {
            dnsPrefix: dnsPrefix,
            useprod: true,
            usestage: true
          };
          enumDeployments(channel, options, function() {
            if (options.rsps.length === 0) {
              utils.doServiceManagementOperation(channel, 'deleteHostedService', options.dnsPrefix, function(error, response) {
                if (!error) {
                  callback();
                } else {
                  callback(error);
                }
              });
            } else {
              callback();
            }
          });
        } else {
          callback();
        }
      } else {
        callback();
      }
    });
  }

  function createPrettyVMView(role, deployment) {
    var roleInstance = getRoleInstance(role.RoleName, deployment);
    var networkConfigSet = getNetworkConfigSet(role);

    return {
      DNSName: url.parse(deployment.Url).host,
      VMName: role.RoleName,
      IPAddress: roleInstance.IpAddress || '',
      InstanceStatus: roleInstance.InstanceStatus,
      InstanceSize: roleInstance.InstanceSize,
      InstanceStateDetails: roleInstance.InstanceStateDetails,
      OSVersion: role.OsVersion,
      Image: role.OSVirtualHardDisk.SourceImageName,
      DataDisks: role.DataVirtualHardDisks,
      Network: {
        Endpoints: (networkConfigSet ? networkConfigSet.InputEndpoints : {})
      }
    };
  }

  function getRoleInstance(roleName, deployment) {
    for (var i = 0; i < deployment.RoleInstanceList.length; i++) {
      if (deployment.RoleInstanceList[i].RoleName === roleName) {
        return deployment.RoleInstanceList[i];
      }
    }
  }

  function getNetworkConfigSet(role) {
    for (var i = 0; i < role.ConfigurationSets.length; i++) {
      var configSet = role.ConfigurationSets[i];
      if (configSet.ConfigurationSetType === 'NetworkConfiguration') {
        return configSet;
      }
    }
  }
};
