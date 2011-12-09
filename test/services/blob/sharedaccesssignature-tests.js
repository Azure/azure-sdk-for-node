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

var testCase = require('nodeunit').testCase;

var qs = require('qs');

var ServiceClient = require('../../../lib/services/serviceclient');
var SharedAccessSignature = require('../../../lib/services/blob/sharedaccesssignature');
var WebResource = require('../../../lib/http/webresource');
var Constants = require('../../../lib/util/constants');
var BlobConstants = Constants.BlobConstants;
var HeaderConstants = Constants.HeaderConstants;
var QueryStringConstants = Constants.QueryStringConstants;

module.exports = testCase(
{
  testGenerateSignatureContainer: function (test) {
    var credentials = new SharedAccessSignature(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);

    var sharedAccessPolicy = {
      Id: 'YWJjZGVmZw==',
      AccessPolicy: {
        Permissions: BlobConstants.SharedAccessPermissions.READ,
        Start: '2011-10-11',
        Expiry: '2011-10-12'
      }
    };

    var signature = credentials._generateSignature(
      'images',
      BlobConstants.ResourceTypes.CONTAINER,
      sharedAccessPolicy);

    test.equal(signature, 'VdlALM4TYEYYNf94Bvt3dn48TsA01wk45ltwP3zeKp4=');
    test.done();
  },

  testGenerateSignatureBlob: function (test) {
    var credentials = new SharedAccessSignature(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);

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

    test.equal(signature, '7NIEip+VOrQ5ZV80pORPK1MOsJc62wwCNcbMvE+lQ0s=');
    test.done();
  },

  testContainerSignedQueryString: function (test) {
    var credentials = new SharedAccessSignature(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);

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

    test.equal(queryString[QueryStringConstants.SIGNED_START], '2011-10-11');
    test.equal(queryString[QueryStringConstants.SIGNED_EXPIRY], '2011-10-12');
    test.equal(queryString[QueryStringConstants.SIGNED_RESOURCE], BlobConstants.ResourceTypes.CONTAINER);
    test.equal(queryString[QueryStringConstants.SIGNED_PERMISSIONS], BlobConstants.SharedAccessPermissions.READ);
    test.equal(queryString[QueryStringConstants.SIGNED_IDENTIFIER], 'YWJjZGVmZw==');
    test.equal(queryString[QueryStringConstants.SIGNATURE], 'VdlALM4TYEYYNf94Bvt3dn48TsA01wk45ltwP3zeKp4=');
    test.done();
  },

  testBlobSignedQueryString: function (test) {
    var credentials = new SharedAccessSignature(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);

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

    test.equal(queryString[QueryStringConstants.SIGNED_START], '2011-10-11');
    test.equal(queryString[QueryStringConstants.SIGNED_EXPIRY], '2011-10-12');
    test.equal(queryString[QueryStringConstants.SIGNED_RESOURCE], BlobConstants.ResourceTypes.BLOB);
    test.equal(queryString[QueryStringConstants.SIGNED_PERMISSIONS], BlobConstants.SharedAccessPermissions.WRITE);
    test.equal(queryString[QueryStringConstants.SIGNATURE], 'k8uyTrn3pgLXuhwgZhxeAH6mZ/es9k2vqHPJEuIH4CE=');
    test.done();
  },

  testSignRequest: function (test) {
    var credentials = new SharedAccessSignature(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);

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
    webResource.requestUrl = '/images/pic1.png?comp=metadata';


    credentials.signRequest(webResource);
    test.equal('/images/pic1.png?comp=metadata&' + qs.stringify(queryString), webResource.requestUrl);
    test.done();
  }
});