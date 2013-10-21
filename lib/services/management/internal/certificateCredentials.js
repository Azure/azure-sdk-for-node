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
* Creates a new SharedKey object.
*
* @constructor
* @param {string} cert    The certificate.
* @param {string} key     The certificate key.
*/
function CertificateCredentials(credentials) {
  this.credentials = credentials;
}

/**
* Signs a request with the Authentication header.
*
* @param {WebResource} The webresource to be signed.
* @param {function(error)}  callback  The callback function.
* @return {undefined}
*/
CertificateCredentials.prototype.signRequest = function (webResource, callback) {
  webResource.cert = this.credentials.cert;
  webResource.key = this.credentials.key;
  callback(null);
};

module.exports = CertificateCredentials;