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
 * Common utils related to Azure blob storage
 */

exports.applyToBlobUrl = applyToBlobUrl;
exports.unescape = unescape;
exports.normalizeServiceName = normalizeServiceName;

var path = require('path');
var qs = require('querystring');
var utils = require('./utils');

//Container names must be valid DNS names, and must conform to these rules:
//* Container names must start with a letter or number, and can contain only letters, numbers, and the dash (-) character.
//* Every dash (-) character must be immediately preceded and followed by a letter or number; consecutive dashes are not permitted in container names.
//* All letters in a container name must be lowercase.
//* Container names must be from 3 through 63 characters long.

// $root is a special container that can exist at the root level and is always valid.
//
// prefix container name (if any) in azurizeName() should follow these rules

// A blob name can contain any combination of characters, but reserved URL characters must be properly escaped. A blob name must be at least one character long and cannot be more than 1,024 characters long.
var azurizeName =
  exports.azurizeName =
    function azurizeName(prefix, filename) {

      if (!filename || typeof prefix !== 'string') {
        throw new Error('Incorrect parameters for azurizeName() : ' + prefix + ', ' + filename);
      }
      if (prefix[0] !== '/') {
        prefix = '/' + prefix;
      }
      // assuming prefix is good
      // do not escape it, so that we don't use '/'
      var azureName = path.basename(filename); // remove dir
      if (azureName.slice(-1) === '.') {
        // do not end the name with '.', this does not work - add something at the end
        azureName += '<>'; // anything other than '.', '/' and '\x00'
      }
      return prefix + azureName;
    };

var getBlobName =
  exports.getBlobName =
    function getBlobName(cli, channel, location, affinityGroup, newName, blob, prefix, filename, callback) {

      if (blob) {
        if (blob[0] === '/') {
          utils.getOrCreateBlobStorage(cli, channel, location, affinityGroup, newName, function (error, blobEndpoint) {
            if (error) {
              callback(error);
            } else {
              callback(null, blobEndpoint + blob);
            }
          });
        } else {
          callback(null, blob);
        }
      } else {
        utils.getOrCreateBlobStorage(cli, channel, location, affinityGroup, newName, function (error, blobEndpoint) {
          if (error) {
            callback(error);
          } else {
            callback(null, blobEndpoint + azurizeName(prefix, filename));
          }
        });
      }
    };

var splitBlobResourceName =
  exports.splitBlobResourceName =
    function splitBlobResourceName(blobResourceName) {
      var blobResourceNameArray = blobResourceName.split('/');
      var rootSet = blobResourceNameArray.length <= 1;
      var container = rootSet ? '$root' : blobResourceNameArray[0];
      var blobName = rootSet ? blobResourceNameArray[0] : blobResourceNameArray.slice(1).join('/');
      return { container: container, blobName: blobName, rootSet: rootSet };
    };

var splitDestinationUri =
  exports.splitDestinationUri =
    function splitDestinationUri(destinationUri) {
      var result = {};
      var protocolSplit = destinationUri.split('://');
      var destNameTrimProtocol = protocolSplit.slice(-1)[0]; // last element
      var destHost = destNameTrimProtocol.split('/')[0];
      result.accountName = destHost;
      var hostArray = destHost.split('.');
      var protocol = '';

      var host = '';

      if (hostArray.length > 1) {
        result.accountName = hostArray[0];
        host = hostArray.slice(1).join('.').split('/')[0];
      }

      result.host = host;
      if (protocolSplit.length > 1) {
        protocol = protocolSplit[0].trim().toLowerCase();
      } else {
        protocol = 'http';
        destinationUri = 'http://' + destinationUri;
      }
      protocol += '://';
      if (result.host) {
        result.host = protocol + result.host;
      }

      result.resourceName = destNameTrimProtocol.split('/').slice(1).join('/');
      var splitResource = splitBlobResourceName(result.resourceName);
      result.container = splitResource.container;
      result.blobName = splitResource.blobName;
      // for management operations - make sure root is using $root
      result.normalizedUri = protocol + result.accountName + (host ? '.' + host : '') +
    '/' + result.container + '/' + result.blobName;

      return result;
    };

// This function does two things with an URL
// 1) adds /$root for root storage and
// 2) escape the name (if escape argument is true)
var normalizeBlobUri =
  exports.normalizeBlobUri =
    function normalizeBlobUri(blobUri, escape) {
      var res = splitDestinationUri(blobUri).normalizedUri;
      if (escape) {
        res = applyToBlobUrl(qs.escape, res);
      }
      return res;
    };

var applyToBlobUrl =
  exports.applyToBlobUrl =
    function applyToBlobUrl(operation, url) {
      var split1 = url.split('://');
      var split2 = split1[split1.length - 1].split('/');
      for (var i = 2; i < split2.length; ++i) { // do not escape host and container
        split2[i] = operation(split2[i]);
      }
      split1[split1.length - 1] = split2.join('/');
      return split1.join('://');
    };

var unescape = exports.unescape = function unescape(url) {
  return applyToBlobUrl(qs.unescape, url);
};

var normalizeServiceName = exports.normalizeServiceName = function normalizeServiceName(name) {
  return name.replace(/[^a-zA-Z0-9]+/g, '').slice(0, 24).toLowerCase();
};
