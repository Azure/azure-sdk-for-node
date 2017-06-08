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
var moment = require('moment');
var util = require('util');
var msRestAzure = require('ms-rest-azure');
var ServerManagement = require('../../../lib/services/servermanagement/lib/serverManagement');
var SuiteBase = require('../../framework/suite-base');
var Promise = require('promise');

var exec = function (cmd, args, opts) {
  args || (args = {});
  opts || (opts = {});
  return new Promise(function (resolve, reject) {
    var child = require('child_process').execFile(cmd, args, opts, function (err, stdout, stderr) {
      if (err) {
        err.out = stdout;
        err.err = stderr;
        err.exitCode = child.ExitCode;
        return reject(err);
      }

      child.out = stdout;
      child.err = stderr;
      return resolve(child);
    });

    if (opts.stdout) {
      child.stdout.pipe(opts.stdout);
    }

    if (opts.stderr) {
      child.stderr.pipe(opts.stderr);
    }
  });
};

// polyfill startsWith on old ES5
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

function powerShell(cmdline) {
  return exec("powershell.exe", typeof (cmdline) === 'Array' ? cmdline : [cmdline]);
}

function rnd(prefix) {
  return (prefix || "") + Math.floor(Math.random() * 65535);
}

function log(text) {
  // enable for interactive testing.
  // console.log("      " + (text || ''));
}

function dump(obj, n) {
  log(util.inspect(obj, false, n || 2));
}

Promise.adaptToPromise = function (fn, argumentCount) {
  if (typeof (fn) == 'object') {
    // adapt members of an object
    for (var each in fn) {
      if (typeof (fn[each]) == 'function' && !each.startsWith("begin")) {
        fn[each] = Promise.adaptToPromise(fn[each]);
      }
    }
    return;
  }
  if (typeof (fn) != 'function') {
    return;
  }
  // adapt a function.
  argumentCount = argumentCount || Infinity;
  return function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop();
      }
      // adapt the callback to the promise pattern.
      args.push(function (err, result, request, response) {
        if (err) {
          // insert the req/resp to the error object.
          err._request = request;
          err._response = response;
          reject(err);
        } else {
          if (result) {
            // insert the req/resp to the result.
            result._request = request;
            result._response = response;
          }
          resolve(result);
        }
      });
      fn.apply(self, args);
    });
  };
};

var suite;
var client;
var baseUrl = 'https://management.azure.com';
var testPrefix = 'servermanagement-tests';
var resourceGroupName;
var location;

