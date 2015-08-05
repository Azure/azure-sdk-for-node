'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the TagCount class.
 * @constructor
 */
function TagCount() { }

/**
 * Validate the payload against the TagCount schema
 *
 * @param {JSON} payload
 *
 */
TagCount.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('TagCount cannot be null.');
  }
  if (payload['type'] !== null && payload['type'] !== undefined && typeof payload['type'].valueOf() !== 'string') {
    throw new Error('payload[\'type\'] must be of type string.');
  }

  if (payload['value'] !== null && payload['value'] !== undefined && typeof payload['value'].valueOf() !== 'string') {
    throw new Error('payload[\'value\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to TagCount schema
 *
 * @param {JSON} instance
 *
 */
TagCount.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new TagCount();
