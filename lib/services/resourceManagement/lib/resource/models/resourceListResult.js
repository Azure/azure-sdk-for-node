'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceListResult class.
 * @constructor
 */
function ResourceListResult() { }

/**
 * Validate the payload against the ResourceListResult schema
 *
 * @param {JSON} payload
 *
 */
ResourceListResult.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceListResult cannot be null.');
  }
  if (util.isArray(payload['value'])) {
    for (var i = 0; i < payload['value'].length; i++) {
      if (payload['value'][i]) {
        models['GenericResource'].validate(payload['value'][i]);
      }
    }
  }

  if (payload['nextLink'] !== null && payload['nextLink'] !== undefined && typeof payload['nextLink'].valueOf() !== 'string') {
    throw new Error('payload[\'nextLink\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to ResourceListResult schema
 *
 * @param {JSON} instance
 *
 */
ResourceListResult.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.value !== null && instance.value !== undefined) {
      var deserializedArray = [];
      instance.value.forEach(function(element) {
        if (element !== null && element !== undefined) {
          element = models['GenericResource'].deserialize(element);
        }
        deserializedArray.push(element);
      });
      instance.value = deserializedArray;
    }
  }
  return instance;
};

module.exports = new ResourceListResult();
