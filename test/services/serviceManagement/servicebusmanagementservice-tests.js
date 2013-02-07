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

var uuid = require('node-uuid');
var url = require('url');

var util = require('util');
var _ = require('underscore');

var should = require('should');
var mocha = require('mocha');

var testutil = require('../../util/util');

var azure = testutil.libRequire('azure');
var sampledata = require('../../util/sampledata.js');
var namespaceNameIsValid = azure.namespaceNameIsValid;
var parseServerResponse = require('../../../lib/services/serviceManagement/models/servicebusparseresponse');

describe('Service Bus Management', function () {
  var namespacesToClean = [];
  var service;

  before(function () {
    var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
    service = azure.createServiceBusManagementService(
      subscriptionId, auth,
      { serializetype: 'XML'});
  });

  after(function (done) {
    deleteNamespaces(namespacesToClean, done);
  });

  function newName() {
    var name = 'nodesdk-' + uuid.v4().substr(0, 8);
    namespacesToClean.push(name);
    return name;
  }

  describe('List Namespaces', function () {
    describe('No defined namespaces', function () {
      before(function (done) {
        service.listNamespaces(function (err, namespaces) {
          deleteNamespaces(namespaces.map(function (ns) { return ns.Name; }), done);
        });
      });

      it('should return empty list of namespaces', function (done) {
        service.listNamespaces(function (err, namespaces) {
          should.exist(namespaces);
          namespaces.should.be.empty;
          done(err);
        });
      });
    });

    describe('when one namespace is defined', function () {
      var name = newName();
      var region = 'West US';

      before(function (done) {
        service.listNamespaces(function (err, namespaces) {
          deleteNamespaces(namespaces.map(function (ns) { return ns.Name; }), function () {
            service.createNamespace(name, region, done);
          });
        });
      });

      it('should return one namespace in the list', function (done) {
        service.listNamespaces(function (err, namespaces) {
          should.exist(namespaces);
          namespaces.should.have.length(1);
          namespaces[0].Name.should.equal(name);
          namespaces[0].Region.should.equal(region);
          done(err);
        });
      });
    });
  });

  describe('Show namespace', function () {
    describe('namespace name exists', function () {
      it('should return the namespace definition', function (done) {
        var name = newName();
        var region = 'West US';
        service.createNamespace(name, region, function (err, result) {
          if(err) { return done(err); }

          service.getNamespace(name, function (err, namespace) {
            should.not.exist(err);
            should.exist(namespace);
            namespace.Name.should.equal(name);
            namespace.Region.should.equal(region);
            done(err);
          });
        });     
      });
    });
  });

  describe('create namespace', function () {
    it('should fail if name is invalid', function (done) {
      service.createNamespace('!notValid$', 'West US', function (err, result) {
        should.exist(err);
        err.message.should.match(/must start with a letter/);
        done();
      });
    });

    it('should succeed if namespace does not exist', function (done) {
      var name = newName();
      var region = 'South Central US';

      service.createNamespace(name, region, function (err, result) {
        should.not.exist(err);
        result.Name.should.equal(name);
        result.Region.should.equal(region);
        done(err);
      });
    });
  });

  describe('delete namespace', function () {
    it('should fail if name is invalid', function (done) {
      service.deleteNamespace('!NotValid$', function (err, result) {
        should.exist(err);
        err.message.should.match(/must start with a letter/);
        done();
      });
    });

    it('should succeed if namespace exists and is activated', function (done) {
      var name = newName();
      var region = 'West US';
      service.createNamespace(name, region, function (err, callback) {
        if (err) { return done(err); }
        waitForNamespaceToActivate(name, function (err) {
          if (err) { return done(err); };

          service.deleteNamespace(name, done);
        });
      });
    });
  });

  describe('Get regions', function() {
    it('should return array of available regions', function (done) {
      service.getRegions(function (err, result) {
        should.exist(result);
        result.should.be.an.instanceOf(Array);
        result.length.should.be.above(0);
        _.each(result, function (region) {
          should.exist(region.Code);
          should.exist(region.FullName);
        });
        done(err);
      });
    });
  });

  describe('verify namespace', function () {
    it('should throw an error if namespace is malformed', function (done) {
      service.verifyNamespace("%$!@%^!", function (err, result) {
        should.exist(err);
        err.message.should.include('must start with a letter');
        done();
      });
    });

    it('should return availability if namespace is properly formed', function (done) {
      var name = newName();
      // Take this name out of the namespaces to clean as no namespace will actually be created
      namespacesToClean.pop();
      service.verifyNamespace(name, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.be.true;
        done();
      });
    });
  });

  describe('Namespace validation', function () {
    it('should pass on valid name', function() {
      (function() { namespaceNameIsValid('aValidNamespace'); })
        .should.not.throw();
    });

    it('should fail if name is too short', function () {
      (function() { namespaceNameIsValid("a"); })  
        .should.throw(/6 to 50/);
    });

    it('should fail if name is too long', function () {
      (function () { namespaceNameIsValid('sbm12345678901234567890123456789012345678901234567890'); })
        .should.throw(/6 to 50/);
    });

    it("should fail if name doesn't start with a letter", function () {
      (function () { namespaceNameIsValid('!notALetter'); })
        .should.throw(/start with a letter/);
    });

    it('should fail if ends with illegal ending', function () {
      (function () { namespaceNameIsValid('namespace-'); } )
        .should.throw(/may not end with/);

      (function () { namespaceNameIsValid('namespace-sb'); })
        .should.throw(/may not end with/);

      (function () { namespaceNameIsValid('namespace-mgmt'); })
        .should.throw(/may not end with/);

      (function () { namespaceNameIsValid('namespace-cache'); })
        .should.throw(/may not end with/);

      (function () { namespaceNameIsValid('namespace-appfabric'); })
        .should.throw(/may not end with/);
    });
  });

  describe('Result parsing', function () {
    describe('When parsing an entry', function () {
      it('should return a single object containing the contents', function () {
        var result = parseServerResponse(sampledata.singleEntry, 'NamespaceDescription');

        result.should.not.be.an.instanceOf(Array);
        result.should.have.property('Name');
        result.should.have.property('Region');
      });
    });

    describe('When parsing a feed', function () {
      it('should return an array with all entries when feed contains more than one entry', function () {
        var result = parseServerResponse(sampledata.threeItemFeed, 'NamespaceDescription');

        result.should.be.an.instanceOf(Array);
        result.should.have.length(3);
        result.forEach(function (ns) {
          ns.should.have.property('Name');
          ns.should.have.property('Region');
        });
      });

      it('should return an array with one entry when feed contains exactly one entry', function () {
        var result = parseServerResponse(sampledata.oneEntryFeed, 'NamespaceDescription');

        result.should.be.an.instanceOf(Array);
        result.should.have.length(1);
        result[0].should.have.property('Name');
        result[0].should.have.property('Region');
      });

      it('should return an empty array when feed contains no entries', function () {
        var result = parseServerResponse(sampledata.noEntryFeed, 'NamespaceDescription');
        should.exist(result);

        result.should.be.an.instanceOf(Array);
        result.should.have.length(0);
      });
    });
  });

  function deleteNamespaces(namespaces, callback) {
    if (namespaces.length === 0) { return callback(); }
    var numDeleted = 0;
    namespaces.forEach(function (namespaceName) {
      waitForNamespaceToActivate(namespaceName, function () {
        service.deleteNamespace(namespaceName, function () {
          ++numDeleted;
          if (numDeleted === namespaces.length) {
            waitForNamespacesToBeDeleted(namespaces, callback);
          }
        });
      });
    });
  }

  function waitForNamespaceToActivate(namespaceName, callback) {
    var poll = function () {
      service.getNamespace(namespaceName, function (err, ns) {
        if (err) { 
          callback(err); 
        } else if (ns.Status === 'Activating') {
          setTimeout(poll, 2000);
        } else {
          // Give Azure time to settle down - can't delete immediately after activating
          // without getting a 500 error.
          setTimeout(callback, 5000);
        }
      });
    };

    poll();
  }

  function waitForNamespacesToBeDeleted(namespaces, callback) {
    if (!namespaces) { return callback(); }

    if (!_.isArray(namespaces)) {
      namespaces = [ namespaces ];
    }

    var numNamespaces = namespaces.length;

    if (numNamespaces === 0) {
      return callback();
    }

    function poll(namespace) {
      service.getNamespace(namespace, function (err, result) {
        // If we get an error, the namespace is gone
        if (err) {
          --numNamespaces;
          if (numNamespaces === 0) {
            callback();
          }
        } else {
          // Try again. Spread out the polling a little randomly so we don't
          // hammer the server all at once
          setTimeout(poll(namespace), 2000 + (Math.floor(Math.random() * 10)) * 1000);
        }
      });
    }

    namespaces.forEach(function (namespace) {
      poll(namespace);
    });
  }
});