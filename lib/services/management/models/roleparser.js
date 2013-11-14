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

/**
* Creates a new RoleParser object.
*
* @constructor
*/
function RoleParser() {
}

/**
* Parse the given role object using the role-schema. Parsing will validate
* the role object and serialize it into requested format
*
* @param {object} roleSchema   Object holding meta-data of the role object.
* @param {object} role         The role object to parse.
* @param {string} serializeTo  The format in which the role object serialized to.
* @param {object} output       The object to hold the serialized result.
*/
RoleParser.prototype.parse = function (roleSchema, role, serializeTo, output) {
  var self = this;

  Object.keys(roleSchema).forEach(function (key) {
    var value = roleSchema[key];
    var typeInfo = self.getTypeInfo(value.Type);
    if (typeInfo.isCollection) {
      self.handleCollectionType(value, role, key, serializeTo, typeInfo, output);
    } else if (typeInfo.isComplex) {
      self.handleComplexType(value, role, key, serializeTo, output);
    } else if (typeInfo.isPrimitive) {
      self.handlePrimitiveType(value, role, key, serializeTo, output);
    }
  });
};


/**
* handle a primitive type
*
* @constructor
* @param {object} metadata     Object holding meta-data of the primitive
*                              member in the 'role' object identified by
*                              key.
*                              {
*                                Name: string,
*                                Required: boolean,
*                                Type: Primitive.[String|Int|Boolean],
*                                RegEx: string,
*                                XmlNode: string,
*                                [IncludeIfEmpty]: optional boolean
*                              }
* @param {object} role         The part of role object currently processing.
* @param {string} key          key in the 'role' object identifying the primitive
*                              type.
* @param {string} serializeTo  The format in which the primitive type serialized to.
*
* @param {object} output       The object updated with primitive member value and
*                              associated meta-data.
*/
RoleParser.prototype.handlePrimitiveType = function (metadata, role, key, serializeTo, output) {
  if (typeof (role[key]) === 'boolean' || role[key] || metadata.IncludeIfEmpty) {
    if (serializeTo === 'XML') {
      output.ele(metadata.XmlNode).txt(role[key]);
    }
  } else if (metadata.Required) {
    if ('Default' in metadata) {
      output.ele(metadata.XmlNode).txt(metadata.Default);
    } else {
      throw new Error('Missing the required primitive field \'' + key + '\' in the role');
    }
  }
};

/**
* handle a complex type
*
* @constructor
* @param {object} metadata     Object holding meta-data of the complex
*                              member in the 'role' object identified by
*                              key.
*                              {
*                                Name: string,
*                                Required: boolean,
*                                Type: Complex.[Type],
*                                RegEx: string,
*                                XmlNode: string,
*                                TypeMeta: object
*                              }
* @param {object} role         The part of role object currently processing.
* @param {string} key          key in the 'role' object identifying the complex
*                              type.
* @param {string} serializeTo  The format in which the complex type serialized to.
*
* @param {object} output       The object updated with complex member value and
*                              associated meta-data.
*/
RoleParser.prototype.handleComplexType = function (metadata, role, key, serializeTo, output) {
  if (key in role) {
    if (serializeTo === 'XML') {
      var newNode = output.ele(metadata.XmlNode);
      this.parse(metadata.TypeMeta, role[key], serializeTo, newNode);
      newNode.up();
    }
  } else if (metadata.Required) {
    throw new Error('Missing the required Complex field \'' + key + '\' in the role');
  }
};

