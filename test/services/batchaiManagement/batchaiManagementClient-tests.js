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

const AzureStorage = require('azure-storage');
const BatchAIManagementClient = require('../../../lib/services/batchaiManagement/lib/batchAIManagementClient');
const StorageManagementClient = require('../../../lib/services/storageManagement2/lib/storageManagementClient');
const SuiteBase = require('../../framework/suite-base');

const Promise = require('promise');
const should = require('should');
const util = require('util');
const uuid = require('uuid');


const testPrefix = 'batchaimanagementservice-tests';
const groupPrefix = 'nodeTestGroup';
const accountPrefix = 'testacc';
const azFileShareName = 'azfileshare';
const azFileShareMountName = 'azfs';
const azContainerName = 'azcontainer';
const azContainerMountName = 'azcs';
const sshPublicKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDA/2AXum+BQkHvli+y9eG9kBd90X0kniEGPqR5AXo6zCty8iU+Bm8yOUqpkTIrx70S32nml35N8WBy+KVmgHOkUEItpK/b25Fuo8mBUDDIISRCKmcy+OUHdFQ6E1UWYEwrb01eLOVDeg2YsTp0xr5Rc6lgoItG6b7gTTXnyhY42B9X5ey5yAp3RwpUdWaZUdGAkZ4Yn9cnOmf+atH+St8LImeiYoAkhr0cPnDIrylguM+CfAmuFmbpIZfsR4alH8rGhMD19jHVNbBLABJuyZkQrUz5XG+M6dL3Wzze9wKnilmRfiCW+kXnJULQB35S8fVHkeTfJTph5uLkh0yrQ5Yj has_no_private_key';
const nfsName = 'nfs';
const nfsMountName = 'nfs';
const clusterName = 'cluster';
const defaultWorkspace = 'workspace';
const defaultExperiment = 'experiment';

const requiredEnvironment = [
  {name: 'AZURE_TEST_LOCATION', defaultValue: 'northeurope'}
];

let suite;
let client;
let groupName;
let location;
let storageAccountName;
let storageAccountKey;

let nfsId;
let nfsInternalIp;
let nfsSubnet;
let clusterId;

// Make webstorm happy - it cannot resolve 'not' and reports lots of false alarms.
should.not = should.not;

