'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceGroupProperties class.
 * @constructor
 */
function ResourceGroupProperties() { }

/**
 * Validate the payload against the ResourceGroupProperties schema
 *
 * @param {JSON} payload
 *
 */
ResourceGroupProperties.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceGroupProperties cannot be null.');
  }
  if (payload['provisioningState'] !== null && payload['provisioningState'] !== undefined && typeof payload['provisioningState'].valueOf() !== 'string') {
    throw new Error('payload[\'provisioningState\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to ResourceGroupProperties schema
 *
 * @param {JSON} instance
 *
 */
ResourceGroupProperties.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ResourceGroupProperties();
