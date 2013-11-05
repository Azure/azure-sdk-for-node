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

var util = require('util');
var crypto = require('crypto');

var date = require('../../../util/date');
var azureutil = require('../../../util/util');

var HmacSha256Sign = require('../../core/hmacsha256sign');
var Constants = require('../../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

/**
* Creates a new SharedAccessSignature object.
*
* @constructor
* @param {string} keyName   The shared access signature key name.
* @param {array}  keyValue  The shared access signature key value.
*/
function SharedAccessSignature(keyName, keyValue) {
  this.keyName = keyName;
  this.keyValue = keyValue;

  this.signer = new HmacSha256Sign(keyValue);
}

/**
* Signs a request with the signature header.
*
* @this {SharedAccessSignature}
* @param {WebResource} The webresource to be signed.
* @param {function(error)}  callback  The callback function.
* @return {undefined}
*/
SharedAccessSignature.prototype.signRequest = function (webResource, callback) {
  var targetUri = encodeURIComponent(webResource.uri.toLowerCase()).toLowerCase();

  var expirationDate = Math.round(date.minutesFromNow(5) / 1000);
  var signature = this._generateSignature(targetUri, expirationDate);

  webResource.withHeader(HeaderConstants.AUTHORIZATION,
    util.format('SharedAccessSignature sig=%s&se=%s&skn=%s&sr=%s', signature, expirationDate, this.keyName, targetUri));

  callback(null);
};

SharedAccessSignature.prototype._generateSignature = function (targetUri, expirationDate) {
  var getvalueToAppend = function (value, noNewLine) {
    var returnValue = '';
    if (!azureutil.objectIsNull(value)) {
      returnValue = value;
    }

    if (noNewLine !== true) {
      returnValue += '\n';
    }

    return returnValue;
  };

  var stringToSign = getvalueToAppend(targetUri) +
    getvalueToAppend(expirationDate, true);

  return encodeURIComponent(crypto.createHmac('sha256', this.keyValue).update(stringToSign).digest('base64'));
};


module.exports = SharedAccessSignature;