describe('BatchAI Management', function () {
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      location = process.env['AZURE_TEST_LOCATION'];
      client = new BatchAIManagementClient(suite.credentials, suite.subscriptionId);
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeout = 0;
      }
      groupName = suite.generateId(groupPrefix, null);
      suite.createResourcegroup(groupName, location, function (err) {
        should.not.exist(err);
        // Test clusters will mount Azure File share and Azure Storage containers - create a storage account for them.
        const storageClient = new StorageManagementClient(suite.credentials, suite.subscriptionId);
        if (suite.isPlayback) {
          storageClient.longRunningOperationRetryTimeout = 0;
        }
        storageAccountName = suite.generateId(accountPrefix, null);
        if (suite.isPlayback) {
          nfsId = util.format('/subscriptions/%s/resourcegroups/%s/providers/microsoft.batchai/workspaces/workspace/fileservers/nfs', process.env['AZURE_SUBSCRIPTION_ID'], groupName);
          nfsInternalIp = '10.0.0.4';
          nfsSubnet = {
            id: util.format("/subscriptions/%s/resourceGroups/%s/providers/Microsoft.Network/virtualNetworks/vnet/subnets/subnet", process.env['AZURE_SUBSCRIPTION_ID'], groupName)
          };
          clusterId = util.format("/subscriptions/%s/resourceGroups/%s/providers/Microsoft.BatchAI/workspaces/workspace/clusters/cluster", process.env['AZURE_SUBSCRIPTION_ID'], groupName);
          done();
          return;
        }
        const accountParameters = {location: location, sku: {name: 'Standard_LRS'}, kind: 'Storage'};
        storageClient.storageAccounts.create(groupName, storageAccountName, accountParameters, function (err) {
          should.not.exist(err);
          storageClient.storageAccounts.listKeys(groupName, storageAccountName, function (err, result) {
            should.not.exist(err);
            should.exist(result.keys[0]);
            storageAccountKey = result.keys[0].value;

            // Create Azure File Share.
            const sharePromise = new Promise(function (resolve) {
              const fileService = AzureStorage.createFileService(storageAccountName, storageAccountKey);
              fileService.createShareIfNotExists(azFileShareName, function (err) {
                should.not.exist(err);
                resolve();
              });
            });

            // Create Azure Storage container.
            const containerPromise = new Promise(function (resolve) {
              const blobService = AzureStorage.createBlobService(storageAccountName, storageAccountKey);
              blobService.createContainerIfNotExists(azContainerName, function (err) {
                should.not.exist(err);
                resolve();
              });
            });

            // Create a default workspace to keep Batch AI resources. Add a default experiment, NFS and cluster in it
            const workspacePromise = new Promise(function (resolve) {
              client.workspaces.create(groupName, defaultWorkspace, {location: location}, function (err, result) {
                should.not.exists(err);

                // Create a default experiment for jobs
                const experimentPromise = new Promise(function (resolve) {
                  client.experiments.create(groupName, defaultWorkspace, defaultExperiment, function (err, result) {
                    should.not.exists(err);
                    resolve();
                  })
                });

                // Create NFS to be mounted in test clusters.
                const nfsPromise = new Promise(function (resolve) {
                  const nfs = {
                    vmSize: 'Standard_D1',
                    dataDisks: {
                      diskCount: 1,
                      diskSizeInGB: 10,
                      storageAccountType: 'Standard_LRS'
                    },
                    sshConfiguration: {
                      userAccountSettings: {
                        adminUserName: 'username',
                        adminUserSshPublicKey: sshPublicKey
                      }
                    }
                  };
                  console.log(util.format('Creating NFS "%s" in the resource group "%s"', nfsName, groupName));
                  client.fileServers.create(groupName, defaultWorkspace, nfsName, nfs, function (err, result) {
                    should.not.exist(err);
                    console.log('NFS created');
                    nfsId = result.id;
                    nfsInternalIp = result.mountSettings.fileServerInternalIP;
                    nfsSubnet = result.subnet;
                    resolve();
                  });
                });

                // We will need one cluster with allocated nodes and mounted Azure File Share in the tests.
                const clusterPromise = new Promise(function (resolve) {
                  const cluster = {
                    vmSize: 'Standard_D1',
                    scaleSettings: {
                      manual: {
                        targetNodeCount: 1
                      }
                    },
                    nodeSetup: {
                      mountVolumes: {
                        azureFileShares: [
                          {
                            azureFileUrl: util.format('https://%s.file.core.windows.net/%s', storageAccountName, azFileShareName),
                            directoryMode: '0777',
                            fileMode: '0777',
                            relativeMountPath: azFileShareMountName,  // Content of the file share will be available at $AZ_BATCHAI_MOUNT_ROOT/azfs
                            accountName: storageAccountName,
                            credentials: {
                              accountKey: storageAccountKey
                            }
                          }
                        ]
                      }
                    },
                    priority: 'lowpriority',
                    userAccountSettings: {
                      adminUserName: 'username',
                      adminUserSshPublicKey: sshPublicKey
                    }
                  };
                  console.log(util.format('Creating cluster "%s" in the resource group "%s"', clusterName, groupName));
                  client.clusters.create(groupName, defaultWorkspace, clusterName, cluster, function (err, result) {
                    should.not.exist(err);
                    console.log('Cluster created');
                    clusterId = result.id;
                    if (!suite.isPlayback) {
                      console.log('Waiting for node to allocate...');
                      setTimeout(function () {
                        resolve();
                      }, 400000);
                    } else {
                      resolve();
                    }
                  });
                });

                Promise.all([nfsPromise, clusterPromise, experimentPromise]).then(function () {
                  resolve();
                });
              });
            });
            Promise.all([sharePromise, containerPromise, workspacePromise]).then(function () {
              done();
            });
          });
        });
      });
    });
  });

  after(function (done) {
    suite.teardownSuite(function () {
      console.log('Deleting resources');
      suite.deleteResourcegroup(groupName, function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  beforeEach(function (done) {
    suite.setupTest(done);
  });

  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });

  describe('existing resources', function () {
    it('should return success for creation of existing cluster', function (done) {
      const cluster = {
        vmSize: 'Standard_D1',
        scaleSettings: {
          manual: {
            targetNodeCount: 1
          }
        },
        nodeSetup: {
          mountVolumes: {
            azureFileShares: [
              {
                azureFileUrl: util.format('https://%s.file.core.windows.net/%s', storageAccountName, azFileShareName),
                directoryMode: '0777',
                fileMode: '0777',
                relativeMountPath: azFileShareMountName,  // Content of the file share will be available at $AZ_BATCHAI_MOUNT_ROOT/azfs
                accountName: storageAccountName,
                credentials: {
                  accountKey: storageAccountKey
                }
              }
            ]
          }
        },
        userAccountSettings: {
          adminUserName: 'username',
          adminUserSshPublicKey: sshPublicKey
        }
      };
      // This will create already existing cluster, must get 200 response.
      client.clusters.create(groupName, defaultWorkspace, clusterName, cluster, function (err, result, request, response) {
        should.not.exist(err);
        should.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe('cluster creation', function () {
    it('should create new cluster with default Ubuntu LTS image', function (done) {
      const cluster = {
        vmSize: 'Standard_D1',
        scaleSettings: {
          manual: {
            targetNodeCount: 0  // No nodes to speedup test execution and save money. Cluster can be resized later.
          }
        },
        // Batch AI will create an admin user account on each node to allow ssh connection to it.
        userAccountSettings: {
          adminUserName: 'username',
          adminUserPassword: uuid.v4(),
          adminUserSshPublicKey: sshPublicKey
        }
      };

      client.clusters.create(groupName, defaultWorkspace, 'cluster1', cluster, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster1');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.currentNodeCount, 0);  // Shows the number of nodes currently allocated.
        should.equal(result.scaleSettings.manual.targetNodeCount, 0);  // Number of nodes which will be allocated.
        should.equal(result.userAccountSettings.adminUserName, 'username');
        should.not.exist(result.userAccountSettings.adminUserPassword);  // Batch AI will never report the password.

        // If virtual machine configuration was not provided during cluster creation, BatchAI will use Ubuntu LTS with
        // best supported sku and version.
        should.equal(result.virtualMachineConfiguration.imageReference.offer, 'UbuntuServer');
        should.equal(result.virtualMachineConfiguration.imageReference.publisher, 'Canonical');
        should.exist(result.virtualMachineConfiguration.imageReference.sku);  // Inspect to see which sku was chosen.
        should.exist(result.virtualMachineConfiguration.imageReference.version);  // Inspect to see which version was chosen.
        done();
      });
    });

    it('should create new cluster with provided image', function (done) {
      const cluster = {
        location: location,
        vmSize: 'Standard_D1',
        scaleSettings: {
          manual: {
            targetNodeCount: 0  // No nodes to speedup test execution and save money. Cluster can be resized later.
          }
        },
        virtualMachineConfiguration: {
          imageReference: {
            offer: 'linux-data-science-vm-ubuntu',
            publisher: 'microsoft-ads',
            sku: 'linuxdsvmubuntu',
            version: 'latest'
          }
        },
        // Batch AI will create an admin user account on each node to allow ssh connection to it.
        userAccountSettings: {
          adminUserName: 'username',
          adminUserPassword: uuid.v4(),
          adminUserSshPublicKey: sshPublicKey
        }
      };

      client.clusters.create(groupName, defaultWorkspace, 'cluster2', cluster, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster2');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.currentNodeCount, 0);  // Shows the number of nodes currently allocated.
        should.equal(result.scaleSettings.manual.targetNodeCount, 0);  // Number of nodes which will be allocated.
        should.equal(result.userAccountSettings.adminUserName, 'username');
        should.not.exist(result.userAccountSettings.adminUserPassword);  // Batch AI will never report the password.
        should.equal(result.virtualMachineConfiguration.imageReference.offer, 'linux-data-science-vm-ubuntu');
        should.equal(result.virtualMachineConfiguration.imageReference.publisher, 'microsoft-ads');
        should.equal(result.virtualMachineConfiguration.imageReference.sku, 'linuxdsvmubuntu');
        should.equal(result.virtualMachineConfiguration.imageReference.version, 'latest');
        done();
      });
    });

    it('should create new cluster with mounted azure file share and storage container successfully', function (done) {
      const cluster = {
        location: location,
        vmSize: 'Standard_D1',
        scaleSettings: {
          manual: {
            targetNodeCount: 0  // No nodes to speedup test execution and save money. Cluster can be resized later.
          }
        },
        nodeSetup: {
          // It's possible to mount multiple Azure File shares and Azure Storage containers on each compute node.
          mountVolumes: {
            azureFileShares: [
              {
                azureFileUrl: util.format('https://%s.file.core.windows.net/%s', storageAccountName, azFileShareName),
                directoryMode: '0777',
                fileMode: '0777',
                relativeMountPath: azFileShareMountName,  // Content of the file share will be available at $AZ_BATCHAI_MOUNT_ROOT/azfs
                accountName: storageAccountName,
                credentials: {
                  accountKey: storageAccountKey
                }
              }
            ],
            azureBlobFileSystems: [
              {
                containerName: azContainerName,
                relativeMountPath: azContainerMountName, // Content of the container will be available at $AZ_BATCHAI_MOUNT_ROOT/azcs
                accountName: storageAccountName,
                credentials: {
                  accountKey: storageAccountKey
                }
              }
            ]
          }
        },
        userAccountSettings: {
          adminUserName: 'username',
          adminUserPassword: uuid.v4(),
          adminUserSshPublicKey: sshPublicKey
        }
      };

      client.clusters.create(groupName, defaultWorkspace, 'cluster3', cluster, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster3');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.currentNodeCount, 0);  // Shows the number of nodes currently allocated.
        should.equal(result.scaleSettings.manual.targetNodeCount, 0);  // Number of nodes which will be allocated.
        should.equal(result.userAccountSettings.adminUserName, 'username');
        should.not.exist(result.userAccountSettings.adminUserPassword);  // Batch AI will never report the password.
        should.equal(result.nodeSetup.mountVolumes.azureBlobFileSystems.length, 1);
        should.equal(result.nodeSetup.mountVolumes.azureBlobFileSystems[0].accountName, storageAccountName);
        should.equal(result.nodeSetup.mountVolumes.azureBlobFileSystems[0].containerName, azContainerName);
        should.equal(result.nodeSetup.mountVolumes.azureBlobFileSystems[0].relativeMountPath, azContainerMountName);
        should.not.exist(result.nodeSetup.mountVolumes.azureBlobFileSystems[0].credentials.accountKey);  // Never reported.
        should.equal(result.nodeSetup.mountVolumes.azureFileShares.length, 1);
        should.equal(result.nodeSetup.mountVolumes.azureFileShares[0].accountName, storageAccountName);
        should.equal(result.nodeSetup.mountVolumes.azureFileShares[0].azureFileUrl,
          util.format('https://%s.file.core.windows.net/%s', storageAccountName, azFileShareName));
        should.equal(result.nodeSetup.mountVolumes.azureFileShares[0].relativeMountPath, azFileShareMountName);
        should.not.exist(result.nodeSetup.mountVolumes.azureFileShares[0].credentials.accountKey);  // Never reported.
        done();
      });
    });

    it('should create new cluster with nfs successfully', function (done) {
      const cluster = {
        location: location,
        vmSize: 'Standard_D1',
        scaleSettings: {
          manual: {
            targetNodeCount: 0  // No nodes to speedup test execution and save money. Cluster can be resized later.
          }
        },
        nodeSetup: {
          mountVolumes: {
            fileServers: [
              {
                fileServer: {
                  id: nfsId
                },
                relativeMountPath: nfsMountName,  // Content of file server's /mnt/data will be available at $AZ_BATCHAI_MOUNT_ROOT/nfs
                mountOptions: 'rw'
              }
            ]
          }
        },
        userAccountSettings: {
          adminUserName: 'username',
          adminUserPassword: uuid.v4(),
          adminUserSshPublicKey: sshPublicKey
        }
      };

      client.clusters.create(groupName, defaultWorkspace, 'cluster4', cluster, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster4');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.currentNodeCount, 0);  // Shows the number of nodes currently allocated.
        should.equal(result.scaleSettings.manual.targetNodeCount, 0);  // Number of nodes which will be allocated.
        should.equal(result.userAccountSettings.adminUserName, 'username');
        should.not.exist(result.userAccountSettings.adminUserPassword);  // Batch AI will never report the password.
        should.equal(result.nodeSetup.mountVolumes.fileServers.length, 1);
        should.equal(result.nodeSetup.mountVolumes.fileServers[0].fileServer.id.toLowerCase(), nfsId.toLowerCase());
        should.equal(result.nodeSetup.mountVolumes.fileServers[0].relativeMountPath, nfsMountName);
        should.equal(result.nodeSetup.mountVolumes.fileServers[0].mountOptions, 'rw');
        done();
      });
    });

    it('should create new cluster with unmanaged file system successfully', function (done) {
      // Batch AI allows you to mount external file servers (cifs, nfs, gluster) on every compute node. The file server
      // and cluster must be in the same subnet to make this work.
      // In this test we will use previously created nfs as unmanaged file system for demo purposes.
      const cluster = {
        location: location,
        vmSize: 'Standard_D1',
        scaleSettings: {
          manual: {
            targetNodeCount: 0  // No nodes to speedup test execution and save money. Cluster can be resized later.
          }
        },
        // We will mount unmanaged file system using private IP, so we need to be on the same subnet.
        subnet: nfsSubnet,
        nodeSetup: {
          mountVolumes: {
            unmanagedFileSystems: [
              {
                mountCommand: util.format('mount -t nfs %s:/mnt/data', nfsInternalIp),
                relativeMountPath: nfsMountName  // Content of file server's /mnt/data will be available at $AZ_BATCHAI_MOUNT_ROOT/nfs
              }
            ]
          }
        },
        userAccountSettings: {
          adminUserName: 'username',
          adminUserPassword: uuid.v4(),
          adminUserSshPublicKey: sshPublicKey
        }
      };

      client.clusters.create(groupName, defaultWorkspace, 'cluster5', cluster, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster5');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.currentNodeCount, 0);  // Shows the number of nodes currently allocated.
        should.equal(result.scaleSettings.manual.targetNodeCount, 0);  // Number of nodes which will be allocated.
        should.equal(result.userAccountSettings.adminUserName, 'username');
        should.not.exist(result.userAccountSettings.adminUserPassword);  // Batch AI will never report the password.
        should.equal(result.nodeSetup.mountVolumes.unmanagedFileSystems.length, 1);
        should.equal(result.nodeSetup.mountVolumes.unmanagedFileSystems[0].mountCommand,
          util.format('mount -t nfs %s:/mnt/data', nfsInternalIp));
        should.equal(result.nodeSetup.mountVolumes.unmanagedFileSystems[0].relativeMountPath, nfsMountName);
        done();
      });
    });

    it('should create new trivial cluster with setup task and mounted azure files share successfully', function (done) {
      const cluster = {
        location: location,
        vmSize: 'Standard_D1',
        scaleSettings: {
          manual: {
            targetNodeCount: 0  // No nodes to speedup test execution. It's possible to resize cluster after creation.
          }
        },
        nodeSetup: {
          // Setup task will run on each cluster's node after node is created or rebooted.
          setupTask: {
            commandLine: 'echo Hello',
            runElevated: true,
            // It's recommended to store setup task logs somewhere outside of node (e.g. Azure File share like this).
            stdOutErrPathPrefix: util.format('$AZ_BATCHAI_MOUNT_ROOT/%s', azFileShareMountName),
            // Additional environment variables which should be available to the setup task.
            environmentVariables: [
              {
                name: 'ENVIRONMENT_VARIABLE_1', value: 'Value1'
              },
              {
                name: 'ENVIRONMENT_VARIABLE_2', value: 'Value2'
              }
            ],
            secrets: [
              {
                name: 'SECRET_ENVIRONMENT_VARIABLE_1', value: 'Secret1'
              },
              {
                name: 'SECRET_ENVIRONMENT_VARIABLE_2', value: 'Secret2'
              }
            ]
          },
          // Mount Azure File share to store setup task logs.
          mountVolumes: {
            azureFileShares: [
              {
                azureFileUrl: util.format('https://%s.file.core.windows.net/%s', storageAccountName, azFileShareName),
                relativeMountPath: azFileShareMountName,  // Content of the file share will be available at $AZ_BATCHAI_MOUNT_ROOT/azfs
                accountName: storageAccountName,
                credentials: {
                  accountKey: storageAccountKey
                }
              }
            ]
          }
        },
        userAccountSettings: {
          adminUserName: 'username',
          adminUserPassword: uuid.v4(),
          adminUserSshPublicKey: sshPublicKey
        }
      };

      client.clusters.create(groupName, defaultWorkspace, 'cluster6', cluster, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster6');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.nodeSetup.setupTask.commandLine, 'echo Hello');
        should.equal(result.nodeSetup.setupTask.stdOutErrPathPrefix, util.format('$AZ_BATCHAI_MOUNT_ROOT/%s', azFileShareMountName));
        should.exist(result.nodeSetup.setupTask.stdOutErrPathSuffix); // path where setup task logs stored
        // For environment variables server returns name and value
        should.equal(result.nodeSetup.setupTask.environmentVariables.map(function (v) {
          return v.name + '=' + v.value;
        }).join(' '), 'ENVIRONMENT_VARIABLE_1=Value1 ENVIRONMENT_VARIABLE_2=Value2');
        // For secrets server returns only names.
        should.equal(result.nodeSetup.setupTask.secrets.map(function (v) {
            return v.name;
          }).join(' '),
          'SECRET_ENVIRONMENT_VARIABLE_1 SECRET_ENVIRONMENT_VARIABLE_2');
        should.equal(result.nodeSetup.setupTask.secrets.some(function (v) {
          return v.value != null;
        }), false);
        done();
      });
    });

    it('should create new cluster with password only', function (done) {
      const cluster = {
        location: location,
        vmSize: 'Standard_D1',
        scaleSettings: {
          manual: {
            targetNodeCount: 0  // No nodes to speedup test execution and save money. Cluster can be resized later.
          }
        },
        // Batch AI will create an admin user account on each node to allow ssh connection to it.
        userAccountSettings: {
          adminUserName: 'username',
          adminUserPassword: uuid.v4()
        }
      };

      client.clusters.create(groupName, defaultWorkspace, 'cluster7', cluster, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster7');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.currentNodeCount, 0);  // Shows the number of nodes currently allocated.
        should.equal(result.scaleSettings.manual.targetNodeCount, 0);  // Number of nodes which will be allocated.
        should.equal(result.userAccountSettings.adminUserName, 'username');
        should.not.exist(result.userAccountSettings.adminUserPassword);  // Batch AI will never report the password.
        done();
      });
    });

    it('should create new cluster with ssh public key only', function (done) {
      const cluster = {
        location: location,
        vmSize: 'Standard_D1',
        scaleSettings: {
          manual: {
            targetNodeCount: 0  // No nodes to speedup test execution and save money. Cluster can be resized later.
          }
        },
        // Batch AI will create an admin user account on each node to allow ssh connection to it.
        userAccountSettings: {
          adminUserName: 'username',
          adminUserSshPublicKey: sshPublicKey
        }
      };

      client.clusters.create(groupName, defaultWorkspace, 'cluster8', cluster, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster8');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.currentNodeCount, 0);  // Shows the number of nodes currently allocated.
        should.equal(result.scaleSettings.manual.targetNodeCount, 0);  // Number of nodes which will be allocated.
        should.equal(result.userAccountSettings.adminUserName, 'username');
        done();
      });
    });

    it('should create new auto-scale cluster with default Ubuntu LTS image', function (done) {
      const cluster = {
        location: location,
        vmSize: 'Standard_D1',
        scaleSettings: {
          // Batch AI will auto resize the cluster in given limits depending on the number or running and queued tasks.
          autoScale: {
            minimumNodeCount: 0,  // Minimum number of nodes in the cluster.
            maximumNodeCount: 10,  // Maximum number of nodes in the cluster.
            initialNodeCount: 0  // Number of nodes to be allocated during cluster creation.
          }
        },
        // Batch AI will create an admin user account on each node to allow ssh connection to it.
        userAccountSettings: {
          adminUserName: 'username',
          adminUserPassword: uuid.v4(),
          adminUserSshPublicKey: sshPublicKey
        }
      };

      client.clusters.create(groupName, defaultWorkspace, 'cluster9', cluster, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster9');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.currentNodeCount, 0);  // Shows the number of nodes currently allocated.
        should.equal(result.scaleSettings.autoScale.minimumNodeCount, 0);
        should.equal(result.scaleSettings.autoScale.maximumNodeCount, 10);
        should.equal(result.scaleSettings.autoScale.initialNodeCount, 0);
        done();
      });
    });
  });

  describe('cluster resize', function () {
    it('should resize cluster successfully', function (done) {
      const cluster = {
        vmSize: 'Standard_D1',
        scaleSettings: {
          manual: {
            targetNodeCount: 0  // No nodes to speedup test execution and save money. Cluster can be resized later.
          }
        },
        // Batch AI will create an admin user account on each node to allow ssh connection to it.
        userAccountSettings: {
          adminUserName: 'username',
          adminUserPassword: uuid.v4(),
          adminUserSshPublicKey: sshPublicKey
        }
      };

      client.clusters.create(groupName, defaultWorkspace, 'cluster10', cluster, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster10');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.currentNodeCount, 0);  // Shows the number of nodes currently allocated.

        // Manually scale the cluster to have one node.
        const resize_parameters = {
          scaleSettings: {
            manual: {
              targetNodeCount: 1
            }
          }
        };

        client.clusters.update(groupName, defaultWorkspace, 'cluster10', resize_parameters, function (err, result) {
          should.not.exist(err);
          should.equal(result.scaleSettings.manual.targetNodeCount, 1);

          // Switch the cluster into auto-scale mode.
          const auto_scale_parameters = {
            scaleSettings: {
              autoScale: {
                minimumNodeCount: 0,
                maximumNodeCount: 10
              }
            }
          };

          client.clusters.update(groupName, defaultWorkspace, 'cluster10', auto_scale_parameters, function (err, result) {
            should.not.exist(err);
            should.equal(result.scaleSettings.autoScale.minimumNodeCount, 0);
            should.equal(result.scaleSettings.autoScale.maximumNodeCount, 10);
            done();
          });
        });
      });
    });
  });

  describe('get cluster information', function () {
    it('should get information about cluster successfully', function (done) {
      client.clusters.get(groupName, defaultWorkspace, 'cluster', function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'cluster');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.vmSize, 'STANDARD_D1');
        should.equal(result.currentNodeCount, 1);  // Shows the number of nodes currently allocated.

        // You can inspect current allocation state: steady - cluster is not resizing currently, resizing - cluster is
        // currently adding or deleting nodes.
        should.equal(result.allocationState, 'steady');

        // You can inspect nodes states.
        should.equal(result.nodeStateCounts.idleNodeCount, 1);  // Number of idling nodes ready to execute jobs.
        should.equal(result.nodeStateCounts.runningNodeCount, 0);  // Number of nodes currently running jobs.
        should.equal(result.nodeStateCounts.preparingNodeCount, 0);  // Just allocated nodes which performing
                                                                     // preparation tasks and/or setup task.
        should.equal(result.nodeStateCounts.leavingNodeCount, 0);  // Number of nodes being deallocated during cluster
                                                                   // during downscaling.
        done();
      });
    });

    it('should get remote login information for cluster nodes successfully', function (done) {
      client.clusters.listRemoteLoginInformation(groupName, defaultWorkspace, 'cluster', function (err, result) {
        should.not.exist(err);
        // Result will contain IP address and ssh port number for each cluster node.
        should.equal(result.length, 1);
        done();
      });
    });
  });

  describe('jobs', function () {
    it('should run host job successfully', function (done) {
      const job = {
        cluster: {
          id: clusterId
        },
        nodeCount: 1, // Number of nodes required for the job execution.
        // Optional job preparation. If specified will be executed before job on every node or container (if
        // containerSettings specified).
        jobPreparation: {
          commandLine: 'echo hello from job preparation'
        },
        // This test will use custom toolkit job, for information about using other toolkits please refer to
        // https://github.com/Azure/BatchAI/blob/master/recipes.
        customToolkitSettings: {
          commandLine: 'echo hello from job'
        },
        // Additional environment variables which should be available to job and job preparation.
        environmentVariables: [
          {
            name: 'ENVIRONMENT_VARIABLE_1', value: 'Value1'
          },
          {
            name: 'ENVIRONMENT_VARIABLE_2', value: 'Value2'
          }
        ],
        secrets: [
          {
            name: 'SECRET_ENVIRONMENT_VARIABLE_1', value: 'Secret1'
          },
          {
            name: 'SECRET_ENVIRONMENT_VARIABLE_2', value: 'Secret2'
          }
        ],
        // Job's and job preparation stdout and stderr will be stored on mounted azure file share.
        stdOutErrPathPrefix: util.format('$AZ_BATCHAI_MOUNT_ROOT/%s', azFileShareMountName),
        // Optionally, job may have additional output directories configured. If output directory is configured on
        // Azure File share or Azure Blob storage, it's possible to list files in that directory using Batch AI list
        // files API.
        outputDirectories: [
          {
            id: 'MODEL',  // ID to use with list files API. Job can find this directory using
                          // $AZ_BATCHAI_OUTPUT_MODEL environment variable.
            pathPrefix: util.format('$AZ_BATCHAI_MOUNT_ROOT/%s', azFileShareMountName),  // Put it on Azure File share
            pathSuffix: 'model' // Folder name for the output directory.
          }
        ]
      };
      client.jobs.create(groupName, defaultWorkspace, defaultExperiment, 'job1', job, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'job1');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.cluster.id.toLowerCase(), clusterId.toLowerCase());
        should.equal(result.nodeCount, 1);
        should.equal(result.customToolkitSettings.commandLine, 'echo hello from job');
        should.equal(result.jobPreparation.commandLine, 'echo hello from job preparation');
        should.equal(result.stdOutErrPathPrefix, util.format('$AZ_BATCHAI_MOUNT_ROOT/%s', azFileShareMountName));
        // Server reports the path segment generated for output dirs which can be used to find output files directly in
        // storage or on mounted file server.
        should.exists(result.jobOutputDirectoryPathSegment);
        should.equal(result.outputDirectories.length, 1);
        should.equal(result.outputDirectories[0].id, 'MODEL');
        should.equal(result.outputDirectories[0].pathPrefix, util.format('$AZ_BATCHAI_MOUNT_ROOT/%s', azFileShareMountName));
        should.equal(result.outputDirectories[0].pathSuffix, 'model');
        // For environment variables server returns name and value
        should.equal(result.environmentVariables.map(function (v) {
          return v.name + '=' + v.value;
        }).join(' '), 'ENVIRONMENT_VARIABLE_1=Value1 ENVIRONMENT_VARIABLE_2=Value2');
        // For secrets server returns only names.
        should.equal(result.secrets.map(function (v) {
            return v.name;
          }).join(' '),
          'SECRET_ENVIRONMENT_VARIABLE_1 SECRET_ENVIRONMENT_VARIABLE_2');
        should.equal(result.secrets.some(function (v) {
          return v.value != null;
        }), false);

        // Let's wait for job's completion and check execution status and list standard output.
        const jobCompletedPromise = new Promise(function (resolve) {
          // 15 sec should be enough for job to complete
          if (!suite.isPlayback) {
            setTimeout(function () {
              resolve();
            }, 15000);
          } else {
            resolve();
          }
        });
        jobCompletedPromise.then(function () {
          client.jobs.get(groupName, defaultWorkspace, defaultExperiment, 'job1', function (err, result) {
            should.not.exist(err);
            should.equal(result.executionState, 'succeeded');
            should.equal(result.executionInfo.exitCode, 0);

            // 'stdouterr' is standard output directory ID for stdout and stderr files.
            client.jobs.listOutputFiles(groupName, defaultWorkspace, defaultExperiment, 'job1',
                {outputdirectoryid: 'stdouterr'}, function (err, result) {
              should.not.exist(err);
              // Should contain stdout and stderr for job and job preparation.
              should.equal(result.length, 5);
              should.equal(result.map(function (v) {
                return v.name;
              }).sort().join(' '), 'execution.log stderr-job_prep.txt stderr.txt stdout-job_prep.txt stdout.txt');
              done();
            })
          })
        });
      });
    });

    it('should run container job successfully', function (done) {
      const job = {
        containerSettings: {
          imageSourceRegistry: {
            // serverUrl: '',  // Specify if image is locate on a server other than hub.docker.com
            image: 'ubuntu'  // Note, you need to provide fully qualified name if using server other than hub.docker.com
            // credentials: {}  // Specify user name and password or key vault secret for private images.
          }
        },
        cluster: {
          id: clusterId
        },
        // The rest of the settings are same for host and container jobs.
        nodeCount: 1, // Number of nodes required for the job execution.
        // Optional job preparation. If specified will be executed before job on every node or container (if
        // containerSettings specified.
        jobPreparation: {
          commandLine: 'echo hello from job preparation'
        },
        // This test will use custom toolkit job, for information about using other toolkits please refer to
        // https://github.com/Azure/BatchAI/blob/master/recipes.
        customToolkitSettings: {
          commandLine: 'echo hello from job'
        },
        // Job's and job preparation stdout and stderr will be stored on mounted azure file share.
        stdOutErrPathPrefix: util.format('$AZ_BATCHAI_MOUNT_ROOT/%s', azFileShareMountName)
      };
      client.jobs.create(groupName, defaultWorkspace, defaultExperiment, 'job2', job, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'job2');
        should.equal(result.provisioningState, 'succeeded');
        should.equal(result.containerSettings.imageSourceRegistry.image, 'ubuntu');
        should.equal(result.cluster.id.toLowerCase(), clusterId.toLowerCase());
        should.equal(result.nodeCount, 1);
        should.equal(result.customToolkitSettings.commandLine, 'echo hello from job');
        should.equal(result.jobPreparation.commandLine, 'echo hello from job preparation');
        should.equal(result.stdOutErrPathPrefix, util.format('$AZ_BATCHAI_MOUNT_ROOT/%s', azFileShareMountName));

        // Let's wait for job's completion and check execution status and list standard output.
        const jobCompletedPromise = new Promise(function (resolve) {
          // 15 sec should be enough for job to complete
          if (!suite.isPlayback) {
            setTimeout(function () {
              resolve();
            }, 15000);
          } else {
            resolve();
          }
        });
        jobCompletedPromise.then(function () {
          client.jobs.get(groupName, defaultWorkspace, defaultExperiment, 'job2', function (err, result) {
            should.not.exist(err);
            should.equal(result.executionState, 'succeeded');
            should.equal(result.executionInfo.exitCode, 0);

            // 'stdouterr' is standard output directory ID for stdout and stderr files.
            client.jobs.listOutputFiles(groupName, defaultWorkspace, defaultExperiment, 'job2',
                                        {outputdirectoryid: 'stdouterr'}, function (err, result) {
              should.not.exist(err);
              // Should contain stdout and stderr for job and job preparation.
              should.equal(result.length, 5);
              should.equal(result.map(function (v) {
                return v.name;
              }).sort().join(' '), 'execution.log stderr-job_prep.txt stderr.txt stdout-job_prep.txt stdout.txt');
              done();
            })
          })
        });
      });
    });

    it('should terminate host job successfully', function (done) {
      const job = {
        cluster: {
          id: clusterId
        },
        nodeCount: 1,
        // Create long running job.
        customToolkitSettings: {
          commandLine: 'ping localhost'
        },
        stdOutErrPathPrefix: util.format('$AZ_BATCHAI_MOUNT_ROOT/%s', azFileShareMountName)
      };
      client.jobs.create(groupName, defaultWorkspace, defaultExperiment, 'job3', job, function (err, result) {
        should.not.exist(err);
        should.equal(result.name, 'job3');
        should.equal(result.provisioningState, 'succeeded');

        // Let job to start execution and terminate it.
        const jobRunningPromise = new Promise(function (resolve) {
          if (!suite.isPlayback) {
            setTimeout(function () {
              resolve();
            }, 15000);
          } else {
            resolve();
          }
        });
        jobRunningPromise.then(function () {
          client.jobs.get(groupName, defaultWorkspace, defaultExperiment, 'job3', function (err, result) {
            should.not.exist(err);
            should.equal(result.executionState, 'running');

            // Terminate it.
            client.jobs.terminate(groupName, defaultWorkspace, defaultExperiment, 'job3', function (err) {
              should.not.exist(err);
              client.jobs.get(groupName, defaultWorkspace, defaultExperiment, 'job3', function (err, result) {
                should.not.exist(err);
                should.equal(result.executionState, 'failed');
                done();
              });
            });
          })
        });
      });
    });

    it('should run a job with job level mounting volumes successfully', function (done) {
      const job = {
        cluster: {
          id: clusterId
        },
        nodeCount: 1, // Number of nodes required for the job execution.
        // Job's and job preparation stdout and stderr will be stored on azure file share mounted during cluster
        // creation.
        stdOutErrPathPrefix: util.format('$AZ_BATCHAI_MOUNT_ROOT/%s', azFileShareMountName),
        // It's possible to mount additional file system required for a job during the job creation. Those file systems
        // are automatically unmounted when job completes execution.
        mountVolumes: {
          // For demo purposes, we will mount azure container for this job.
          azureBlobFileSystems: [
            {
              containerName: azContainerName,
              // Content of the container be available at $AZ_BATCHAI_JOB_MOUNT_ROOT/azcs
              relativeMountPath: azContainerMountName,
              accountName: storageAccountName,
              credentials: {
                accountKey: storageAccountKey
              }
            }
          ]
        },
        // Output and input directories can be created on file system mounted at job level as well.
        outputDirectories: [
          {
            id: 'OUTPUT', // Batch AI will create AZ_BATCHAI_OUTPUT_OUTPUT environment variable with the full path to
                          // the output directory.
            pathPrefix: util.format('$AZ_BATCHAI_JOB_MOUNT_ROOT/%s', azContainerMountName),
          }
        ],
        // Both job and job preparation have access to file system mounted during cluster and job creation.
        jobPreparation: {
          commandLine: 'echo hello from job preparation; echo prep > $AZ_BATCHAI_OUTPUT_OUTPUT/prep.txt'
        },
        // This test will use custom toolkit job, for information about using other toolkits please refer to
        // https://github.com/Azure/BatchAI/blob/master/recipes.
        customToolkitSettings: {
          commandLine: 'echo hello from job; echo job > $AZ_BATCHAI_OUTPUT_OUTPUT/job.txt'
        },
      };
      client.jobs.create(groupName, defaultWorkspace, defaultExperiment, 'job4', job, function (err) {
        should.not.exist(err);

        // Let's wait for job's completion and check execution status, list standard output and output stored on the
        // container mounted during job creation.
        const jobCompletedPromise = new Promise(function (resolve) {
          // 15 sec should be enough for job to complete
          if (!suite.isPlayback) {
            setTimeout(function () {
              resolve();
            }, 15000);
          } else {
            resolve();
          }
        });
        jobCompletedPromise.then(function () {
          client.jobs.get(groupName, defaultWorkspace, defaultExperiment, 'job4', function (err, result) {
            should.not.exist(err);
            should.equal(result.executionState, 'succeeded');
            should.equal(result.executionInfo.exitCode, 0);

            // 'stdouterr' is standard output directory ID for stdout and stderr files.
            let checkedStdOutErr = new Promise(function (resolve) {
              client.jobs.listOutputFiles(groupName, defaultWorkspace, defaultExperiment, 'job4',
                                          {outputdirectoryid: 'stdouterr'}, function (err, result) {
                should.not.exist(err);
                // Should contain stdout and stderr for job and job preparation.
                should.equal(result.length, 5);
                should.equal(result.map(function (v) {
                  return v.name;
                }).sort().join(' '), 'execution.log stderr-job_prep.txt stderr.txt stdout-job_prep.txt stdout.txt');
                resolve();
              })
            });

            // 'OUTPUT' is the id of the output directory we specified in the job.
            let checkedOutputDirectory = new Promise(function (resolve) {
              client.jobs.listOutputFiles(groupName, defaultWorkspace, defaultExperiment, 'job4',
                                          {outputdirectoryid: 'OUTPUT'}, function (err, result) {
                should.not.exist(err);
                should.equal(result.map(function (v) {
                  return v.name;
                }).sort().join(' '), 'job.txt prep.txt');
                resolve();
              })
            });

            Promise.all([checkedStdOutErr, checkedOutputDirectory]).then(function () {
              done();
            });
          })
        });
      });
    });
  });

  describe('quota and usage', function () {
    it('should list quota and usage successfully', function (done) {
      client.usages.list(location, function (err, result) {
        should.not.exist(err);
        // Server will return a list of quotas and current usages for cluster and jobs. Each entry will have a name,
        // unit, current and max value.
        should.equal(result.some(function (v) {
          return !v.name || !v.name.value || !v.unit;
        }), false);
        done();
      })
    });
  });
});