describe('ServerManagement', function () {

  before(function (done) {
    suite = new SuiteBase(this, testPrefix);

    // make it easy to get/use test variables.
    suite.Get = function (variableName, defaultValueFn) {
      if (suite.isPlayback) {
        return suite.getMockVariable(variableName);
      }

      var v = suite.getMockVariable(variableName);
      if (!v) {
        if (typeof (defaultValueFn) == 'function') {
          v = defaultValueFn();
        } else {
          v = defaultValueFn;
        }
        suite.saveMockVariable(variableName, v);
      }
      return v;
    };

    // one time setup of test suite.
    suite.setupSuiteAsync(function (setUpDone) {

      // commonly used variables
      location = suite.Get('location', 'centralus');
      resourceGroupName = suite.Get('resourceGroupName', 'rsmt-rnr-rg');
      client = new ServerManagement(suite.credentials, suite.subscriptionId, baseUrl);

      // adapt the SMT client library to use promises.
      Promise.adaptToPromise(client.gateway);
      Promise.adaptToPromise(client.node);
      Promise.adaptToPromise(client.session);
      Promise.adaptToPromise(client.powerShell);

      setUpDone(); // We tell the test framework we are done setting up
      done(); // We tell mocha we are done with the 'before' part
    });
  });

  after(function (done) {
    suite.teardownSuite(done);
  });

  afterEach(function (done) {
    suite.baseTeardownTest(function () {
      done();
    });
  });

  beforeEach(function (done) {
    // force log comments to the next line.
    log("");

    // finish per-test init.
    suite.setupTest(done);
  });

  // tests

  it('can create and remove gateways', function () {
    gatewayName = suite.Get("createremovegw", function () {
      return rnd('sdk-test-gw-');
    });

    return client.gateway.create(resourceGroupName, gatewayName, { location: location }).should.be.fulfilled().then(function (gateway) {
      log("Created " + gateway.name);
      //gateway._response.statusCode.should.equal(200);
      gateway.type.should.equal("microsoft.servermanagement/gateways");
      gateway.location.should.equal(location);
      gateway.name.should.equal(gatewayName);
    }).then(function () {
      log("verifying exists " + gatewayName);
      return client.gateway.get(resourceGroupName, gatewayName).should.be.fulfilled().then(function (gateway) {
        gateway.type.should.equal("microsoft.servermanagement/gateways");
        gateway.location.should.equal(location);
        gateway.name.should.equal(gatewayName);
        log("Found  " + gateway.name);
      });
    }).then(function () {
      log("removing " + gatewayName);
      return client.gateway.deleteMethod(resourceGroupName, gatewayName).should.be.fulfilled().then(function () {
        log("deleted gateway" + gatewayName);
      }).then(function () {
        log("verifying gateway deleted" + gatewayName);
        return client.gateway.get(resourceGroupName, gatewayName).should.be.rejected();
      });
    });
  });

  it('should not find random gateway', function () {
    var gatewayName = suite.Get("randomgatewayfail", function () {
      return rnd('sdk-test-gw-');
    });
    return client.gateway.get(resourceGroupName, gatewayName).should.be.rejected();
  });

  it('list the gateways in the resourcegroup', function () {
    return client.gateway.list(resourceGroupName).should.be.fulfilled().then(function (gateways) {
      return Promise.all(gateways.map(function (gw, index, array) {
        if (gw.name) {
          log('found gateway ' + gw.name);
        }
      }));
    });
  });

  it('ensures that the local "mygateway" is configured properly (live/recording only)', function () {
    if (suite.isPlayback) {
      return;
    }
    // gateway service must be installed on recording machine for this stuff to work.

    // make sure this is running as admin
    return powerShell("exit [int] -not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator')").should.be.fulfilled().then(function () {
      return(

        // make sure that the SMT gateway service is installed already
        powerShell('get-service ServerManagementToolsGateway')
      );
    }).should.be.fulfilled().then(function () {
      return(

        //check if  there is a gateway registered for this service called 'mygateway'
        client.gateway.get(resourceGroupName, "mygateway")
      );
    }).then(function (gw) {
      // yes, found the gateway
      log('\'' + gw.name + '\' is configured in this resource group.');
      return gw;
    }, function (err) {
      // no, 'mygateway' not registerd. let's do that.
      log("'mygateway' is not configured in this resource group. Adding...");
      return client.gateway.create(resourceGroupName, 'mygateway', { location: location }).should.be.fulfilled();
    });
  });

  // disabled - useful in interactive testing
  it.skip('gets a new profile installed [interactive use]', function () {
    // download the profile.
    return client.gateway.getProfile(resourceGroupName, 'mygateway').should.be.fulfilled().then(function (profile) {
      profile._request = null;
      profile._response = null;
      log("Installing 'mygateway' profile...");

      return powerShell('\n        Add-Type -assembly System.Security\n        $null = stop-service ServerManagementToolsGateway -ea 0;\n        write-host "stopped" \n        write-host \'profile:' + JSON.stringify(profile) + '\'\n        \n        $profile = [System.Text.Encoding]::UTF8.GetBytes(\'' + JSON.stringify(profile) + '\')\n        $enc = [System.Security.Cryptography.ProtectedData]::Protect( $profile, $null, "LocalMachine" )\n        \n        [System.IO.File]::WriteAllBytes( "$env:ALLUSERSPROFILE\\ManagementGateway\\GatewayProfile.json", $enc )\n\n        $null = start-service ServerManagementToolsGateway -ea 0\n        \n        #sleep 180 \n      ').should.be.fulfilled();
    });
  });

  it("Creates a node for this PC.", function () {
    var nodename = suite.Get("smtnodename", function () {
      return require('os').hostname();
    });
    var username = suite.Get("smtusername", function () {
      return "gsadmin";
    });
    var password = suite.Get("smtpassword", function () {
      return "S0meP@sswerd!";
    });

    // get the gateway
    return client.gateway.get(resourceGroupName, "mygateway").should.be.fulfilled().then(function (gw) {

      // register the node.
      return client.node.create(resourceGroupName, nodename, { location: location, gatewayId: gw.id, userName: username, password: password, connectionName: nodename }).should.be.fulfilled().then(function (node) {});
    });
  });

  it('gets the list of nodes', function () {
    return client.node.list(resourceGroupName).should.be.fulfilled().should.be.fulfilled().then(function (nodes) {
      return Promise.all(nodes.map(function (node, index, array) {
        log('found node ' + node.name);
      }));
    });
  });

  it("Creates a session and makes a powershell call.", function () {
    var nodename = suite.Get("smtnodename", function () {
      return require('os').hostname();
    });
    var sessionName = suite.Get("smtsession", function () {
      return rnd("session-");
    });
    var username = suite.Get("smtusername", function () {
      return "gsadmin";
    });
    var password = suite.Get("smtpassword", function () {
      return "S0meP@sswerd!";
    });

    log("creating session");
    // get the gateway
    return client.session.create(resourceGroupName, nodename, sessionName, { userName: username, password: password }).should.be.fulfilled().then(function (session) {
      log("creating pssession");
      // create the powershell runspace
      return client.powerShell.createSession(resourceGroupName, nodename, sessionName, "00000000-0000-0000-0000-000000000000").should.be.fulfilled().then(function (psSession) {
        log("invoking command");
        // run a command
        return client.powerShell.invokeCommand(resourceGroupName, nodename, sessionName, psSession.sessionId, { command: "dir c:\\" }).should.be.fulfilled().then(function (results) {
          log('results: ' + results.results[0].value);
        });
      });
    }).then(function () {
      return client.session.deleteMethod(resourceGroupName, nodename, sessionName).should.be.fulfilled();
    });
  });

  it('deletes and lists nodes', function () {
    var nodename = suite.Get("smtnodename", function () {
      return require('os').hostname();
    });

    return client.node.list(resourceGroupName).should.be.fulfilled().should.be.fulfilled().then(function (nodes) {
      return Promise.all(nodes.map(function (node, index, array) {
        if (node.name == nodename) {
          return client.node.deleteMethod(resourceGroupName, nodename).should.be.fulfilled().then(function () {
            log('Deleted node: ' + nodename);
          });
        }
      }));
    }).should.be.fulfilled();
  });

  // disabled - useful in interactive testing
  it.skip('Removes gateways that should not be there [interactive use]', function () {
    return client.gateway.list(resourceGroupName).then(function (gateways) {
      return Promise.all(gateways.map(function (gw, index, array) {
        if (gw.name) {
          log('found gateway ' + gw.name);
          if (gw.name.startsWith("sdk-test-gw")) {
            log('removing gateway ' + gw.name);
            return client.gateway.deleteMethod(resourceGroupName, gw.name);
          }
        }
      }));
    });
  });
});