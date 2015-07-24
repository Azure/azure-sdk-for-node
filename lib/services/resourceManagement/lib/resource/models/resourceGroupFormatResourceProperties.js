'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceGroupFormatResourceProperties class.
 * @constructor
 */
function ResourceGroupFormatResourceProperties() { }

/**
 * Validate the payload against the ResourceGroupFormatResourceProperties schema
 *
 * @param {JSON} payload
 *
 */
ResourceGroupFormatResourceProperties.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceGroupFormatResourceProperties cannot be null.');
  }
  if (payload['provisioningState'] !== null && payload['provisioningState'] !== undefined && typeof payload['provisioningState'] !== 'string') {
    throw new Error('payload[\'provisioningState\'] must be of type string.');
  }

};

/**
 * Deserialize the instance to ResourceGroupFormatResourceProperties schema
 *
 * @param {JSON} instance
 *
 */
ResourceGroupFormatResourceProperties.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ResourceGroupFormatResourceProperties();
