'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceProviderOperationDisplayProperties class.
 * @constructor
 */
function ResourceProviderOperationDisplayProperties() { }

/**
 * Validate the payload against the ResourceProviderOperationDisplayProperties schema
 *
 * @param {JSON} payload
 *
 */
ResourceProviderOperationDisplayProperties.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceProviderOperationDisplayProperties cannot be null.');
  }
  if (payload['publisher'] !== null && payload['publisher'] !== undefined && typeof payload['publisher'].valueOf() !== 'string') {
    throw new Error('payload[\'publisher\'] must be of type string.');
  }

  if (payload['provider'] !== null && payload['provider'] !== undefined && typeof payload['provider'].valueOf() !== 'string') {
    throw new Error('payload[\'provider\'] must be of type string.');
  }

  if (payload['resource'] !== null && payload['resource'] !== undefined && typeof payload['resource'].valueOf() !== 'string') {
    throw new Error('payload[\'resource\'] must be of type string.');
  }

  if (payload['operation'] !== null && payload['operation'] !== undefined && typeof payload['operation'].valueOf() !== 'string') {
    throw new Error('payload[\'operation\'] must be of type string.');
  }

  if (payload['description'] !== null && payload['description'] !== undefined && typeof payload['description'].valueOf() !== 'string') {
    throw new Error('payload[\'description\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to ResourceProviderOperationDisplayProperties schema
 *
 * @param {JSON} instance
 *
 */
ResourceProviderOperationDisplayProperties.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new ResourceProviderOperationDisplayProperties();
