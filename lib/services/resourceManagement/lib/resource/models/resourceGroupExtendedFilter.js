'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceGroupExtendedFilter class.
 * @constructor
 */
function ResourceGroupExtendedFilter() { }

/**
 * Validate the payload against the ResourceGroupExtendedFilter schema
 *
 * @param {JSON} payload
 *
 */
ResourceGroupExtendedFilter.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceGroupExtendedFilter cannot be null.');
  }
  if (payload['tagName'] !== null && payload['tagName'] !== undefined && typeof payload['tagName'] !== 'string') {
    throw new Error('payload[\'tagName\'] must be of type string.');
  }

  if (payload['tagValue'] !== null && payload['tagValue'] !== undefined && typeof payload['tagValue'] !== 'string') {
    throw new Error('payload[\'tagValue\'] must be of type string.');
  }

};

/**
 * Deserialize the instance to ResourceGroupExtendedFilter schema
 *
 * @param {JSON} instance
 *
 */
ResourceGroupExtendedFilter.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ResourceGroupExtendedFilter();
