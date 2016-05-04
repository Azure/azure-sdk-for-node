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


var should = require('should');
var util = require('util');
var fs = require('fs');
var stream = require('stream');
var moment = require('moment');
var msRest = require('ms-rest');
var msRestAzure = require('ms-rest-azure');
var SuiteBase = require('../../framework/suite-base');
var FileTokenCache = require('../../../lib/util/fileTokenCache');
var BatchServiceClient = require('../../../lib/services/batch/lib/batchServiceClient');
var BatchCredentials = require('../../../lib/services/batch/lib/batchSharedKeyCredentials')
var WebResource = msRest.WebResource;
var Pipeline = msRest.requestPipeline;
var ServiceClient = msRest.ServiceClient;
var testPrefix = 'batchservice-tests';
var groupPrefix = 'nodeTestGroup';
var accountPrefix = 'testacc';
var certThumb = 'cff2ab63c8c955aaf71989efa641b906558d9fb7';
var createdGroups = [];
var createdAccounts = [];

var requiredEnvironment = [
  { name: 'AZURE_BATCH_ACCOUNT', defaultValue: 'batchtestnodesdk' },
  { name: 'AZURE_BATCH_ENDPOINT', defaultValue: 'https://batchtestnodesdk.japaneast.batch.azure.com/'}
];

var suite;
var client;
var compute_nodes;


var readStreamToBuffer = function (strm, callback)  {
  var bufs = [];
  strm.on('data', function (d) { bufs.push(d); });
  strm.on('end', function () {
    callback(null, Buffer.concat(bufs));
  });
};

