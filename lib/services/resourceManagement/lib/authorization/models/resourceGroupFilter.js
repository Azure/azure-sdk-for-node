'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceGroupFilter class.
 * @constructor
 */
function ResourceGroupFilter() { }

/**
 * Validate the payload against the ResourceGroupFilter schema
 *
 * @param {JSON} payload
 *
 */
ResourceGroupFilter.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceGroupFilter cannot be null.');
  }
  if (payload['tagName'] !== null && payload['tagName'] !== undefined && typeof payload['tagName'].valueOf() !== 'string') {
    throw new Error('payload[\'tagName\'] must be of type string.');
  }

  if (payload['tagValue'] !== null && payload['tagValue'] !== undefined && typeof payload['tagValue'].valueOf() !== 'string') {
    throw new Error('payload[\'tagValue\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to ResourceGroupFilter schema
 *
 * @param {JSON} instance
 *
 */
ResourceGroupFilter.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ResourceGroupFilter();
