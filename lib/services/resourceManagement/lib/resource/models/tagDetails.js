'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the TagDetails class.
 * @constructor
 */
function TagDetails() { }

/**
 * Validate the payload against the TagDetails schema
 *
 * @param {JSON} payload
 *
 */
TagDetails.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('TagDetails cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'] !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['tagName'] !== null && payload['tagName'] !== undefined && typeof payload['tagName'] !== 'string') {
    throw new Error('payload[\'tagName\'] must be of type string.');
  }

  if (payload['count'] !== null && payload['count'] !== undefined) {
    models['TagCount'].validate(payload['count']);
  }

  if (payload['values'] !== null && payload['values'] !== undefined && util.isArray(payload['values'])) {
    for (var i = 0; i < payload['values'].length; i++) {
      if (payload['values'][i] !== null && payload['values'][i] !== undefined) {
        models['TagValue'].validate(payload['values'][i]);
      }
    }
  }

};

/**
 * Deserialize the instance to TagDetails schema
 *
 * @param {JSON} instance
 *
 */
TagDetails.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.count !== null && instance.count !== undefined) {
      instance.count = models['TagCount'].deserialize(instance.count);
    }

    if (instance.values !== null && instance.values !== undefined) {
      var deserializedArray = [];
      instance.values.forEach(function(element) {
        if (element !== null && element !== undefined) {
          element = models['TagValue'].deserialize(element);
        }
        deserializedArray.push(element);
      });
      instance.values = deserializedArray;
    }

  }
  return instance;
};

module.exports = new TagDetails();