describe('Batch Service', function () {
  
  before(function (done) {
    suite = new SuiteBase(this, testPrefix, requiredEnvironment);
    suite.setupSuite(function () {
      var account = process.env.AZURE_BATCH_ACCOUNT;
      var uri = process.env['AZURE_BATCH_ENDPOINT'];
      var key = process.env['AZURE_BATCH_ACCOUNT_KEY'];
      if (key === null || key === undefined) {
        key = 'non null default value';
      }
      var creds = new BatchCredentials(account, key);
      client = new BatchServiceClient(creds, uri);
      if (suite.isPlayback) {
        client.longRunningOperationRetryTimeout = 0;
      }
      done();
    });
  });
  
  after(function (done) {
    suite.teardownSuite(done);
  });
    beforeEach(function (done) {
    suite.setupTest(done);
  });
  
  afterEach(function (done) {
    suite.baseTeardownTest(done);
  });

  describe('operations', function () {

    it('should list node agent sku successfully', function (done) {
      client.account.listNodeAgentSkus(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        result[0].id.should.equal('batch.node.centos 7');
        result[0].osType.should.equal('linux');
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should add new certificate successfully', function (done) {
      var options = {
        thumbprint: certThumb, thumbprintAlgorithm: 'sha1', password: 'nodesdk', certificateFormat: 'pfx',
        data: 'MIIGMQIBAzCCBe0GCSqGSIb3DQEHAaCCBd4EggXaMIIF1jCCA8AGCSqGSIb3DQEHAaCCA7EEggOtMIIDqTCCA6UGCyqGSIb3DQEMCgECoIICtjCCArIwHAYKKoZIhvcNAQwBAzAOBAhyd3xCtln3iQICB9AEggKQhe5P10V9iV1BsDlwWT561Yu2hVq3JT8ae/ebx1ZR/gMApVereDKkS9Zg4vFyssusHebbK5pDpU8vfAqle0TM4m7wGsRj453ZorSPUfMpHvQnAOn+2pEpWdMThU7xvZ6DVpwhDOQk9166z+KnKdHGuJKh4haMT7Rw/6xZ1rsBt2423cwTrQVMQyACrEkianpuujubKltN99qRoFAxhQcnYE2KlYKw7lRcExq6mDSYAyk5xJZ1ZFdLj6MAryZroQit/0g5eyhoNEKwWbi8px5j71pRTf7yjN+deMGQKwbGl+3OgaL1UZ5fCjypbVL60kpIBxLZwIJ7p3jJ+q9pbq9zSdzshPYor5lxyUfXqaso/0/91ayNoBzg4hQGh618PhFI6RMGjwkzhB9xk74iweJ9HQyIHf8yx2RCSI22JuCMitPMWSGvOszhbNx3AEDLuiiAOHg391mprEtKZguOIr9LrJwem/YmcHbwyz5YAbZmiseKPkllfC7dafFfCFEkj6R2oegIsZo0pEKYisAXBqT0g+6/jGwuhlZcBo0f7UIZm88iA3MrJCjlXEgV5OcQdoWj+hq0lKEdnhtCKr03AIfukN6+4vjjarZeW1bs0swq0l3XFf5RHa11otshMS4mpewshB9iO9MuKWpRxuxeng4PlKZ/zuBqmPeUrjJ9454oK35Pq+dghfemt7AUpBH/KycDNIZgfdEWUZrRKBGnc519C+RTqxyt5hWL18nJk4LvSd3QKlJ1iyJxClhhb/NWEzPqNdyA5cxen+2T9bd/EqJ2KzRv5/BPVwTQkHH9W/TZElFyvFfOFIW2+03RKbVGw72Mr/0xKZ+awAnEfoU+SL/2Gj2m6PHkqFX2sOCi/tN9EA4xgdswEwYJKoZIhvcNAQkVMQYEBAEAAAAwXQYJKwYBBAGCNxEBMVAeTgBNAGkAYwByAG8AcwBvAGYAdAAgAFMAdAByAG8AbgBnACAAQwByAHkAcAB0AG8AZwByAGEAcABoAGkAYwAgAFAAcgBvAHYAaQBkAGUAcjBlBgkqhkiG9w0BCRQxWB5WAFAAdgBrAFQAbQBwADoANABjAGUANgAwADQAZABhAC0AMAA2ADgAMQAtADQANAAxADUALQBhADIAYwBhAC0ANQA3ADcAMwAwADgAZQA2AGQAOQBhAGMwggIOBgkqhkiG9w0BBwGgggH/BIIB+zCCAfcwggHzBgsqhkiG9w0BDAoBA6CCAcswggHHBgoqhkiG9w0BCRYBoIIBtwSCAbMwggGvMIIBXaADAgECAhAdka3aTQsIsUphgIXGUmeRMAkGBSsOAwIdBQAwFjEUMBIGA1UEAxMLUm9vdCBBZ2VuY3kwHhcNMTYwMTAxMDcwMDAwWhcNMTgwMTAxMDcwMDAwWjASMRAwDgYDVQQDEwdub2Rlc2RrMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5fhcxbJHxxBEIDzVOMc56s04U6k4GPY7yMR1m+rBGVRiAyV4RjY6U936dqXHCVD36ps2Q0Z+OeEgyCInkIyVeB1EwXcToOcyeS2YcUb0vRWZDouC3tuFdHwiK1Ed5iW/LksmXDotyV7kpqzaPhOFiMtBuMEwNJcPge9k17hRgRQIDAQABo0swSTBHBgNVHQEEQDA+gBAS5AktBh0dTwCNYSHcFmRjoRgwFjEUMBIGA1UEAxMLUm9vdCBBZ2VuY3mCEAY3bACqAGSKEc+41KpcNfQwCQYFKw4DAh0FAANBAHl2M97QbpzdnwO5HoRBsiEExOcLTNg+GKCr7HUsbzfvrUivw+JLL7qjHAIc5phnK+F5bQ8HKe0L9YXBSKl+fvwxFTATBgkqhkiG9w0BCRUxBgQEAQAAADA7MB8wBwYFKw4DAhoEFGVtyGMqiBd32fGpzlGZQoRM6UQwBBTI0YHFFqTS4Go8CoLgswn29EiuUQICB9A='
      };
      client.certificateOperations.add(options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(201);
        done();
      });
    });
    
    it('should list certificates successfully', function (done) {
      client.certificateOperations.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        result[0].thumbprint.should.equal(certThumb);
        result[0].thumbprintAlgorithm.should.equal('sha1');
        response.statusCode.should.equal(200);
        done();
      });
    });
    
    it('should get certificate reference successfully', function (done) {
      client.certificateOperations.get('sha1', certThumb, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.thumbprint.should.equal(certThumb);
        result.thumbprintAlgorithm.should.equal('sha1');
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should create a new pool successfully', function (done) {
      var pool = {
        id: 'nodesdktestpool1', vmSize: 'small', cloudServiceConfiguration: { osFamily: '4' }, targetDedicated: 3,
        certificateReferences: [{ thumbprint: certThumb, thumbprintAlgorithm: 'sha1' }]
      };
      client.pool.add(pool, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(201);
        if (suite.isPlayback) {
          done();
        }
        console.log('Waiting for pool to start up...')
        setTimeout(function () {
          done();
        }, 100000);
      });
    });

    it('should update pool target OS version successfully', function (done) {
      client.pool.upgradeOS('nodesdktestpool1', 'WA-GUEST-OS-4.27_201512-01', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should update pool parameters successfully', function (done) {
      var options = { metadata: [ { name: 'foo', value: 'bar' } ], certificateReferences: [], applicationPackageReferences: []};
      client.pool.updateProperties('nodesdktestpool1', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(204);
        done();
      });
    });

    it('should patch pool parameters successfully', function (done) {
      var options = { metadata: [{ name: 'foo2', value: 'bar2' }] };
      client.pool.patch('nodesdktestpool1', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        if (suite.isPlayback) {
          done();
        }
        console.log('Waiting for nodes to be ready...')
        setTimeout(function () {
          done();
        }, 300000);
      });
    });

    it('should get a pool reference successfully', function (done) {
      client.pool.get('nodesdktestpool1', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.id.should.equal('nodesdktestpool1');
        result.state.should.equal('active');
        result.allocationState.should.equal('steady');
        should.exist(result.cloudServiceConfiguration);
        result.cloudServiceConfiguration.osFamily.should.equal('4');
        result.vmSize.should.equal('small');
        result.metadata[0].name.should.equal('foo2');
        result.metadata[0].value.should.equal('bar2');
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should get a pool reference with odata successfully', function (done) {
      var options = { poolGetOptions: { select: 'id,state', expand: 'stats' } };
      client.pool.get('nodesdktestpool1', options, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.id.should.equal('nodesdktestpool1');
        result.state.should.equal('active');
        should.not.exist(result.allocationState);
        should.not.exist(result.vmSize);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should list compute nodes successfully', function (done) {
      client.computeNodeOperations.list('nodesdktestpool1', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        result[0].state.should.equal('idle');
        result[0].schedulingState.should.equal('enabled');
        response.statusCode.should.equal(200);
        compute_nodes = result.map(function (x) { return x.id })
        done();
      });
    });

    it('should get a compute node reference', function (done) {
      client.computeNodeOperations.get('nodesdktestpool1', compute_nodes[0], function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.id.should.equal(compute_nodes[0]);
        result.state.should.equal('idle');
        result.schedulingState.should.equal('enabled');
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should add a user to a compute node successfully', function (done) {
      var options = { name: 'NodeSDKTestUser', isAdmin: false, password: 'kt#_gahr!@aGERDXA' }
      client.computeNodeOperations.addUser('nodesdktestpool1', compute_nodes[0], options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(201);
        done();
      });
    });

    it('should update a compute node user successfully', function (done) {
      var options = { password: 'liilef#$DdRGSa_ewkjh' }
      client.computeNodeOperations.updateUser('nodesdktestpool1', compute_nodes[0], 'NodeSDKTestUser', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should get a remote desktop file successfully', function (done) {
      client.computeNodeOperations.getRemoteDesktop('nodesdktestpool1', compute_nodes[0], function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        readStreamToBuffer(result, function (err, buff) {
          should.not.exist(err);
          buff.length.should.be.above(0);
          done();
        });
      });
    });

    it('should delete a compute node user successfully', function (done) {
      client.computeNodeOperations.deleteUser('nodesdktestpool1', compute_nodes[0], 'NodeSDKTestUser', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should disable scheduling on a compute node successfully', function (done) {
      client.computeNodeOperations.disableScheduling('nodesdktestpool1', compute_nodes[1], function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should enable scheduling on a compute node successfully', function (done) {
      client.computeNodeOperations.enableScheduling('nodesdktestpool1', compute_nodes[1], function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should reboot a compute node successfully', function (done) {
      client.computeNodeOperations.reboot('nodesdktestpool1', compute_nodes[0], function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should reimage a compute node successfully', function (done) {
      client.computeNodeOperations.reimage('nodesdktestpool1', compute_nodes[1], function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should enable autoscale successfully', function (done) {
      var options = { autoScaleFormula: '$TargetDedicated=2', autoScaleEvaluationInterval: moment.duration({ minutes: 6 }) };
      client.pool.enableAutoScale('nodesdktestpool1', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should evaluate pool autoscale successfully', function (done) {
      client.pool.evaluateAutoScale('nodesdktestpool1', '$TargetDedicated=3', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.results.should.equal('$TargetDedicated=3;$NodeDeallocationOption=requeue');
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should fail to evaluate invalid autoscale formula', function (done) {
      client.pool.evaluateAutoScale('nodesdktestpool1', 'something_useless', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.results.should.equal('$TargetDedicated=2;$NodeDeallocationOption=requeue');
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should disable autoscale successfully', function (done) {
      client.pool.disableAutoScale('nodesdktestpool1', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should create a second pool successfully', function (done) {
      pool = { id: 'nodesdktestpool2', vmSize: 'small', cloudServiceConfiguration: { osFamily: '4' } };
      client.pool.add(pool, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(201);
        done();
      });
    });

    it('should list pools without filters', function (done) {
      client.pool.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(1);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should list a maximum number of pools', function (done) {
      var options = { poolListOptions: { maxResults: 1 } };
      client.pool.list(options, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.equal(1);
        response.statusCode.should.equal(200);
        client.pool.listNext(result.odatanextLink, function (err, result, request, response) {
          should.not.exist(err);
          should.exist(result);
          result.length.should.equal(1);
          response.statusCode.should.equal(200);
          done();
        });
      });
    });

    it('should fail to list pools with invalid max', function (done) {
      var options = { poolListOptions: { maxResults: -5 } };
      client.pool.list(options, function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.code.should.equal('InvalidQueryParameterValue');
        done();
      });
    });

    it('should list pools according to filter', function (done) {
      var options = { poolListOptions: { filter: 'startswith(id,\'nodesdktestpool1\')', select: 'id,state', expand: 'stats' } };
      client.pool.list(options, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.equal(1);
        result[0].id.should.equal('nodesdktestpool1');
        result[0].state.should.equal('active');
        should.not.exist(result[0].allocationState);
        should.not.exist(result[0].vmSize);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should check that pool exists successfully', function (done) {
      client.pool.exists('nodesdktestpool1', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.should.equal(true);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should start pool resizing successfully', function (done) {
      var options = { targetDedicated: 3 };
      client.pool.resize('nodesdktestpool2', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should stop pool resizing successfully', function (done) {
      client.pool.stopResize('nodesdktestpool2', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should get pool lifetime statistics', function (done) {
      client.pool.getAllPoolsLifetimeStatistics(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        should.exist(result.usageStats);
        should.exist(result.resourceStats);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should list pools usage metrics', function (done) {
      var options = { poolListPoolUsageMetricsOptions: { maxResults: 1 } };
      client.pool.listPoolUsageMetrics(options, function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        result[0].poolId.should.equal('nodesdktestpool1');
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should create a job successfully', function (done) {
      var options = { id: 'HelloWorldJobNodeSDKTest', poolInfo: { poolId: 'nodesdktestpool1' } };
      client.job.add(options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(201);
        done();
      });
    });

    it('should update a job successfully', function (done) {
      var options = { priority: 500, constraints: { maxTaskRetryCount: 3 }, poolInfo: { poolId: 'nodesdktestpool1' } };
      client.job.update('HelloWorldJobNodeSDKTest', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should patch a job successfully', function (done) {
      var options = { priority: 500, constraints: { maxTaskRetryCount: 3 }, poolInfo: { poolId: 'nodesdktestpool1' } };
      client.job.update('HelloWorldJobNodeSDKTest', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should create a task successfully', function (done) {
      var options = {
        id: 'HelloWorldNodeSDKTestTask',
        commandLine: 'echo Hello World'};
      client.task.add('HelloWorldJobNodeSDKTest', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(201);
        done();
      });
    });

    it('should terminate a task successfully', function (done) {
      client.task.terminate('HelloWorldJobNodeSDKTest', 'HelloWorldNodeSDKTestTask', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(204);
        done();
      });
    });

    it('should create a second task successfully', function (done) {
      var options = {
        id: 'HelloWorldNodeSDKTestTask2',
        commandLine: 'cmd /c echo hello world'
      };
      client.task.add('HelloWorldJobNodeSDKTest', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(201);
        done();
      });
    });

    it('should update a task successfully', function (done) {
      var options = { constraints: { maxTaskRetryCount: 3 } };
      client.task.update('HelloWorldJobNodeSDKTest', 'HelloWorldNodeSDKTestTask2', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should list all tasks successfully', function (done) {
      client.task.list('HelloWorldJobNodeSDKTest', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.equal(2);
        result[0].constraints.maxTaskRetryCount.should.equal(3);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should get task reference successfully', function (done) {
      client.task.get('HelloWorldJobNodeSDKTest', 'HelloWorldNodeSDKTestTask', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.id.should.equal('HelloWorldNodeSDKTestTask');
        response.statusCode.should.equal(200);
        if (suite.isPlayback) {
          done();
        }
        console.log('Waiting for task to complete...')
        setTimeout(function () {
          done();
        }, 100000);
      });
    });

    //TODO: Need to test with actual subtasks
    it('should list sub tasks successfully', function (done) {
      client.task.listSubtasks('HelloWorldJobNodeSDKTest', 'HelloWorldNodeSDKTestTask', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should list files from task successfully', function (done) {
      client.file.listFromTask('HelloWorldJobNodeSDKTest', 'HelloWorldNodeSDKTestTask2', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should get file properties from task successfully', function (done) {
      client.file.getNodeFilePropertiesFromTask('HelloWorldJobNodeSDKTest', 'HelloWorldNodeSDKTestTask2', 'stderr.txt', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should get file from task successfully', function (done) {
      client.file.getFromTask('HelloWorldJobNodeSDKTest', 'HelloWorldNodeSDKTestTask2', 'stdout.txt', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        response.statusCode.should.equal(200);
        readStreamToBuffer(result, function (err, buff) {
          should.not.exist(err);
          buff.length.should.be.above(0);
          done();
        });
      });
    });

    it('should delete file from task successfully', function (done) {
      client.file.deleteFromTask('HelloWorldJobNodeSDKTest', 'HelloWorldNodeSDKTestTask2', 'stderr.txt', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should re-list compute nodes successfully', function (done) {
      if (suite.isPlayback) {
        // We don't need to do this unless recording...
        done();
      }
      client.computeNodeOperations.list('nodesdktestpool1', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        compute_nodes = result.map(function (x) { return x.id })
        console.log('Waiting for nodes to be ready...')
        setTimeout(function () {
          done();
        }, 100000);
      });
    });

    it('should list files from compute node successfully', function (done) {
      client.file.listFromComputeNode('nodesdktestpool1', compute_nodes[1], function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        response.statusCode.should.equal(200);
        done();
      });
    });

    //TODO: Test this with an actual compute node file
    //it('should get file properties from node successfully', function (done) {
    //  client.file.getNodeFilePropertiesFromComputeNode('nodesdktestpool1', compute_nodes[0], 'workitems', function (err, result, request, response) {
    //    should.not.exist(err);
    //    should.not.exist(result);
    //    response.statusCode.should.equal(200);
    //    done();
    //  });
    //});

    //TODO: Test this with an actual compute node file
    //it('should get file from node successfully', function (done) {
    //  client.file.getFromComputeNode('nodesdktestpool1', compute_nodes[0], 'workitems', function (err, result, request, response) {
    //    should.not.exist(err);
    //    should.exist(result);
    //    response.statusCode.should.equal(200);
    //    readStreamToBuffer(result, function (err, buff) {
    //      should.not.exist(err);
    //      buff.length.should.be.above(0);
    //      done();
    //    });
    //  });
    //});

    //TODO: Test this with an actual compute node file
    //it('should delete file from node successfully', function (done) {
    //  client.file.deleteFromComputeNode('nodesdktestpool1', compute_nodes[0], 'workitems', function (err, result, request, response) {
    //    should.not.exist(err);
    //    should.not.exist(result);
    //    response.statusCode.should.equal(200);
    //    done();
    //  });
    //});

    it('should list applications successfully', function (done) {
      client.application.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.equal(1);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should get application reference successfully', function (done) {
      client.application.get('my_application_id', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        done();
      });
    });

    it('should delete a task successfully', function (done) {
      client.task.deleteMethod('HelloWorldJobNodeSDKTest', 'HelloWorldNodeSDKTestTask', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should delete a second task successfully', function (done) {
      client.task.deleteMethod('HelloWorldJobNodeSDKTest', 'HelloWorldNodeSDKTestTask2', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should get a job reference successfully', function (done) {
      client.job.get('HelloWorldJobNodeSDKTest', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.id.should.equal('HelloWorldJobNodeSDKTest');
        result.state.should.equal('active');
        result.poolInfo.poolId.should.equal('nodesdktestpool1');
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should list jobs successfully', function (done) {
      client.job.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should fail to job prep+release status', function (done) {
      client.job.listPreparationAndReleaseTaskStatus('HelloWorldJobNodeSDKTest', function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.code.should.equal('JobPreparationTaskOrReleaseTaskNotSpecified');
        done();
      });
    });

    it('should disable a job successfully', function (done) {
      client.job.disable('HelloWorldJobNodeSDKTest', 'requeue', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should enable a job successfully', function (done) {
      client.job.enable('HelloWorldJobNodeSDKTest', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should terminate a job successfully', function (done) {
      client.job.terminate('HelloWorldJobNodeSDKTest', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should delete a job successfully', function (done) {
      client.job.deleteMethod('HelloWorldJobNodeSDKTest', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should get all job statistics successfully', function (done) {
      client.job.getAllJobsLifetimeStatistics(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        should.exist(result.userCPUTime);
        should.exist(result.kernelCPUTime);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should create a job schdule successfully', function (done) {
      var options = {
        id: 'NodeSDKTestSchedule', jobSpecification: { id: 'HelloWorldJobNodeSDKTest', poolInfo: { poolId: 'nodesdktestpool1' } },
        schedule: { doNotRunUntil: "2017-12-25T00:00:00.00", startWindow: moment.duration({ minutes: 6 }) }
      };
      client.jobSchedule.add(options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(201);
        done();
      });
    });

    it('should list job schedules successfully', function (done) {
      client.jobSchedule.list(function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.be.above(0);
        response.statusCode.should.equal(200);
        done();
      });
    });

    //TODO: Have the job schedule perform jobs
    it('should list jobs from job schedule successfully', function (done) {
      client.job.listFromJobSchedule('NodeSDKTestSchedule', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.equal(0);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should check if a job schedule exists successfully', function (done) {
      client.jobSchedule.exists('NodeSDKTestSchedule', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.should.equal(true);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should get a job schedule reference successfully', function (done) {
      client.jobSchedule.get('NodeSDKTestSchedule', function (err, result, request, response) {
        should.not.exist(err);
        should.exist(result);
        result.id.should.equal('NodeSDKTestSchedule');
        result.state.should.equal('active');
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should update a job schedule successfully', function (done) {
      var options = { schedule: { recurrenceInterval: moment.duration({ hours: 6 }) }, jobSpecification: { poolInfo: { poolId: 'nodesdktestpool2' }}};
      client.jobSchedule.update('NodeSDKTestSchedule', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should patch a job schedule successfully', function (done) {
      var options = {
        schedule: { recurrenceInterval: moment.duration({ hours: 3 }), startWindow: moment.duration({ hours: 1 }) }
      };
      client.jobSchedule.patch('NodeSDKTestSchedule', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(200);
        done();
      });
    });

    it('should disable a job schedule successfully', function (done) {
      client.jobSchedule.disable('NodeSDKTestSchedule', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(204);
        done();
      });
    });

    it('should enable a job schedule successfully', function (done) {
      client.jobSchedule.enable('NodeSDKTestSchedule', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(204);
        done();
      });
    });

    it('should terminate a job schedule successfully', function (done) {
      client.jobSchedule.terminate('NodeSDKTestSchedule', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should delete a job schedule successfully', function (done) {
      client.jobSchedule.deleteMethod('NodeSDKTestSchedule', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should remove nodes in pool successfully', function (done) {
      var options = { nodeList: compute_nodes, nodeDeallocationOption: 'terminate' };
      client.pool.removeNodes('nodesdktestpool1', options, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should delete a pool successfully', function(done) {
      client.pool.deleteMethod('nodesdktestpool1', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should delete a second pool successfully', function (done) {
      client.pool.deleteMethod('nodesdktestpool2', function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should fail to delete a non-existant pool', function (done) {
      client.pool.deleteMethod('nodesdktestpool1', function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.code.should.equal('PoolBeingDeleted');
        done();
      });
    });

    it('should delete a certificate successfully', function (done) {
      client.certificateOperations.deleteMethod('sha1', certThumb, function (err, result, request, response) {
        should.not.exist(err);
        should.not.exist(result);
        response.statusCode.should.equal(202);
        done();
      });
    });

    it('should fail to cancel deleting a certificate', function (done) {
      client.certificateOperations.cancelDeletion('sha1', certThumb, function (err, result, request, response) {
        should.exist(err);
        should.not.exist(result);
        err.code.should.equal('CertificateBeingDeleted');
        done();
      });
    });
   
  });
});