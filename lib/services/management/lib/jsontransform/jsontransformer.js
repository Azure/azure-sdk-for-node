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

function JsonTransformer() {
}

JsonTransformer.prototype.transform = function(jsonObject, metaData) {
  var rootProperty = null;
  for (var key in metaData) {
    if (metaData.hasOwnProperty(key)) {
      if (rootProperty) {
        throw new Error('Incorrect metadata, there should not be more than one top level property.');
      }

      rootProperty = key;
    }
  }

  if (metaData.remove) {
    throw new Error('Incorrect metadata, top level metadata should not have remove flag.');
  }

  var newJsonObject = {};
  newJsonObject[rootProperty] = jsonObject;
  this.transformIntern(null, null,
    newJsonObject,
    {
      'properties': metaData
    }
  );

  return newJsonObject[rootProperty];
};

JsonTransformer.prototype.transformIntern = function(parentJsonObject, parentProperty, jsonObject, metaData) {
  var properties = metaData.properties || [];
  var markedToRemove = false;
  var currentProperty = null;
  for (var property in properties) {
    if (properties.hasOwnProperty(property)) {
      var childMetaData = properties[property].metaData;
      if (markedToRemove) {
        throw new Error('One of the sibling of the property ' + property +
          ' has remove flag, in this case that property should be the only child of its parent ' + parentProperty);
      }

      markedToRemove = childMetaData.remove;
      currentProperty = property;
      if (jsonObject[property]) {
        if (childMetaData.isArray) {
          if (!(jsonObject[property] instanceof  Array)) {
            jsonObject[property] = [jsonObject[property]];
          }

          if (childMetaData.hetro) {
            var identityPropertyName = childMetaData.identityProperty;
            if (!identityPropertyName) {
              throw new Error('Incorret metadata, hetro flag is set for the property ' + property +
                ' but required identityProperty flag not found');
            }

            for (var i = 0; i < jsonObject[property].length; i++) {
              var identityPropertyValue = jsonObject[property][i][identityPropertyName];
              if (childMetaData.entryMeta[identityPropertyValue]) {
                this.transformIntern(jsonObject, property, jsonObject[property][i],
                  childMetaData.entryMeta[identityPropertyValue].metaData);
              }
            }
          } else {
            for (var j = 0; j < jsonObject[property].length; j++) {
              this.transformIntern(jsonObject, property, jsonObject[property][j], childMetaData);
            }
          }
        } else {
          this.transformIntern(jsonObject, property, jsonObject[property], childMetaData);
        }
      }
    }
  }

  if (markedToRemove) {
    for(var parentChildProperty in parentJsonObject[parentProperty]) {
      if (parentChildProperty !== currentProperty) {
        throw new Error('The property ' + currentProperty +
          ' marked to remove and set its value to parent property ' + parentProperty +
          ', but looks like property ' + currentProperty + ' has siblings ' + parentChildProperty +
          ' overwritting parent property will cause these sibilings to loose.');
      }
    }

    parentJsonObject[parentProperty] = jsonObject[currentProperty];
  }
};

module.exports = JsonTransformer;