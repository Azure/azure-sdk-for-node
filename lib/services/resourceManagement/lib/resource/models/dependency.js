'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the Dependency class.
 * @constructor
 */
function Dependency() { }

/**
 * Validate the payload against the Dependency schema
 *
 * @param {JSON} payload
 *
 */
Dependency.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('Dependency cannot be null.');
  }
  if (util.isArray(payload['dependsOn'])) {
    for (var i = 0; i < payload['dependsOn'].length; i++) {
      if (payload['dependsOn'][i]) {
        models['BasicDependency'].validate(payload['dependsOn'][i]);
      }
    }
  }

  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['resourceType'] !== null && payload['resourceType'] !== undefined && typeof payload['resourceType'].valueOf() !== 'string') {
    throw new Error('payload[\'resourceType\'] must be of type string.');
  }

  if (payload['resourceName'] !== null && payload['resourceName'] !== undefined && typeof payload['resourceName'].valueOf() !== 'string') {
    throw new Error('payload[\'resourceName\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to Dependency schema
 *
 * @param {JSON} instance
 *
 */
Dependency.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.dependsOn !== null && instance.dependsOn !== undefined) {
      var deserializedArray = [];
      instance.dependsOn.forEach(function(element) {
        if (element !== null && element !== undefined) {
          element = models['BasicDependency'].deserialize(element);
        }
        deserializedArray.push(element);
      });
      instance.dependsOn = deserializedArray;
    }
  }
  return instance;
};

module.exports = new Dependency();
