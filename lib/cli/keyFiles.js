/**
* Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR
* CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
* WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE,
* FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT.
*
* See the Apache License, Version 2.0 for specific language governing
* permissions and limitations under the License.
*/

/**
 * Functions to work with key and certificate files
 */

var fs = require('fs');
var utils = require('./utils');

var KEY_PATT = /(-+BEGIN RSA PRIVATE KEY-+)(\n\r?|\r\n?)([A-Za-z0-9\+\/\n\r]+\=*)(\n\r?|\r\n?)(-+END RSA PRIVATE KEY-+)/;
var CERT_PATT = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9\+\/\n\r]+\=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/;

exports.readFromFile = function readFromFile(fileName) {
  // other parameters are optional
  try {
    var data = fs.readFileSync(fileName, 'utf8');
  } catch(e) {
    throw new Error('No account information found. Please import credentials using "azure account import <file>".');
  }
  var ret = {};
  var matchKey = data.match(KEY_PATT);
  if (matchKey) {
    ret.key = matchKey[1] + '\n' + matchKey[3] + '\n' + matchKey[5] + '\n';
  }

  var matchCert = data.match(CERT_PATT);
  if (matchCert) {
    ret.cert = matchCert[1] + '\n' + matchCert[3] + '\n' + matchCert[5] + '\n';
  }

  return ret;
};

exports.writeToFile = function writeToFile(fileName, keyCertData) {
  var data = (keyCertData.key || '') + (keyCertData.cert || '');
  utils.writeFileSyncMode(fileName, data, 'utf8');
};
