'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the StorageAccountCheckNameAvailabilityParameters class.
 * @constructor
 */
function StorageAccountCheckNameAvailabilityParameters() { }

/**
 * Validate the payload against the StorageAccountCheckNameAvailabilityParameters schema
 *
 * @param {JSON} payload
 *
 */
StorageAccountCheckNameAvailabilityParameters.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('StorageAccountCheckNameAvailabilityParameters cannot be null.');
  }
  if (payload['name'] !== null && payload['name'] !== undefined && typeof payload['name'].valueOf() !== 'string') {
    throw new Error('payload[\'name\'] must be of type string.');
  }

  if (payload['type'] !== null && payload['type'] !== undefined && typeof payload['type'].valueOf() !== 'string') {
    throw new Error('payload[\'type\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to StorageAccountCheckNameAvailabilityParameters schema
 *
 * @param {JSON} instance
 *
 */
StorageAccountCheckNameAvailabilityParameters.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new StorageAccountCheckNameAvailabilityParameters();
