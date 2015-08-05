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
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['tagName'] !== null && payload['tagName'] !== undefined && typeof payload['tagName'].valueOf() !== 'string') {
    throw new Error('payload[\'tagName\'] must be of type string.');
  }

  if (payload['count']) {
    models['TagCount'].validate(payload['count']);
  }

  if (util.isArray(payload['values'])) {
    for (var i = 0; i < payload['values'].length; i++) {
      if (payload['values'][i]) {
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