/**
* handle a collection type
*
* @constructor
* @param {object} metadata     Object holding meta-data of the collection
*                              member in the 'role' object identified by
*                              key.
*                               {
*                                 Name: string,
*                                 Required: boolean,
*                                 Type: Collection(Complex.[Mixed|Type]|Primitive.[Type])
*                                 XmlNode: string,
*                                 XmlItemNode: string,
*                                 TypeMeta: object
*                               }
* @param {object} role         The part of role object currently processing.
* @param {string} key          key in the 'role' object identifying the collection
*                              type.
* @param {string} serializeTo  The format in which the collection type serialized to.
* @param {mixed}  typeInfo     The type information of the collection type
*                               {
*                                 isCollection: true,
*                                 isComplex: true|false,
*                                 isPrimitive: true|false,
*                                 subType: [String|Int|Boolean|Mixed|Type]
*                               }
* @param {object} output       The object updated with collection member value and
*                              associated meta-data.
*/
RoleParser.prototype.handleCollectionType = function (metadata, role, key, serializeTo, typeInfo, output) {
  if (key in role) {
    if (serializeTo === 'XML') {
      var newNodeLevel1 = output.ele(metadata.XmlNode);
      var newNodeLevel2 = null;
      if (typeInfo.isComplex) {
        if (typeInfo.subType === 'Mixed') {
          // role[key] is collection of non-homogeneous complex types so meta-data is
          // different for items in the collection.

          // 'keyProperty' is the name of the property present in common in all
          // complex types which makeup the collection. .e.g. ConfigurationSetType
          // in 'ConfigurationSets'
          var keyProperty = metadata.ItemKey.key;
          var keyValues = metadata.ItemKey.values;
          for (var j = 0; j < keyValues.length; j++) {
            for (var k = 0; k < role[key].length; k++) {
              if (keyProperty in role[key][k]) {
                if (role[key][k][keyProperty] === keyValues[j]) {
                  // Add node to hold each item in the collection
                  newNodeLevel2 = newNodeLevel1.ele(metadata.ItemXmlNode);
               // Parse the complex type instance
                  this.parse(metadata.TypeMeta[keyValues[j]], role[key][k], serializeTo, newNodeLevel2);
               // Close item level node
                  newNodeLevel2.up();
                }
              } else {
                throw new Error('Missing the required field \'' + keyProperty + '\' in the role');
              }
            }
          }
        } else {
          // role[key] is a collection of homogeneous complex type so meta-data is same for
          // all the items in the collection.
          for (var i = 0; i < role[key].length; i++) {
            // Add node to hold each item in the collection
            newNodeLevel2 = newNodeLevel1.ele(metadata.ItemXmlNode);
            // Parse the complex type instance
            this.parse(metadata.TypeMeta, role[key][i], serializeTo, newNodeLevel2);
            // Close item level node
            newNodeLevel2.up();
          }
        }
      } else {
        // role[key] is a collection of primitive type.
        for (var l = 0; l < role[key].length; l++) {
          newNodeLevel2 = newNodeLevel1.ele(metadata.ItemXmlNode);
          newNodeLevel2.txt(role[key][l]);
          newNodeLevel2.up();
        }
      }
      newNodeLevel1.up();
    }
  } else if (metadata.Required) {
    throw new Error('Missing the required Collection field \'' + key + '\' in the role');
  }
};

/**
* Parse and validate Type attribute in the role-schema.
*
* @constructor
* @param {string} type          The type string to parse and validate.
*
* @return {mixed} typeInfo      The parsed result of type attribute.
*                                {
*                                  isCollection: boolean,
*                                  isComplex: boolean,
*                                  isPrimitive: boolean,
*                                  subType: string
*                                }
*/
RoleParser.prototype.getTypeInfo = function (type) {
  var typeInfo =
    {
      isCollection: false,
      isComplex: false,
      isPrimitive: false,
      subType: null
    };

  var len = type.length;
  var nextToken = 0;
  if (type.indexOf('Collection(') === 0) {
    nextToken = 11;
    typeInfo.isCollection = true;
    if (type.charAt(len - 1) !== ')') {
      throw new Error('Invalid Role-Schema, Missing closing bracket for a collection type\'' + type + '\'');
    }

    len--;
  }

  if (type.indexOf('Complex.', nextToken) === nextToken) {
    nextToken += 8;
    typeInfo.isComplex = true;
  }

  if (!typeInfo.isComplex && (type.indexOf('Primitive.', nextToken) === nextToken)) {
    nextToken += 10;
    typeInfo.isPrimitive = true;
  }

  if (!typeInfo.isComplex && !typeInfo.isPrimitive) {
    throw new Error('Invalid Role-Schema, Found a type which is not complex or primitive \'' + type + '\'');
  }

  typeInfo.subType = type.substring(nextToken, len);
  if (!typeInfo.subType) {
    throw new Error('Invalid Role-Schema, Invalid value for type attribute \'' + type + '\' in role');
  }

  if (typeInfo.isPrimitive && typeInfo.subType !== 'String' && typeInfo.subType !== 'Int' && typeInfo.subType !== 'Boolean') {
    throw new Error('Invalid Role-Schema, Unsupported primitive type \'' + type + '\'');
  }

  if (!typeInfo.isCollection && typeInfo.subType === 'Mixed') {
    throw new Error('Invalid Role-Schema, Mixed subtype is supported only for Collection type \'' + type + '\'');
  }

  return typeInfo;
};

module.exports = RoleParser;