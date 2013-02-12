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

// Module dependencies.
var xmlbuilder = require('xmlbuilder');

var Constants = require('../../../util/constants');
var HeaderConstants = Constants.HeaderConstants;

// Expose 'BlobResult'.
exports = module.exports = BlobResult;

function BlobResult(container, blob) {
  if (container) {
    this.container = container;
  }

  if (blob) {
    this.blob = blob;
  }
}

BlobResult.parse = function (blobXml) {
  var blobResult = new BlobResult();
  for (var propertyName in blobXml) {
    if (propertyName === 'Properties' || propertyName === 'Metadata') {
      blobResult[propertyName.toLowerCase()] = { };
      for (var subPropertyName in blobXml[propertyName][0]) {
        blobResult[propertyName.toLowerCase()][subPropertyName.toLowerCase()] = blobXml[propertyName][0][subPropertyName][0];
      }
    } else {
      blobResult[propertyName.toLowerCase()] = blobXml[propertyName][0];
    }
  }

  return blobResult;
};

BlobResult.prototype.getPropertiesFromHeaders = function (headers) {
  var self = this;

  var setBlobPropertyFromHeaders = function (blobProperty, headerProperty) {
    if (!self[blobProperty] && headers[headerProperty.toLowerCase()]) {
      self[blobProperty] = headers[headerProperty.toLowerCase()];
    }
  };

  setBlobPropertyFromHeaders('etag', HeaderConstants.ETAG);
  setBlobPropertyFromHeaders('lastModified', Constants.LAST_MODIFIED_ELEMENT);

  setBlobPropertyFromHeaders('contentType', HeaderConstants.CONTENT_TYPE);
  setBlobPropertyFromHeaders('contentEncoding', HeaderConstants.CONTENT_ENCODING);
  setBlobPropertyFromHeaders('contentLanguage', HeaderConstants.CONTENT_LANGUAGE);
  setBlobPropertyFromHeaders('contentMD5', HeaderConstants.CONTENT_MD5);
  setBlobPropertyFromHeaders('cacheControl', HeaderConstants.CACHE_CONTROL);
  setBlobPropertyFromHeaders('contentRange', HeaderConstants.CONTENT_RANGE);
  setBlobPropertyFromHeaders('contentTypeHeader', HeaderConstants.CONTENT_TYPE_HEADER);
  setBlobPropertyFromHeaders('contentEncodingHeader', HeaderConstants.CONTENT_ENCODING_HEADER);
  setBlobPropertyFromHeaders('contentLanguageHeader', HeaderConstants.CONTENT_LANGUAGE_HEADER);
  setBlobPropertyFromHeaders('contentMD5Header', HeaderConstants.BLOB_CONTENT_MD5_HEADER);
  setBlobPropertyFromHeaders('cacheControlHeader', HeaderConstants.CACHE_CONTROL_HEADER);

  setBlobPropertyFromHeaders('contentLength', HeaderConstants.CONTENT_LENGTH);
  setBlobPropertyFromHeaders('contentLengthHeader', HeaderConstants.CONTENT_LENGTH_HEADER);

  setBlobPropertyFromHeaders('range', HeaderConstants.RANGE);
  setBlobPropertyFromHeaders('rangeHeader', HeaderConstants.STORAGE_RANGE_HEADER);

  setBlobPropertyFromHeaders('getContentMd5', HeaderConstants.RANGE_GET_CONTENT_MD5);
  setBlobPropertyFromHeaders('acceptRanges', HeaderConstants.ACCEPT_RANGES);

  setBlobPropertyFromHeaders('blobType', HeaderConstants.BLOB_TYPE_HEADER);
  setBlobPropertyFromHeaders('leaseStatus', HeaderConstants.LEASE_STATUS);
  setBlobPropertyFromHeaders('leaseId', HeaderConstants.LEASE_ID_HEADER);
  setBlobPropertyFromHeaders('sequenceNumberHeader', HeaderConstants.SEQUENCE_NUMBER);
};
