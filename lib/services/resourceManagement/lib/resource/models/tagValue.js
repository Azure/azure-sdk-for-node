'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the TagValue class.
 * @constructor
 */
function TagValue() { }

/**
 * Validate the payload against the TagValue schema
 *
 * @param {JSON} payload
 *
 */
TagValue.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('TagValue cannot be null.');
  }
  if (payload['id'] !== null && payload['id'] !== undefined && typeof payload['id'].valueOf() !== 'string') {
    throw new Error('payload[\'id\'] must be of type string.');
  }

  if (payload['tagValueProperty'] !== null && payload['tagValueProperty'] !== undefined && typeof payload['tagValueProperty'].valueOf() !== 'string') {
    throw new Error('payload[\'tagValueProperty\'] must be of type string.');
  }

  if (payload['count']) {
    models['TagCount'].validate(payload['count']);
  }
};

/**
 * Deserialize the instance to TagValue schema
 *
 * @param {JSON} instance
 *
 */
TagValue.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.count !== null && instance.count !== undefined) {
      instance.count = models['TagCount'].deserialize(instance.count);
    }
  }
  return instance;
};

module.exports = new TagValue();
