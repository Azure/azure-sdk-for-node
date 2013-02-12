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
var BlobConstants = Constants.BlobConstants;

// Expose 'ContainerResult'.
exports = module.exports = ContainerResult;

function ContainerResult(name, publicAccessLevel) {
  if (name) {
    this.name = name;
  }
  
  if (publicAccessLevel) {
    this.publicAccessLevel = publicAccessLevel;
  }
}

ContainerResult.parse = function (containerXml) {
  var containerResult = new ContainerResult();
  for (var propertyName in containerXml) {
    if (propertyName === 'Properties' || propertyName === 'Metadata') {
      containerResult[propertyName.toLowerCase()] = { };
      for (var subPropertyName in containerXml[propertyName][0]) {
        containerResult[propertyName.toLowerCase()][subPropertyName.toLowerCase()] = containerXml[propertyName][0][subPropertyName][0];
      }
    } else {
      containerResult[propertyName.toLowerCase()] = containerXml[propertyName][0];
    }
  }

  return containerResult;
};

ContainerResult.prototype.getPropertiesFromHeaders = function (headers) {
  var self = this;

  var setContainerPropertyFromHeaders = function (containerProperty, headerProperty) {
    if (!self[containerProperty] && headers[headerProperty.toLowerCase()]) {
      self[containerProperty] = headers[headerProperty.toLowerCase()];
    }
  };

  setContainerPropertyFromHeaders('etag', HeaderConstants.ETAG);
  setContainerPropertyFromHeaders('lastModified', Constants.LAST_MODIFIED_ELEMENT);

  if (!self.publicAccessLevel) {
    self.publicAccessLevel = BlobConstants.BlobContainerPublicAccessType.OFF;
    if (headers[HeaderConstants.BLOB_PUBLIC_ACCESS_HEADER]) {
      self.publicAccessLevel = headers[HeaderConstants.BLOB_PUBLIC_ACCESS_HEADER];
    }
  }

  if (self.publicAccessLevel === 'true') {
    // The container was marked for full public read access using a version prior to 2009-09-19.
    self.publicAccessLevel = BlobConstants.BlobContainerPublicAccessType.CONTAINER;
  }
};
