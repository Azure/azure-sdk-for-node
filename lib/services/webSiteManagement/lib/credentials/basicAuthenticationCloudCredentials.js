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

var azureCommon = require('azure-common');
var validate = azureCommon.validate;

/**
* Creates a new BasicAuthenticationCloudCredentials object.
* Either a pair of cert / key values need to be pass or a pem file location.
*
* @constructor
* @param {string} credentials.username            The username.
* @param {string} credentials.password            The password.
*/
function BasicAuthenticationCloudCredentials(credentials) {
  validate.validateArgs('BasicAuthenticationCloudCredentials', function (v) {
    v.object(credentials, 'credentials');
    v.string(credentials.username, 'credentials.subscriptionId');
    v.string(credentials.password, 'credentials.pem');
  });

  this.credentials = credentials;
}

/**
* Signs a request with the Authentication header.
*
* @param {WebResource} The webresource to be signed.
* @param {function(error)}  callback  The callback function.
* @return {undefined}
*/
BasicAuthenticationCloudCredentials.prototype.signRequest = function (webResource, callback) {
  webResource.auth = {
    username: this.credentials.username,
    password: this.credentials.password
  };

  callback(null);
};

module.exports = BasicAuthenticationCloudCredentials;