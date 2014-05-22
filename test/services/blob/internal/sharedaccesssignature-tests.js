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

var assert = require('assert');

var qs = require('querystring');

// Test includes
var testutil = require('../../../util/util');

// Lib includes
var common = require('azure-common');
var storage = require('azure-storage-legacy');
var WebResource = common.WebResource;
var SharedAccessSignature = storage.SharedAccessSignature;
var Constants = common.Constants;
var ServiceClientConstants = common.ServiceClientConstants;
var BlobConstants = Constants.BlobConstants;
var QueryStringConstants = Constants.QueryStringConstants;

suite('sharedaccesssignature-tests', function () {
  test('GenerateSignatureContainer', function (done) {
    var credentials = new SharedAccessSignature(ServiceClientConstants.DEVSTORE_STORAGE_ACCOUNT, ServiceClientConstants.DEVSTORE_STORAGE_ACCESS_KEY);

    var sharedAccessPolicy = {
      Id: 'YWJjZGVmZw==',
      AccessPolicy: {
        Permissions: BlobConstants.SharedAccessPermissions.READ,
        Start: '2011-10-11T00%3A00%3A00',
        Expiry: '2011-10-12T00%3A00%3A00'
      }
    };

    var signature = credentials._generateSignature(
      'images',
      BlobConstants.ResourceTypes.CONTAINER,
      sharedAccessPolicy);

    assert.equal(signature, '98xkmnEzq5G8rgCXDu4p+Huwre7UjtA0yV4DU8H+uGM=');
    done();
  });

  test('GenerateSignatureBlob', function (done) {
    var credentials = new SharedAccessSignature(ServiceClientConstants.DEVSTORE_STORAGE_ACCOUNT, ServiceClientConstants.DEVSTORE_STORAGE_ACCESS_KEY);

    var sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: BlobConstants.SharedAccessPermissions.READ,
        Start: '2011-10-11T11:03:40Z',
        Expiry: '2011-10-12T11:53:40Z'
      }
    };

    var signature = credentials._generateSignature(
      'images/pic1.png',
      BlobConstants.ResourceTypes.BLOB,
      sharedAccessPolicy);

    assert.equal(signature, 'ju4tX0G79vPxMOkBb7UfNVEgrj9+ZnSMutpUemVYHLY=');
    done();
  });

  test('ContainerSignedQueryString', function (done) {
    var credentials = new SharedAccessSignature(ServiceClientConstants.DEVSTORE_STORAGE_ACCOUNT, ServiceClientConstants.DEVSTORE_STORAGE_ACCESS_KEY);

    var sharedAccessPolicy = {
      Id: 'YWJjZGVmZw==',
      AccessPolicy: {
        Permissions: BlobConstants.SharedAccessPermissions.READ,
        Start: '2011-10-11',
        Expiry: '2011-10-12'
      }
    };

    var queryString = credentials.generateSignedQueryString(
      'images',
      {},
      BlobConstants.ResourceTypes.CONTAINER,
      sharedAccessPolicy);

    assert.equal(queryString[QueryStringConstants.SIGNED_START], '2011-10-11');
    assert.equal(queryString[QueryStringConstants.SIGNED_EXPIRY], '2011-10-12');
    assert.equal(queryString[QueryStringConstants.SIGNED_RESOURCE], BlobConstants.ResourceTypes.CONTAINER);
    assert.equal(queryString[QueryStringConstants.SIGNED_PERMISSIONS], BlobConstants.SharedAccessPermissions.READ);
    assert.equal(queryString[QueryStringConstants.SIGNED_IDENTIFIER], 'YWJjZGVmZw==');
    assert.equal(queryString[QueryStringConstants.SIGNATURE], '1AWckmWSNrNCjh9krPXoD4exAgZWQQr38gG6z/ymkhQ=');
    done();
  });

  test('BlobSignedQueryString', function (done) {
    var credentials = new SharedAccessSignature(ServiceClientConstants.DEVSTORE_STORAGE_ACCOUNT, ServiceClientConstants.DEVSTORE_STORAGE_ACCESS_KEY);

    var sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: BlobConstants.SharedAccessPermissions.WRITE,
        Start: '2011-10-11',
        Expiry: '2011-10-12'
      }
    };

    var queryString = credentials.generateSignedQueryString(
      'images/pic1.png',
      {},
      BlobConstants.ResourceTypes.BLOB,
      sharedAccessPolicy);

    assert.equal(queryString[QueryStringConstants.SIGNED_START], '2011-10-11');
    assert.equal(queryString[QueryStringConstants.SIGNED_EXPIRY], '2011-10-12');
    assert.equal(queryString[QueryStringConstants.SIGNED_RESOURCE], BlobConstants.ResourceTypes.BLOB);
    assert.equal(queryString[QueryStringConstants.SIGNED_PERMISSIONS], BlobConstants.SharedAccessPermissions.WRITE);
    assert.equal(queryString[QueryStringConstants.SIGNATURE], '8I8E8TImfR2TIAcMDq8rF+IhhYyvowXpxSfF1kxnWLQ=');
    done();
  });

  test('SignRequest', function (done) {
    var credentials = new SharedAccessSignature(ServiceClientConstants.DEVSTORE_STORAGE_ACCOUNT, ServiceClientConstants.DEVSTORE_STORAGE_ACCESS_KEY);

    var sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: BlobConstants.SharedAccessPermissions.READ,
        Start: '2011-10-11',
        Expiry: '2011-10-12'
      }
    };

    var queryString = credentials.generateSignedQueryString(
      'images/pic1.png',
      {},
      BlobConstants.ResourceTypes.BLOB,
      sharedAccessPolicy);

    credentials.permissionSet = [{
      path: '/images/pic1.png',
      queryString: queryString
    }];

    var webResource = WebResource.get()
      .withProperty(BlobConstants.SharedAccessPermissionProperty, BlobConstants.SharedAccessPermissions.READ)
      .withProperty(BlobConstants.ResourceTypeProperty, BlobConstants.ResourceTypes.BLOB);

    webResource.path = '/images/pic1.png?comp=metadata';
    webResource.uri = '/images/pic1.png?comp=metadata';

    credentials.signRequest(webResource, function () {
      assert.equal('/images/pic1.png?comp=metadata&' + qs.stringify(queryString), webResource.uri);
      done();
    });
  });
});